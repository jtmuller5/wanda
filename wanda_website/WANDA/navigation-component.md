# Wanda Website Navigation Component

## Overview
The Navigation component provides a consistent header across the Wanda website with authentication functionality and responsive design.

## Features

### Logo and Branding
- **Wanda Title**: Displays prominently on the left side with gradient text styling
- **Icon Placeholder**: A rounded icon placeholder (currently showing "W") positioned to the left of the title
- **Visual Design**: Uses a blue-to-purple gradient that matches the site's brand colors

### Authentication Integration
The navigation seamlessly integrates with the authentication system:

#### For Unauthenticated Users:
- **Login Button**: Displays a prominent "Login" button
- **Inline Phone Input**: When clicked, the login button transforms into:
  - Phone number input field with formatting
  - "Continue" button to proceed to verification
  - "Cancel" button to return to login button state
- **Phone Verification Modal**: Opens when user submits a valid phone number

#### For Authenticated Users:
- **Phone Number Display**: Shows the user's phone number (hidden on mobile)
- **Sign Out Button**: Allows users to sign out of their account

### Responsive Design
- **Mobile Optimization**: Phone number display is hidden on small screens
- **Flexible Layout**: Adapts to different screen sizes using Tailwind CSS
- **Transparent Mode**: Can be configured to overlay content with transparent background

## Technical Implementation

### Props Interface
```typescript
interface NavigationProps {
  transparent?: boolean  // Optional: enables transparent overlay mode
}
```

### Component Structure
```
Navigation
├── Navigation Bar (fixed or static positioning)
│   ├── Logo Section
│   │   ├── Icon Placeholder
│   │   └── Wanda Title
│   └── Authentication Section
│       ├── Unauthenticated State
│       │   ├── Login Button
│       │   └── Phone Input Form (conditional)
│       └── Authenticated State
│           ├── Phone Number Display
│           └── Sign Out Button
└── Phone Verification Modal (conditional)
```

### Styling Modes

#### Standard Mode (`transparent={false}`)
- White background with subtle shadow
- Border at bottom
- Suitable for pages with non-overlapping content

#### Transparent Mode (`transparent={true}`)
- Semi-transparent white background with backdrop blur
- Fixed positioning for overlay effect
- Subtle border for definition
- Ideal for hero sections and landing pages

### State Management
The component manages several local states:
- `showVerificationModal`: Controls verification modal visibility
- `showPhoneInput`: Toggles between login button and phone input
- `phoneNumber`: Stores formatted phone number input

### Integration with Auth Context
The component uses the `useAuth` hook to:
- Check authentication status (`user`)
- Sign out users (`signOut`)
- Handle authentication flow

### Phone Number Formatting
Implements real-time phone number formatting:
- Removes non-digit characters
- Formats as (XXX) XXX-XXXX
- Validates minimum length before enabling submission

## Usage Examples

### Landing Page (Transparent)
```tsx
import Navigation from '../components/Navigation'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation transparent={true} />
      {/* Rest of landing page content */}
    </div>
  )
}
```

### Dashboard (Standard)
```tsx
import Navigation from '../components/Navigation'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Dashboard content with top padding for fixed nav */}
      </div>
    </div>
  )
}
```

## Layout Considerations

### Content Spacing
When using the Navigation component, ensure proper spacing:
- **Transparent Mode**: Content should account for overlay positioning
- **Standard Mode**: Add `pt-16` (64px) to main content for navigation height
- **Dashboard**: Use `pt-24` (96px) for additional breathing room

### Z-Index Management
The navigation uses `z-50` to ensure it appears above other content when in transparent mode.

## Design System Integration

### Colors
- **Primary Gradient**: `from-blue-600 to-purple-600`
- **Text Colors**: Slate color palette for consistency
- **Interactive States**: Hover and focus states using darker variants

### Typography
- **Logo**: `text-2xl font-bold` with gradient text
- **Buttons**: `font-semibold` for emphasis
- **Phone Display**: `text-sm` for secondary information

### Spacing
- **Container**: `max-w-7xl mx-auto` for consistent page width
- **Padding**: `px-4 sm:px-6 lg:px-8` responsive horizontal padding
- **Height**: `h-16` (64px) standard navigation height

## Accessibility Features

- **Focus Management**: Proper focus states for all interactive elements
- **Keyboard Navigation**: All buttons and inputs are keyboard accessible
- **Screen Reader Support**: Semantic HTML structure
- **Auto Focus**: Phone input automatically focuses when activated

## Future Enhancements

### Icon Integration
The current icon placeholder can be replaced with:
- Custom Wanda logo SVG
- Icon component from a design system
- Dynamic user avatar for authenticated users

### Additional Authentication Methods
- Social login integration
- Email/password fallback
- Remember device functionality

### Enhanced Mobile Experience
- Hamburger menu for additional navigation items
- Swipe gestures for mobile interactions
- Progressive Web App navigation patterns

## Dependencies

- **React**: Core framework
- **React Router**: For navigation (if needed)
- **Tailwind CSS**: Styling framework
- **AuthContext**: Custom authentication context
- **PhoneVerificationModal**: Modal component for phone verification

## File Structure
```
src/components/
├── Navigation.tsx           # Main navigation component
├── PhoneVerificationModal.tsx  # Verification modal
└── ...

src/contexts/
└── AuthContext.tsx         # Authentication context

src/pages/
├── Landing.tsx             # Landing page using Navigation
└── Dashboard.tsx           # Dashboard using Navigation
```