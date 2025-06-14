# Wanda Website

A modern web interface for the Wanda voice-first local discovery platform.

## Features

- 📱 Phone number authentication using Firebase Auth
- 👤 User dashboard with profile and call history
- 🔒 Protected routes for authenticated users
- 📞 Integration with Wanda's voice assistant
- 🎨 Modern, responsive design with Tailwind CSS

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication and Firestore
   - Enable Phone Number authentication in the Firebase console
   - Copy your Firebase config to `.env`:
   
   ```bash
   cp .env.example .env
   ```
   
   Then fill in your Firebase configuration values in `.env`.

3. **Configure Firebase Authentication:**
   - In Firebase Console > Authentication > Sign-in method
   - Enable "Phone" sign-in method
   - Add your domain to the authorized domains list

4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Deploy to GCP**
https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service 

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Hero.tsx        # Landing page hero with phone auth
│   ├── PhoneVerificationModal.tsx  # Phone verification modal
│   ├── Features.tsx    # Features section
│   ├── HowItWorks.tsx  # How it works section
│   └── Footer.tsx      # Site footer
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/               # Utilities and configurations
│   └── firebase.ts    # Firebase configuration
├── pages/             # Page components
│   ├── Landing.tsx    # Landing page
│   └── Dashboard.tsx  # User dashboard
├── types/            # TypeScript type definitions
│   └── index.ts      # Shared types
└── main.tsx          # App entry point
```

## Authentication Flow

1. User enters phone number on landing page
2. Phone verification modal opens
3. Firebase sends SMS with verification code
4. User enters verification code
5. On successful verification, user is redirected to dashboard
6. Dashboard loads user profile and call history from Firestore

## Integration with Wanda Backend

The website integrates with the Wanda voice assistant backend through shared Firestore collections:

- `callers` - User profiles and preferences
- `calls` - Call history and transcripts

When users call the Wanda phone number `(845) 388-3443`, their data is automatically synced to their web dashboard.

## Environment Variables

Create a `.env` file with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Deployment

Build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Firebase Auth** - Phone number authentication
- **Firestore** - Database
- **React Router** - Client-side routing
