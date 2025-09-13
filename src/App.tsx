import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Builder from "./pages/Builder";
import AddCICDFlow from "@/pages/Flows/AddCICDFlow.tsx";
import Recommendations from "@/pages/Recommendations.tsx";
import Results from "@/pages/Results.tsx";
import DockerComposeFlow from "./pages/Flows/DockerComposeFlow";
import DockerRecommendations from "./pages/DockerRecommendations";
import DockerResults from "./pages/DockerResults";
import NewProjectFlow from "./pages/Flows/NewProjectFlows";
import ProjectRecommendations from "./pages/ProjectRecommendations";
import ProjectResults from "./pages/ProjectResults";
import FreeformFlow from "./pages/Flows/FreeFormFlow";
import FreeformRecommendations from "./pages/FreeFormRecommendations";
import FreeformResults from "./pages/FreeFormResults";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/flow/add-cicd" element={<AddCICDFlow />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/results" element={<Results />} />
            <Route path="/flow/docker-compose" element={<DockerComposeFlow />} />
            <Route path="/docker-recommendations" element={<DockerRecommendations />} />
            <Route path="/docker-results" element={<DockerResults />} />
            <Route path="/flow/new-project" element={<NewProjectFlow />} />
            <Route path="/project-recommendations" element={<ProjectRecommendations />} />
            <Route path="/project-results" element={<ProjectResults />} />
            <Route path="/flow/freeform" element={<FreeformFlow />} />
            <Route path="/freeform-recommendations" element={<FreeformRecommendations />} />
            <Route path="/freeform-results" element={<FreeformResults />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
