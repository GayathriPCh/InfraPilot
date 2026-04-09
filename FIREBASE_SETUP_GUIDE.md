# InfraPilot - Firebase & User Activity Setup Guide

## What's Been Implemented ✅

Your InfraPilot app now has a complete **authentication and data persistence system** with the following features:

### 1. **Firebase Integration**
- ✅ Firebase Authentication (Email/Password)
- ✅ Firestore Database for storing user activities and plans
- ✅ Firebase Storage (ready for future file uploads)
- ✅ Your Firebase config is already set up

### 2. **User Authentication**
- ✅ Sign up page (`/signup`) - Create new accounts
- ✅ Login page (`/login`) - User login with persistence
- ✅ Protected routes - Pages require login
- ✅ Auth context & hooks - Easy access to user state

### 3. **Activity & Plan Storage**
- ✅ Save architecture plans to Firestore
- ✅ Auto-generate metadata (timestamps, user ID, tags)
- ✅ Support for all project types (builder, docker, project, freeform)

### 4. **Downloadable Plans**
- ✅ Download as JSON
- ✅ Download as Text
- ✅ Download as PDF
- ✅ Download as CSV
- ✅ Download Docker Compose YAML
- ✅ Multi-format architecture plans

### 5. **History & Dashboard**
- ✅ `/history` page - View all saved plans
- ✅ Search functionality
- ✅ Filter by activity type
- ✅ Delete plans
- ✅ Quick download from history

### 6. **Navigation**
- ✅ Navbar component with auth status
- ✅ Dynamic links based on login status
- ✅ Quick access to dashboard

---

## How to Integrate with Your Pages

### Step 1: Import the Hooks & Services
```tsx
import { useAuth } from "@/hooks/useAuth";
import { activityService } from "@/services/activityService";
import { downloadService } from "@/services/downloadService";
import { toast } from "@/hooks/use-toast";
```

### Step 2: In Your Results Pages (e.g., Results.tsx, DockerResults.tsx)

Add a "Save Plan" button with this handler:

```tsx
const { user } = useAuth();

const handleSavePlan = async () => {
  if (!user) {
    toast({ title: "Error", description: "Please log in first", variant: "destructive" });
    return;
  }

  try {
    await activityService.saveActivity({
      uid: user.uid,
      activityType: "builder", // or "docker", "project", "freeform"
      title: "My Architecture Plan",
      description: "Description of what you built",
      input: userInput, // What user entered
      services: selectedServices, // Array of service names
      connections: connections, // Array of connections
      aiResponse: aiRecommendations, // Full AI response
      output: generatedConfig, // YAML or JSON config
      recommendations: "Key recommendations text",
      status: "completed",
      tags: ["tag1", "tag2"],
    });

    toast({ title: "Success", description: "Plan saved to your history!" });
  } catch (error) {
    toast({ title: "Error", description: "Failed to save plan", variant: "destructive" });
  }
};
```

### Step 3: Add Download Buttons
```tsx
const handleDownloadPlan = async (format: "json" | "pdf" | "text") => {
  try {
    await downloadService.downloadArchitecturePlan(
      "My Plan Title",
      selectedServices,
      connections,
      recommendations,
      format
    );
    toast({ title: "Success", description: `Downloaded as ${format.toUpperCase()}` });
  } catch (error) {
    toast({ title: "Error", description: "Failed to download" });
  }
};
```

### Step 4: Update Results Pages (Results.tsx, DockerResults.tsx, etc.)

Add these buttons before the closing div:

```tsx
{user && (
  <div className="mt-8 flex gap-4 justify-center flex-wrap">
    <Button onClick={handleSavePlan}>💾 Save Plan</Button>
    <Button onClick={() => handleDownloadPlan("json")}>📥 JSON</Button>
    <Button onClick={() => handleDownloadPlan("text")}>📝 Text</Button>
    <Button onClick={() => handleDownloadPlan("pdf")}>📄 PDF</Button>
  </div>
)}
```

---

## Updated Routes

### Public Routes
- `/` - Home page (with Navbar)
- `/login` - Login page
- `/signup` - Sign up page

