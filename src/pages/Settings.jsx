import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TONES = ['friendly', 'professional', 'concise', 'detailed', 'playful'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Arabic', 'Chinese', 'Japanese'];
const IMAGE_STYLES = ['realistic', 'cartoon', 'oil painting', 'watercolor', 'digital art', 'minimalist', 'photographic'];

export default function Settings() {
  const [settings, setSettings] = useState({
    ai_tone: 'friendly',
    language: 'English',
    image_style: 'realistic',
  });

  const [settingsId, setSettingsId] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const user = await base44.auth.me();

        const records = await base44.entities.Settings.filter({
          user_email: user.email,
        });

        if (records && records.length > 0) {
          setSettings(records[0]);
          setSettingsId(records[0].id);
        } else {
          setSettings((s) => ({
            ...s,
            user_email: user.email,
          }));
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };

    load();
  }, []);

  const handleSave = async () => {
    try {
      if (settingsId) {
        await base44.entities.Settings.update(settingsId, settings);
      } else {
        const created = await base44.entities.Settings.create(settings);
        setSettingsId(created.id);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <Link to="/subscription">
        <div className="flex items-center justify-between p-4 bg-secondary rounded-2xl border border-border hover:border-primary/40 transition-colors mb-2 cursor-pointer">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />

            <div>
              <p className="text-sm font-medium text-foreground">
                Subscription
              </p>
              <p className="text-xs text-muted-foreground">
                Upgrade your cosmic tier
              </p>
            </div>
          </div>

          <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
        </div>
      </Link>

      <div className="space-y-8">
        {/* AI Tone */}
        <div>
          <label className="block text-sm font-medium mb-2">
            AI Response Tone
          </label>

          <div className="flex flex-wrap gap-2">
            {TONES.map((tone) => (
              <button
                key={tone}
                onClick={() =>
                  setSettings((s) => ({ ...s, ai_tone: tone }))
                }
                className={`px-4 py-2 rounded-xl text-sm capitalize border transition-colors ${
                  settings.ai_tone === tone
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary text-secondary-foreground border-border hover:border-primary/50'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Response Language
          </label>

          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() =>
                  setSettings((s) => ({ ...s, language: lang }))
                }
                className={`px-4 py-2 rounded-xl text-sm border transition-colors ${
                  settings.language === lang
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary text-secondary-foreground border-border hover:border-primary/50'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Image Style */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Default Image Generation Style
          </label>

          <div className="flex flex-wrap gap-2">
            {IMAGE_STYLES.map((style) => (
              <button
                key={style}
                onClick={() =>
                  setSettings((s) => ({ ...s, image_style: style }))
                }
                className={`px-4 py-2 rounded-xl text-sm capitalize border transition-colors ${
                  settings.image_style === style
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary text-secondary-foreground border-border hover:border-primary/50'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {saved ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}