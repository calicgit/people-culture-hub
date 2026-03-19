import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "./pages/Landing";
import CouncilLogin from "./pages/CouncilLogin";
import Sections from "./pages/Sections";
import Legal from "./pages/Legal";
import MeetupInvite from "./pages/MeetupInvite";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/council-login" element={<CouncilLogin />} />
            <Route path="/sections" element={<Sections />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/meetup-invite" element={<MeetupInvite />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
