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
  Timestamp,
  serverTimestamp,
  type DocumentData
} from 'firebase/firestore'
import { db } from './firebase'
import type { Project, Ticket } from '@/types'

// Utility Functions for Timestamp Conversion
export function convertFirestoreDate(timestamp: any): Date {
  if (!timestamp) return new Date()
  if (timestamp instanceof Date) return timestamp
  if (timestamp?.toDate) return timestamp.toDate()
  if (timestamp?.seconds) return new Date(timestamp.seconds * 1000)
  return new Date(timestamp)
}

export function convertToFirestoreDate(date: Date | undefined): Timestamp | undefined {
  if (!date) return undefined
  if (date instanceof Date) return Timestamp.fromDate(date)
  return undefined
}

// ==================== PROJECT OPERATIONS ====================

export async function getFirebaseProjects(): Promise<Project[]> {
  try {
    console.log('📦 Fetching projects from Firestore...')
    const projectsCol = collection(db, 'projects')
    const projectSnapshot = await getDocs(projectsCol)

    const projects: Project[] = projectSnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        projectType: data.projectType,
        clientId: data.clientId,
        webDeveloperId: data.webDeveloperId,
        socialMediaCoordinatorId: data.socialMediaCoordinatorId,
        currentStage: data.currentStage,
        status: data.status,
        websiteUrl: data.websiteUrl,
        brand: data.brand,
        projectDate: data.projectDate ? convertFirestoreDate(data.projectDate) : undefined,
        socialMediaPlatforms: data.socialMediaPlatforms,
        campaignGoals: data.campaignGoals,
        targetAudience: data.targetAudience,
        notes: data.notes,
        createdAt: convertFirestoreDate(data.createdAt),
        updatedAt: convertFirestoreDate(data.updatedAt),
        launchDate: data.launchDate ? convertFirestoreDate(data.launchDate) : undefined,
      } as Project
    })

    console.log(`✅ Fetched ${projects.length} projects from Firestore`)
    return projects
  } catch (error) {
    console.error('❌ Error fetching projects from Firestore:', error)
    return []
  }
}

export async function getFirebaseProjectById(id: string): Promise<Project | null> {
  try {
    console.log(`📦 Fetching project ${id} from Firestore...`)
    const projectDoc = doc(db, 'projects', id)
    const projectSnapshot = await getDoc(projectDoc)

    if (!projectSnapshot.exists()) {
      console.log(`⚠️ Project ${id} not found in Firestore`)
      return null
    }

    const data = projectSnapshot.data() as DocumentData
    const project: Project = {
      id: projectSnapshot.id,
      name: data.name,
      description: data.description,
      projectType: data.projectType,
      clientId: data.clientId,
      webDeveloperId: data.webDeveloperId,
      socialMediaCoordinatorId: data.socialMediaCoordinatorId,
      currentStage: data.currentStage,
      status: data.status,
      websiteUrl: data.websiteUrl,
      socialMediaPlatforms: data.socialMediaPlatforms,
      campaignGoals: data.campaignGoals,
      targetAudience: data.targetAudience,
      notes: data.notes,
      createdAt: convertFirestoreDate(data.createdAt),
      updatedAt: convertFirestoreDate(data.updatedAt),
      launchDate: data.launchDate ? convertFirestoreDate(data.launchDate) : undefined,
    }

    console.log(`✅ Fetched project ${id} from Firestore`)
    return project
  } catch (error) {
    console.error(`❌ Error fetching project ${id} from Firestore:`, error)
    return null
  }
}

