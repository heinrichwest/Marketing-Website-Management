import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserRole, Project, Ticket } from "@/types"
import { getProjectsByUserId, mockUsers, getUsers } from "@/lib/mock-data"
import { auth, db } from "@/lib/firebase"

// Storage key for messages
const MESSAGES_STORAGE_KEY = "marketing_management_website_messages"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User as FirebaseUser
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp, type DocumentData } from "firebase/firestore"

// Flag to use mock authentication instead of Firebase
// Default to Firebase if configured, only use mock if explicitly enabled via localStorage
const USE_MOCK_AUTH = localStorage.getItem('useMockAuth') === 'true'

interface AuthUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  phone: string
}

interface SignUpData {
  email: string
  password: string
  fullName: string
  phone: string
  role: UserRole
}

interface AuthContextType {
  isSignedIn: boolean
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: SignUpData) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateCurrentUser: (updates: Partial<AuthUser>) => void
  switchRole: (newRole: UserRole) => void
  hasRole: (roles: UserRole[]) => boolean
  canAccessProject: (projectId: string) => boolean
  canManageTicket: (ticket: Ticket) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock authentication functions
  const mockSignIn = async (email: string, password: string): Promise<void> => {
    const mockUser = getUsers().find(u => u.email === email && u.password === password)
    if (!mockUser) {
      throw new Error("Invalid email or password")
    }
    if (!mockUser.isActive) {
      throw new Error("Account is inactive")
    }

    const authUser: AuthUser = {
      id: mockUser.id,
      email: mockUser.email,
      fullName: mockUser.fullName,
      role: mockUser.role,
      phone: mockUser.phone,
    }

    setUser(authUser)
    setIsSignedIn(true)
    localStorage.setItem("mockAuthUser", JSON.stringify(authUser))
  }

  const mockSignUp = async (data: SignUpData): Promise<void> => {
    // For mock, create user and add to mockUsers array
    const newUserId = `user-${Date.now()}`
    const newUser = {
      id: newUserId,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      phone: data.phone,
      password: data.password, // Store password for mock auth
      isActive: true, // New users start as active
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Add new user to mockUsers and persist
    mockUsers.push(newUser)
    localStorage.setItem("marketing_management_website_users", JSON.stringify(getUsers().concat(newUser)))

    // Send notification to all admins about new user registration
    const admins = getUsers().filter(u => u.role === "admin")
    const notificationMessage = {
      id: `message-${Date.now()}`,
      senderId: newUserId,
      recipientId: undefined, // Broadcast to all admins
      subject: "New User Registration",
      content: `A new user has registered: ${newUser.fullName} (${newUser.email}) as ${newUser.role}. Please review and approve if necessary.`,
      isRead: false,
      isBroadcast: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Add message to all admins
    const currentMessages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || "[]")
    admins.forEach(admin => {
      currentMessages.push({
        ...notificationMessage,
        recipientId: admin.id,
        id: `message-${Date.now()}-${admin.id}`,
      })
    })
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(currentMessages))

    const authUser: AuthUser = {
      id: newUserId,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      phone: newUser.phone,
    }

    setUser(authUser)
    setIsSignedIn(true)
    localStorage.setItem("mockAuthUser", JSON.stringify(authUser))
  }

  const mockSignOut = async (): Promise<void> => {
    setUser(null)
    setIsSignedIn(false)
    localStorage.removeItem("mockAuthUser")
  }

  // Firebase authentication functions
  const fetchUserData = async (firebaseUser: FirebaseUser): Promise<AuthUser | null> => {
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
      if (!userDoc.exists()) {
        console.error("User document not found in Firestore")
        return null
      }

      const userData = userDoc.data() as DocumentData

      // Check if user is active
      if (!userData.isActive) {
        console.error("User account is inactive")
        return null
      }

      return {
        id: firebaseUser.uid,
        email: userData.email || firebaseUser.email || "",
        fullName: userData.fullName || "",
        role: userData.role as UserRole,
        phone: userData.phone || "",
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      return null
    }
  }

  // Initialize authentication based on USE_MOCK_AUTH flag
  useEffect(() => {
    if (USE_MOCK_AUTH) {
      // Load user from localStorage
      setLoading(true)
      const storedUser = localStorage.getItem("mockAuthUser")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setIsSignedIn(true)
        } catch (error) {
          console.error("Error parsing stored user:", error)
          localStorage.removeItem("mockAuthUser")
        }
      }
      setLoading(false)
    } else {
      // Use Firebase auth
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setLoading(true)
        if (firebaseUser) {
          const userData = await fetchUserData(firebaseUser)
          if (userData) {
            setUser(userData)
            setIsSignedIn(true)
          } else {
            setUser(null)
            setIsSignedIn(false)
          }
        } else {
          setUser(null)
          setIsSignedIn(false)
        }
        setLoading(false)
      })

      return () => unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<void> => {
    if (USE_MOCK_AUTH) {
      return mockSignIn(email, password)
    }

    try {
      // Check if Firebase is properly initialized
      if (!auth) {
        console.error("Firebase Auth not initialized. Check your Firebase configuration.")
        throw new Error("Firebase Auth not initialized. Please check your configuration.")
      }

      await signInWithEmailAndPassword(auth, email, password)
      // Auth state change listener will handle setting user data
    } catch (error: any) {
      console.error("Sign in error:", error)
      console.error("Error code:", error.code)
      console.error("Error message:", error.message)

      // Provide more specific error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error("auth/user-not-found - No user found with this email. Please create an account first.")
      } else if (error.code === 'auth/wrong-password') {
        throw new Error("auth/wrong-password - Incorrect password.")
      } else if (error.code === 'auth/invalid-email') {
        throw new Error("auth/invalid-email - Invalid email address format.")
      } else if (error.code === 'auth/user-disabled') {
        throw new Error("auth/user-disabled - This account has been disabled.")
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error("auth/too-many-requests - Too many failed login attempts. Please try again later.")
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error("auth/network-request-failed - Network error. Please check your internet connection.")
      } else if (error.code === 'auth/invalid-api-key') {
        throw new Error("auth/invalid-api-key - Firebase API key is invalid. Check your .env file.")
      } else if (error.code === 'auth/configuration-not-found') {
        throw new Error("auth/configuration-not-found - Firebase configuration not found. Check your .env file.")
      }

      throw new Error(error.message || error.code || "Failed to sign in")
    }
  }

  const signUp = async (data: SignUpData): Promise<void> => {
    if (USE_MOCK_AUTH) {
      return mockSignUp(data)
    }

    try {
      if (!auth) {
        throw new Error("Firebase Auth not initialized. Please check your configuration.")
      }

      // Create the Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const firebaseUser = userCredential.user

      // Create the user document in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        role: data.role,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // Auth state change listener will handle setting user data
    } catch (error: any) {
      console.error("Sign up error:", error)
      console.error("Error code:", error.code)
      console.error("Error message:", error.message)

      if (error.code === 'auth/email-already-in-use') {
        throw new Error("An account with this email already exists.")
      } else if (error.code === 'auth/invalid-email') {
        throw new Error("Invalid email address format.")
      } else if (error.code === 'auth/weak-password') {
        throw new Error("Password is too weak. Please use at least 6 characters.")
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error("Email/password accounts are not enabled. Please contact support.")
      }

      throw new Error(error.message || "Failed to create account")
    }
  }

  const resetPassword = async (email: string): Promise<void> => {
    if (USE_MOCK_AUTH) {
      // For mock auth, simulate sending a password reset email
      const mockUser = getUsers().find(u => u.email === email)
      if (!mockUser) {
        throw new Error("No account found with this email address.")
      }
      // In mock mode, just simulate success
      console.log(`[Mock] Password reset email would be sent to: ${email}`)
      return
    }

    try {
      if (!auth) {
        throw new Error("Firebase Auth not initialized. Please check your configuration.")
      }

      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      console.error("Password reset error:", error)
      console.error("Error code:", error.code)
      console.error("Error message:", error.message)

      if (error.code === 'auth/user-not-found') {
        throw new Error("No account found with this email address.")
      } else if (error.code === 'auth/invalid-email') {
        throw new Error("Invalid email address format.")
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error("Too many requests. Please try again later.")
      }

      throw new Error(error.message || "Failed to send password reset email")
    }
  }

  const updateCurrentUser = (updates: Partial<AuthUser>) => {
    if (!user) return
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)

    if (USE_MOCK_AUTH) {
      localStorage.setItem("mockAuthUser", JSON.stringify(updatedUser))
    } else {
      // For Firebase, update Firestore if needed
      // But since updates are done via admin panel, assume Firestore is updated separately
    }
  }

  const signOut = async (): Promise<void> => {
    if (USE_MOCK_AUTH) {
      return mockSignOut()
    }

    try {
      await firebaseSignOut(auth)
      // Auth state change listener will handle clearing user data
    } catch (error: any) {
      console.error("Sign out error:", error)
      throw new Error(error.message || "Failed to sign out")
    }
  }

  const switchRole = (newRole: UserRole) => {
    if (!user) return
    // Note: This is a client-side role switch for testing/demo purposes
    // In production, role changes should be done through admin panel and Firestore
    const updatedUser = { ...user, role: newRole }
    setUser(updatedUser)

    if (USE_MOCK_AUTH) {
      localStorage.setItem("mockAuthUser", JSON.stringify(updatedUser))
    }
  }

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false
    return roles.includes(user.role)
  }

  const canAccessProject = (projectId: string): boolean => {
    if (!user) return false
    if (user.role === "admin") return true

    const projects = getProjectsByUserId(user.id, user.role)
    return projects.some((p) => p.id === projectId)
  }

  const canManageTicket = (ticket: Ticket): boolean => {
    if (!user) return false
    if (user.role === "admin") return true
    if (user.role === "web_developer" && ticket.assignedTo === user.id) return true
    if (user.role === "client" && ticket.createdBy === user.id) return true
    return false
  }

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateCurrentUser,
        switchRole,
        hasRole,
        canAccessProject,
        canManageTicket,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
