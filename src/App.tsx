import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";
import Resume from "./pages/Resume";
import { Contact } from "./pages/Contact";
import { Blog } from "./pages/Blog";
import CustomScrollbar from "@/components/CustomScrollbar";
import PortfolioDetail from "./pages/Detail1";
import PortfolioDetail2 from "./pages/Detail2";
import ProjectDetail from './pages/PortfolioDetailFrame'
import Admin from './pages/admin/Admin'
import { useEffect } from "react";
import { isFirebaseConfigured } from "./lib/firebase/config";
import { getProfile, getLinks } from "./services/profileService";
import { getProjects } from "./services/projectService";
import { getServices } from "./services/servicesService";
import { getResume } from "./services/resumeService";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000,   // 30 minutes — data rarely changes
      gcTime: 2 * 60 * 60 * 1000,  // 2 hours in memory
      retry: 2,
      refetchOnWindowFocus: false,  // don't refetch when tab regains focus
      refetchOnReconnect: false,    // don't refetch on reconnect — Firestore handles offline
    },
  },
});

/** Prefetch all portfolio data at startup so navigation is instant. */
function DataPrefetcher() {
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    // Fire all fetches in parallel — they populate the React Query cache
    queryClient.prefetchQuery({ queryKey: ["profile"], queryFn: getProfile });
    queryClient.prefetchQuery({ queryKey: ["links"], queryFn: getLinks });
    queryClient.prefetchQuery({ queryKey: ["projects"], queryFn: getProjects });
    queryClient.prefetchQuery({ queryKey: ["services"], queryFn: getServices });
    queryClient.prefetchQuery({ queryKey: ["resume"], queryFn: getResume });
  }, []);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataPrefetcher />
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <CustomScrollbar>
        <Routes>
          {/* All routes that use the main layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<ProjectDetail />} />
            {/* <Route path="/portfolio/:id" element={< />} /> */}
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            {/* <Route path="/portfolio/1" element={<PortfolioDetail />} />
            <Route path="/portfolio/2" element={<PortfolioDetail2 />} /> */}
          </Route>

          {/* Admin route without main layout */}
          <Route path="/admin" element={<Admin />} />

          {/* Routes without layout (like 404) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CustomScrollbar>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
