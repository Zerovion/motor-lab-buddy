import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotorConfigProvider } from "@/contexts/MotorConfigContext";
import Layout from "./components/Layout";
import Index from "./pages/Index.tsx";
import DOL from "./pages/DOL.tsx";
import StarDelta from "./pages/StarDelta.tsx";
import AutoTransformer from "./pages/AutoTransformer.tsx";
import VFD from "./pages/VFD.tsx";
import RotorResistance from "./pages/RotorResistance.tsx";
import Comparison from "./pages/Comparison.tsx";
import Settings from "./pages/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MotorConfigProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/dol" element={<DOL />} />
              <Route path="/star-delta" element={<StarDelta />} />
              <Route path="/autotransformer" element={<AutoTransformer />} />
              <Route path="/vfd" element={<VFD />} />
              <Route path="/rotor-resistance" element={<RotorResistance />} />
              <Route path="/comparison" element={<Comparison />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MotorConfigProvider>
  </QueryClientProvider>
);

export default App;