export async function createFirebaseProject(
  data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Project> {
  try {
    console.log('📝 Creating project in Firestore...')

    // Generate a custom ID if needed
    const projectsCol = collection(db, 'projects')
    const customId = `proj-${Date.now()}`
    const projectDoc = doc(projectsCol, customId)

    const projectData = {
      name: data.name,
      description: data.description,
      projectType: data.projectType,
      clientId: data.clientId,
      webDeveloperId: data.webDeveloperId || null,
      socialMediaCoordinatorId: data.socialMediaCoordinatorId || null,
       currentStage: data.currentStage,
       status: data.status,
       websiteUrl: data.websiteUrl || null,
       brand: data.brand || null,
       projectDate: data.projectDate ? convertToFirestoreDate(data.projectDate) : null,
       socialMediaPlatforms: data.socialMediaPlatforms || null,
      campaignGoals: data.campaignGoals || null,
      targetAudience: data.targetAudience || null,
      notes: data.notes || null,
      launchDate: data.launchDate ? convertToFirestoreDate(data.launchDate) : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await addDoc(collection(db, 'projects'), projectData)

    // Fetch the created project to return with proper timestamps
    const createdSnapshot = await getDocs(
      query(collection(db, 'projects'), where('name', '==', data.name))
    )

    if (!createdSnapshot.empty) {
      const doc = createdSnapshot.docs[0]
      const docData = doc.data() as DocumentData

      const project: Project = {
        id: doc.id,
        name: docData.name,
        description: docData.description,
        projectType: docData.projectType,
        clientId: docData.clientId,
        webDeveloperId: docData.webDeveloperId,
        socialMediaCoordinatorId: docData.socialMediaCoordinatorId,
         currentStage: docData.currentStage,
         status: docData.status,
         websiteUrl: docData.websiteUrl,
         brand: docData.brand,
         projectDate: docData.projectDate ? convertFirestoreDate(docData.projectDate) : undefined,
         socialMediaPlatforms: docData.socialMediaPlatforms,
        campaignGoals: docData.campaignGoals,
        targetAudience: docData.targetAudience,
        notes: docData.notes,
        createdAt: convertFirestoreDate(docData.createdAt),
        updatedAt: convertFirestoreDate(docData.updatedAt),
        launchDate: docData.launchDate ? convertFirestoreDate(docData.launchDate) : undefined,
      }

      console.log(`✅ Project "${project.name}" created in Firestore with ID: ${project.id}`)
      return project
    }

    // Fallback return if we can't fetch the created project
    throw new Error('Failed to fetch created project')
  } catch (error) {
    console.error('❌ Error creating project in Firestore:', error)
    throw error
  }
}

export async function updateFirebaseProject(
  id: string,
  updates: Partial<Omit<Project, 'id' | 'createdAt'>>
): Promise<Project | null> {
  try {
    console.log(`📝 Updating project ${id} in Firestore...`)
    const projectDoc = doc(db, 'projects', id)

    // Check if project exists
    const projectSnapshot = await getDoc(projectDoc)
    if (!projectSnapshot.exists()) {
      console.log(`⚠️ Project ${id} not found in Firestore`)
      return null
    }

    const updateData: any = { ...updates, updatedAt: serverTimestamp() }

    // Convert Date fields to Timestamps
    if (updates.launchDate) {
      updateData.launchDate = convertToFirestoreDate(updates.launchDate)
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        updateData[key] = null
      }
    })

    await updateDoc(projectDoc, updateData)

    // Fetch updated project
    const updatedProject = await getFirebaseProjectById(id)

    console.log(`✅ Project ${id} updated in Firestore`)
    return updatedProject
  } catch (error) {
    console.error(`❌ Error updating project ${id} in Firestore:`, error)
    return null
  }
}

export async function deleteFirebaseProject(id: string): Promise<boolean> {
  try {
    console.log(`🗑️ Deleting project ${id} from Firestore...`)
    const projectDoc = doc(db, 'projects', id)
    await deleteDoc(projectDoc)

    console.log(`✅ Project ${id} deleted from Firestore`)
    return true
  } catch (error) {
    console.error(`❌ Error deleting project ${id} from Firestore:`, error)
    return false
  }
}

// ==================== TICKET OPERATIONS ====================

