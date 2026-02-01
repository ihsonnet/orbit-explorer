import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Rocket, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpaceBackground from "@/components/SpaceBackground";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <SpaceBackground />
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="relative z-10 text-center px-6">
          {/* Floating satellite icon */}
          <div className="float mb-8">
            <Rocket className="w-24 h-24 text-primary mx-auto rotate-45" />
          </div>
          
          {/* 404 with glow effect */}
          <h1 className="text-8xl md:text-9xl font-display font-bold gradient-text mb-4">
            404
          </h1>
          
          {/* Main message */}
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
            Not Found!
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Lost in <span className="text-primary font-semibold">S.P.A.C.E.</span> ?
          </p>
          
          {/* Back to home button */}
          <Link to="/">
            <Button variant="hero" size="lg" className="gap-2">
              Go back to <Home className="w-5 h-5" /> Home
            </Button>
          </Link>
          
          {/* Decorative orbit rings */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-primary/20 rounded-full orbit-ring" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-accent/15 rounded-full orbit-ring" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full orbit-ring" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
