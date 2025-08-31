import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "pattaya1-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "pattaya1-demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "pattaya1-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Connect to emulators in development
if (process.env.NODE_ENV === "development") {
  try {
    connectAuthEmulator(auth, "http://localhost:9099")
    connectFirestoreEmulator(db, "localhost", 8080)
  } catch (error) {
    console.log("Emulators already connected")
  }
}

// Auth providers
export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope("email")
googleProvider.addScope("profile")
// Re-prompt for consent to ensure email is granted
googleProvider.setCustomParameters({ prompt: "consent" })

export const facebookProvider = new FacebookAuthProvider()
facebookProvider.addScope("email")
// Re-request declined permissions like email if previously denied
facebookProvider.setCustomParameters({ auth_type: "rerequest" })

// Line provider
export const lineProvider = new OAuthProvider("oidc.line")
lineProvider.addScope("profile")
lineProvider.addScope("openid")
lineProvider.addScope("email")
lineProvider.setCustomParameters({ prompt: "consent" })

// Apple provider
export const appleProvider = new OAuthProvider("apple.com")
appleProvider.addScope("email")
appleProvider.addScope("name")
appleProvider.setCustomParameters({ prompt: "consent" })

export default app