export async function getFirebaseTickets(): Promise<Ticket[]> {
  try {
    console.log('🎫 Fetching tickets from Firestore...')
    const ticketsCol = collection(db, 'tickets')
    const ticketSnapshot = await getDocs(ticketsCol)

    const tickets: Ticket[] = ticketSnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData
      return {
        id: doc.id,
        projectId: data.projectId,
        createdBy: data.createdBy,
        assignedTo: data.assignedTo || undefined,
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        status: data.status,
        createdAt: convertFirestoreDate(data.createdAt),
        updatedAt: convertFirestoreDate(data.updatedAt),
        resolvedAt: data.resolvedAt ? convertFirestoreDate(data.resolvedAt) : undefined,
        resolutionNotes: data.resolutionNotes || undefined,
        attachments: data.attachments || undefined,
      } as Ticket
    })

    console.log(`✅ Fetched ${tickets.length} tickets from Firestore`)
    return tickets
  } catch (error) {
    console.error('❌ Error fetching tickets from Firestore:', error)
    return []
  }
}

export async function getFirebaseTicketById(id: string): Promise<Ticket | null> {
  try {
    console.log(`🎫 Fetching ticket ${id} from Firestore...`)
    const ticketDoc = doc(db, 'tickets', id)
    const ticketSnapshot = await getDoc(ticketDoc)

    if (!ticketSnapshot.exists()) {
      console.log(`⚠️ Ticket ${id} not found in Firestore`)
      return null
    }

    const data = ticketSnapshot.data() as DocumentData
    const ticket: Ticket = {
      id: ticketSnapshot.id,
      projectId: data.projectId,
      createdBy: data.createdBy,
      assignedTo: data.assignedTo || undefined,
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority,
      status: data.status,
      createdAt: convertFirestoreDate(data.createdAt),
      updatedAt: convertFirestoreDate(data.updatedAt),
      resolvedAt: data.resolvedAt ? convertFirestoreDate(data.resolvedAt) : undefined,
      resolutionNotes: data.resolutionNotes || undefined,
      attachments: data.attachments || undefined,
    }

    console.log(`✅ Fetched ticket ${id} from Firestore`)
    return ticket
  } catch (error) {
    console.error(`❌ Error fetching ticket ${id} from Firestore:`, error)
    return null
  }
}

export async function getFirebaseTicketsByProjectId(projectId: string): Promise<Ticket[]> {
  try {
    console.log(`🎫 Fetching tickets for project ${projectId} from Firestore...`)
    const ticketsCol = collection(db, 'tickets')
    const q = query(ticketsCol, where('projectId', '==', projectId))
    const ticketSnapshot = await getDocs(q)

    const tickets: Ticket[] = ticketSnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData
      return {
        id: doc.id,
        projectId: data.projectId,
        createdBy: data.createdBy,
        assignedTo: data.assignedTo || undefined,
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        status: data.status,
        createdAt: convertFirestoreDate(data.createdAt),
        updatedAt: convertFirestoreDate(data.updatedAt),
        resolvedAt: data.resolvedAt ? convertFirestoreDate(data.resolvedAt) : undefined,
        resolutionNotes: data.resolutionNotes || undefined,
        attachments: data.attachments || undefined,
      } as Ticket
    })

    console.log(`✅ Fetched ${tickets.length} tickets for project ${projectId}`)
    return tickets
  } catch (error) {
    console.error(`❌ Error fetching tickets for project ${projectId}:`, error)
    return []
  }
}

