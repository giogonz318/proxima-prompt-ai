import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Globe, ImageIcon, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatInput({ onSend, isLoading, onImageClick }) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const toggleRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Try Chrome.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join('');
      setText(transcript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [isRecording]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [text]);

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-xl p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 bg-secondary rounded-2xl border border-border focus-within:border-primary/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none px-4 py-3.5 focus:outline-none max-h-40"
          />
          <div className="flex items-center gap-1 pr-2 pb-2">
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-1 text-[10px] rounded-full px-2 py-1 transition-colors ${
                isRecording
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : 'bg-muted text-muted-foreground hover:text-primary'
              }`}
              title={isRecording ? 'Stop recording' : 'Record voice'}
            >
              {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              <span>{isRecording ? 'Stop' : 'Voice'}</span>
            </button>
            <button
              onClick={onImageClick}
              className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-1 hover:text-primary transition-colors"
              title="Generate image (5/day)"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Image</span>
            </button>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-1">
              <Globe className="w-3 h-3" />
              <span>Web</span>
            </div>
            <Button
              size="icon"
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              className="h-8 w-8 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-30"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          AI can make mistakes. Responses are enhanced with web search.
        </p>
      </div>
    </div>
  );
}