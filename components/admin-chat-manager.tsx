"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle, Clock, User, Bell, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  email: string
  role: string
}

interface Conversation {
  id: string
  user_id: string
  admin_id: string | null
  subject: string
  status: string
  last_message_at: string
  created_at: string
  user?: Profile
  admin?: Profile
  unread_count?: number
}

interface Message {
  id: string
  content: string
  sender_id: string
  message_type: string
  is_read: boolean
  created_at: string
  sender?: Profile
}

interface AdminChatManagerProps {
  user: SupabaseUser
}

export function AdminChatManager({ user }: AdminChatManagerProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [newMessageCount, setNewMessageCount] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    console.log("Setting up admin real-time subscriptions")

    const conversationChannel = supabase
      .channel("admin-conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        (payload) => {
          console.log("[Real-time] Admin conversation change:", payload)
          loadConversations()
        },
      )
      .subscribe((status) => {
        console.log("Admin conversation subscription status:", status)
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected')
      })

    const messageChannel = supabase
      .channel("admin-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          console.log("[Real-time] Admin new message:", payload)

          try {
            if (selectedConversation && payload.new.conversation_id === selectedConversation.id) {
              const { data: newMessage, error } = await supabase
                .from("messages")
                .select("*")
                .eq("id", payload.new.id)
                .single()

              if (error) {
                console.error("Error fetching new message:", error)
                return
              }

              if (newMessage) {
                // Get sender profile
                const { data: senderProfile } = await supabase
                  .from("profiles")
                  .select("*")
                  .eq("id", newMessage.sender_id)
                  .single()

                const messageWithSender = {
                  ...newMessage,
                  sender: senderProfile,
                }

                setMessages((prev) => [...prev, messageWithSender])

                if (newMessage.sender_id !== user.id) {
                  await supabase
                    .from("messages")
                    .update({ is_read: true })
                    .eq("id", newMessage.id)
                }
              }
            } else if (payload.new.sender_id !== user.id) {
              setNewMessageCount((prev) => prev + 1)

              try {
                const audio = new Audio("/notification.mp3")
                audio.volume = 0.3
                audio.play().catch(() => {})
              } catch (error) {
                console.error("Error playing notification sound:", error)
              }
            }

            loadConversations()
          } catch (error) {
            console.error("Error processing new message:", error)
          }
        },
      )
      .subscribe()

    return () => {
      console.log("Cleaning up admin subscriptions")
      conversationChannel.unsubscribe()
      messageChannel.unsubscribe()
    }
  }, [selectedConversation, user.id])

  useEffect(() => {
    setNewMessageCount(0)
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      console.log("Loading admin conversations")
      setLoading(true)
      const { data: conversationsData, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("status", "active")
        .order("last_message_at", { ascending: false })

      if (error) {
        console.error("Error loading conversations:", error)
        throw error
      }

      console.log("Loaded conversations:", conversationsData?.length || 0)

      const userIds = [...new Set(conversationsData?.map((c) => c.user_id) || [])]
      const adminIds = [...new Set(conversationsData?.map((c) => c.admin_id).filter(Boolean) || [])]

      const [usersData, adminsData] = await Promise.all([
        userIds.length > 0 ? supabase.from("profiles").select("*").in("id", userIds) : { data: [] },
        adminIds.length > 0 ? supabase.from("profiles").select("*").in("id", adminIds) : { data: [] },
      ])

      const conversationsWithProfiles = (conversationsData || []).map((conv) => ({
        ...conv,
        user: usersData.data?.find((u) => u.id === conv.user_id),
        admin: adminsData.data?.find((a) => a.id === conv.admin_id),
      }))

      const conversationsWithCounts = await Promise.all(
        conversationsWithProfiles.map(async (conv) => {
          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conv.id)
            .eq("is_read", false)
            .neq("sender_id", user.id)

          return { ...conv, unread_count: count || 0 }
        }),
      )

      setConversations(conversationsWithCounts)
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      console.log("Loading messages for conversation:", conversationId)
      
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error loading messages:", error)
        throw error
      }

      console.log("Loaded messages:", messagesData?.length || 0)

      const senderIds = [...new Set(messagesData?.map((m) => m.sender_id) || [])]
      const { data: sendersData } = await supabase.from("profiles").select("*").in("id", senderIds)

      const messagesWithSenders = (messagesData || []).map((msg) => ({
        ...msg,
        sender: sendersData?.find((s) => s.id === msg.sender_id),
      }))

      setMessages(messagesWithSenders)

      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id)

      if (selectedConversation && !selectedConversation.admin_id) {
        await supabase.from("conversations").update({ admin_id: user.id }).eq("id", conversationId)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      console.log("Sending admin message:", newMessage.trim())
      
      const { data: messageData, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: newMessage.trim(),
        })
        .select("*")
        .single()

      if (error) {
        console.error("Error sending message:", error)
        throw error
      }

      const { data: senderData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      const messageWithSender = {
        ...messageData,
        sender: senderData,
      }

      setMessages((prev) => [...prev, messageWithSender])
      setNewMessage("")

      await loadConversations()
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const refreshData = async () => {
    console.log("Manually refreshing admin data")
    await loadConversations()
    if (selectedConversation) {
      await loadMessages(selectedConversation.id)
    }
  }

  const updateConversationStatus = async (conversationId: string, status: string) => {
    try {
      console.log("Updating conversation status:", conversationId, status)
      
      await supabase.from("conversations").update({ status }).eq("id", conversationId)

      await loadConversations()
      if (selectedConversation?.id === conversationId && status !== "active") {
        setSelectedConversation(null)
        setMessages([])
      }
    } catch (error) {
      console.error("Error updating conversation status:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                Active Conversations
                {newMessageCount > 0 && <Bell className="h-4 w-4 text-orange-500 animate-pulse" />}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div 
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' 
                      ? 'bg-green-500 animate-pulse' 
                      : connectionStatus === 'connecting'
                      ? 'bg-yellow-500 animate-pulse'
                      : 'bg-red-500'
                  }`}
                ></div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshData}
                  title="Refresh conversations"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No active conversations</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id ? "bg-blue-50 border-blue-200" : ""
                    } ${conversation.unread_count! > 0 ? "bg-yellow-50" : ""}`}
                    onClick={() => {
                      setSelectedConversation(conversation)
                      loadMessages(conversation.id)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{conversation.subject}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <User className="h-3 w-3" />
                          {conversation.user?.full_name || conversation.user?.email}
                        </div>
                      </div>
                      {conversation.unread_count! > 0 && (
                        <Badge variant="destructive" className="text-xs animate-pulse">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {format(new Date(conversation.last_message_at), "MMM d, h:mm a")}
                      </div>
                    </div>
                    {conversation.admin && (
                      <div className="text-xs text-gray-500 mt-1">
                        Assigned to: {conversation.admin.full_name || conversation.admin.email}
                      </div>
                    )}
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedConversation.subject}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Customer: {selectedConversation.user?.full_name || selectedConversation.user?.email}</span>
                      <div className="flex items-center gap-1">
                        <div 
                          className={`w-2 h-2 rounded-full ${
                            connectionStatus === 'connected' 
                              ? 'bg-green-500 animate-pulse' 
                              : connectionStatus === 'connecting'
                              ? 'bg-yellow-500 animate-pulse'
                              : 'bg-red-500'
                          }`}
                        ></div>
                        <span className="text-xs">
                          {connectionStatus === 'connected' ? 'Online' : 
                           connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateConversationStatus(selectedConversation.id, "closed")}
                    >
                      Close Chat
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadMessages(selectedConversation.id)}
                      title="Refresh messages"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[480px] p-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_id === user.id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-3 py-2 ${
                              message.sender_id === user.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center justify-end mt-1">
                              <p
                                className={`text-xs ${
                                  message.sender_id === user.id ? "text-blue-100" : "text-gray-500"
                                }`}
                              >
                                {format(new Date(message.created_at), "h:mm a")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your response..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-sm">Choose a conversation from the list to start responding</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
