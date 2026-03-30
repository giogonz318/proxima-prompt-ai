import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmptyState from './EmptyState';
import ChatInput from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChatArea({ messages, isLoading, onSend, onImageClick }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      {messages.length === 0 && !isLoading ? (
        <>
          <EmptyState onSuggestionClick={onSend} />
          <ChatInput onSend={onSend} isLoading={isLoading} onImageClick={onImageClick} />
        </>
      ) : (
        <>
          <ScrollArea className="flex-1 min-h-0">
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
          <ChatInput onSend={onSend} isLoading={isLoading} onImageClick={onImageClick} />
        </>
      )}
    </div>
  );
}