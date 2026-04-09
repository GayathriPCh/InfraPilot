import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { activityService, ActivityRecord } from "@/services/activityService";
import { downloadService } from "@/services/downloadService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

export default function History() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activities, setActivities] = useState<(ActivityRecord & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    (async () => {
      try {
        const data = await activityService.getUserActivities(user.uid);
        setActivities(data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load activities", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await activityService.deleteActivity(id);
      setActivities(activities.filter((a) => a.id !== id));
      toast({ title: "Success", description: "Activity deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete activity", variant: "destructive" });
    }
  };

  const handleDownload = async (activity: ActivityRecord & { id: string }, format: "json" | "pdf" | "text") => {
    try {
      await downloadService.downloadArchitecturePlan(
        activity.title,
        activity.services,
        activity.connections,
        activity.recommendations || "No recommendations available",
        format
      );
      toast({ title: "Success", description: `Plan downloaded as ${format.toUpperCase()}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to download", variant: "destructive" });
    }
  };

  const filtered = activities.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || a.activityType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Helmet>
        <title>History - InfraPilot</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                ← Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Your Infrastructure Plans</h1>
                <p className="text-slate-400">Welcome, {user?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 rounded-md border border-slate-300 bg-white"
              >
                <option value="all">All Types</option>
                <option value="builder">Builder</option>
                <option value="docker">Docker</option>
                <option value="project">Project</option>
                <option value="freeform">Freeform</option>
              </select>
            </div>
          </div>

          {/* Activities Grid */}
          {loading ? (
            <div className="text-center text-slate-400">Loading your plans...</div>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-slate-500">
                {activities.length === 0
                  ? "No plans yet. Create your first infrastructure plan!"
                  : "No plans match your search."}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filtered.map((activity) => (
                <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle>{activity.title}</CardTitle>
                        <CardDescription>{activity.description}</CardDescription>
                      </div>
                      <Badge className="ml-4">{activity.activityType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Services */}
                      <div>
                        <p className="text-sm font-semibold mb-2">Services:</p>
                        <div className="flex flex-wrap gap-2">
                          {activity.services.map((service) => (
                            <Badge key={service} variant="secondary">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Date */}
                      <div>
                        <p className="text-sm text-slate-500">
                          Created: {new Date(
                            activity.createdAt instanceof Date ? activity.createdAt : activity.createdAt.toDate?.() || new Date()
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(activity, "json")}
                        >
                          📥 JSON
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(activity, "text")}
                        >
                          📝 Text
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(activity, "pdf")}
                        >
                          📄 PDF
                        </Button>

                        {/* Delete Button */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              🗑️ Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{activity.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                            <div className="flex gap-2">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(activity.id)}>
                                Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
