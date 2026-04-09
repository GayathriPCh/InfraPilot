import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Builder from "./pages/Builder";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import History from "./pages/History";
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
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes */}
              <Route
                path="/builder"
                element={
                  <ProtectedRoute>
                    <Builder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/flow/add-cicd"
                element={
                  <ProtectedRoute>
                    <AddCICDFlow />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommendations"
                element={
                  <ProtectedRoute>
                    <Recommendations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <ProtectedRoute>
                    <Results />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/flow/docker-compose"
                element={
                  <ProtectedRoute>
                    <DockerComposeFlow />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/docker-recommendations"
                element={
                  <ProtectedRoute>
                    <DockerRecommendations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/docker-results"
                element={
                  <ProtectedRoute>
                    <DockerResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/flow/new-project"
                element={
                  <ProtectedRoute>
                    <NewProjectFlow />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project-recommendations"
                element={
                  <ProtectedRoute>
                    <ProjectRecommendations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project-results"
                element={
                  <ProtectedRoute>
                    <ProjectResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/flow/freeform"
                element={
                  <ProtectedRoute>
                    <FreeformFlow />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/freeform-recommendations"
                element={
                  <ProtectedRoute>
                    <FreeformRecommendations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/freeform-results"
                element={
                  <ProtectedRoute>
                    <FreeformResults />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </HelmetProvider>
);

export default App;
