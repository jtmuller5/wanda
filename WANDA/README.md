# Wanda - Voice-First Local Discovery Platform

Wanda is a voice-first local discovery platform that helps users find restaurants, shops, activities, and entertainment options through natural conversation. Built for the 2025 Vapi Build Challenge, Wanda combines the power of AI voice technology with Google Maps integration to provide personalized recommendations.

## Project Overview

**Name Origin**: Wanda is a play on the word "Wander" - reflecting the platform's goal to help users explore and discover new places in their local area.

**Core Mission**: Enable hands-free local discovery that works while driving, walking, or when users can't interact with their phones.

## Key Features

### 🗣️ Voice-First Experience
- Natural conversation interface
- Works entirely through voice commands
- No typing or screen interaction required
- Available via phone calls and web browser

### 🧠 Smart Personalization
- Learns user preferences over time
- Remembers food preferences, activities, and entertainment choices
- Provides increasingly relevant recommendations
- Profile management through voice commands

### 📍 Google Maps Integration
- Real-time place discovery
- Detailed business information (hours, ratings, phone numbers)
- SMS directions sent directly to user's phone
- Location-aware search with radius options

### 📱 Multi-Platform Access
- **Phone**: Call (843) 648-9138 from any device
- **Web**: Browser-based voice widget on website
- **Future**: Mobile apps and smart speaker integration

### 🎯 Specialized Assistants
- **Intro Assistant**: Initial routing and general help
- **Search Assistant**: Location discovery and recommendations
- **Profile Assistant**: Preference management and user data
- **Review Assistant**: Place feedback and rating system

## Technical Architecture

### Voice AI Stack
- **Vapi**: Voice AI platform for call handling and speech processing
- **OpenAI GPT-4**: Language model for natural conversation
- **11Labs**: High-quality voice synthesis
- **Deepgram**: Speech-to-text transcription

### Backend Services
- **Express.js**: Node.js server for API endpoints
- **Firebase**: User data storage and authentication
- **Google Maps API**: Place search and business information
- **Twilio**: SMS messaging for directions

### Frontend Platform
- **React + TypeScript**: Modern web application
- **Tailwind CSS**: Responsive design system
- **Vite**: Fast development and build tooling
- **Firebase Auth**: Phone number authentication

## User Journey

### 1. Initial Contact
```
User: "I'm looking for a good Italian restaurant"
Wanda: "I'd be happy to help! What city or area should I search in?"
```

### 2. Personalized Search
```
Wanda: "I found 3 great Italian restaurants near downtown. 
        Based on your saved preferences for outdoor seating, 
        I especially recommend Tony's Bistro with their patio."
```

### 3. Actionable Results
```
User: "Send me directions to Tony's Bistro"
Wanda: "Perfect! I've sent the directions to your phone via text."
```

### 4. Preference Learning
```
Wanda: "I noticed you enjoyed the outdoor seating. 
        Should I prioritize restaurants with patios in future searches?"
```

## Project Structure

```
wanda/
├── src/                          # Express.js backend
│   ├── wanda/
│   │   ├── assistants/          # AI assistant configurations
│   │   ├── tools/               # Function calling tools
│   │   ├── responses/           # Tool response handlers
│   │   ├── transfers/           # Assistant routing logic
│   │   └── event-handlers/      # Vapi event processing
│   ├── services/                # External service integrations
│   └── types.ts                 # TypeScript definitions
├── wanda_website/               # React frontend
│   ├── src/
│   │   ├── components/          # UI components
│   │   ├── pages/               # Application pages
│   │   ├── contexts/            # React contexts
│   │   └── lib/                 # Utility libraries
│   └── public/                  # Static assets
└── WANDA/                       # Documentation
    └── *.md                     # Implementation guides
```

## Implementation Guides

### Available Documentation
- **[Web Call Widget Implementation](./web-call-widget-implementation.md)**: Complete guide for adding browser-based voice calls
- **Phone Integration**: Twilio/Vapi phone number setup
- **Google Maps Integration**: API configuration and usage
- **Firebase Setup**: Database and authentication configuration
- **Assistant Configuration**: Squad-based AI assistant architecture

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Authentication enabled
- Vapi account with API keys
- Google Maps API key
- Twilio account (for SMS)

### Environment Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start development server: `npm run dev`

### Key Environment Variables
```env
# Vapi Configuration
VAPI_API_KEY=your_private_key
VITE_VAPI_PUBLIC_KEY=your_public_key

# Google Services
GOOGLE_MAPS_API_KEY=your_maps_key

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_service_key

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

## Vapi Build Challenge

This project was created for the **2025 Vapi Build Challenge** with the following goals:

### Innovation Criteria
- **Novel Use Case**: Voice-first local discovery platform
- **Technical Excellence**: Multi-assistant architecture with tool calling
- **User Experience**: Seamless voice interaction without app downloads
- **Real-World Impact**: Solving actual user problems with hands-free discovery

### Technical Achievements
- Advanced squad-based assistant routing
- Real-time preference learning and personalization  
- Cross-platform voice experience (phone + web)
- Integration with multiple external APIs
- Scalable architecture for future enhancements

## Future Roadmap

### Short Term
- Enhanced place reviews and ratings system
- Voice commands for profile management
- Improved natural language understanding
- Performance optimizations

### Medium Term
- Mobile app development
- Smart speaker integration (Alexa, Google Home)
- Multi-language support
- Advanced recommendation algorithms

### Long Term
- Predictive recommendations based on time/location
- Social features and shared recommendations
- Business partnership integrations
- Global expansion beyond local discovery

## Contributing

Wanda is built with modularity and extensibility in mind. Key areas for contribution:

- **New Assistant Types**: Specialized assistants for different use cases
- **Tool Integrations**: Additional APIs and services
- **UI/UX Improvements**: Enhanced web interface and mobile experience
- **Performance**: Optimization and caching strategies
- **Documentation**: Implementation guides and tutorials

## Contact

For questions about the project or implementation details, please refer to the documentation in the WANDA folder or examine the codebase structure.

---

*Built with ❤️ for the 2025 Vapi Build Challenge*