### Protected Routes (Require Login)
- `/builder` - Visual builder
- `/history` - View saved plans
- `/flow/add-cicd` - Add CI/CD flow
- `/flow/docker-compose` - Docker compose flow
- `/flow/new-project` - New project flow
- `/flow/freeform` - Free form flow
- `/recommendations` - Recommendations page
- `/results` - Results page
- All other results and flow pages...

---

## Firestore Database Structure

### Collections

#### `users` collection
Stores user profiles:
```json
{
  "uid": "user-id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### `activities` collection
Stores saved architecture plans:
```json
{
  "uid": "user-id",
  "activityType": "builder",
  "title": "My E-commerce Platform",
  "description": "Tech stack for online store",
  "input": "User description of project",
  "services": ["react", "node", "postgres"],
  "connections": [
    {
      "from": "react",
      "to": "node",
      "type": "connects_to"
    }
  ],
  "aiResponse": "Full AI recommendations...",
  "output": "Generated YAML/config",
  "recommendations": "Key recommendations text",
  "dockerCompose": "Docker compose YAML if applicable",
  "cicdPipeline": "CI/CD config if applicable",
  "status": "completed",
  "tags": ["ai-generated"],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

## Security Rules (Firestore)

Your Firebase project should have these rules for security:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Users can only read/write their own activities
    match /activities/{document=**} {
      allow read, write: if request.auth.uid == resource.data.uid;
    }
  }
}
```

---

## Testing the System

### 1. Start the app
```bash
npm run dev
```

### 2. Sign up
- Go to `/signup`
- Create an account with email and password

### 3. Navigate to Builder
- Click "Visual Builder" or go to `/builder`
- Create your architecture

### 4. Save your plan
- Click "Save Plan" (when implemented in Results pages)
- Plan gets saved to Firestore

### 5. Check History
- Go to `/history`
- See all saved plans
- Download plans in multiple formats
- Delete old plans

---

## Important Notes for Final Review

### ✅ Completed Features
1. User authentication (signup/login/logout)
2. Protected routes
3. Firestore database integration
4. Activity tracking system
5. Multi-format downloads (JSON, PDF, Text, CSV)
6. History/Dashboard page
7. Search & filter functionality
8. Beautiful UI with Navbar

### ⚠️ Still Need to Integrate Into Results Pages
These files should call `activityService.saveActivity()` when users generate plans:
- `src/pages/Results.tsx` - From Builder
- `src/pages/DockerResults.tsx` - From Docker Compose
- `src/pages/ProjectResults.tsx` - From Project flow
- `src/pages/FreeFormResults.tsx` - From Freeform flow
- `src/pages/Recommendations.tsx` - From recommendations

### 📝 Example Integration in Results.tsx
Check `src/utils/activityIntegrationExample.ts` for code examples!

---

## Quick Checklist for Final Review Tomorrow

- [ ] Firebase credentials are configured
- [ ] User can sign up and login
- [ ] Protected routes redirect unauthenticated users to /login
- [ ] User can navigate to history page
- [ ] History page shows saved plans (empty if no plans saved yet)
- [ ] Download buttons work (JSON/PDF/Text)
- [ ] Navbar shows login/signup for guests, email + Dashboard for logged-in users
- [ ] Activity saving is integrated into Results pages (optional but recommended)

---

## Troubleshooting

### Issue: Firebase errors on build
**Solution**: Make sure Firebase is installed: `npm install firebase html2canvas jspdf`

### Issue: Protected pages redirect to login
**Solution**: This is intentional! Users must sign up/login first.

### Issue: History page is empty
**Solution**: Navigate to a Results page and save a plan (if Results pages are updated with save functionality).

### Issue: Download not working
**Solution**: Check browser console for errors. Ensure html2canvas and jspdf are installed.

---

## Next Steps (Recommended)

1. **Integrate into Results pages** - Add save functionality to all Results pages
2. **Add plan templates** - Let users save as templates
3. **Add collaboration** - Share plans with team members
4. **Add plan versions** - Track changes over time
5. **Add export to real formats** - Kubernetes YAML, Terraform, etc.

---

Great luck with your final review! 🚀
