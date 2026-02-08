import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Satellite, Globe, Calendar, BookOpen, Home } from 'lucide-react';
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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {settings.show_logo ? (
              <img 
                src={space4eLogo} 
                alt="S.P.A.C.E. for Everyone" 
                className="h-10 w-auto object-contain"
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
                  className={cn(
                    'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
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
                    <span className="hidden md:inline">{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
