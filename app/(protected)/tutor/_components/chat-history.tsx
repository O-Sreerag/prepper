import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

interface ChatHistoryProps {
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation) => void;
}

export const ChatHistoryComponent = ({
  showSidebar,
  setShowSidebar,
  conversations,
  selectedConversation,
  setSelectedConversation,
}: ChatHistoryProps) => {
  return (
    <div className={`lg:col-span-1 ${showSidebar ? "block" : "hidden lg:block"}`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Conversations</CardTitle>
          <CardDescription className="hidden sm:block">Your chat history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedConversation?.id === conversation.id ? "bg-muted" : ""
                }`}
                onClick={() => {
                  setSelectedConversation(conversation);
                  setShowSidebar(false); // Hide sidebar on mobile after selection
                }}
              >
                <div className="font-medium text-sm truncate">{conversation.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};