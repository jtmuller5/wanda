# Wanda - Voice-Powered Local Guide

Wanda is an innovative voice AI agent built for the Vapi Build Challenge 2025. She helps callers find places to eat, shop, and explore by searching Google Maps and sending directions via SMS.

## Features

### 🗣️ Voice Interaction
- Multi-assistant architecture with seamless transfers
- Natural conversation flow
- Voice-optimized for hands-free use while driving

### 🗺️ Location Services
- **Google Maps Integration**: Search for restaurants, shops, and attractions
- **Smart Directions**: Send Google Maps links via SMS
- **Context-Aware**: Remember recent searches for easy reference

### 📱 SMS Integration
- **Twilio Integration**: Send directions directly to caller's phone
- **Smart Links**: Uses Place IDs when available for accurate directions
- **Caller-Friendly**: Designed for people who can't interact with their phone

### 🔄 Assistant Transfer System
- **Intro Assistant**: Initial greeting and routing
- **Search Assistant**: Handles location searches and directions
- **Profile Assistant**: Manages user preferences (future enhancement)

## Architecture

### Core Components

- **Express.js Server**: Handles Vapi webhooks and tool functions
- **Firebase Integration**: Stores call records and search history
- **Google Maps API**: Places search functionality
- **Twilio SMS**: Direction delivery system

### Assistant Flow

1. **User calls Wanda** → Intro Assistant greets and routes
2. **Location request** → Transfers to Search Assistant
3. **Search & Results** → Uses Google Maps to find places
4. **Directions request** → Sends SMS with Google Maps link

## Getting Started

### Prerequisites

- Node.js 18+
- Google Maps API key
- Twilio account and phone number
- Firebase project
- Vapi account

### Installation

1. Clone this repository
```bash
git clone <repository-url>
cd wanda
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (copy `.env.example` to `.env`):
```bash
cp .env.example .env
```

4. Configure your environment variables:
```env
# Vapi Configuration
VAPI_API_KEY=your_vapi_api_key_here

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id_here
FIREBASE_CLIENT_EMAIL=your_firebase_client_email_here
FIREBASE_PRIVATE_KEY=your_firebase_private_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. For production, build and run:
```bash
npm run build
npm start
```

## Usage Examples

### Basic Conversation Flow

```
Caller: "Hi Wanda"
Wanda: "Hello, this is Wanda. How can I help you today?"

Caller: "I'm looking for a pizza place"
Wanda: "I'd be happy to help you find a pizza place! What city or area are you in?"

Caller: "I'm in downtown Seattle"
Wanda: "Great! Let me search for pizza places in downtown Seattle."

[Search results]
Wanda: "I found the following places:
1. Serious Pie at 316 Virginia St
2. Via Tribunali at 913 Pine St  
3. Pagliacci Pizza at 426 Broadway E

Would you like me to send you directions to any of these places?"

Caller: "Yes, send me directions to the first one"
Wanda: "Perfect! I've sent the directions to Serious Pie to your phone via text message."
```

## API Endpoints

### `/wanda` (POST)
Main Vapi webhook endpoint for incoming calls

### `/events` (POST) 
Handles Vapi server events:
- `tool-calls`: Processes function calls (search, directions)
- `status-update`: Updates call status
- `end-of-call-report`: Stores call completion data
- `hang`: Handles call termination

## Tool Functions

### `wandaSearchMaps`
Searches Google Maps for places
- **Parameters**: `query`, `location`, `radius` (optional)
- **Returns**: List of up to 3 places with names and addresses

### `wandaSendDirections`
Sends SMS with Google Maps directions
- **Parameters**: `placeName`, `placeAddress`, `placeId` (optional), `placeNumber` (optional)
- **Returns**: Confirmation message
- **Smart Features**: Can reference recent search results by number

## Technologies Used

- **TypeScript**: Type-safe development
- **Express.js**: Web server framework
- **Vapi**: Voice AI platform
- **Firebase**: Database and storage
- **Google Maps API**: Location services
- **Twilio**: SMS messaging
- **11Labs**: Text-to-speech voice
- **Deepgram**: Speech-to-text transcription

## Deployment

### Google Cloud Run

1. Set your project ID:
```bash
gcloud config set project $MY_PROJECT_ID
```

2. Deploy:
```bash
gcloud run deploy --source .
```

### Environment Variables
Make sure to set all required environment variables in your deployment environment.

## Contributing

This project was built for the Vapi Build Challenge 2025. Feel free to fork and enhance!

## License

MIT License