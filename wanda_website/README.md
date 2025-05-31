# Wanda Website

A modern, responsive landing page for Wanda - the voice-first local discovery companion.

## Features

- **Modern Design**: Clean, gradient-based design with smooth animations
- **Responsive**: Works perfectly on all devices
- **Voice-First Focus**: Emphasizes the phone-based interaction model
- **Call-to-Action**: Multiple prominent CTAs to call Wanda
- **Feature Showcase**: Highlights key capabilities and benefits
- **How It Works**: Step-by-step explanation of the user experience

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with the new Vite plugin
- **Vite** - Fast build tool and dev server

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── Hero.tsx          # Main hero section with phone input
│   ├── Features.tsx      # Feature cards showcasing capabilities
│   ├── HowItWorks.tsx    # Step-by-step process explanation
│   └── Footer.tsx        # Footer with contact info and links
├── App.tsx               # Main app component
├── main.tsx             # React entry point
└── index.css            # Global styles and Tailwind imports
```

## Key Features

### Hero Section
- Eye-catching gradient design
- Phone number input for future login functionality
- Prominent call-to-action with Wanda's phone number
- Key statistics and benefits

### Features Section
- Six key feature cards with hover animations
- Icons and descriptions for each capability
- Responsive grid layout

### How It Works
- Four-step process explanation
- Example conversation to demonstrate functionality
- Visual icons and animations

### Footer
- Contact information and quick call button
- Feature and use case listings
- Technology stack attribution

## Phone Number Integration

The phone number input in the hero section is formatted automatically and ready for future integration with a login/authentication system. Currently, it logs the entered number to the console when "Get Started" is clicked.

## Customization

The design uses Tailwind CSS with custom gradients and animations. Key design elements:

- **Colors**: Blue to purple gradients for primary elements
- **Typography**: Inter font family for clean readability
- **Animations**: Subtle hover effects and floating animations
- **Responsive**: Mobile-first design with responsive breakpoints

## Future Enhancements

- Phone number authentication integration
- User dashboard for call history and profile management
- Real-time call status indicators
- Analytics and usage tracking