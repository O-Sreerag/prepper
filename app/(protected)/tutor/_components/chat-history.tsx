import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

export const ChatHistoryComponent = ({showSidebar, setShowSidebar, selectedConversation, setSelectedConversation}: {showSidebar: boolean, setShowSidebar: (value: boolean) => void, selectedConversation: string | null, setSelectedConversation: (id: string) => void}) => {
    return (
        <>
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
                                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${selectedConversation === conversation.id ? "bg-muted" : ""
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
        </>
    )
}