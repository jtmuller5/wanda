# Wanda Technical Architecture

## System Overview

Wanda is built on a modern, scalable architecture that combines several best-in-class technologies to deliver a seamless voice-first experience for local discovery.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Phone Call    │────│   Vapi API      │────│   Wanda Server  │
│   (User)        │    │   (Voice AI)    │    │   (Express.js)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │   Google Maps   │─────────────┤
                       │      API        │             │
                       └─────────────────┘             │
                                                        │
                       ┌─────────────────┐             │
                       │   Twilio SMS    │─────────────┤
                       │      API        │             │
                       └─────────────────┘             │
                                                        │
                       ┌─────────────────┐             │
                       │   Firebase      │─────────────┘
                       │   (Database)    │
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Web Dashboard │
                       │   (React/Vite)  │
                       └─────────────────┘
```

## Core Components

### 1. Voice Interface Layer (Vapi)

**Purpose**: Handles all voice interactions and AI processing

**Components**:
- **Speech-to-Text**: Deepgram Nova-3 for accurate transcription
- **Text-to-Speech**: ElevenLabs for natural voice synthesis  
- **AI Models**: GPT-4o primary, Gemini 2.0 Flash backup
- **Squad Management**: Multi-agent orchestration

**Configuration**:
```typescript
transcriber: {
  language: "en",
  smartFormat: true,
  provider: "deepgram",
  endpointing: 120,
  model: "nova-3-general",
}

voice: {
  provider: "11labs",
  voiceId: "56AoDkrOh6qfVPDXZ7Pt",
  useSpeakerBoost: true,
  style: 0,
  optimizeStreamingLatency: 4,
  speed: 0.96,
  model: "eleven_turbo_v2_5",
  stability: 0.5,
}
```

### 2. Application Server (Node.js/Express)

**Purpose**: Business logic, API integration, and data management

**Key Endpoints**:
- `/wanda` - Main Vapi webhook for call handling
- `/events` - Server message handling (tool calls, status updates)
- Health checks and monitoring

**Architecture Pattern**: Event-driven with separate handlers
```typescript
// Event routing
switch (message.type) {
  case "tool-calls": handleFunctionCall()
  case "status-update": handleStatusUpdate()
  case "end-of-call-report": handleEndOfCallReport()
  case "hang": handleHang()
}
```

### 3. Multi-Agent System

#### **Agent Squad Structure**
```typescript
interface Squad {
  members: [
    IntroAssistant,    // Entry point and routing
    SearchAssistant,   // Location discovery
    ProfileAssistant   // User management
  ]
}
```

#### **Agent Transfer Logic**
- **Seamless Handoffs**: `swap-system-message-in-history` mode
- **Context Preservation**: Maintains conversation flow
- **Intent Detection**: Natural language routing

#### **Agent Capabilities**
| Agent | Tools | Purpose |
|-------|-------|---------|
| Intro | `transferCall` | Welcome & routing |
| Search | `wandaSearchMaps`, `wandaSendDirections`, `wandaGetPlaceDetails` | Discovery & navigation |
| Profile | `wandaUpdateProfile`, `wandaUpdatePreferences`, `wandaGetProfile` | User management |

### 4. Data Layer (Firebase)

**Database Structure**:
```
callers/{phoneNumber}
├── name: string
├── age: number
├── city: string
├── foodPreferences: string[]
├── activitiesPreferences: string[]
├── shoppingPreferences: string[]
├── entertainmentPreferences: string[]
├── createdAt: timestamp
└── lastCalledAt: timestamp

calls/{callId}
├── callerPhoneNumber: string
├── status: string
├── createdAt: timestamp
├── endedReason: string
├── summary: string
├── transcript: string
├── directionsSent: boolean
├── lastSearchResults: SearchResult[]
└── recordingUrl: string
```

**Security Rules**:
- Phone number-based authentication
- User can only access own data
- Server-side validation for all writes

### 5. External API Integrations

#### **Google Maps API Integration**
```typescript
// Text Search (New API)
POST https://places.googleapis.com/v1/places:searchText
Headers: {
  'X-Goog-Api-Key': API_KEY,
  'X-Goog-FieldMask': 'places.displayName,places.formattedAddress'
}

