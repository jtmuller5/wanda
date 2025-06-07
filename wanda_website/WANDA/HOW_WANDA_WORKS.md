# Wanda: AI-Powered Voice Assistant for Local Discovery

## Overview

Wanda is an innovative voice-first AI assistant designed to help users discover local places to eat, shop, and explore. Built for the 2025 Vapi Build Challenge, Wanda combines the power of conversational AI with Google Maps integration to provide personalized, location-based recommendations through simple phone calls.

## How Wanda Works

### 1. Voice-First Experience
- **Phone Number**: Users call (843) 648-9138 to interact with Wanda
- **Natural Conversation**: Speak naturally about what you're looking for
- **Hands-Free**: Perfect for use while driving or when you can't use your phone
- **Real-Time Responses**: Immediate AI-powered assistance

### 2. Multi-Agent Architecture

Wanda uses a sophisticated squad-based AI system with three specialized agents:

#### **Intro Agent** (`Wanda_Intro`)
- **Purpose**: Initial greeting and routing
- **Capabilities**: 
  - Welcomes callers
  - Determines user intent (search vs. profile update)
  - Transfers to appropriate specialist agent
- **Transfer Logic**: Routes based on user request type

#### **Search Agent** (`Wanda_Search`)
- **Purpose**: Location discovery and navigation
- **Capabilities**:
  - Google Maps integration for place search
  - Personalized recommendations based on user preferences
  - SMS directions delivery
  - Detailed place information lookup
- **Tools**:
  - `wandaSearchMaps`: Search Google Maps with user preferences
  - `wandaSendDirections`: Text Google Maps links to users
  - `wandaGetPlaceDetails`: Fetch detailed place information

#### **Profile Agent** (`Wanda_Profile`)
- **Purpose**: User profile and preference management
- **Capabilities**:
  - Profile creation and updates
  - Preference management (food, activities, shopping, entertainment)
  - Profile information retrieval
- **Tools**:
  - `wandaUpdateProfile`: Update basic info (name, age, city)
  - `wandaUpdatePreferences`: Manage preference arrays
  - `wandaGetProfile`: Retrieve current profile information

### 3. Intelligent Personalization

#### **Profile System**
- **Basic Information**: Name, age, city
- **Preference Categories**:
  - **Food**: Cuisines, dietary restrictions, dining preferences
  - **Activities**: Hobbies, interests, activity types
  - **Shopping**: Store types, product categories
  - **Entertainment**: Event types, venue preferences

