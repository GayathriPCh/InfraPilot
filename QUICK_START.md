# 🚀 QUICK START - InfraPilot Firebase Setup

## TL;DR - Get Running in 2 Minutes

### 1. Install Dependencies (Already Done ✅)
```bash
npm install firebase html2canvas jspdf
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test the System
1. Go to `http://localhost:5173/signup`
2. Create an account with email/password
3. You're logged in! ✨
4. Go to `/history` to see the dashboard
5. Navigate to `/builder` to start building

---

## 📍 Key Pages

| URL | Purpose | Auth Required |
|-----|---------|-------|
| `/` | Home page | ❌ No |
| `/login` | User login | ❌ No |
| `/signup` | Create account | ❌ No |
| `/builder` | Visual builder | ✅ Yes |
| `/history` | View saved plans | ✅ Yes |
| `/flow/*` | Various flows | ✅ Yes |

---

## 💾 Saving Plans (Next Step)

To enable users to save their plans from Results pages, add this to `Results.tsx` (and similar pages):

```tsx
import { useAuth } from "@/hooks/useAuth";
import { activityService } from "@/services/activityService";

// In your component:
const { user } = useAuth();

const handleSavePlan = async () => {
  if (!user) return;
  
  await activityService.saveActivity({
    uid: user.uid,
    activityType: "builder", // or docker, project, freeform
    title: "My Architecture",
    description: "Description here",
    input: userInput,
    services: selectedServices,
    connections: connections,
    aiResponse: aiResponse,
    output: generatedConfig,
    recommendations: "Recommendations",
    status: "completed",
  });
};

// Add button:
<Button onClick={handleSavePlan}>💾 Save Plan</Button>
```

---

## 📥 Download Plans

Users can download from the History page automatically. All download formats work:
- JSON ✅
- PDF ✅ 
- Text ✅
- CSV ✅

---

## 🔐 Firebase Security Rules

Add these to your Firebase Console for Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /activities/{document=**} {
      allow read, write: if request.auth.uid == resource.data.uid;
    }
  }
}
```

---

## ✅ Final Checklist

- [x] Firebase installed
- [x] Auth pages working
- [x] Navbar showing
- [x] History page accessible
- [x] Protected routes working
- [x] Ready for final review!

---

## 🎯 For Your Presentation Tomorrow

Show them:
1. **Sign up** → Create a test account
2. **Login** → Show persistent session
3. **Protected route** → Show it blocks unauthenticated users
4. **History page** → Show the dashboard (empty but beautiful)
5. **Download** → Show download functionality works (if plans are saved)

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Run `npm install` again |
| Firebase error | Check credentials in `src/config/firebase.ts` |
| Can't login | Make sure you signed up first |
| History empty | Plans aren't saved yet (requires Results page integration) |

---

**You're all set! 🎉**
