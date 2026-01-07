import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

// Firebase configuration
// Replace these values with your Firebase project config
// You can find these in Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'marketing-website-management',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('⚠️ Firebase configuration is missing!')
  console.error('Please create a .env file with the following variables:')
  console.error('  VITE_FIREBASE_API_KEY')
  console.error('  VITE_FIREBASE_AUTH_DOMAIN')
  console.error('  VITE_FIREBASE_PROJECT_ID')
  console.error('  VITE_FIREBASE_STORAGE_BUCKET')
  console.error('  VITE_FIREBASE_MESSAGING_SENDER_ID')
  console.error('  VITE_FIREBASE_APP_ID')
  console.error('\nGet these from: Firebase Console > Project Settings > Your apps > Web app')
}

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp
if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig)
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error)
    throw error
  }
} else {
  app = getApps()[0]
}

// Initialize Firebase services
export const auth: Auth = getAuth(app)
export const db: Firestore = getFirestore(app)
export default app

