import ReactMarkdown from 'react-markdown';
import { User, Satellite } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-1">
          <Satellite className="w-4 h-4 text-primary" />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-secondary text-secondary-foreground rounded-bl-sm'
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              className="text-sm prose prose-invert prose-sm max-w-none 
                [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                prose-p:leading-relaxed prose-p:my-1.5
                prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:rounded-lg prose-pre:my-2
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-headings:text-foreground prose-strong:text-foreground
                prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5"
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </p>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center mt-1">
          <User className="w-4 h-4 text-primary" />
        </div>
      )}
    </motion.div>
  );
}