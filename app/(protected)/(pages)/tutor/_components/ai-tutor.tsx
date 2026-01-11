"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icons } from "@/components/icons";
import { QUICK_ACTIONS } from "@/app/(protected)/(pages)/tutor/_constants";
import { AiCapabilitiesComponent, ChatHistoryComponent, HeaderComponent } from "@/app/(protected)/(pages)/tutor/_components";

// ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error'
type messageRole = "system" | "user" | "assistant";

export const AITutorComponent = () => {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/tutor",
    }),
    messages: [
      {
        id: "init",
        role: "assistant" as messageRole,
        parts: [
          {
            type: "text",
            text: "Hello! I'm your AI tutor. I can help with questions, explanations, and study guidance. What would you like to learn today?",
          },
        ],
      },
    ],
  });

  const [inputValue, setInputValue] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendMessage({ text: inputValue });
    setInputValue("");
  };

  const handleQuickAction = (action: string) => setInputValue(action);

  const isTyping = status === "streaming";

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <HeaderComponent showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <ChatHistoryComponent
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />

        {/* Main Chat Area */}
        <div className="lg:col-span-3 relative">
          <Card className="flex flex-col h-[500px] sm:h-[600px] pt-3 pb-2 md:pt-3 md:pb-3 gap-2 md:gap-2">
            <CardHeader className="flex-shrink-0 flex items-center justify-between">
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
            </CardHeader>

            {/* Messages - Scrollable */}
            <CardContent className="flex-1 flex flex-col px-3 md:px-4 py-2 md:py-2 overflow-hidden min-h-0">
              <div className="flex-1 overflow-y-auto pr-2 md:pr-4">
                <div className="space-y-3 sm:space-y-4">
                  <AnimatePresence initial={false}>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg break-words ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <div className="text-xs sm:text-sm leading-relaxed">
                            <ReactMarkdown>
                              {message.parts.map((p) => (p.type === "text" ? p.text : "")).join("")}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        key="typing-indicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-start"
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Quick Actions */}
              <AnimatePresence>
                {showQuickActions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.25 }}
                    className="absolute bottom-16 sm:bottom-20 left-3 right-3 md:left-4 md:right-4 bg-background/95 backdrop-blur-sm border rounded-lg p-2 shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        <div className="flex gap-1.5 sm:gap-2 pb-1">
                          {QUICK_ACTIONS.map((action, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="text-xs sm:text-sm bg-background h-7 sm:h-8 px-2 sm:px-3 whitespace-nowrap flex-shrink-0"
                              onClick={() => handleQuickAction(action.title)}
                            >
                              <action.icon className="mr-1 sm:mr-2 h-3 w-3" />
                              {action.title}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                        onClick={() => setShowQuickActions(false)}
                      >
                        <Icons.arrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle Quick Actions */}
              {!showQuickActions && (
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-16 sm:bottom-20 right-3 md:right-4 h-8 sm:h-9 shadow-lg"
                  onClick={() => setShowQuickActions(true)}
                >
                  <Icons.brain className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Quick Actions
                </Button>
              )}

              {/* Input */}
              <form className="flex gap-2 flex-shrink-0" onSubmit={handleSubmit}>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 text-sm sm:text-base h-9 sm:h-10"
                />
                <Button type="submit" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                  <Icons.play className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Capabilities */}
      <AiCapabilitiesComponent />
    </div>
  );
};
