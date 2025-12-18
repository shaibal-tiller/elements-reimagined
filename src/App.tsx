import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CustomScrollbar from "./components/CustomScrollbar";
import Portfolio from "./pages/Portfolio";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <TooltipProvider>
    
    
    */}
    <Toaster />
    <Sonner />
    <BrowserRouter>
      {/* <CustomScrollbar> */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/portfolio" element={<Portfolio />} />

        <Route path="/resume" element={<Portfolio />} />
        <Route path="/contact" element={<Portfolio />} />
        <Route path="/blog" element={<Portfolio />} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH
          
          
          -ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* </CustomScrollbar> */}
    </BrowserRouter>
    {/* </TooltipProvider> */}
  </QueryClientProvider>
);

export default App;
