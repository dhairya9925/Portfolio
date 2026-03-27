import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { usePortfolioData } from "./hooks/usePortfolioData";

// Inner component allows useQuery hook inside QueryClientProvider
function AppContent() {
  const { data, isLoading, isError } = usePortfolioData();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading data from Supabase...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background">
        <p className="text-red-500 font-semibold mb-2">Error loading portfolio data.</p>
        <p className="text-sm text-muted-foreground">Please check your Supabase connection and environment variables.</p>
      </div>
    );
  }

  const providerValue = {
    me: data?.me || null,
    technologies: data?.technologies || [],
    projects: data?.projects || [],
    education: data?.education || [],
    loading: false,
  };

  return (
    <PortfolioProvider value={providerValue}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
