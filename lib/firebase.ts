import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

const firebaseConfig = {
  apiKey: 'AIzaSyBhVeHemWPecvMlEPYqjExAFHnsCkEDebI',
  authDomain: 'pattaya1-4a699.firebaseapp.com',
  projectId: 'pattaya1-4a699',
  storageBucket: 'pattaya1-4a699.firebasestorage.app',
  messagingSenderId: '366162328240',
  appId: '1:366162328240:web:d091b401f004237482d975',
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
