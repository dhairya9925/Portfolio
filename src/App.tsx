import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PortfolioProvider, Me, Technology, Project, Education } from "@/context/PortfolioContext";

const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<{
    me: Me | null;
    technologies: Technology[];
    projects: Project[];
    education: Education[];
  }>({
    me: null,
    technologies: [],
    projects: [],
    education: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, techRes, projRes, eduRes] = await Promise.all([
          fetch("http://127.0.0.1:8001/api/me"),
          fetch("http://127.0.0.1:8001/api/technologies"),
          fetch("http://127.0.0.1:8001/api/projects"),
          fetch("http://127.0.0.1:8001/api/edu"),
        ]);

        const me = await meRes.json();
        const technologies = await techRes.json();
        const projects = await projRes.json();
        const edu = await eduRes.json();

        console.log({ me, technologies, projects, edu });

        setPortfolioData({
          me,
          technologies: Array.isArray(technologies) ? technologies : [], // Ensure array
          projects: Array.isArray(projects) ? projects : [],
          education: Array.isArray(edu) ? edu : [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PortfolioProvider value={{ ...portfolioData, loading }}>
          <Toaster />
          <Sonner />
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground animate-pulse">Loading data...</p>
            </div>
          ) : (
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          )}
        </PortfolioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
