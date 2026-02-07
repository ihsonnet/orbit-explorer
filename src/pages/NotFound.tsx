import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Rocket, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpaceBackground from "@/components/SpaceBackground";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <SEO
        title="404 - Page Not Found"
        description="Lost in space? The page you're looking for doesn't exist. Navigate back to explore satellites and space technology."
        noIndex={true}
      />
      <SpaceBackground />
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center pt-20">
        <div className="relative z-10 text-center px-6">
          {/* Floating satellite icon */}
          <div className="float mb-4">
            <Rocket className="w-14 h-14 md:w-16 md:h-16 text-primary mx-auto rotate-45" />
          </div>
          
          {/* 404 with glow effect */}
          <h1 className="text-6xl md:text-7xl font-display font-bold gradient-text mb-2">
            404
          </h1>
          
          {/* Main message */}
          <h2 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-1">
            Not Found!
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground mb-6">
            Lost in <span className="text-primary font-semibold">S.P.A.C.E.</span> ?
          </p>
          
          {/* Back to home button */}
          <Link to="/">
            <Button variant="hero" size="default" className="gap-2">
              Go back to <Home className="w-4 h-4" /> Home
            </Button>
          </Link>
          
          {/* Decorative orbit rings */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-primary/20 rounded-full orbit-ring" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-accent/15 rounded-full orbit-ring" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/10 rounded-full orbit-ring" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
