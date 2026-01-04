"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat, type Message } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { QUICK_ACTIONS } from "@/app/(protected)/tutor/_constants";
import { AiCapabilitiesComponent, ChatHistoryComponent, HeaderComponent } from "@/app/(protected)/tutor/_components";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export const AITutorComponent = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const { messages, append, setMessages, isLoading } = useChat({
    api: "/api/tutor",
  });

  const [inputValue, setInputValue] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        const response = await fetch(`/api/conversations/${selectedConversation.id}/messages`);
        if (response.ok) {
          const data = await response.json();
          const formattedMessages: Message[] = data.map((msg: any) => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          }));
          setMessages(formattedMessages);
        }
      };
      fetchMessages();
    } else {
      setMessages([
        {
          id: "init",
          role: "assistant",
          content: "Hello! I'm your AI tutor. I can help with questions, explanations, and study guidance. What would you like to learn today?",
        },
      ]);
    }
  }, [selectedConversation, setMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const messageContent = inputValue;
    setInputValue("");

    let currentConversationId = selectedConversation?.id;

    if (!currentConversationId) {
      try {
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: messageContent.slice(0, 30) + '...' }),
        });
        if (response.ok) {
          const newConversation = await response.json();
          setConversations(prev => [newConversation, ...prev]);
          setSelectedConversation(newConversation);
          currentConversationId = newConversation.id;

          await append({ content: messageContent, role: 'user' }, { options: { body: { conversationId: currentConversationId } } });
        } else {
          console.error("Failed to create conversation");
          return;
        }
      } catch (error) {
        console.error("Error creating conversation:", error);
        return;
      }
    } else {
      await append({ content: messageContent, role: 'user' }, { options: { body: { conversationId: currentConversationId } } });
    }
  };

  const handleQuickAction = (action: string) => setInputValue(action);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <HeaderComponent showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-4">
        <ChatHistoryComponent
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          conversations={conversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
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
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
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
              <form className="flex gap-2 flex-shrink-0" onSubmit={handleSubmit}>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 text-sm sm:text-base h-9 sm:h-10"
                />
                <Button type="submit" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" disabled={isLoading}>
                  <Icons.play className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <AiCapabilitiesComponent />
    </div>
  );
};
