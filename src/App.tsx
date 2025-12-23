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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
    <CustomScrollbar>
      <Routes>
        {/* All routes that use the main layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} /> 
          <Route path="/portfolio/1" element={<PortfolioDetail />} />
           <Route path="/portfolio/2" element={<PortfolioDetail2 />} />
        </Route>

        {/* Routes without layout (like 404) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </CustomScrollbar>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;