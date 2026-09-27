import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Satellite, Globe, Calendar, BookOpen, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import space4eLogo from '@/assets/space4e-logo.png';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/sky-above-me', label: 'Sky Above Me', icon: Satellite },
  { path: '/my-day', label: 'My Day & Space', icon: Calendar },
  { path: '/global', label: 'Global View', icon: Globe },
  { path: '/learn', label: 'Learn & Share', icon: BookOpen },
];

const Navigation = () => {
  const location = useLocation();
  const { settings } = useSiteSettings();

  return (
    <>
      <Link
        to="/space-ambassador-program"
        className="group fixed inset-x-0 top-0 z-[60] h-6 bg-gradient-to-r from-violet-950 via-accent/90 to-violet-950 text-white border-b border-primary/30 shadow-[0_0_20px_hsl(var(--glow-accent)/0.25)] flex items-center justify-center gap-2 px-4 text-[11px] sm:text-xs font-semibold tracking-wide hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary transition-all duration-300"
        aria-label="Space Ambassador Program is Open! Learn more"
      >
        <span
          className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--glow-primary))] animate-pulse shrink-0"
          aria-hidden="true"
        />
        <span className="truncate">Space Ambassador Program is Open!</span>
        <ArrowRight
          className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-6 left-0 right-0 z-50 px-4 py-2"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl px-3 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            {settings.show_logo ? (
              <img 
                src={space4eLogo} 
                alt="S.P.A.C.E. for Everyone" 
                className="h-8 max-w-[160px] object-contain"
              />
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Satellite className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-lg hidden sm:block">
                  S.P.A.C.E.
                </span>
              </>
            )}
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-label={item.label}
                  className={cn(
                    'relative px-2 lg:px-3 xl:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                    'hover:text-foreground',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-secondary rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navigation;
