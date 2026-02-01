import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface SiteSettings {
  maintenance_mode: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  maintenance_mode: false,
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'maintenance_mode')
        .maybeSingle();

      if (error) {
        console.error('Error fetching site settings:', error);
        setSettings(DEFAULT_SETTINGS);
      } else if (data) {
        setSettings({
          maintenance_mode: data.value === 'true',
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

  return {
    settings,
    loading,
    updateMaintenanceMode,
    refetch: fetchSettings,
  };
}
