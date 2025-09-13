"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth"
import { auth, googleProvider, facebookProvider, appleProvider, lineProvider } from "@/lib/firebase"
import { strapiAPI, type StrapiUser } from "@/lib/strapi-api"
import { STRAPI_CONFIG } from "@/lib/strapi-config"

interface UserProfile {
  uid: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  dateOfBirth?: string
  phoneNumber?: string
  avatar?: string
  role: "user" | "business" | "admin"
  verified: boolean
  emailVerified: boolean
  verificationCode?: string
  createdAt: string
  lastLogin: string
  ageVerified: boolean
  strapiUser?: StrapiUser
}

interface AuthContextType {
  user: UserProfile | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  loginWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (userData: RegisterData) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithFacebook: () => Promise<void>
  loginWithApple: () => Promise<void>
  loginWithLine: () => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  sendVerificationCode: (email: string) => Promise<void>
  verifyEmailCode: (code: string) => Promise<boolean>
  checkAge: () => boolean
  syncWithStrapi: () => Promise<void>
  getStrapiToken: () => string | null
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  phoneNumber?: string
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  loginWithGoogle: async () => {},
  loginWithFacebook: async () => {},
  loginWithApple: async () => {},
  loginWithLine: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  sendVerificationCode: async () => {},
  verifyEmailCode: async () => false,
  checkAge: () => false,
  syncWithStrapi: async () => {},
  getStrapiToken: () => null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [strapiToken, setStrapiToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('strapi_token')
    }
    return null
  })

  // Create user profile from Firebase user
  const createUserProfile = (firebaseUser: FirebaseUser, additionalData?: Partial<UserProfile>): UserProfile => {
    const { displayName, email, photoURL } = firebaseUser
    const now = new Date().toISOString()

    return {
      uid: firebaseUser.uid,
      email: email || "",
      firstName: additionalData?.firstName || displayName?.split(" ")[0] || "",
      lastName: additionalData?.lastName || displayName?.split(" ").slice(1).join(" ") || "",
      displayName: displayName || `${additionalData?.firstName} ${additionalData?.lastName}` || "",
      dateOfBirth: additionalData?.dateOfBirth || "",
      phoneNumber: additionalData?.phoneNumber || "",
      avatar: photoURL || "",
      role: "user",
      verified: false,
      emailVerified: firebaseUser.emailVerified,
      createdAt: now,
      lastLogin: now,
      ageVerified: false,
      ...additionalData,
    }
  }

  // Helper to resolve email reliably from Firebase
  const resolveEmailFromFirebase = async (currentUser: FirebaseUser): Promise<string | null> => {
    // 1) Direct email
    if (currentUser.email) return currentUser.email

    // 2) Provider data
    const providerEmail = currentUser.providerData.find((p) => p?.email)?.email
    if (providerEmail) return providerEmail

    // 3) REST lookup with idToken (Identity Toolkit)
    try {
      const idToken = await currentUser.getIdToken(true)
      const key = 'AIzaSyBhVeHemWPecvMlEPYqjExAFHnsCkEDebI'
      if (!key) return null
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        }
      )
      if (!res.ok) return null
      const json = await res.json()
      const emailFromLookup = json?.users?.[0]?.email || null
      return emailFromLookup || null
    } catch {
      return null
    }
  }

  // Sync user with Strapi
  const syncWithStrapi = async () => {
    if (!firebaseUser) return

    try {
      console.log('[Auth] syncWithStrapi: start', { uid: firebaseUser.uid })
      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken(true)
      console.log('[Auth] got idToken length', idToken?.length)
      // Resolve a reliable email upfront for sync
      const resolvedEmailForSync = await resolveEmailFromFirebase(firebaseUser)
      
      // Try to login with Strapi first
      try {
        console.log('[Auth] trying loginUser in Strapi')
        const strapiResponse = await strapiAPI.loginUser(firebaseUser.uid)
        updateStrapiToken(idToken)
        setUser(prev => prev ? { ...prev, strapiUser: strapiResponse.user } : null)
        console.log('✅ User logged in with Strapi:', strapiResponse.user.id)
        // Best-effort profile sync in Strapi
        try {
          await strapiAPI.syncFirebaseUser({
            firebaseUid: firebaseUser.uid,
            email: resolvedEmailForSync || firebaseUser.email || undefined,
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            phoneNumber: firebaseUser.phoneNumber || undefined,
            emailVerified: !!firebaseUser.emailVerified,
          }, idToken)
        } catch (e) {
          console.warn('[Auth] Strapi profile sync (login) failed', e)
        }
      } catch (error) {
        // User doesn't exist in Strapi, register them
        console.log('🔄 User not found in Strapi, registering...')
        
        // Resolve a reliable email
        const resolvedEmail = resolvedEmailForSync
        const usernameFallback = firebaseUser.displayName || (resolvedEmail ? resolvedEmail.split('@')[0] : `user-${firebaseUser.uid.slice(0,6)}`)
        const synthesizedEmail = resolvedEmail || `${firebaseUser.uid}@no-email.firebase`
        const userData = {
          username: usernameFallback,
          email: synthesizedEmail,
          firebaseUid: firebaseUser.uid,
        }
        console.log('➡️ Register payload to Strapi:', userData)

        // Proceed even when provider does not return an email. Backend will accept placeholder.

        try {
          console.log('[Auth] trying registerUser in Strapi')
          const strapiResponse = await strapiAPI.registerUser(userData)
          updateStrapiToken(idToken)
          setUser(prev => prev ? { ...prev, strapiUser: strapiResponse.user } : null)
          console.log('✅ User registered with Strapi:', strapiResponse.user.id)
          // Best-effort profile sync in Strapi right after registration
          try {
            await strapiAPI.syncFirebaseUser({
              firebaseUid: firebaseUser.uid,
              email: synthesizedEmail,
              displayName: firebaseUser.displayName || undefined,
              photoURL: firebaseUser.photoURL || undefined,
              phoneNumber: firebaseUser.phoneNumber || undefined,
              emailVerified: !!firebaseUser.emailVerified,
            }, idToken)
          } catch (e) {
            console.warn('[Auth] Strapi profile sync (register) failed', e)
          }
        } catch (registerError) {
          console.error('❌ Failed to register user with Strapi:', registerError)
          // Still set the token even if registration fails
          updateStrapiToken(idToken)
        }
      }
    } catch (error) {
      console.error("Strapi sync error:", error)
    }
  }

  // Update Strapi token and persist to localStorage
  const updateStrapiToken = (token: string | null) => {
    setStrapiToken(token)
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('strapi_token', token)
      } else {
        localStorage.removeItem('strapi_token')
      }
    }
  }

  // Get Strapi token
  const getStrapiToken = () => strapiToken

  useEffect(() => {
    console.log('[Auth] mounted. STRAPI_CONFIG.apiUrl =', STRAPI_CONFIG.apiUrl)
    
    // Check if we have a token in localStorage but no Firebase user
    const checkStoredToken = async () => {
      const storedToken = localStorage.getItem('strapi_token')
      if (storedToken && !firebaseUser) {
        console.log('[Auth] Found stored token, but no Firebase user. Token will be cleared.')
        updateStrapiToken(null)
      }
    }
    
    checkStoredToken()
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[Auth] onAuthStateChanged fired. user?', !!firebaseUser)
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        try {
          // Create user profile from Firebase user
          const userProfile = createUserProfile(firebaseUser)
          setUser(userProfile)

          // Sync with Strapi
          await syncWithStrapi()
        } catch (error) {
          console.error("Error setting up user profile:", error)
        }
      } else {
        setUser(null)
        updateStrapiToken(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const userProfile = createUserProfile(result.user)
      setUser(userProfile)
      await syncWithStrapi()
    } catch (error) {
      console.error("Email login error:", error)
      throw error
    }
  }

  const registerWithEmail = async (userData: RegisterData) => {
    try {
      const { email, password, ...profileData } = userData
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Update Firebase profile
      await updateProfile(result.user, {
        displayName: `${profileData.firstName} ${profileData.lastName}`,
      })

      // Send email verification
      await sendEmailVerification(result.user)

      // Generate verification code
      const verificationCode = Math.floor(10000 + Math.random() * 90000).toString()

      const userProfile = createUserProfile(result.user, {
        ...profileData,
        verificationCode,
        emailVerified: false,
      })
      setUser(userProfile)

      // Sync with Strapi (this will register the user)
      await syncWithStrapi()

      // Send verification email with code
      await sendVerificationCode(email, verificationCode)
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const userProfile = createUserProfile(result.user)
      setUser(userProfile)
      await syncWithStrapi()
    } catch (error) {
      console.error("Google login error:", error)
      throw error
    }
  }

  const loginWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider)
      const userProfile = createUserProfile(result.user)
      setUser(userProfile)
      await syncWithStrapi()
    } catch (error) {
      // Fallback to redirect flow if popups are blocked
      const errorCode = (error as { code?: string })?.code || ""
      if (errorCode === "auth/popup-blocked") {
        try {
          await signInWithRedirect(auth, facebookProvider)
          return
        } catch (redirectError) {
          console.error("Facebook redirect login error:", redirectError)
          throw redirectError
        }
      }
      console.error("Facebook login error:", error)
      throw error
    }
  }

  const loginWithApple = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider)
      const userProfile = createUserProfile(result.user)
      setUser(userProfile)
      await syncWithStrapi()
    } catch (error) {
      console.error("Apple login error:", error)
      throw error
    }
  }

  const loginWithLine = async () => {
    try {
      const result = await signInWithPopup(auth, lineProvider)
      const userProfile = createUserProfile(result.user)
      setUser(userProfile)
      await syncWithStrapi()
    } catch (error) {
      console.error("Line login error:", error)
      throw error
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setFirebaseUser(null)
    updateStrapiToken(null)
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return

    try {
      setUser({ ...user, ...data })
    } catch (error) {
      console.error("Profile update error:", error)
      throw error
    }
  }

  const sendVerificationCode = async (email: string, code?: string) => {
    const verificationCode = code || Math.floor(10000 + Math.random() * 90000).toString()

    // Update user with verification code
    if (user) {
      await updateUserProfile({ verificationCode })
    }

    // Send verification email
    try {
      await fetch("/api/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      })
    } catch (error) {
      console.error("Failed to send verification email:", error)
    }
  }

  const verifyEmailCode = async (code: string): Promise<boolean> => {
    if (!user || !user.verificationCode) return false

    if (user.verificationCode === code) {
      await updateUserProfile({
        emailVerified: true,
        verified: true,
        verificationCode: undefined,
      })
      return true
    }

    return false
  }

  const checkAge = (): boolean => {
    if (!user || !user.dateOfBirth) return false

    const birthDate = new Date(user.dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18
    }

    return age >= 18
  }

  const value = {
    user,
    firebaseUser,
    loading,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginWithFacebook,
    loginWithApple,
    loginWithLine,
    logout,
    updateUserProfile,
    sendVerificationCode,
    verifyEmailCode,
    checkAge,
    syncWithStrapi,
    getStrapiToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
