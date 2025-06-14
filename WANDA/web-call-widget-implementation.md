# Adding Web Call Widget to Wanda Website

This document explains how to add a web call widget to the Wanda landing page that allows users to start voice calls directly from their browser using the Vapi Web SDK.

## Overview

The web call widget provides users with an alternative to calling the phone number by allowing them to:
1. Enter their phone number for personalization
2. Start a voice conversation directly in the browser
3. See real-time transcripts of the conversation
4. Experience the same Wanda assistant capabilities as phone calls

## Implementation Steps

### 1. Install Dependencies

Add the Vapi Web SDK to your React project:

```bash
npm install @vapi-ai/web
```

Update `package.json`:
```json
{
  "dependencies": {
    "@vapi-ai/web": "^1.0.0",
    // ... other dependencies
  }
}
```

### 2. Environment Configuration

Add Vapi configuration to your `.env` file:

```env
# Vapi Configuration
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
VITE_API_URL=http://localhost:3000
```

### 3. Create Web Call Widget Component

Create `src/components/WebCallWidget.tsx`:

```typescript
import { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';

interface WebCallWidgetProps {
  apiKey: string;
  serverUrl?: string;
}

export default function WebCallWidget({ apiKey, serverUrl }: WebCallWidgetProps) {
  // State management for call status, transcript, errors, etc.
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState<Array<{role: string, text: string}>>([]);
  const vapiRef = useRef<Vapi | null>(null);

  // Initialize Vapi instance and set up event listeners
  // Handle phone number formatting
  // Implement startCall and endCall functions
  // Render UI with phone input, call controls, and transcript display
}
```

### 4. Key Features Implementation

#### Phone Number Formatting
```typescript
const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
};
```

#### Vapi Event Handling
```typescript
vapi.on('call-start', () => setIsConnected(true));
vapi.on('call-end', () => setIsConnected(false));
vapi.on('speech-start', () => setIsSpeaking(true));
vapi.on('speech-end', () => setIsSpeaking(false));
vapi.on('message', (message) => {
  if (message.type === 'transcript') {
    setTranscript(prev => [...prev, {
      role: message.role,
      text: message.transcript
    }]);
  }
});
```

#### Assistant Configuration
The widget creates an inline assistant configuration that mirrors the server-side Wanda configuration:

```typescript
const assistantConfig = {
  transcriber: {
    language: 'en',
    provider: 'deepgram',
    model: 'nova-3-general'
  },
  voice: {
    provider: '11labs',
    voiceId: '56AoDkrOh6qfVPDXZ7Pt'
  },
  model: {
    provider: 'openai',
    model: 'gpt-4o-2024-11-20',
    messages: [{ role: 'system', content: 'Wanda system prompt...' }]
  }
};
```

### 5. Integration with Hero Component

Update `src/components/Hero.tsx` to include the widget:

```typescript
import WebCallWidget from './WebCallWidget';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Existing hero content */}
      
      {/* Web Call Widget */}
      <div className="relative z-10 w-full max-w-4xl mx-auto mt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 text-slate-600">
            <div className="h-px bg-slate-300 flex-1"></div>
            <span className="px-4 text-sm font-medium">OR TRY IT ON THE WEB</span>
            <div className="h-px bg-slate-300 flex-1"></div>
          </div>
        </div>
        
        <WebCallWidget 
          apiKey={import.meta.env.VITE_VAPI_PUBLIC_KEY || ''}
          serverUrl={import.meta.env.VITE_API_URL || 'http://localhost:3000'}
        />
      </div>
    </div>
  );
}
```

### 6. Server-Side Endpoint (Optional Enhancement)

Add a server endpoint for web call configuration in `src/index.ts`:

```typescript
// Web call endpoint for browser-based calls
app.post("/wanda-web", async (req, res) => {
  const { phoneNumber } = req.body;
  
  // Load caller preferences from Firebase
  const caller = await loadCaller({
    phoneNumber: Number(phoneNumber.replace("+1", "")),
  });

  // Create assistant configuration with user preferences
  const assistantConfig = {
    squad: {
      members: [/* Wanda assistant squad members */],
      membersOverrides: {
        transcriber: { /* transcriber config */ },
        voice: { /* voice config */ },
        serverMessages: ["tool-calls", "status-update", "end-of-call-report"],
        server: { url: `https://${req.headers.host}/events` }
      }
    }
  };

  res.json(assistantConfig);
});
```

## UI/UX Design Principles

### Visual Design
- **Glassmorphism**: Semi-transparent background with backdrop blur
- **Gradient Accents**: Blue-to-purple gradients matching brand colors
- **Responsive Layout**: Works on desktop and mobile devices
- **Accessibility**: Proper focus states and screen reader support

### Interactive States
1. **Initial State**: Phone number input with call button
2. **Loading State**: Connecting animation and disabled controls
3. **Active Call**: Live transcript, speaking indicators, end call button
4. **Error States**: Clear error messages with retry options

### User Experience
- **Progressive Enhancement**: Phone call as primary CTA, web widget as alternative
- **Clear Instructions**: Microphone permission prompts and usage guidance
- **Real-time Feedback**: Speaking indicators and live transcription
- **Graceful Fallback**: Error handling and configuration validation

## Technical Architecture

### Client-Side Flow
1. User enters phone number
2. Widget initializes Vapi instance
3. Assistant configuration created/fetched
4. WebRTC connection established
5. Real-time audio processing and transcription
6. Event handling for call lifecycle

### Server Integration
- Optional server endpoint for personalized assistant configuration
- Firebase integration for user preferences
- Event handling for call analytics and user data updates

### Error Handling
- Network connectivity issues
- Microphone permission denied
- Invalid API configuration
- Call connection failures

## Configuration Requirements

### Required Environment Variables
```env
VITE_VAPI_PUBLIC_KEY=your_public_key_here  # Required
VITE_API_URL=http://localhost:3000         # Optional, defaults to localhost
```

### Browser Requirements
- Modern browsers with WebRTC support
- Microphone access permission
- Secure context (HTTPS) for production

## Security Considerations

### API Key Management
- Use public API keys only (never expose private keys)
- Environment variable configuration
- Production vs development key separation

### User Privacy
- Phone numbers used for personalization only
- No persistent storage of audio data
- Clear privacy messaging in UI

## Deployment Notes

### Development
```bash
npm run dev  # Start development server
```

### Production Build
```bash
npm run build  # Build for production
```

### Environment Setup
1. Configure Vapi public API key
2. Set up server endpoint URL
3. Verify HTTPS certificate for production
4. Test microphone permissions flow

## Future Enhancements

### Advanced Features
- Call recording and playback
- Multi-language support
- Voice activity detection
- Call quality metrics

### Integration Opportunities
- User authentication sync
- Preference learning from web calls
- Analytics and usage tracking
- A/B testing for different assistant configurations

## Troubleshooting

### Common Issues
1. **No API Key**: Widget shows configuration warning
2. **Microphone Blocked**: Browser permission prompt
3. **Network Issues**: Connection timeout handling
4. **Audio Quality**: WebRTC optimization settings

### Debug Tools
- Browser console for Vapi events
- Network tab for API calls
- WebRTC internals for connection issues
- React DevTools for component state

This implementation provides a seamless voice interaction experience directly in the browser while maintaining consistency with the phone-based Wanda experience.
