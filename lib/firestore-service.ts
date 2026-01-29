import { db } from "./firebase"
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  type DocumentData
} from "firebase/firestore"
import type { Project, User, Ticket, UserRole } from "@/types"

// Collection names
const COLLECTIONS = {
  PROJECTS: "projects",
  USERS: "users",
  TICKETS: "tickets",
}

// Helper to check if Firebase is configured
const isFirebaseConfigured = () => {
  return localStorage.getItem('useMockAuth') === 'false'
}

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: Timestamp | Date | undefined): Date => {
  if (!timestamp) return new Date()
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate()
  }
  return new Date(timestamp)
}

// Convert project document to Project type
const convertProjectDoc = (doc: DocumentData, id: string): Project => {
  const data = doc
  return {
    id,
    name: data.name || "",
    description: data.description || "",
    projectType: data.projectType || "website",
    clientId: data.clientId || "",
    webDeveloperId: data.webDeveloperId,
    socialMediaCoordinatorId: data.socialMediaCoordinatorId,
    currentStage: data.currentStage || "planning",
    status: data.status || "active",
    websiteUrl: data.websiteUrl,
    brand: data.brand,
    createdAt: convertTimestamp(data.createdAt),
    launchDate: data.launchDate ? convertTimestamp(data.launchDate) : undefined,
    updatedAt: convertTimestamp(data.updatedAt),
    notes: data.notes,
    projectDate: data.projectDate ? convertTimestamp(data.projectDate) : undefined,
    product: data.product,
    socialMediaPlatforms: data.socialMediaPlatforms,
    campaignGoals: data.campaignGoals,
    targetAudience: data.targetAudience,
    posts: data.posts,
    likes: data.likes,
    impressions: data.impressions,
    reach: data.reach,
    engagement: data.engagement,
  }
}

// ==================== PROJECTS ====================

// Get all projects from Firestore
export async function getFirestoreProjects(): Promise<Project[]> {
  try {
    const projectsRef = collection(db, COLLECTIONS.PROJECTS)
    const q = query(projectsRef, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => convertProjectDoc(doc.data(), doc.id))
  } catch (error) {
    console.error("Error fetching projects from Firestore:", error)
    throw error
  }
}

// Get a single project by ID
export async function getFirestoreProjectById(projectId: string): Promise<Project | null> {
  try {
    const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId)
    const snapshot = await getDoc(projectRef)

    if (!snapshot.exists()) {
      return null
    }

    return convertProjectDoc(snapshot.data(), snapshot.id)
  } catch (error) {
    console.error("Error fetching project from Firestore:", error)
    throw error
  }
}

// Create a new project in Firestore
export async function createFirestoreProject(
  projectData: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<Project> {
  try {
    const projectsRef = collection(db, COLLECTIONS.PROJECTS)

    const docData = {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(projectsRef, docData)

    // Return the created project
    return {
      ...projectData,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  } catch (error) {
    console.error("Error creating project in Firestore:", error)
    throw error
  }
}

// Update a project in Firestore
export async function updateFirestoreProject(
  projectId: string,
  updates: Partial<Omit<Project, "id" | "createdAt">>
): Promise<Project | null> {
  try {
    const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId)

    // Check if project exists
    const existingDoc = await getDoc(projectRef)
    if (!existingDoc.exists()) {
      return null
    }

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    }

    await updateDoc(projectRef, updateData)

    // Return the updated project
    const updatedDoc = await getDoc(projectRef)
    return convertProjectDoc(updatedDoc.data()!, projectId)
  } catch (error) {
    console.error("Error updating project in Firestore:", error)
    throw error
  }
}

// Delete a project from Firestore
export async function deleteFirestoreProject(projectId: string): Promise<boolean> {
  try {
    const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId)

    // Check if project exists
    const existingDoc = await getDoc(projectRef)
    if (!existingDoc.exists()) {
      return false
    }

    await deleteDoc(projectRef)
    return true
  } catch (error) {
    console.error("Error deleting project from Firestore:", error)
    throw error
  }
}

// Get projects by user ID and role
export async function getFirestoreProjectsByUserId(
  userId: string,
  role: UserRole
): Promise<Project[]> {
  try {
    const projectsRef = collection(db, COLLECTIONS.PROJECTS)
    let q

    switch (role) {
      case "admin":
        q = query(projectsRef, orderBy("createdAt", "desc"))
        break
      case "web_developer":
        q = query(projectsRef, where("webDeveloperId", "==", userId))
        break
      case "social_media_coordinator":
        q = query(projectsRef, where("socialMediaCoordinatorId", "==", userId))
        break
      case "client":
        q = query(projectsRef, where("clientId", "==", userId))
        break
      default:
        return []
    }

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => convertProjectDoc(doc.data(), doc.id))
  } catch (error) {
    console.error("Error fetching projects by user from Firestore:", error)
    throw error
  }
}

// ==================== USERS ====================

// Get all users from Firestore
export async function getFirestoreUsers(): Promise<User[]> {
  try {
    const usersRef = collection(db, COLLECTIONS.USERS)
    const snapshot = await getDocs(usersRef)

    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        email: data.email || "",
        password: "", // Never return password from Firestore
        fullName: data.fullName || "",
        phone: data.phone || "",
        role: data.role || "client",
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        isActive: data.isActive ?? true,
        profileImage: data.profileImage,
      } as User
    })
  } catch (error) {
    console.error("Error fetching users from Firestore:", error)
    throw error
  }
}

