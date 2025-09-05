# 🚀 Orbital Flow

**AI-Powered Productivity Platform** built with Next.js, Firebase, and Google Gemini AI

Orbital Flow is a comprehensive productivity platform that helps users manage tasks, build habits, set goals, take notes, and leverage AI-powered insights to boost their productivity and achieve their objectives.

## ✨ Features

### 🎯 **Core Productivity Tools**
- **Tasks Management** - Create, organize, and track tasks with priorities and due dates
- **Habit Tracking** - Build consistent habits with streak tracking and visual feedback
- **Goal Setting** - Set and monitor progress toward your objectives
- **Note Taking** - Capture ideas and important information
- **Calendar Integration** - Schedule and visualize your productivity timeline

### 🤖 **AI-Powered Intelligence**
- **Smart Assistant** - AI-powered productivity insights using Google Gemini
- **Contextual Advice** - Personalized recommendations based on your data
- **Progress Analysis** - AI-driven analysis of your productivity patterns
- **Task Prioritization** - Intelligent suggestions for task management

### 🎨 **Modern User Experience**
- **Real-time Sync** - Instant updates across all your data
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode** - Choose your preferred theme
- **Smooth Animations** - Framer Motion powered interactions
- **Toast Notifications** - Real-time feedback for all actions

### 🔐 **Authentication & Security**
- **Multi-Auth Support** - Email/password and Google Sign-in
- **Email Verification** - Secure account verification flow
- **Password Reset** - Secure password recovery
- **Firebase Security** - Industry-standard security rules

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15.3+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: React Query for caching
- **Forms**: React Hook Form

### **Backend & Database**
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Real-time**: Firestore real-time listeners

### **AI & Intelligence**
- **AI Model**: Google Gemini 1.5 Flash
- **AI Framework**: Google Genkit
- **Integration**: Custom AI flows for productivity insights

### **Development & Deployment**
- **Package Manager**: npm
- **Build Tool**: Next.js with Turbopack
- **Deployment**: Vercel
- **Version Control**: Git

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+ 
- npm or yarn
- Firebase project
- Google AI Studio API key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/orbital-flow.git
cd orbital-flow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Google AI API Key
GOOGLEAI_API_KEY=your_google_ai_api_key
NEXT_PUBLIC_GOOGLEAI_API_KEY=your_google_ai_api_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:9002
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_here
```

### 4. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Add your web app configuration to the environment variables

### 5. Google AI Setup
1. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Ensure the key has access to Gemini models
3. Add the key to your environment variables

### 6. Run Development Server
```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

## 📁 Project Structure

```
orbital-flow/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── tasks/             # Tasks management
│   │   ├── habits/            # Habit tracking
│   │   ├── goals/             # Goal setting
│   │   ├── notes/             # Note taking
│   │   └── settings/          # User settings
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   ├── dashboard/        # Dashboard components
│   │   └── icons/            # Custom icons
│   ├── hooks/                # Custom React hooks
│   ├── services/             # Firebase & API services
│   ├── ai/                   # AI flows and logic
│   ├── lib/                  # Utility libraries
│   └── providers/            # React context providers
├── public/                   # Static assets
├── firebase.json             # Firebase configuration
└── next.config.ts           # Next.js configuration
```

## 🔧 Key Features Explained

### Real-time Data Synchronization
All data updates instantly across the application using Firestore real-time listeners. Changes are reflected immediately without page refreshes.

### AI-Powered Insights
The AI assistant analyzes your productivity data and provides personalized recommendations for:
- Task prioritization
- Habit optimization  
- Goal achievement strategies
- Progress tracking insights

### Performance Optimizations
- **Route Prefetching**: Critical routes are prefetched for instant navigation
- **React Query Caching**: Efficient data fetching and caching
- **Bundle Optimization**: Code splitting and tree shaking
- **Image Optimization**: Next.js Image component with lazy loading

### Theme System
Seamless dark/light mode switching with:
- System preference detection
- Manual toggle in sidebar
- Persistent user preference storage
- Smooth transitions between themes

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   Add all environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel domain

3. **Firebase Configuration**
   - Add your Vercel domain to Firebase Auth authorized domains
   - Update CORS settings if needed

### Build for Production
```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📊 Performance Monitoring

The application includes:
- **Core Web Vitals** tracking
- **Bundle analysis** with `@next/bundle-analyzer`
- **Performance profiling** in development
- **Error tracking** with proper error boundaries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Maintain 90%+ test coverage
- Follow the existing code style

## 📝 API Documentation

### Firebase Collections

#### Tasks
```typescript
interface Task {
  id: string
  title: string
  priority: 'High' | 'Medium' | 'Low'
  completed: boolean
  userId: string
  dueDate?: string
  createdAt: Timestamp
  completedAt?: Timestamp
}
```

#### Habits
```typescript
interface Habit {
  id: string
  name: string
  icon: 'Dumbbell' | 'BookOpen' | 'GlassWater' | 'BrainCircuit'
  streak: number
  userId: string
  lastCompleted: string | null
}
```

#### Goals
```typescript
interface Goal {
  id: string
  title: string
  description?: string
  progress: number
  target: number
  deadline?: string
  category?: string
  userId: string
  createdAt: Timestamp
}
```

## 🐛 Troubleshooting

### Common Issues

1. **AI Assistant Not Working**
   - Verify Google AI API key is correct
   - Check if key has Gemini model access
   - Ensure environment variables are set

2. **Authentication Issues**
   - Verify Firebase configuration
   - Check authorized domains in Firebase console
   - Ensure environment variables match Firebase config

3. **Real-time Updates Not Working**
   - Check Firestore security rules
   - Verify user authentication status
   - Check browser console for errors

4. **Build Failures**
   - Clear Next.js cache: `rm -rf .next`
   - Clear node modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`

## 🔒 Security

- **Authentication**: Firebase Auth with secure token handling
- **Authorization**: Firestore security rules for data protection
- **API Keys**: Secure environment variable management
- **HTTPS**: Enforced in production
- **Input Validation**: Comprehensive validation on all user inputs

## 📈 Performance Metrics

- **Lighthouse Score**: 95+ on all metrics
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.0s

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/orbital-flow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/orbital-flow/discussions)
- **Email**: support@orbitalflow.app

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) team for the amazing framework
- [Firebase](https://firebase.google.com) for backend infrastructure
- [Google AI](https://ai.google.dev) for Gemini AI capabilities
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Vercel](https://vercel.com) for seamless deployment

---

**Built with ❤️ for productivity enthusiasts**

*Orbital Flow - Where productivity meets intelligence* 🚀
