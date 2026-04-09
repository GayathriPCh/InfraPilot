import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";

export interface ActivityRecord {
  id?: string;
  uid: string;
  activityType: "builder" | "docker" | "project" | "freeform"; // Type of activity
  title: string; // User-friendly title
  description?: string;
  input: string; // What user input/prompt
  services: string[]; // Selected/recommended services
  connections: Array<{
    from: string;
    to: string;
    type: "depends_on" | "connects_to" | "proxies_to";
  }>;
  aiResponse?: string; // Full AI response/recommendations
  output?: string; // Generated config/yaml
  dockerCompose?: string; // Docker compose output if applicable
  cicdPipeline?: string; // CI/CD pipeline output
  recommendations?: string; // Recommendations text
  status: "draft" | "completed";
  tags?: string[];
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export const activityService = {
  // Save a new activity/response
  async saveActivity(activity: Omit<ActivityRecord, "id" | "createdAt" | "updatedAt">) {
    try {
      const docRef = await addDoc(collection(db, "activities"), {
        ...activity,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error saving activity:", error);
      throw error;
    }
  },

  // Get all activities for a user
  async getUserActivities(uid: string, limit = 50) {
    try {
      const q = query(
        collection(db, "activities"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (ActivityRecord & { id: string })[];
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  },

  // Get activities by type
  async getUserActivitiesByType(uid: string, activityType: ActivityRecord["activityType"]) {
    try {
      const q = query(
        collection(db, "activities"),
        where("uid", "==", uid),
        where("activityType", "==", activityType),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (ActivityRecord & { id: string })[];
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  },

  // Update an activity
  async updateActivity(activityId: string, updates: Partial<ActivityRecord>) {
    try {
      await updateDoc(doc(db, "activities", activityId), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
    }
  },

  // Delete an activity
  async deleteActivity(activityId: string) {
    try {
      await deleteDoc(doc(db, "activities", activityId));
    } catch (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
  },

  // Search activities by title/description
  async searchActivities(uid: string, searchTerm: string) {
    try {
      const activities = await this.getUserActivities(uid);
      return activities.filter(
        (a) =>
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error("Error searching activities:", error);
      throw error;
    }
  },
};
