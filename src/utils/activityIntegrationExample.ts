// This file shows how to integrate activity tracking and downloading into your Result pages

import { useAuth } from "@/hooks/useAuth";
import { activityService, ActivityRecord } from "@/services/activityService";
import { downloadService } from "@/services/downloadService";
import { toast } from "@/hooks/use-toast";

/**
 * Example: Save an activity to Firestore after generating architecture
 */
export async function saveArchitectureActivity(
  uid: string,
  title: string,
  description: string,
  services: string[],
  connections: Array<{ from: string; to: string; type: "depends_on" | "connects_to" | "proxies_to" }>,
  aiResponse: string,
  output: string,
  activityType: "builder" | "docker" | "project" | "freeform" = "builder"
) {
  try {
    const activity: Omit<ActivityRecord, "id" | "createdAt" | "updatedAt"> = {
      uid,
      activityType,
      title,
      description,
      input: description,
      services,
      connections,
      aiResponse,
      output,
      recommendations: aiResponse,
      status: "completed",
      tags: ["ai-generated"],
    };

    const activityId = await activityService.saveActivity(activity);
    toast({ title: "Saved", description: "Your plan has been saved to your history!" });
    return activityId;
  } catch (error) {
    toast({ title: "Error", description: "Failed to save activity", variant: "destructive" });
    throw error;
  }
}

/**
 * Example: Use in a Results page component
 */
export function useActivityTracking() {
  const { user } = useAuth();

  const trackAndSave = async (
    title: string,
    description: string,
    services: string[],
    connections: Array<{ from: string; to: string; type: "depends_on" | "connects_to" | "proxies_to" }>,
    aiResponse: string,
    output: string
  ) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save plans", variant: "destructive" });
      return;
    }

    await saveArchitectureActivity(
      user.uid,
      title,
      description,
      services,
      connections,
      aiResponse,
      output
    );
  };

  const handleDownload = (
    title: string,
    services: string[],
    connections: Array<{ from: string; to: string; type: "depends_on" | "connects_to" | "proxies_to" }>,
    recommendations: string,
    format: "json" | "pdf" | "text" = "json"
  ) => {
    downloadService.downloadArchitecturePlan(title, services, connections, recommendations, format);
  };

  return { trackAndSave, handleDownload };
}

/**
 * Example usage in a Results page component:
 *
 * import { useActivityTracking } from "@/utils/activityIntegrationExample";
 *
 * export default function Results() {
 *   const { trackAndSave, handleDownload } = useActivityTracking();
 *   const { user } = useAuth();
 *
 *   const handleSaveAndDownload = async () => {
 *     await trackAndSave(
 *       "My Awesome App",
 *       "E-commerce platform with React frontend and Node.js backend",
 *       ["react", "node", "postgres"],
 *       [{ from: "react", to: "node", type: "connects_to" }],
 *       "Recommended architecture...",
 *       "Generated YAML/Config..."
 *     );
 *
 *     handleDownload(
 *       "My Awesome App",
 *       ["react", "node", "postgres"],
 *       [{ from: "react", to: "node", type: "connects_to" }],
 *       "Recommended architecture...",
 *       "json"
 *     );
 *   };
 *
 *   return (
 *     <div>
 *       {user && (
 *         <button onClick={handleSaveAndDownload}>
 *           Save & Download Plan
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 */