// Get user by ID
export async function getFirestoreUserById(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId)
    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
      return null
    }

    const data = snapshot.data()
    return {
      id: snapshot.id,
      email: data.email || "",
      password: "",
      fullName: data.fullName || "",
      phone: data.phone || "",
      role: data.role || "client",
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
      isActive: data.isActive ?? true,
      profileImage: data.profileImage,
    } as User
  } catch (error) {
    console.error("Error fetching user from Firestore:", error)
    throw error
  }
}

// ==================== MIGRATION HELPER ====================

// Migrate local projects to Firestore (one-time operation)
export async function migrateLocalProjectsToFirestore(localProjects: Project[]): Promise<void> {
  try {
    const existingProjects = await getFirestoreProjects()
    const existingIds = new Set(existingProjects.map(p => p.id))

    for (const project of localProjects) {
      // Skip if project already exists in Firestore
      if (existingIds.has(project.id)) {
        continue
      }

      // Create project in Firestore with original ID
      const projectRef = doc(db, COLLECTIONS.PROJECTS, project.id)
      await updateDoc(projectRef, {
        name: project.name,
        description: project.description,
        projectType: project.projectType,
        clientId: project.clientId,
        webDeveloperId: project.webDeveloperId || null,
        socialMediaCoordinatorId: project.socialMediaCoordinatorId || null,
        currentStage: project.currentStage,
        status: project.status,
        websiteUrl: project.websiteUrl || null,
        brand: project.brand || null,
        createdAt: project.createdAt,
        launchDate: project.launchDate || null,
        updatedAt: project.updatedAt,
        notes: project.notes || null,
        projectDate: project.projectDate || null,
        product: project.product || null,
        socialMediaPlatforms: project.socialMediaPlatforms || null,
        campaignGoals: project.campaignGoals || null,
        targetAudience: project.targetAudience || null,
        posts: project.posts || null,
        likes: project.likes || null,
        impressions: project.impressions || null,
        reach: project.reach || null,
        engagement: project.engagement || null,
      }).catch(async () => {
        // If update fails (doc doesn't exist), create it with setDoc
        const { setDoc } = await import("firebase/firestore")
        await setDoc(projectRef, {
          name: project.name,
          description: project.description,
          projectType: project.projectType,
          clientId: project.clientId,
          webDeveloperId: project.webDeveloperId || null,
          socialMediaCoordinatorId: project.socialMediaCoordinatorId || null,
          currentStage: project.currentStage,
          status: project.status,
          websiteUrl: project.websiteUrl || null,
          brand: project.brand || null,
          createdAt: project.createdAt,
          launchDate: project.launchDate || null,
          updatedAt: project.updatedAt,
          notes: project.notes || null,
          projectDate: project.projectDate || null,
          product: project.product || null,
          socialMediaPlatforms: project.socialMediaPlatforms || null,
          campaignGoals: project.campaignGoals || null,
          targetAudience: project.targetAudience || null,
          posts: project.posts || null,
          likes: project.likes || null,
          impressions: project.impressions || null,
          reach: project.reach || null,
          engagement: project.engagement || null,
        })
      })
    }

    console.log("Migration completed successfully")
  } catch (error) {
    console.error("Error migrating projects to Firestore:", error)
    throw error
  }
}

// ==================== SEED DATA ====================

// Seed Firestore with mock projects (one-time operation)
export async function seedFirestoreProjects(mockProjects: Project[]): Promise<number> {
  try {
    const { setDoc } = await import("firebase/firestore")
    let seededCount = 0

    // Check existing projects
    const existingProjects = await getFirestoreProjects()
    const existingIds = new Set(existingProjects.map(p => p.id))

    for (const project of mockProjects) {
      // Skip if project already exists in Firestore
      if (existingIds.has(project.id)) {
        continue
      }

      // Create project in Firestore with original ID
      const projectRef = doc(db, COLLECTIONS.PROJECTS, project.id)
      await setDoc(projectRef, {
        name: project.name,
        description: project.description,
        projectType: project.projectType,
        clientId: project.clientId,
        webDeveloperId: project.webDeveloperId || null,
        socialMediaCoordinatorId: project.socialMediaCoordinatorId || null,
        currentStage: project.currentStage,
        status: project.status,
        websiteUrl: project.websiteUrl || null,
        brand: project.brand || null,
        createdAt: project.createdAt,
        launchDate: project.launchDate || null,
        updatedAt: project.updatedAt,
        notes: project.notes || null,
        projectDate: project.projectDate || null,
        product: project.product || null,
        socialMediaPlatforms: project.socialMediaPlatforms || null,
        campaignGoals: project.campaignGoals || null,
        targetAudience: project.targetAudience || null,
        posts: project.posts || null,
        likes: project.likes || null,
        impressions: project.impressions || null,
        reach: project.reach || null,
        engagement: project.engagement || null,
      })
      seededCount++
    }

    console.log(`Seeded ${seededCount} projects to Firestore`)
    return seededCount
  } catch (error) {
    console.error("Error seeding projects to Firestore:", error)
    throw error
  }
}

// Export utility to check if using Firestore
export { isFirebaseConfigured }
