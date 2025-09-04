# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Orbital Flow is an AI-powered productivity dashboard built with Next.js 15, featuring task management, notes, habits, calendar, goals, and AI assistant integration. The application uses Firebase for authentication and data storage, Gemini AI for intelligent features, and a modern React/TypeScript stack.

## Common Development Commands

### Development Server
```bash
npm run dev              # Start development server on port 9002 with Turbopack
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run ESLint
npm run typecheck       # Run TypeScript compiler without emitting
```

### AI/Genkit Development
```bash
npm run genkit:dev      # Start Genkit development server
npm run genkit:watch    # Start Genkit with file watching
```

### Firebase/Deployment
```bash
firebase deploy         # Deploy to Firebase (project: orbital-flow-cp8pz)
```

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system, Framer Motion for animations
- **UI Components**: Radix UI primitives with custom theming
- **State Management**: TanStack Query (React Query) for server state, custom hooks for local state
- **Authentication**: Firebase Auth with Google OAuth
- **Database**: Firestore with offline persistence enabled
- **AI Integration**: Google AI (Gemini 2.0 Flash) via Genkit framework
- **Build Tool**: Turbopack for fast development builds

### Application Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Authentication routes (login, signup)
│   ├── calendar/       # Calendar view
│   ├── tasks/          # Task management
│   ├── notes/          # Notes management
│   ├── goals/          # Goal tracking
│   ├── habits/         # Habit tracking
│   ├── notifications/  # Notification center
│   ├── settings/       # User preferences
│   └── layout.tsx      # Root layout with providers
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components (buttons, inputs, etc.)
│   ├── layout/        # Layout components (app shell, sidebar, header)
│   └── dashboard/     # Dashboard-specific widgets
├── services/          # Business logic and Firebase operations
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
├── ai/                # Genkit AI flows and configurations
└── providers/         # React context providers
```

### Key Architectural Patterns

**Service Layer Architecture**: Each major feature (tasks, goals, habits, notes, users) has a dedicated service file in `src/services/` that encapsulates all Firebase operations and business logic.

**Custom Hook Layer**: React Query is wrapped in custom hooks (`src/hooks/`) that provide type-safe, optimistic updates and real-time synchronization with Firestore.

**AI Integration**: The app uses Genkit flows for AI features, with structured prompts and type-safe input/output schemas. AI flows are located in `src/ai/flows/`.

**Authentication Flow**: The app uses a centralized auth provider with route protection in the AppShell component. Users are redirected to `/login` if not authenticated.

**Responsive Design**: The UI adapts to different screen sizes using Tailwind's responsive utilities and a collapsible sidebar for mobile.

## Development Guidelines

### Environment Variables Required
Create a `.env.local` file with:
```
GOOGLEAI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=orbital-flow-cp8pz
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Code Organization
- Use the `@/*` path alias for imports from the `src/` directory
- Follow the established pattern: Services → Custom Hooks → Components
- AI flows should be server actions marked with `'use server'`
- All Firebase operations should go through the service layer
- Use TypeScript interfaces for data models (see `src/services/taskService.ts` for examples)

### UI/UX Patterns
- The app uses a consistent color system based on CSS custom properties
- Components follow Radix UI patterns with custom styling
- Animations are handled through Framer Motion with consistent timing (0.2s-0.4s durations)
- The sidebar is collapsible and context-aware
- Toast notifications are used for user feedback

### AI Integration
- All AI features use the Genkit framework with structured prompts
- Input/output schemas are defined using Zod for type safety
- AI flows are designed to be context-aware (calendar events, goals, etc.)
- The main AI assistant is integrated into the dashboard for quick access

### Data Flow
1. User interactions trigger actions in components
2. Actions call custom hooks that use React Query
3. React Query manages caching and calls service functions
4. Services handle Firebase operations and business logic
5. Real-time updates flow back through the hook layer to components

### Firebase Integration
- Firestore persistence is enabled for offline functionality
- Security rules should be configured in Firebase Console
- The app uses server timestamps for consistent data
- Collections: `tasks`, `notes`, `goals`, `habits`, `users`

### Performance Considerations
- The app uses Turbopack for fast development builds
- Images are optimized with Next.js Image component
- Bundle analysis available via Next.js built-in tools
- React Query handles intelligent caching and background updates
- Components are lazy-loaded where appropriate

### Testing Strategy
- Type checking via TypeScript compiler
- Component testing should use React Testing Library patterns
- AI flows can be tested independently using Genkit's testing utilities
- Firebase operations should be tested with Firebase emulator suite

## Known Issues & Workarounds

- Development server runs on port 9002 instead of default 3000
- Some build warnings about TypeScript/ESLint are ignored for faster builds
- Genkit integration requires server actions for AI flows
- Firebase emulator setup may be needed for local development testing
