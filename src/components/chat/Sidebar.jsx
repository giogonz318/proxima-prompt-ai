import { useState } from 'react';
import { Plus, MessageSquare, Trash2, X, Satellite } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';

export default function Sidebar({ conversations, activeId, onSelect, onNew, onDelete, isOpen, onClose }) {
  const [hoveredId, setHoveredId] = useState(null);

  const grouped = groupConversations(conversations);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed lg:relative z-50 lg:z-auto top-0 left-0 h-full w-[280px] 
          bg-sidebar border-r border-sidebar-border flex flex-col
          lg:translate-x-0 ${!isOpen ? 'lg:flex hidden' : 'flex'}`}
        style={{ transform: undefined }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Satellite className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm text-sidebar-foreground">Proxima</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNew}
              className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
          {Object.entries(grouped).map(([label, convos]) => (
            <div key={label}>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 mb-1.5 font-medium">
                {label}
              </p>
              <div className="space-y-0.5">
                {convos.map((conv) => (
                  <div
                    key={conv.id}
                    onMouseEnter={() => setHoveredId(conv.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => { onSelect(conv.id); onClose(); }}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm
                      ${activeId === conv.id
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }`}
                  >
                    <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-50" />
                    <span className="truncate flex-1">{conv.title || 'New chat'}</span>
                    {hoveredId === conv.id && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                        className="flex-shrink-0 p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {conversations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No conversations yet
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}

function groupConversations(convos) {
  const groups = {};
  const now = moment();

  convos.forEach((c) => {
    const date = moment(c.created_date);
    let label;
    if (now.diff(date, 'days') === 0) label = 'Today';
    else if (now.diff(date, 'days') === 1) label = 'Yesterday';
    else if (now.diff(date, 'days') < 7) label = 'This Week';
    else if (now.diff(date, 'days') < 30) label = 'This Month';
    else label = 'Older';

    if (!groups[label]) groups[label] = [];
    groups[label].push(c);
  });

  return groups;
}