
# Orbital-Flow

AI-powered productivity dashboard with tasks, notes, habits, calendar, and Gemini integration.  
Built with Next.js, Firebase, and Tailwind CSS.

## Features

- Task, note, habit, and goal management
- Calendar and productivity analytics
- AI assistant powered by Gemini (Google AI)
- Firebase authentication and cloud storage
- Responsive UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js v18 or later
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sarvesh2005-code/Orbital-Flow.git
   cd Orbital-Flow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```
   GOOGLEAI_API_KEY=your-gemini-api-key
   # Add other environment variables as needed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:9002](http://localhost:9002) (or the port specified in your config).

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Deploy on Vercel

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com), sign in, and import your GitHub repository.
3. In Vercel dashboard, set your environment variables (`GOOGLEAI_API_KEY`, etc.) under Project Settings > Environment Variables.
4. Click "Deploy".

### Custom Domain

1. In your Vercel dashboard, go to your project.
2. Click "Settings" > "Domains" > "Add".
3. Enter your custom domain (e.g., `yourdomain.com`) and follow the DNS instructions provided by Vercel.
4. Once DNS propagates, your app will be live on your custom domain.

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
