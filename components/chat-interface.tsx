"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle } from "lucide-react"
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    initializeChat()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!conversation) return

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
          console.log("[v0] New message:", payload)

          const { data: newMessage } = await supabase.from("messages").select("*").eq("id", payload.new.id).single()

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

            // Mark as read if it's not from current user
            await supabase.from("messages").update({ is_read: true }).eq("id", newMessage.id).neq("sender_id", user.id)
          }
        },
      )
      .subscribe()

    return () => {
      messageChannel.unsubscribe()
    }
  }, [conversation, user.id])

  const initializeChat = async () => {
    try {
      // Check if user already has a conversation
      let { data: existingConversation, error: fetchError } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError
      }

      // If no conversation exists, create one
      if (!existingConversation) {
        const { data: newConversation, error: createError } = await supabase
          .from("conversations")
          .insert({
            user_id: user.id,
            subject: "Support Chat",
          })
          .select()
          .single()

        if (createError) throw createError
        existingConversation = newConversation
      }

      setConversation(existingConversation)
      await loadMessages(existingConversation.id)
    } catch (error) {
      console.error("Error initializing chat:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      // First get messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (messagesError) throw messagesError

      // Then get sender profiles for each unique sender
      const senderIds = [...new Set(messagesData?.map((m) => m.sender_id) || [])]
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", senderIds)

      if (profilesError) throw profilesError

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
      console.error("Error loading messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation) return

    try {
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

      if (messageError) throw messageError

      // Then get the sender profile
      const { data: senderProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) throw profileError

      // Combine the data
      const messageWithSender = {
        ...messageData,
        sender: senderProfile,
      }

      setMessages((prev) => [...prev, messageWithSender])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
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
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Online</span>
            </div>
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
  )
}
