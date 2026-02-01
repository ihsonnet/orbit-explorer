import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/hooks/use-toast';

const MaintenanceToggle = () => {
  const { toast } = useToast();
  const { settings, loading, updateMaintenanceMode } = useSiteSettings();
  const [updating, setUpdating] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setUpdating(true);
    const success = await updateMaintenanceMode(checked);
    setUpdating(false);

    if (success) {
      toast({
        title: checked ? 'Maintenance Mode Enabled' : 'Maintenance Mode Disabled',
        description: checked 
          ? 'The site is now showing the maintenance page to all visitors.' 
          : 'The site is now accessible to all visitors.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update maintenance mode. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            settings.maintenance_mode ? 'bg-destructive/10' : 'bg-muted'
          }`}>
            <AlertTriangle className={`w-5 h-5 ${
              settings.maintenance_mode ? 'text-destructive' : 'text-muted-foreground'
            }`} />
          </div>
          <div>
            <Label htmlFor="maintenance-mode" className="text-base font-semibold text-foreground cursor-pointer">
              Maintenance Mode
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              When enabled, all visitors will see a maintenance page instead of the site content.
            </p>
            {settings.maintenance_mode && (
              <p className="text-sm text-destructive mt-2 font-medium">
                ⚠️ Site is currently in maintenance mode
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {updating && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          <Switch
            id="maintenance-mode"
            checked={settings.maintenance_mode}
            onCheckedChange={handleToggle}
            disabled={updating}
          />
        </div>
      </div>
    </div>
  );
};

export default MaintenanceToggle;
