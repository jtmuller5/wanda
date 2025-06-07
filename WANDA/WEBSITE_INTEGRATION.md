# Wanda Website Integration

This document explains how the Wanda website integrates with the voice assistant backend to provide a seamless user experience.

## Overview

The Wanda website (`wanda_website/`) provides a web interface that complements the voice-first experience. Users can:

1. **Authenticate** using their phone number (same as used for voice calls)
2. **View their profile** and preferences set during voice interactions
3. **Browse call history** with summaries and search results
4. **Track directions** sent via SMS during calls

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Wanda Website │    │    Firebase      │    │ Wanda Voice API │
│                 │    │   (Firestore)    │    │                 │
│  - Authentication│◄──►│  - callers       │◄──►│ - Voice calls   │
│  - Dashboard     │    │  - calls         │    │ - SMS sending   │
│  - Call history  │    │  - preferences   │    │ - Map search    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Data Flow

### 1. User Authentication
- User enters phone number on website
- Firebase Auth sends SMS verification code
- Upon verification, user gains access to dashboard
- Phone number serves as primary identifier (same as voice calls)

### 2. Profile Synchronization
- Voice assistant updates caller profile in Firestore (`callers` collection)
- Website reads profile data to display user preferences
- Changes made via voice calls automatically appear on website

### 3. Call History Integration
- Each voice call creates a record in Firestore (`calls` collection)
- Website displays call history with:
  - Call timestamps and duration
  - Search queries and results
  - Directions sent via SMS
  - Call summaries and transcripts

## Database Schema

### Callers Collection (`callers/{phoneNumber}`)
```typescript
interface WandaCaller {
  phoneNumber: string          // Document ID (without +1)
  name?: string               // Set via voice or website
  age?: number                // Set via voice or website  
  city?: string               // Set via voice or website
  foodPreferences?: string[]   // Updated from call analysis
  activitiesPreferences?: string[]
  shoppingPreferences?: string[]
  entertainmentPreferences?: string[]
  createdAt: string           // ISO timestamp
  lastCalledAt?: string       // Last voice call timestamp
}
```

### Calls Collection (`calls/{callId}`)
```typescript
interface CallRecord {
  id: string                  // Vapi call ID
  callerPhoneNumber: string   // +1 format
  createdAt: string          // Call start time
  status?: string            // 'ended', 'in-progress', etc.
  endedReason?: string       // How call ended
  summary?: string           // AI-generated summary
  transcript?: string        // Full conversation
  directionsSent?: boolean   // Whether SMS was sent
  directionsPlaceName?: string
  directionsPlaceAddress?: string
  lastSearchResults?: SearchResult[]
  lastSearchAt?: string
}
```

## Authentication Implementation

### Phone Number Verification Flow

1. **User Input**: User enters phone number in format `(555) 123-4567`
2. **Formatting**: Website converts to international format `+15551234567`
3. **Firebase Auth**: Uses `signInWithPhoneNumber()` with reCAPTCHA verification
4. **SMS Delivery**: Firebase sends 6-digit verification code
5. **Code Verification**: User enters code, Firebase validates
6. **Session Creation**: Firebase creates authenticated session
7. **Database Access**: User can now access their Firestore data

### Security Considerations

- **reCAPTCHA**: Prevents automated abuse of SMS sending
- **Rate Limiting**: Firebase automatically rate limits SMS per phone number
- **Phone Verification**: Only verified phone numbers can access data
- **Firestore Rules**: Database rules ensure users only access their own data

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own caller profile
    match /callers/{phoneNumber} {
      allow read, write: if request.auth != null 
        && request.auth.token.phone_number == '+1' + phoneNumber;
    }
    
    // Users can only access their own call records
    match /calls/{callId} {
      allow read: if request.auth != null 
        && resource.data.callerPhoneNumber == request.auth.token.phone_number;
    }
  }
}
```

## Features

### Dashboard Components

1. **Profile Card**
   - Displays user's name, age, city
   - Shows preference tags by category
   - Syncs with voice assistant updates

2. **Call History**
   - Chronological list of voice calls
   - Status indicators (completed, directions sent)
   - Search results and destinations
   - Call summaries when available

3. **Quick Actions**
   - Prominent call button to voice assistant
   - Direct access to phone number `(843) 648-9138`

### Responsive Design

- **Mobile-first**: Optimized for phone usage
- **Tablet support**: Enhanced layout for larger screens  
- **Desktop**: Full-featured dashboard experience
- **Accessibility**: WCAG compliant with screen reader support

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Auth and Firestore enabled
- Environment variables configured

### Installation
```bash
cd wanda_website
npm install
cp .env.example .env
# Configure Firebase credentials in .env
npm run dev
```

### Firebase Configuration
1. Create Firebase project
2. Enable Authentication > Phone sign-in
3. Enable Firestore database
4. Add domain to authorized domains
5. Copy config to `.env` file

## Deployment

### Build Process
```bash
npm run build
```

### Hosting Options
- **Firebase Hosting**: Seamless integration with backend
- **Vercel**: Easy deployment with Git integration  
- **Netlify**: Static site hosting with form handling
- **AWS S3**: Simple storage with CloudFront CDN

### Environment Variables
Production deployment requires:
- Firebase configuration
- Domain authorization in Firebase console
- HTTPS enforcement for phone authentication

## Future Enhancements

1. **Real-time Updates**: WebSocket connection for live call status
2. **Preference Management**: Direct editing of preferences via website
3. **Call Scheduling**: Book future calls with reminders
4. **Analytics Dashboard**: Usage patterns and favorite places
5. **Social Features**: Share discoveries with friends
6. **Offline Support**: Progressive Web App capabilities

## Testing

### Unit Tests
- Component rendering
- Authentication flows
- Data formatting utilities

### Integration Tests  
- Firebase Auth integration
- Firestore data operations
- Phone number validation

### E2E Tests
- Complete authentication flow
- Dashboard data loading
- Cross-device session persistence

## Monitoring

### Analytics
- Google Analytics 4 integration
- Custom events for authentication
- Conversion tracking for voice calls

### Error Tracking
- Sentry for runtime error monitoring
- Firebase Performance monitoring
- Custom logging for authentication issues

## Support

For technical issues:
1. Check Firebase console for authentication errors
2. Verify Firestore security rules
3. Test phone number format handling
4. Review browser console for client-side errors

The website serves as a companion to the voice experience, making Wanda accessible across all user touchpoints while maintaining the core voice-first philosophy.
