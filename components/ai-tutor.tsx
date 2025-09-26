"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icons } from "@/components/icons"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  context?: string
}

const mockConversations = [
  {
    id: "1",
    title: "Physics - Newton's Laws",
    lastMessage: "Can you explain the third law?",
    timestamp: "2 hours ago",
    messageCount: 8,
  },
  {
    id: "2",
    title: "Chemistry - Organic Reactions",
    lastMessage: "What's the mechanism for SN2?",
    timestamp: "1 day ago",
    messageCount: 12,
  },
  {
    id: "3",
    title: "Math - Calculus Integration",
    lastMessage: "Help with integration by parts",
    timestamp: "2 days ago",
    messageCount: 6,
  },
]

const quickActions = [
  {
    title: "Explain concept",
    icon: Icons.brain,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    title: "Solve step by step",
    icon: Icons.fileText,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    title: "Practice questions",
    icon: Icons.target,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    title: "Study help",
    icon: Icons.calendar,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
]

export function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI tutor. I can help you with questions, explanations, and study guidance. What would you like to learn about today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getAIResponse(inputValue),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (question: string): string => {
    const responses = [
      "Great question! Let me break this down for you step by step...",
      "I can help you understand this concept. Here's a detailed explanation...",
      "This is a common topic that students find challenging. Let me clarify...",
      "Excellent! This connects to several important principles. Let me explain...",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">AI Tutor</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Get instant help with questions and concepts</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden bg-transparent"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Icons.fileText className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button variant="outline" size="sm">
            <Icons.rotateCcw className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-4">
        {/* Sidebar - Conversation History */}
        <div className={`lg:col-span-1 ${showSidebar ? "block" : "hidden lg:block"}`}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Conversations</CardTitle>
              <CardDescription className="hidden sm:block">Your chat history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedConversation === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => {
                      setSelectedConversation(conversation.id)
                      setShowSidebar(false) // Hide sidebar on mobile after selection
                    }}
                  >
                    <div className="font-medium text-sm truncate">{conversation.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      <Badge variant="secondary" className="text-xs">
                        {conversation.messageCount}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[500px] sm:h-[600px] flex flex-col">
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
                    <Icons.zap className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-sm sm:text-base">AI Tutor</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Online • Ready to help</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent">
                    <Icons.fileText className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent">
                    <Icons.brain className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 flex flex-col p-3 sm:p-6">
              <ScrollArea className="flex-1 pr-2 sm:pr-4" ref={scrollAreaRef}>
                <div className="space-y-3 sm:space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <div className="text-xs sm:text-sm leading-relaxed">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-muted-foreground p-2 sm:p-3 rounded-lg">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-bounce" />
                          <div
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Actions */}
              <div className="mt-3 sm:mt-4 mb-3 sm:mb-4">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm bg-transparent h-7 sm:h-8 px-2 sm:px-3"
                      onClick={() => handleQuickAction(action.title)}
                    >
                      <action.icon className="mr-1 sm:mr-2 h-3 w-3" />
                      {action.title}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 text-sm sm:text-base h-9 sm:h-10"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10"
                >
                  <Icons.play className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Concept Explanations</CardTitle>
            <Icons.brain className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Get detailed explanations for any topic</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Step-by-Step Solutions</CardTitle>
            <Icons.fileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Solve problems with detailed steps</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Practice Questions</CardTitle>
            <Icons.target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Generate custom practice problems</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Study Guidance</CardTitle>
            <Icons.calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Personalized study recommendations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
