import { useState, useEffect, useCallback } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import CosmosBackground from '@/components/chat/CosmosBackground';
import { base44 } from '@/api/base44Client';
import moment from 'moment';
import Sidebar from '@/components/chat/Sidebar';
import ChatArea from '@/components/chat/ChatArea';
import ImageGeneratorModal from '@/components/chat/ImageGeneratorModal';
import { Menu, Settings as SettingsIcon, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ShareAppButton from '@/components/ShareAppButton';

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [remainingImages, setRemainingImages] = useState(5);
  const [imageUsageRecord, setImageUsageRecord] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [codeUsageRecord, setCodeUsageRecord] = useState(null);
  const [remainingAdvancedCode, setRemainingAdvancedCode] = useState(null);

  const { tier, isAdmin, limits } = useSubscription();

  useEffect(() => {
    loadConversations();
    loadImageUsage();
    loadUserProfile();
    loadSettings();
    if (!isAdmin) loadCodeUsage();
  }, [isAdmin]);

  const getUser = async () => {
    try {
      return await base44.auth.me();
    } catch {
      return null;
    }
  };

  const loadCodeUsage = async () => {
    if (isAdmin) {
      setRemainingAdvancedCode(Infinity);
      return;
    }

    const user = await getUser();
    if (!user) return;

    const today = moment().format('YYYY-MM-DD');

    const records = await base44.entities.CodeUsage.filter({
      userId: user.id,
      date: today,
    });

    const limit = limits.advancedCode;

    if (records.length > 0) {
      setCodeUsageRecord(records[0]);
      setRemainingAdvancedCode(
        limit === Infinity ? Infinity : Math.max(0, limit - (records[0].advanced_count || 0))
      );
    } else {
      setRemainingAdvancedCode(limit);
    }
  };

  const loadSettings = async () => {
    const user = await getUser();
    if (!user) return;

    const records = await base44.entities.Settings.filter({
      userId: user.id,
    });

    if (records.length > 0) setUserSettings(records[0]);
  };

  const loadUserProfile = async () => {
    const user = await getUser();
    if (!user) return;

    const profiles = await base44.entities.UserProfile.filter({
      userId: user.id,
    });

    if (profiles.length > 0) setUserProfile(profiles[0]);
  };

  const loadImageUsage = async () => {
    if (isAdmin) {
      setRemainingImages(Infinity);
      return;
    }

    const user = await getUser();
    if (!user) return;

    const today = moment().format('YYYY-MM-DD');

    const records = await base44.entities.ImageUsage.filter({
      userId: user.id,
      date: today,
    });

    const limit = limits.images;

    if (records.length > 0) {
      setImageUsageRecord(records[0]);
      setRemainingImages(
        limit === Infinity ? Infinity : Math.max(0, limit - (records[0].count || 0))
      );
    } else {
      setRemainingImages(limit);
    }
  };

  const loadConversations = async () => {
    const data = await base44.entities.Conversation.list('-createdAt', 50);
    setConversations(data || []);
  };

  const selectConversation = useCallback(
    (id) => {
      const conv = conversations.find((c) => c.id === id);
      if (conv) {
        setActiveConvId(id);
        setMessages(conv.messages || []);
      }
    },
    [conversations]
  );

  const startNewChat = useCallback(() => {
    setActiveConvId(null);
    setMessages([]);
  }, []);

  const deleteConversation = useCallback(
    async (id) => {
      await base44.entities.Conversation.delete(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConvId === id) {
        setActiveConvId(null);
        setMessages([]);
      }
    },
    [activeConvId]
  );

  const handleSend = useCallback(
    async (text) => {
      const userMsg = {
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoading(true);

      const contextMessages = updatedMessages.slice(-10);
      const conversationContext = contextMessages
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: conversationContext,
      });

      const assistantMsg = {
        role: 'assistant',
        content: result,
        timestamp: new Date().toISOString(),
      };

      const allMessages = [...updatedMessages, assistantMsg];
      setMessages(allMessages);
      setIsLoading(false);

      if (activeConvId) {
        await base44.entities.Conversation.update(activeConvId, {
          messages: allMessages,
        });
      } else {
        const created = await base44.entities.Conversation.create({
          title: text.slice(0, 50),
          messages: allMessages,
        });

        setActiveConvId(created.id);
        setConversations((prev) => [created, ...prev]);
      }
    },
    [messages, activeConvId]
  );

  return (
    <div className="h-screen flex bg-background">
      <Sidebar
        conversations={conversations}
        activeId={activeConvId}
        onSelect={selectConversation}
        onNew={startNewChat}
        onDelete={deleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 p-3 border-b">
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <SettingsIcon className="w-4 h-4" />
            </Button>
          </Link>

          <Button onClick={() => setSidebarOpen(true)}>
            <Menu />
          </Button>
        </div>

        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onSend={handleSend}
          onImageClick={() => setImageModalOpen(true)}
        />
      </div>

      <ImageGeneratorModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
      />

      <ShareAppButton />
    </div>
  );
}