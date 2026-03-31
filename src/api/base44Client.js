import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

// 🔥 Import entities (NEW)
import CodeUsage from '@/lib/entities/CodeUsage';
import Conversation from '@/lib/entities/Conversation';
import ImageUsage from '@/lib/entities/ImageUsage';
import Settings from '@/lib/entities/Settings';
import Subscription from '@/lib/entities/Subscription';
import UserProfile from '@/lib/entities/UserProfile';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// 🔥 Create Base44 client
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

// 🔥 Attach entities (CRITICAL FIX)
export const entities = {
  CodeUsage,
  Conversation,
  ImageUsage,
  Settings,
  Subscription,
  UserProfile,
};