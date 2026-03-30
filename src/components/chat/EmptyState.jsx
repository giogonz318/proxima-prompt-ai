import { Globe, Brain, Zap, Satellite } from 'lucide-react';
import { motion } from 'framer-motion';

const suggestions = [
  { icon: Globe, text: "What's happening in the world today?" },
  { icon: Brain, text: 'Explain how black holes form' },
  { icon: Zap, text: 'Help me write a professional email' },
];

export default function EmptyState({ onSuggestionClick }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/20 flex items-center justify-center">
            <Satellite className="w-9 h-9 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Explore the Universe of Knowledge</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Your AI co-pilot for navigating ideas, questions, and the cosmos of human knowledge.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-3 mt-8 justify-center max-w-lg">
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            onClick={() => onSuggestionClick(s.text)}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 
              border border-border rounded-xl text-sm text-secondary-foreground 
              transition-all hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <s.icon className="w-4 h-4 text-muted-foreground" />
            {s.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
}