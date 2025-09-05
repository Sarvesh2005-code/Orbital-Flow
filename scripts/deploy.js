#!/usr/bin/env node

/**
 * Deployment Script for Orbital Flow
 * Automates the deployment process to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Orbital Flow Deployment...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env.local file not found!');
  console.log('Please copy .env.example to .env.local and configure your environment variables.');
  process.exit(1);
}

// Step 1: Clean and build
console.log('📦 Step 1: Building the application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!\n');
} catch (error) {
  console.error('❌ Build failed!');
  process.exit(1);
}

// Step 2: Deploy to Vercel
console.log('🌐 Step 2: Deploying to Vercel...');
try {
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('✅ Deployment completed successfully!\n');
} catch (error) {
  console.error('❌ Deployment failed!');
  console.log('Make sure you have Vercel CLI installed: npm i -g vercel');
  process.exit(1);
}

console.log('🎉 Orbital Flow has been deployed successfully!');
console.log('📋 Post-deployment checklist:');
console.log('   1. Update environment variables in Vercel dashboard');
console.log('   2. Add your domain to Firebase Auth authorized domains');
console.log('   3. Test all features on the live site');
console.log('   4. Monitor performance and error logs');
console.log('\n🔗 Useful links:');
console.log('   • Vercel Dashboard: https://vercel.com/dashboard');
console.log('   • Firebase Console: https://console.firebase.google.com');
console.log('   • Google AI Studio: https://aistudio.google.com');
