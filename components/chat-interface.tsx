"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  email: string
  role: string
}

interface Conversation {
  id: string
  subject: string
  status: string
  last_message_at: string
  created_at: string
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

interface ChatInterfaceProps {
  user: User
  profile: Profile
}

export function ChatInterface({ user, profile }: ChatInterfaceProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${info}`])
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    initializeChat()
  }, [user.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!conversation) return

    addDebugInfo(`Setting up real-time subscription for conversation: ${conversation.id}`)
    console.log("Setting up real-time subscription for conversation:", conversation.id)

    // Subscribe to message changes for the conversation
    const messageChannel = supabase
      .channel(`conversation-messages-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        async (payload) => {
          addDebugInfo(`New message received: ${payload.new.id}`)
          console.log("[Real-time] New message received:", payload)

          try {
            const { data: newMessage, error } = await supabase
              .from("messages")
              .select("*")
              .eq("id", payload.new.id)
              .single()

            if (error) {
              addDebugInfo(`Error fetching message: ${error.message}`)
              console.error("Error fetching new message:", error)
              return
            }

            if (newMessage && newMessage.sender_id !== user.id) {
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
              addDebugInfo(`Added message from ${senderProfile?.full_name || senderProfile?.email}`)

              // Mark as read if it's not from current user
              await supabase
                .from("messages")
                .update({ is_read: true })
                .eq("id", newMessage.id)
                .neq("sender_id", user.id)
            }
          } catch (error) {
            addDebugInfo(`Error processing message: ${error}`)
            console.error("Error processing new message:", error)
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${conversation.id}`,
        },
        (payload) => {
          addDebugInfo(`Conversation updated: ${payload.eventType}`)
          console.log("[Real-time] Conversation updated:", payload)
          if (payload.new) {
            setConversation(payload.new as Conversation)
          }
        },
      )
      .subscribe((status) => {
        addDebugInfo(`Subscription status: ${status}`)
        console.log("Subscription status:", status)
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected')
      })

    // Also subscribe to conversation updates
    const conversationChannel = supabase
      .channel(`conversation-updates-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${conversation.id}`,
        },
        (payload) => {
          addDebugInfo(`Conversation change: ${payload.eventType}`)
          console.log("[Real-time] Conversation change:", payload)
          if (payload.new) {
            setConversation(payload.new as Conversation)
          }
        },
      )
      .subscribe()

    return () => {
      addDebugInfo("Cleaning up subscriptions")
      console.log("Cleaning up subscriptions")
      messageChannel.unsubscribe()
      conversationChannel.unsubscribe()
    }
  }, [conversation?.id, user.id])

  const initializeChat = async () => {
    try {
      addDebugInfo(`Initializing chat for user: ${user.id}`)
      console.log("Initializing chat for user:", user.id)
      
      // Get the most recent active conversation for the user
      let { data: existingConversations, error: fetchError } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("last_message_at", { ascending: false })
        .limit(1)

      if (fetchError) {
        addDebugInfo(`Error fetching conversations: ${fetchError.message}`)
        console.error("Error fetching conversations:", fetchError)
        throw fetchError
      }

      let existingConversation = existingConversations?.[0] || null

      // If no active conversation exists, create one
      if (!existingConversation) {
        addDebugInfo("Creating new conversation")
        console.log("Creating new conversation")
        const { data: newConversation, error: createError } = await supabase
          .from("conversations")
          .insert({
            user_id: user.id,
            subject: "Support Chat",
            status: "active",
          })
          .select()
          .single()

        if (createError) {
          addDebugInfo(`Error creating conversation: ${createError.message}`)
          console.error("Error creating conversation:", createError)
          throw createError
        }
        existingConversation = newConversation
      }

      addDebugInfo(`Setting conversation: ${existingConversation.id}`)
      console.log("Setting conversation:", existingConversation)
      setConversation(existingConversation)
      await loadMessages(existingConversation.id)
    } catch (error) {
      addDebugInfo(`Error initializing chat: ${error}`)
      console.error("Error initializing chat:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      addDebugInfo(`Loading messages for conversation: ${conversationId}`)
      console.log("Loading messages for conversation:", conversationId)
      
      // First get messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (messagesError) {
        addDebugInfo(`Error loading messages: ${messagesError.message}`)
        console.error("Error loading messages:", messagesError)
        throw messagesError
      }

      addDebugInfo(`Loaded ${messagesData?.length || 0} messages`)
      console.log("Loaded messages:", messagesData?.length || 0)

      // Then get sender profiles for each unique sender
      const senderIds = [...new Set(messagesData?.map((m) => m.sender_id) || [])]
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", senderIds)

      if (profilesError) {
        addDebugInfo(`Error loading profiles: ${profilesError.message}`)
        console.error("Error loading profiles:", profilesError)
        throw profilesError
      }

      // Combine the data
      const messagesWithSenders =
        messagesData?.map((message) => ({
          ...message,
          sender: profilesData?.find((p) => p.id === message.sender_id),
        })) || []

      setMessages(messagesWithSenders)

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id)
    } catch (error) {
      addDebugInfo(`Error loading messages: ${error}`)
      console.error("Error loading messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation) return

    try {
      addDebugInfo(`Sending message: ${newMessage.trim()}`)
      console.log("Sending message:", newMessage.trim())
      
      // First insert the message
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          content: newMessage.trim(),
        })
        .select()
        .single()

      if (messageError) {
        addDebugInfo(`Error sending message: ${messageError.message}`)
        console.error("Error sending message:", messageError)
        throw messageError
      }

      // Then get the sender profile
      const { data: senderProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) {
        addDebugInfo(`Error getting sender profile: ${profileError.message}`)
        console.error("Error getting sender profile:", profileError)
        throw profileError
      }

      // Combine the data
      const messageWithSender = {
        ...messageData,
        sender: senderProfile,
      }

      setMessages((prev) => [...prev, messageWithSender])
      setNewMessage("")
      addDebugInfo("Message sent successfully")
    } catch (error) {
      addDebugInfo(`Error sending message: ${error}`)
      console.error("Error sending message:", error)
    }
  }

  const refreshMessages = async () => {
    if (!conversation) return
    addDebugInfo("Manually refreshing messages")
    console.log("Manually refreshing messages")
    await loadMessages(conversation.id)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)

    // Simple typing indicator (could be enhanced with debouncing)
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Support Chat</CardTitle>
              <p className="text-sm text-gray-500">Get help with your bookings and questions</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={conversation?.status === "active" ? "default" : "secondary"}>
                {conversation?.status || "active"}
              </Badge>
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
                <span className="text-xs text-gray-500">
                  {connectionStatus === 'connected' ? 'Online' : 
                   connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshMessages}
                className="ml-2"
                title="Refresh messages"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Welcome to support chat!</p>
                <p className="text-sm">Send a message to get help with your bookings</p>
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
                      <p className={`text-xs mt-1 ${message.sender_id === user.id ? "text-blue-100" : "text-gray-500"}`}>
                        {format(new Date(message.created_at), "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Debug Panel - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="max-h-40 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-xs space-y-1 max-h-24 overflow-y-auto">
              {debugInfo.map((info, index) => (
                <div key={index} className="text-gray-600 font-mono">
                  {info}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
