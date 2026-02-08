import { useState } from 'react';
import { Image, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/hooks/use-toast';

const LogoToggle = () => {
  const { toast } = useToast();
  const { settings, loading, updateShowLogo } = useSiteSettings();
  const [updating, setUpdating] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setUpdating(true);
    const success = await updateShowLogo(checked);
    setUpdating(false);

    if (success) {
      toast({
        title: checked ? 'Logo Enabled' : 'Logo Disabled',
        description: checked 
          ? 'The header is now showing the S.P.A.C.E. 4E logo.' 
          : 'The header is now showing the icon and text.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update logo visibility. Please try again.',
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
            settings.show_logo ? 'bg-primary/10' : 'bg-muted'
          }`}>
            <Image className={`w-5 h-5 ${
              settings.show_logo ? 'text-primary' : 'text-muted-foreground'
            }`} />
          </div>
          <div>
            <Label htmlFor="show-logo" className="text-base font-semibold text-foreground cursor-pointer">
              Show Header Logo
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              When enabled, the S.P.A.C.E. 4E logo image is displayed in the header. When disabled, the satellite icon and text are shown instead.
            </p>
            {settings.show_logo && (
              <p className="text-sm text-primary mt-2 font-medium">
                ✓ Logo is currently visible
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {updating && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          <Switch
            id="show-logo"
            checked={settings.show_logo}
            onCheckedChange={handleToggle}
            disabled={updating}
          />
        </div>
      </div>
    </div>
  );
};

export default LogoToggle;
