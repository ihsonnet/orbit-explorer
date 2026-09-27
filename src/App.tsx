import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import SkyAboveMe from "./pages/SkyAboveMe";
import MyDay from "./pages/MyDay";
import Global from "./pages/Global";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Maintenance from "./pages/Maintenance";
import Ambassadors from "./pages/Ambassadors";
import SpaceLab from "./pages/SpaceLab";
import { useSiteSettings } from "./hooks/useSiteSettings";

const queryClient = new QueryClient();

// Wrapper component to handle maintenance mode
const AppRoutes = () => {
  const location = useLocation();
  const { settings, loading } = useSiteSettings();
  
  // Allow admin routes even during maintenance
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Show maintenance page if enabled and not on admin routes
  if (!loading && settings.maintenance_mode && !isAdminRoute) {
    return <Maintenance />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/sky-above-me" element={<SkyAboveMe />} />
      <Route path="/my-day-and-space" element={<MyDay />} />
      <Route path="/my-day" element={<Navigate to="/my-day-and-space" replace />} />
      <Route path="/global" element={<Global />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/space-ambassador-program" element={<Ambassadors />} />
      <Route path="/space-lab" element={<SpaceLab />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