// Place Details
GET https://maps.googleapis.com/maps/api/place/details/json
Params: {
  place_id: string,
  fields: 'name,formatted_address,international_phone_number'
}
```

**Usage Patterns**:
- Profile-enhanced searches
- Location bias using user city
- Preference filtering
- Result caching for directions

#### **Twilio SMS Integration**
```typescript
// SMS Delivery
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json
Body: {
  To: userPhoneNumber,
  From: twilioPhoneNumber,
  Body: directionsMessage
}
```

**Message Templates**:
- Directions with Google Maps links
- Place information summaries
- Branded "Sent by Wanda" footer

### 6. Web Dashboard (React/TypeScript)

**Technology Stack**:
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS 4.x
- **Routing**: React Router DOM
- **Authentication**: Firebase Auth (Phone)

**Component Architecture**:
```
src/
├── components/
│   ├── Navigation.tsx
│   ├── ProfileEditor.tsx
│   └── PhoneVerificationModal.tsx
├── pages/
│   ├── Landing.tsx
│   └── Dashboard.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   └── firebase.ts
└── types/
    └── index.ts
```

**Key Features**:
- Profile completeness tracking
- Visual preference management
- Call history with rich details
- Real-time data synchronization

## Data Flow Architecture

### 1. Incoming Call Flow
```
Phone Call → Vapi → Load Caller Profile → Create Squad → Start Conversation
```

### 2. Search Request Flow
```
User Speech → Intent Detection → Transfer to Search Agent → 
Google Maps API → Enhanced Results → Voice Response → 
Optional SMS Directions
```

### 3. Profile Update Flow
```
User Request → Transfer to Profile Agent → Firebase Update → 
Confirmation Response → Future Search Enhancement
```

### 4. Cross-Platform Sync
```
Voice Update → Firebase → Web Dashboard Refresh
Web Update → Firebase → Next Voice Call Enhancement
```

## Scalability Considerations

### **Serverless Architecture**
- **Auto-scaling**: Handles traffic spikes automatically
- **Cost Efficiency**: Pay-per-use pricing model
- **Global Distribution**: Multi-region deployment ready

### **Database Optimization**
- **Indexed Queries**: Optimized for phone number lookups
- **Batch Operations**: Efficient bulk updates
- **Connection Pooling**: Managed connection limits

### **API Rate Limiting**
- **Google Maps**: Quota management and caching
- **Twilio**: Message rate limiting
- **Firebase**: Read/write optimization

### **Monitoring & Observability**
```typescript
// Key Metrics Tracked
- Call completion rates
- API response times
- Error rates by component
- User satisfaction scores
- Profile completion rates
```

## Security Architecture

### **Authentication & Authorization**
```typescript
// Firebase Auth Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /callers/{phoneNumber} {
      allow read, write: if request.auth != null 
        && request.auth.token.phone_number == '+1' + phoneNumber;
    }
  }
}
```

### **Data Protection**
- **Encryption**: All data encrypted at rest and in transit
- **PII Handling**: Minimal personal data collection
- **Audit Logging**: Complete interaction tracking
- **GDPR Compliance**: Data deletion capabilities

### **API Security**
- **Environment Variables**: All secrets in secure storage
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Server-side data sanitization
- **CORS Configuration**: Restricted origin access

## Performance Optimization

### **Voice Experience**
- **Latency Targets**: <500ms response time
- **Streaming**: Real-time audio processing
- **Caching**: Frequent data cached locally
- **Fallback**: Alternative AI models for redundancy

### **Web Interface**
- **Code Splitting**: Lazy-loaded components
- **Bundle Optimization**: Tree-shaking and minification
- **CDN**: Static asset distribution
- **Progressive Loading**: Skeleton screens during data fetch

### **Database Performance**
- **Query Optimization**: Minimal data transfer
- **Caching Strategy**: Redis for session data
- **Connection Management**: Efficient pool usage
- **Batch Processing**: Bulk operations for analytics

## Deployment Architecture

### **Production Environment**
```yaml
# Infrastructure
- Compute: Cloud Functions (Node.js 18)
- Database: Firebase Firestore
- CDN: Firebase Hosting
- Monitoring: Firebase Analytics + Custom metrics
- Secrets: Google Secret Manager
```

### **Development Workflow**
```yaml
# CI/CD Pipeline
- Code: TypeScript with strict mode
- Testing: Jest + React Testing Library
- Linting: ESLint + Prettier
- Build: Vite production build
- Deploy: Firebase CLI automated deployment
```

### **Environment Management**
```typescript
// Configuration
interface Config {
  development: {
    vapi: { baseUrl: 'https://api.vapi.ai' },
    firebase: { project: 'wanda-dev' },
    google: { mapsApiKey: process.env.GOOGLE_MAPS_API_KEY_DEV }
  },
  production: {
    vapi: { baseUrl: 'https://api.vapi.ai' },
    firebase: { project: 'wanda-74cc9' },
    google: { mapsApiKey: process.env.GOOGLE_MAPS_API_KEY }
  }
}
```

## Error Handling & Resilience

### **Graceful Degradation**
- **API Failures**: Fallback to cached data
- **Network Issues**: Retry with exponential backoff
- **Service Outages**: Alternative service routing
- **Voice Processing**: Text fallback options

### **Error Recovery**
```typescript
// Retry Logic
const retryWithBackoff = async (fn: Function, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(Math.pow(2, i) * 1000);
    }
  }
};
```

### **User Experience Continuity**
- **Session Recovery**: Maintain state across interruptions
- **Context Preservation**: Remember conversation progress
- **Alternative Flows**: Multiple paths to completion
- **Clear Messaging**: Helpful error explanations

## Future Architecture Considerations

### **Scalability Enhancements**
- **Microservices**: Split monolithic functions into focused services
- **Event Streaming**: Apache Kafka for real-time data processing
- **Container Orchestration**: Kubernetes for complex deployments
- **Global CDN**: Edge computing for reduced latency

### **Advanced Features**
- **Machine Learning Pipeline**: Custom models for recommendation improvement
- **Real-time Analytics**: Stream processing for instant insights
- **Multi-language Support**: I18n architecture for global expansion
- **IoT Integration**: Smart device connectivity

### **Platform Extensions**
- **Mobile SDK**: Native app integration capabilities
- **Partner APIs**: Third-party service integration
- **Webhook System**: Real-time event notifications
- **GraphQL Gateway**: Unified API layer

## Monitoring & Analytics

### **Application Monitoring**
```typescript
// Custom Metrics Dashboard
interface Metrics {
  voiceMetrics: {
    callDuration: number;
    transcriptionAccuracy: number;
    responseLatency: number;
    userSatisfaction: number;
  };
  searchMetrics: {
    querySuccess: number;
    resultRelevance: number;
    directionsRequested: number;
    conversionRate: number;
  };
  systemMetrics: {
    apiResponseTimes: number[];
    errorRates: Record<string, number>;
    uptime: number;
    resourceUtilization: number;
  };
}
```

### **Business Intelligence**
- **User Journey Analytics**: Conversation flow analysis
- **Feature Usage Tracking**: Most popular functionalities
- **Performance Benchmarking**: Success rate improvements
- **Predictive Analytics**: Usage pattern forecasting

### **Real-time Alerting**
```typescript
// Alert Configuration
const alerts = {
  criticalErrors: { threshold: 5, window: '5m' },
  apiLatency: { threshold: 1000, window: '1m' },
  callFailures: { threshold: 10, window: '15m' },
  userExperience: { threshold: 3.0, window: '30m' }
};
```

## Compliance & Governance

### **Data Governance**
- **Data Classification**: Sensitive vs. non-sensitive data handling
- **Retention Policies**: Automated data lifecycle management
- **Access Controls**: Role-based permissions
- **Audit Trails**: Complete interaction logging

### **Regulatory Compliance**
- **GDPR**: European data protection regulations
- **CCPA**: California consumer privacy act
- **HIPAA**: Healthcare data protection (if applicable)
- **SOC 2**: Security and availability standards

### **Quality Assurance**
```typescript
// Testing Strategy
interface TestStrategy {
  unitTests: 'Jest + React Testing Library';
  integrationTests: 'Supertest for API endpoints';
  e2eTests: 'Playwright for user flows';
  voiceTests: 'Vapi testing framework';
  performanceTests: 'Artillery for load testing';
  securityTests: 'OWASP ZAP for vulnerability scanning';
}
```

## Development Best Practices

### **Code Quality**
- **TypeScript Strict Mode**: Enhanced type safety
- **ESLint Configuration**: Comprehensive code analysis
- **Prettier Integration**: Consistent code formatting
- **Husky Git Hooks**: Pre-commit quality checks

### **Documentation Standards**
- **API Documentation**: OpenAPI/Swagger specifications
- **Code Comments**: JSDoc for function documentation
- **Architecture Decisions**: ADR (Architecture Decision Records)
- **Deployment Guides**: Step-by-step setup instructions

### **Version Control Strategy**
```bash
# Branch Strategy
main/              # Production-ready code
├── develop/       # Integration branch
├── feature/*      # Feature development
├── hotfix/*       # Production fixes
└── release/*      # Release preparation
```

This comprehensive technical architecture provides a solid foundation for Wanda's current implementation while allowing for future growth and enhancement. The modular design ensures maintainability, scalability, and the ability to adapt to changing requirements as the platform evolves.
