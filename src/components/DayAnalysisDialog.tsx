import { FormEvent, useState } from 'react';
import { Loader2, LockKeyhole, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { dayAnalysisSchema, type DayAnalysis } from '@/lib/dayAnalysis';

interface DayAnalysisDialogProps {
  onAnalysis: (analysis: DayAnalysis) => void;
}

const MAX_LENGTH = 4000;

const DayAnalysisDialog = ({ onAnalysis }: DayAnalysisDialogProps) => {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const description = day.trim();

    if (description.length < 10) {
      setError('Please describe a little more of your day (at least 10 characters).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/.netlify/functions/analyze-day', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ day: description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'The analysis request failed.');
      }

      const parsed = dayAnalysisSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error('The analysis returned an unexpected format.');
      }

      onAnalysis(parsed.data);
      setOpen(false);
      setDay('');

      window.setTimeout(() => {
        document.getElementById('your-day-analysis')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 150);
    } catch (requestError) {
      console.error('Day analysis failed:', requestError);
      setError('Mission control could not analyze your day right now. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!loading) {
          setOpen(nextOpen);
          if (nextOpen) setError('');
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="hero" size="lg" className="shrink-0">
          <Sparkles aria-hidden="true" />
          Check My Day &amp; Space
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl border-primary/30 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <DialogTitle className="font-display text-2xl">Tell us about your day</DialogTitle>
          <DialogDescription className="leading-relaxed">
            Write what you did, where you went, or which apps and services you used. AI will turn it into a personalized space-connection timeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="day-description" className="mb-2 block text-sm font-medium text-foreground">
              Describe your day
            </label>
            <Textarea
              id="day-description"
              value={day}
              onChange={(event) => {
                setDay(event.target.value);
                if (error) setError('');
              }}
              maxLength={MAX_LENGTH}
              rows={7}
              autoFocus
              disabled={loading}
              placeholder="I checked the weather, drove to work with maps, joined a video call, ordered lunch, and watched a movie..."
              className="min-h-40 resize-y border-border/80 bg-background/60"
              aria-describedby="day-description-help day-analysis-error"
            />
            <div id="day-description-help" className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                Avoid including private or sensitive information.
              </span>
              <span>{day.length}/{MAX_LENGTH}</span>
            </div>
          </div>

          {error && (
            <p id="day-analysis-error" role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" disabled={loading || day.trim().length < 10}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" />
                  Analyzing your orbit…
                </>
              ) : (
                <>
                  <Sparkles aria-hidden="true" />
                  Build My Timeline
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DayAnalysisDialog;
