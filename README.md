# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ad862708-e8dc-4a01-bc99-683a874939a3

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ad862708-e8dc-4a01-bc99-683a874939a3) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Firebase (Firestore & Authentication)
- React Query (TanStack Query)

---

## Firebase Setup Guide

This portfolio uses Firebase for dynamic content management. Follow these steps to set up Firebase:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" (or "Add project")
3. Enter a project name (e.g., "portfolio-shaibal")
4. Enable/disable Google Analytics as preferred
5. Click "Create project"

### 2. Enable Firestore Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a location (e.g., `asia-south1` for Bangladesh)
5. Click "Enable"

### 3. Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click "Save"

### 4. Create Admin User

1. In Firebase Console, go to **Build > Authentication > Users**
2. Click "Add user"
3. Enter the admin email: `shaibal.tiller@gmail.com`
4. Set a secure password
5. Click "Add user"

### 5. Set Firestore Security Rules

1. In Firebase Console, go to **Firestore Database > Rules**
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for all collections
    match /{collection}/{docId} {
      allow read: if true;

      // Only authenticated admin can write
      allow write: if request.auth != null
        && request.auth.token.email == 'shaibal.tiller@gmail.com';
    }
  }
}
```

3. Click "Publish"

### 6. Get Firebase Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Enter an app nickname (e.g., "portfolio-web")
5. Click "Register app"
6. Copy the `firebaseConfig` object values

### 7. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```sh
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase config values:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 8. (Optional) Migrate Existing Data

To populate Firestore with initial data:

1. Install firebase-admin:
   ```sh
   npm install firebase-admin --save-dev
   ```

2. Download service account key:
   - Go to **Project Settings > Service accounts**
   - Click "Generate new private key"
   - Save as `scripts/serviceAccountKey.json`

3. Run migration:
   ```sh
   npx tsx scripts/migrateToFirestore.ts
   ```

---

## Admin Panel

Access the admin panel at `/admin` to manage:

- **Projects**: Add, edit, delete portfolio projects
- **Services**: Manage service offerings
- **Profile**: Update personal information and social links

**Login credentials**: Use the admin email (`shaibal.tiller@gmail.com`) and the password you set in Firebase Authentication.

---

## Fallback Behavior

The portfolio gracefully handles missing Firebase configuration:

- If Firebase is not configured, static data from `src/data/projectsData.ts` and `src/assets/data.js` is used
- If Firestore is empty, static data is used as fallback
- If network errors occur, cached/static data is displayed

This ensures the portfolio always works, even without Firebase setup.

---

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ad862708-e8dc-4a01-bc99-683a874939a3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
