import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface SiteSettings {
  maintenance_mode: boolean;
  show_logo: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  maintenance_mode: false,
  show_logo: true,
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) {
        console.error('Error fetching site settings:', error);
        setSettings(DEFAULT_SETTINGS);
      } else if (data && data.length > 0) {
        const settingsMap = data.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {} as Record<string, string>);
        
        setSettings({
          maintenance_mode: settingsMap['maintenance_mode'] === 'true',
          show_logo: settingsMap['show_logo'] !== 'false', // default true
        });
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (err) {
      console.error('Failed to fetch site settings:', err);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateMaintenanceMode = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'maintenance_mode',
          value: enabled ? 'true' : 'false',
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'key',
        });

      if (error) {
        console.error('Error updating maintenance mode:', error);
        return false;
      }

      setSettings(prev => ({ ...prev, maintenance_mode: enabled }));
      return true;
    } catch (err) {
      console.error('Failed to update maintenance mode:', err);
      return false;
    }
  };

  const updateShowLogo = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'show_logo',
          value: enabled ? 'true' : 'false',
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'key',
        });

      if (error) {
        console.error('Error updating show logo:', error);
        return false;
      }

      setSettings(prev => ({ ...prev, show_logo: enabled }));
      return true;
    } catch (err) {
      console.error('Failed to update show logo:', err);
      return false;
    }
  };

  return {
    settings,
    loading,
    updateMaintenanceMode,
    updateShowLogo,
    refetch: fetchSettings,
  };
}
