import { Satellite, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Satellite className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg">S.P.A.C.E. for Everyone</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Making space accessible to all. Discover how satellites silently power your everyday life, 
              from internet and navigation to weather forecasting and disaster response.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-3 text-foreground">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/sky-above-me" className="hover:text-primary transition-colors">
                  Sky Above Me
                </Link>
              </li>
              <li>
                <Link to="/my-day" className="hover:text-primary transition-colors">
                  My Day & Space
                </Link>
              </li>
              <li>
                <Link to="/global" className="hover:text-primary transition-colors">
                  Global View
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-primary transition-colors">
                  Learn
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-3 text-foreground">Data Sources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="https://celestrak.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  Celestrak <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://data.nasa.gov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  NASA Open Data <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://api.spacexdata.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  SpaceX API <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} S.P.A.C.E. for Everyone. 
            Real-time TLE data from Celestrak. Educational use only.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live satellite tracking
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
