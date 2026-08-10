# Orbital Flow Codebase Workflow

## Overview
Orbital Flow is a modern web application designed to enhance productivity and task management. The codebase is structured to ensure scalability, maintainability, and performance.

## Folder Structure

- **src/**: Contains the main application code.
  - **ai/**: AI-related utilities and flows.
  - **app/**: Next.js application pages and API routes.
  - **components/**: Reusable UI components and layouts.
  - **hooks/**: Custom React hooks.
  - **lib/**: Utility functions and libraries.
  - **services/**: Business logic and API integrations.

- **public/**: Static assets such as images and icons.
- **docs/**: Documentation files.
- **.next/**: Build artifacts (auto-generated).
- **node_modules/**: Installed dependencies.

## Key Components

### AI Flows
Located in `src/ai/flows/`, these files handle AI-powered features such as:
- Answering queries (`answer-queries.ts`)
- Suggesting tasks (`suggest-tasks.ts`)
- Summarizing notes (`summarize-notes.ts`)

### Pages
The `src/app/` directory contains all the pages of the application, including:
- **Authentication**: `login/`, `signup/`, `verify-email/`
- **Features**: `tasks/`, `notes/`, `calendar/`, `goals/`, `habits/`
- **Settings**: `settings/`

### Components
Reusable components are organized into:
- **UI**: Basic UI elements like buttons, inputs, and modals.
- **Layout**: Application shell, header, and sidebar.
- **Dashboard**: Widgets like AI assistant, habit tracker, and productivity chart.

### Services
Located in `src/services/`, these files encapsulate business logic for:
- Tasks (`taskService.ts`)
- Goals (`goalService.ts`)
- Habits (`habitService.ts`)
- Notes (`noteService.ts`)
- Users (`userService.ts`)

## Workflow

1. **Development**:
   - Start the development server: `npm run dev`
   - Access the app at `http://localhost:3000`

2. **Building for Production**:
   - Build the app: `npm run build`
   - Start the production server: `npm start`

3. **Testing**:
   - Run tests: `npm test`

4. **Deployment**:
   - Deploy to Vercel or another hosting platform.

## Best Practices
- Use the Orbital Flow logo consistently across the app.
- Follow the DRY (Don't Repeat Yourself) principle.
- Optimize components for performance.
- Use TypeScript for type safety.

## Contact
For questions or contributions, contact the repository owner or open an issue on GitHub.