#### **Smart Recommendations**
- Uses caller profile to enhance search results
- Filters results based on saved preferences
- Considers location context (caller's city vs. search area)
- Learns from call history and interaction patterns

### 4. Seamless Integration

#### **Google Maps API**
- **Text Search**: Advanced place discovery with natural language queries
- **Place Details**: Comprehensive information including hours, ratings, contact info
- **Location Services**: Address resolution and geographic search
- **Directions**: Direct integration with Google Maps for navigation

#### **SMS Integration (Twilio)**
- **Instant Delivery**: Text directions immediately after search
- **Rich Content**: Place names, addresses, and Google Maps links
- **Call Context**: Links searches to direction requests automatically

#### **Firebase Backend**
- **Real-Time Data**: Instant profile updates and call logging
- **Persistent Storage**: Maintains user preferences across calls
- **Call History**: Complete interaction tracking
- **Analytics**: Structured data extraction from conversations

### 5. Advanced Features

#### **Context Awareness**
- **Search Enhancement**: Automatically incorporates user preferences into searches
- **Location Intelligence**: Uses profile city when location not specified
- **Conversation Memory**: Maintains context within call sessions
- **Result Matching**: Links direction requests to recent search results

#### **Call Analysis & Learning**
- **Structured Data Extraction**: Automatically identifies mentioned preferences
- **Profile Auto-Update**: Learns preferences from natural conversation
- **Interaction Tracking**: Monitors usage patterns and effectiveness
- **Continuous Improvement**: Refines recommendations based on user behavior

#### **Error Handling & Fallbacks**
- **Graceful Degradation**: Handles API failures smoothly
- **Alternative Responses**: Provides options when primary results fail
- **User Guidance**: Clear instructions for better interaction
- **Recovery Mechanisms**: Automatic retry and alternative approaches

### 6. Technical Architecture

#### **Voice Processing**
- **Transcription**: Deepgram Nova-3 for accurate speech-to-text
- **Voice Synthesis**: ElevenLabs for natural, engaging responses
- **Real-Time Processing**: Low-latency conversation handling
- **Multi-Language Support**: Ready for international expansion

#### **AI Models**
- **Primary**: GPT-4o for complex reasoning and natural conversation
- **Backup**: Gemini 2.0 Flash for alternative processing
- **Temperature Tuning**: Optimized for consistent, helpful responses
- **Context Management**: Maintains conversation flow across agent transfers

#### **Data Flow**
1. **Incoming Call** → Phone number verification & caller lookup
2. **Voice Processing** → Speech-to-text conversion
3. **Intent Detection** → Route to appropriate agent
4. **Tool Execution** → API calls for search/profile operations
5. **Response Generation** → AI-crafted natural language responses
6. **Voice Synthesis** → Text-to-speech delivery
7. **Action Completion** → SMS delivery, database updates

### 7. User Experience Flow

#### **First-Time Caller**
1. Call Wanda's number
2. Introduction and capability explanation
3. Profile setup encouragement
4. Basic information collection
5. First search or profile update

#### **Returning Caller**
1. Personalized greeting with name
2. Quick access to search or profile functions
3. Enhanced recommendations based on history
4. Streamlined interaction flow

#### **Search Experience**
1. Express what you're looking for
2. Specify location (or use profile default)
3. Receive personalized recommendations
4. Request directions via SMS
5. Get detailed place information if needed

#### **Profile Management**
1. Request profile updates
2. Add/remove/replace preferences
3. Update basic information
4. Confirm changes
5. Immediate effect on future searches

### 8. Integration Points

#### **Web Dashboard**
- **Profile Management**: Complete profile editing interface
- **Call History**: Detailed interaction logs
- **Preference Management**: Visual preference editing
- **Progress Tracking**: Profile completeness indicators

#### **Firebase Authentication**
- **Phone Verification**: Secure access to personal data
- **Session Management**: Maintain authentication state
- **Privacy Protection**: Secure data access controls

#### **Real-Time Synchronization**
- **Instant Updates**: Profile changes reflect immediately
- **Cross-Platform**: Web and voice stay synchronized
- **Consistent Experience**: Same data across all touchpoints

### 9. Security & Privacy

#### **Data Protection**
- **Encrypted Storage**: All personal data encrypted at rest
- **Secure Transmission**: HTTPS/TLS for all communications
- **Access Controls**: Phone-based authentication required
- **Data Minimization**: Only collect necessary information

#### **Privacy Features**
- **User Control**: Full control over profile information
- **Data Deletion**: Ability to remove stored data
- **Transparent Usage**: Clear explanation of data use
- **Consent Management**: Explicit permission for data collection

### 10. Scalability & Performance

#### **Infrastructure Design**
- **Serverless Architecture**: Auto-scaling cloud functions
- **CDN Integration**: Fast global content delivery
- **Database Optimization**: Efficient query patterns
- **Caching Strategy**: Reduced API calls and improved response times

#### **Monitoring & Analytics**
- **Call Quality Metrics**: Track conversation success rates
- **Performance Monitoring**: API response times and error rates
- **User Satisfaction**: Feedback collection and analysis
- **Usage Analytics**: Understanding user behavior patterns

## Future Enhancements

### **Advanced Features**
- **Group Recommendations**: Plans for multiple people
- **Event Planning**: Coordinated activity suggestions
- **Booking Integration**: Direct reservation capabilities
- **Social Features**: Share discoveries with friends

### **Platform Expansion**
- **Mobile App**: Complementary smartphone application
- **Smart Speakers**: Alexa and Google Home integration
- **Web Interface**: Full browser-based experience
- **API Access**: Third-party integration capabilities

### **AI Improvements**
- **Multi-Modal Input**: Photo and text message support
- **Predictive Suggestions**: Proactive recommendations
- **Natural Language**: Even more conversational interactions
- **Emotional Intelligence**: Mood-based recommendations

Wanda represents the future of local discovery - where finding great places is as simple as having a conversation. By combining cutting-edge AI with practical utility, Wanda makes exploring your world more accessible, personalized, and enjoyable than ever before.
