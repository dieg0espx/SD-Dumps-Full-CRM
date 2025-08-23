"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle, Clock, User, Bell, RefreshCw, Wifi, WifiOff } from "lucide-react"
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
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const conversationsPollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const messagesPollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Simple polling function for conversations
  const pollConversations = async () => {
    try {
      console.log("Polling for conversations...")
      setLoading(true)
      const { data: conversationsData, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("status", "active")
        .order("last_message_at", { ascending: false })

      if (error) {
        console.error("Error loading conversations:", error)
        return
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
      console.error("Error polling conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  // Simple polling function for messages
  const pollMessages = async () => {
    if (!selectedConversation) return
    
    try {
      console.log("Polling for messages in conversation:", selectedConversation.id)
      
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversation.id)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error polling messages:", error)
        return
      }

      console.log("Loaded messages:", messagesData?.length || 0)

      const senderIds = [...new Set(messagesData?.map((m) => m.sender_id) || [])]
      const { data: sendersData } = await supabase.from("profiles").select("*").in("id", senderIds)

      const messagesWithSenders = (messagesData || []).map((msg) => ({
        ...msg,
        sender: sendersData?.find((s) => s.id === msg.sender_id),
      }))

      setMessages(messagesWithSenders)

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", selectedConversation.id)
        .neq("sender_id", user.id)

      // Assign admin if not already assigned
      if (selectedConversation && !selectedConversation.admin_id) {
        await supabase.from("conversations").update({ admin_id: user.id }).eq("id", selectedConversation.id)
      }
    } catch (error) {
      console.error("Error polling messages:", error)
    }
  }

  // Start polling for conversations
  const startConversationsPolling = () => {
    // Clear existing interval
    if (conversationsPollingIntervalRef.current) {
      clearInterval(conversationsPollingIntervalRef.current)
    }

    console.log("Starting conversations polling")
    
    // Poll conversations every 3 seconds
    conversationsPollingIntervalRef.current = setInterval(pollConversations, 3000)
    
    // Also poll immediately
    pollConversations()
  }

  // Start polling for messages
  const startMessagesPolling = () => {
    if (!selectedConversation) return
    
    // Clear existing interval
    if (messagesPollingIntervalRef.current) {
      clearInterval(messagesPollingIntervalRef.current)
    }

    console.log("Starting messages polling for conversation:", selectedConversation.id)
    
    // Poll messages every 2 seconds
    messagesPollingIntervalRef.current = setInterval(pollMessages, 2000)
    
    // Also poll immediately
    pollMessages()
  }

  // Stop polling
  const stopPolling = () => {
    if (conversationsPollingIntervalRef.current) {
      clearInterval(conversationsPollingIntervalRef.current)
      conversationsPollingIntervalRef.current = null
    }
    if (messagesPollingIntervalRef.current) {
      clearInterval(messagesPollingIntervalRef.current)
      messagesPollingIntervalRef.current = null
    }
    console.log("Stopped all polling")
  }

  useEffect(() => {
    startConversationsPolling()
    
    return () => {
      stopPolling()
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Set up messages polling when selected conversation changes
  useEffect(() => {
    if (selectedConversation) {
      startMessagesPolling()
      setNewMessageCount(0)
    }

    return () => {
      if (messagesPollingIntervalRef.current) {
        clearInterval(messagesPollingIntervalRef.current)
        messagesPollingIntervalRef.current = null
      }
    }
  }, [selectedConversation?.id])

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

      // Add message to state immediately for better UX
      setMessages((prev) => [...prev, messageWithSender])
      setNewMessage("")

      // Trigger a poll to get any other new messages
      setTimeout(pollMessages, 500)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const refreshConversations = async () => {
    console.log("Manually refreshing conversations")
    await pollConversations()
  }

  const refreshMessages = async () => {
    console.log("Manually refreshing messages")
    await pollMessages()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
  }

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversations
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {connectionStatus === 'connected' ? (
                    <>
                      <Wifi className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-gray-600">Live</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">Offline</span>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshConversations}
                  className="p-1"
                  title="Refresh conversations"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)]">
              {conversations.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No active conversations</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => selectConversation(conversation)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <p className="font-medium text-sm truncate">
                              {conversation.user?.full_name || conversation.user?.email || "Unknown User"}
                            </p>
                            {conversation.unread_count && conversation.unread_count > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {conversation.subject}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {format(new Date(conversation.last_message_at), "MMM d, h:mm a")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedConversation ? (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Chat with {selectedConversation.user?.full_name || selectedConversation.user?.email || "Customer"}
                  </div>
                ) : (
                  "Select a conversation"
                )}
              </CardTitle>
              {selectedConversation && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshMessages}
                    className="p-1"
                    title="Refresh messages"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Messages Area */}
                <div className="flex-1 mb-4">
                  <ScrollArea className="h-full">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation</p>
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
                                message.sender_id === user.id 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender_id === user.id 
                                  ? "text-blue-100" 
                                  : "text-gray-500"
                              }`}>
                                {format(new Date(message.created_at), "h:mm a")}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!newMessage.trim()}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose a conversation from the list to start chatting</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
