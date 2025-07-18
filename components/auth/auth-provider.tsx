"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { auth, googleProvider, facebookProvider, appleProvider, lineProvider, db } from "@/lib/firebase"

interface UserProfile {
  uid: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  dateOfBirth: string
  phoneNumber: string
  avatar?: string
  role: "user" | "business" | "admin"
  verified: boolean
  emailVerified: boolean
  verificationCode?: string
  createdAt: string
  lastLogin: string
  ageVerified: boolean
}

interface AuthUser extends FirebaseUser {
  firstName?: string
  lastName?: string
  displayName: string
  avatar?: string
  role?: string
  emailVerified: boolean
}

interface AuthContextType {
  user: AuthUser | null
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
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  dateOfBirth: string
  phoneNumber: string
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
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile
            setUser(userData)

            // Update last login
            await updateDoc(doc(db, "users", firebaseUser.uid), {
              lastLogin: new Date().toISOString(),
            })
          } else {
            setUser({
              ...firebaseUser,
              firstName: firebaseUser.displayName?.split(" ")[0] || "",
              lastName: firebaseUser.displayName?.split(" ")[1] || "",
              displayName: firebaseUser.displayName || firebaseUser.email || "User",
              avatar: firebaseUser.photoURL || undefined,
              role: "user",
              emailVerified: firebaseUser.emailVerified,
            } as AuthUser)
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const createUserProfile = async (firebaseUser: FirebaseUser, additionalData?: Partial<UserProfile>) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        const { displayName, email, photoURL } = firebaseUser
        const now = new Date().toISOString()

        const userData: UserProfile = {
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

        await setDoc(userRef, userData)
        setUser(userData)
      }
    } catch (error) {
      console.error("Error creating user profile:", error)
      throw error
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await createUserProfile(result.user)
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

      await createUserProfile(result.user, {
        ...profileData,
        verificationCode,
        emailVerified: false,
      })

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
      await createUserProfile(result.user)
    } catch (error) {
      console.error("Google login error:", error)
      throw error
    }
  }

  const loginWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider)
      await createUserProfile(result.user)
    } catch (error) {
      console.error("Facebook login error:", error)
      throw error
    }
  }

  const loginWithApple = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider)
      await createUserProfile(result.user)
    } catch (error) {
      console.error("Apple login error:", error)
      throw error
    }
  }

  const loginWithLine = async () => {
    try {
      const result = await signInWithPopup(auth, lineProvider)
      await createUserProfile(result.user)
    } catch (error) {
      console.error("Line login error:", error)
      throw error
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setFirebaseUser(null)
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return

    try {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, data)
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
