import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";

import type { Message as ChatMessage } from "../../../../backend/src/types/message";
import DateFirstConversation from "./date-first-conversation";

interface MessageListProps {
  messages: ChatMessage[];
  currentUsername?: string;
}

export function MessageList({
  messages,
  currentUsername,
}: MessageListProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      {messages.map((message, index) => {
        const isCurrentUser = message.sender === currentUsername;

        return (
          <div key={message.id} className="flex flex-col gap-4">
            {/* Date de début de conversation */}
            {index === 0 && (
              <DateFirstConversation
                date={new Date(message.timestamp).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              />
            )}

            <Message align={isCurrentUser ? "end" : "start"}>
              <MessageAvatar>
                <Avatar>
                  <AvatarImage
                    src={
                      isCurrentUser
                        ? "/avatars/10.png"
                        : "/avatars/02.png"
                    }
                    alt={`@${message.sender}`}
                  />

                  <AvatarFallback>
                    {message.sender
                      .slice(0, 1)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </MessageAvatar>

              <MessageContent>
                {!isCurrentUser && (
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    {message.sender}
                  </p>
                )}

                <Bubble
                  variant={
                    isCurrentUser
                      ? "default"
                      : "muted"
                  }
                >
                  <BubbleContent>
                    {message.body}
                  </BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          </div>
        );
      })}
    </div>
  );
}