export async function getFirebaseTicketsByUserId(userId: string, role: string): Promise<Ticket[]> {
  try {
    console.log(`🎫 Fetching tickets for user ${userId} (${role}) from Firestore...`)
    const ticketsCol = collection(db, 'tickets')
    let q

    if (role === 'admin') {
      // Admins see all tickets
      q = query(ticketsCol)
    } else if (role === 'client') {
      // Clients see tickets they created
      q = query(ticketsCol, where('createdBy', '==', userId))
    } else {
      // Developers/coordinators see assigned tickets
      q = query(ticketsCol, where('assignedTo', '==', userId))
    }

    const ticketSnapshot = await getDocs(q)

    const tickets: Ticket[] = ticketSnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData
      return {
        id: doc.id,
        projectId: data.projectId,
        createdBy: data.createdBy,
        assignedTo: data.assignedTo || undefined,
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        status: data.status,
        createdAt: convertFirestoreDate(data.createdAt),
        updatedAt: convertFirestoreDate(data.updatedAt),
        resolvedAt: data.resolvedAt ? convertFirestoreDate(data.resolvedAt) : undefined,
        resolutionNotes: data.resolutionNotes || undefined,
        attachments: data.attachments || undefined,
      } as Ticket
    })

    console.log(`✅ Fetched ${tickets.length} tickets for user ${userId}`)
    return tickets
  } catch (error) {
    console.error(`❌ Error fetching tickets for user ${userId}:`, error)
    return []
  }
}

export async function createFirebaseTicket(
  data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Ticket> {
  try {
    console.log('📝 Creating ticket in Firestore...')

    const ticketData = {
      projectId: data.projectId,
      createdBy: data.createdBy,
      assignedTo: data.assignedTo || null,
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority,
      status: data.status,
      resolvedAt: data.resolvedAt ? convertToFirestoreDate(data.resolvedAt) : null,
      resolutionNotes: data.resolutionNotes || null,
      attachments: data.attachments || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const ticketsCol = collection(db, 'tickets')
    const docRef = await addDoc(ticketsCol, ticketData)

    // Fetch the created ticket
    const createdTicket = await getFirebaseTicketById(docRef.id)

    if (!createdTicket) {
      throw new Error('Failed to fetch created ticket')
    }

    console.log(`✅ Ticket "${createdTicket.title}" created in Firestore with ID: ${createdTicket.id}`)
    return createdTicket
  } catch (error) {
    console.error('❌ Error creating ticket in Firestore:', error)
    throw error
  }
}

export async function updateFirebaseTicket(
  id: string,
  updates: Partial<Omit<Ticket, 'id' | 'createdAt'>>
): Promise<Ticket | null> {
  try {
    console.log(`📝 Updating ticket ${id} in Firestore...`)
    const ticketDoc = doc(db, 'tickets', id)

    // Check if ticket exists
    const ticketSnapshot = await getDoc(ticketDoc)
    if (!ticketSnapshot.exists()) {
      console.log(`⚠️ Ticket ${id} not found in Firestore`)
      return null
    }

    const updateData: any = { ...updates, updatedAt: serverTimestamp() }

    // Convert Date fields to Timestamps
    if (updates.resolvedAt) {
      updateData.resolvedAt = convertToFirestoreDate(updates.resolvedAt)
    }

    // Auto-set resolvedAt if status changes to resolved/closed
    if (updates.status === 'resolved' || updates.status === 'closed') {
      if (!updateData.resolvedAt) {
        updateData.resolvedAt = serverTimestamp()
      }
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        updateData[key] = null
      }
    })

    await updateDoc(ticketDoc, updateData)

    // Fetch updated ticket
    const updatedTicket = await getFirebaseTicketById(id)

    console.log(`✅ Ticket ${id} updated in Firestore`)
    return updatedTicket
  } catch (error) {
    console.error(`❌ Error updating ticket ${id} in Firestore:`, error)
    return null
  }
}

export async function deleteFirebaseTicket(id: string): Promise<boolean> {
  try {
    console.log(`🗑️ Deleting ticket ${id} from Firestore...`)
    const ticketDoc = doc(db, 'tickets', id)
    await deleteDoc(ticketDoc)

    console.log(`✅ Ticket ${id} deleted from Firestore`)
    return true
  } catch (error) {
    console.error(`❌ Error deleting ticket ${id} from Firestore:`, error)
    return false
  }
}
