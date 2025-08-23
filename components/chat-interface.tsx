"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle, RefreshCw, Wifi, WifiOff } from "lucide-react"
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
  isPopup?: boolean
}

export function ChatInterface({ user, profile, isPopup = false }: ChatInterfaceProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  // Detect if we're in a popup window
  const isInPopup = typeof window !== 'undefined' && window.opener

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Simple polling function that reloads all messages
  const pollForMessages = async () => {
    if (!conversation) return
    
    try {
      console.log("Polling for messages...")
      
      // Get all messages for the conversation
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true })

      if (messagesError) {
        console.error("Error polling messages:", messagesError)
        return
      }

      // Get sender profiles
      if (messagesData && messagesData.length > 0) {
        const senderIds = [...new Set(messagesData.map((m) => m.sender_id))]
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", senderIds)

        if (profilesError) {
          console.error("Error loading profiles:", profilesError)
          return
        }

        // Combine messages with profiles
        const messagesWithSenders = messagesData.map((message) => ({
          ...message,
          sender: profilesData?.find((p) => p.id === message.sender_id),
        }))

        // Update messages state
        setMessages(messagesWithSenders)

        // Mark messages as read
        await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("conversation_id", conversation.id)
          .neq("sender_id", user.id)
      } else {
        setMessages([])
      }
    } catch (error) {
      console.error("Error in polling:", error)
    }
  }

  // Start polling
  const startPolling = () => {
    if (!conversation) return
    
    // Clear existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    console.log("Starting polling for conversation:", conversation.id)
    
    // Poll every 2 seconds
    pollingIntervalRef.current = setInterval(pollForMessages, 2000)
    
    // Also poll immediately
    pollForMessages()
  }

  // Stop polling
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
      console.log("Stopped polling")
    }
  }

  useEffect(() => {
    initializeChat()
  }, [user.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Set up polling when conversation changes
  useEffect(() => {
    if (conversation) {
      startPolling()
      setConnectionStatus('connected')
    }

    return () => {
      stopPolling()
    }
  }, [conversation?.id])

  const initializeChat = async () => {
    try {
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
        console.error("Error fetching conversations:", fetchError)
        throw fetchError
      }

      let existingConversation = existingConversations?.[0] || null

      // If no active conversation exists, create one
      if (!existingConversation) {
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
          console.error("Error creating conversation:", createError)
          throw createError
        }
        existingConversation = newConversation
      }

      console.log("Setting conversation:", existingConversation)
      setConversation(existingConversation)
    } catch (error) {
      console.error("Error initializing chat:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation) return

    try {
      console.log("Sending message:", newMessage.trim())
      
      // Insert the message
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
        console.error("Error sending message:", messageError)
        throw messageError
      }

      // Get the sender profile
      const { data: senderProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("Error getting sender profile:", profileError)
        throw profileError
      }

      // Combine the data
      const messageWithSender = {
        ...messageData,
        sender: senderProfile,
      }

      console.log("Message sent successfully:", messageWithSender)
      
      // Add message to state immediately for better UX
      setMessages((prev) => [...prev, messageWithSender])
      setNewMessage("")
      
      // Trigger a poll to get any other new messages
      setTimeout(pollForMessages, 500)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const refreshMessages = async () => {
    console.log("Manually refreshing messages")
    await pollForMessages()
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
    <div className="flex flex-col h-full ">
      {/* Main Chat Card */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border mb-4 flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Support Chat</h1>
              <p className="text-sm text-gray-600">Get help with your bookings and questions</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-black text-white">
                active
              </Badge>
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
                onClick={refreshMessages}
                className="p-1"
                title="Refresh messages"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-200px)] overflow-y-auto">
          <ScrollArea className="h-full">
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
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
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
    </div>
  )
}
