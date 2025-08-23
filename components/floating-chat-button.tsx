"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export function FloatingChatButton() {
  const openChatWindow = () => {
    const chatWindow = window.open(
      '/chat',
      'support-chat',
      'width=400,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
    )
    if (chatWindow) {
      chatWindow.focus()
    }
  }

  return (
    <Button
      onClick={openChatWindow}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white z-50"
      title="Open Support Chat"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  )
}
