import type {
  User,
  UserRole,
  Project,
  Ticket,
  Comment,
  Message,
  WebsiteAnalytics,
  SocialMediaAnalytics,
  ProjectStageHistory,
  Activity,
} from "@/types"

// LocalStorage keys
const STORAGE_KEYS = {
  USERS: "marketing_management_website_users",
  PROJECTS: "marketing_management_website_projects",
  TICKETS: "marketing_management_website_tickets",
  COMMENTS: "marketing_management_website_comments",
  MESSAGES: "marketing_management_website_messages",
  WEBSITE_ANALYTICS: "marketing_management_website_website_analytics",
  SOCIAL_ANALYTICS: "marketing_management_website_social_analytics",
  STAGE_HISTORY: "marketing_management_website_stage_history",
  ACTIVITIES: "marketing_management_website_activities",
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "admin@system.com",
    password: "admin123",
    fullName: "Admin User",
    phone: "+27821234567",
    role: "admin",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    isActive: true,
  },
  {
    id: "user-2",
    email: "dev@system.com",
    password: "dev123",
    fullName: "John Developer",
    phone: "+27821234568",
    role: "web_developer",
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-02"),
    isActive: true,
  },
  {
    id: "user-3",
    email: "jane.dev@system.com",
    password: "dev123",
    fullName: "Jane Smith",
    phone: "+27821234569",
    role: "web_developer",
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-02"),
    isActive: true,
  },
  {
    id: "user-4",
    email: "social@system.com",
    password: "social123",
    fullName: "Sarah Cohen",
    phone: "+27821234570",
    role: "social_media_coordinator",
    createdAt: new Date("2025-01-03"),
    updatedAt: new Date("2025-01-03"),
    isActive: true,
  },
  {
    id: "user-5",
    email: "client@system.com",
    password: "client123",
    fullName: "Michael Client",
    phone: "+27821234571",
    role: "client",
    createdAt: new Date("2025-01-04"),
    updatedAt: new Date("2025-01-04"),
    isActive: true,
  },
  {
    id: "user-6",
    email: "client2@company.com",
    password: "client123",
    fullName: "Emma Business",
    phone: "+27821234572",
    role: "client",
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-05"),
    isActive: true,
  },
]

// Mock Projects - SpecCon Websites
export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "SpecCon",
    description: "Main SpecCon corporate website - showcasing our services and portfolio",
    projectType: "website",
    clientId: "user-5",
    webDeveloperId: "user-2",
    socialMediaCoordinatorId: "user-4",
    currentStage: "maintenance",
    status: "active",
    websiteUrl: "https://speccon.co.za",
    googleAnalyticsPropertyId: "G-XXXXXXXXXX",
    googleAnalyticsViewId: "123456789",
    createdAt: new Date("2024-06-01"),
    launchDate: new Date("2024-08-15"),
    updatedAt: new Date("2025-02-08"),
  },
  {
    id: "proj-2",
    name: "Andebe",
    description: "Andebe Skills Development & Training platform",
    projectType: "website",
    clientId: "user-5",
    webDeveloperId: "user-2",
    socialMediaCoordinatorId: "user-4",
    currentStage: "development",
    status: "active",
    websiteUrl: "https://andebe.co.za",
    googleAnalyticsPropertyId: "G-YYYYYYYYYY",
    googleAnalyticsViewId: "987654321",
    createdAt: new Date("2024-09-15"),
    updatedAt: new Date("2025-02-09"),
  },
  {
    id: "proj-3",
    name: "Megrolowveld",
    description: "Megrolowveld business and services website",
    projectType: "website",
    clientId: "user-6",
    webDeveloperId: "user-3",
    socialMediaCoordinatorId: "user-4",
    currentStage: "testing",
    status: "active",
    websiteUrl: "https://megrolowveld.co.za",
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2025-02-05"),
  },
  {
    id: "proj-4",
    name: "Skills Development Facilitation",
    description: "Skills development facilitation and training coordination platform",
    projectType: "website",
    clientId: "user-5",
    webDeveloperId: "user-2",
    currentStage: "design",
    status: "active",
    createdAt: new Date("2024-11-20"),
    updatedAt: new Date("2025-02-08"),
  },
  {
    id: "proj-5",
    name: "InfinityNPO",
    description: "Infinity NPO - Non-profit organization website for community development",
    projectType: "website",
    clientId: "user-6",
    webDeveloperId: "user-3",
    socialMediaCoordinatorId: "user-4",
    currentStage: "launch",
    status: "active",
    websiteUrl: "https://infinitynpo.co.za",
    createdAt: new Date("2024-08-10"),
    launchDate: new Date("2024-12-01"),
    updatedAt: new Date("2025-02-06"),
  },
  {
    id: "proj-6",
    name: "InfinityLearn",
    description: "InfinityLearn e-learning platform for online education and training",
    projectType: "website",
    clientId: "user-5",
    webDeveloperId: "user-2",
    socialMediaCoordinatorId: "user-4",
    currentStage: "development",
    status: "active",
    websiteUrl: "https://infinitylearn.co.za",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2025-02-09"),
  },
  {
    id: "proj-7",
    name: "Elearning",
    description: "General e-learning platform with course management and student tracking",
    projectType: "website",
    clientId: "user-6",
    webDeveloperId: "user-3",
    currentStage: "development",
    status: "active",
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2025-02-08"),
  },
  {
    id: "proj-8",
    name: "TAP",
    description: "Training and Assessment Platform for skills development",
    projectType: "website",
    clientId: "user-5",
    webDeveloperId: "user-2",
    socialMediaCoordinatorId: "user-4",
    currentStage: "testing",
    status: "active",
    websiteUrl: "https://tap.co.za",
    createdAt: new Date("2024-07-20"),
    updatedAt: new Date("2025-02-07"),
  },
  {
    id: "proj-9",
    name: "LMS",
    description: "Learning Management System for comprehensive training programs",
    projectType: "website",
    clientId: "user-6",
    webDeveloperId: "user-3",
    socialMediaCoordinatorId: "user-4",
    currentStage: "launch",
    status: "active",
    websiteUrl: "https://lms.speccon.co.za",
    createdAt: new Date("2024-05-15"),
    launchDate: new Date("2024-11-01"),
    updatedAt: new Date("2025-02-05"),
  },
  {
    id: "proj-10",
    name: "Venueideas",
    description: "Wedding and event venue booking and discovery platform",
    projectType: "website",
    clientId: "user-5",
    webDeveloperId: "user-2",
    currentStage: "planning",
    status: "active",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-02-08"),
  },
  {
    id: "proj-11",
    name: "Weddingideas",
    description: "Complete wedding planning resource and vendor directory",
    projectType: "website",
    clientId: "user-6",
    webDeveloperId: "user-3",
    socialMediaCoordinatorId: "user-4",
    currentStage: "design",
    status: "active",
    createdAt: new Date("2024-12-05"),
    updatedAt: new Date("2025-02-06"),
  },
  {
    id: "proj-12",
    name: "Workreadiness",
    description: "Work readiness training and assessment platform for job seekers",
    projectType: "website",
    clientId: "user-5",
    webDeveloperId: "user-2",
    socialMediaCoordinatorId: "user-4",
    currentStage: "development",
    status: "active",
    websiteUrl: "https://workreadiness.co.za",
    createdAt: new Date("2024-08-25"),
    updatedAt: new Date("2025-02-09"),
  },
  {
    id: "proj-13",
    name: "Specconacademy",
    description: "SpecCon Academy - comprehensive training academy platform",
    projectType: "website",
    clientId: "user-6",
    webDeveloperId: "user-3",
    currentStage: "testing",
    status: "active",
    websiteUrl: "https://specconacademy.co.za",
    createdAt: new Date("2024-07-10"),
    updatedAt: new Date("2025-02-07"),
  },
  {
    id: "proj-14",
    name: "Trouidees",
    description: "Wedding ideas and planning inspiration platform (Afrikaans)",
    projectType: "website",
    clientId: "user-5",
    webDeveloperId: "user-2",
    socialMediaCoordinatorId: "user-4",
    currentStage: "design",
    status: "active",
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-02-08"),
  },
  {
    id: "proj-15",
    name: "Employment Equity Act",
    description: "Employment Equity Act compliance and reporting platform",
    projectType: "website",
    clientId: "user-6",
    webDeveloperId: "user-3",
    currentStage: "planning",
    status: "active",
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-02-05"),
  },
  {
    id: "proj-16",
    name: "Leeromtelees",
    description: "Afrikaans educational platform for reading and learning",
    projectType: "website",
    clientId: "user-5",
    webDeveloperId: "user-2",
    socialMediaCoordinatorId: "user-4",
    currentStage: "development",
    status: "active",
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2025-02-09"),
  },
  {
    id: "proj-17",
    name: "Grade.co.za",
    description: "Grade tracking and academic performance management system",
    projectType: "website",
    clientId: "user-6",
    webDeveloperId: "user-3",
    socialMediaCoordinatorId: "user-4",
    currentStage: "testing",
    status: "active",
    websiteUrl: "https://grade.co.za",
    createdAt: new Date("2024-09-20"),
    updatedAt: new Date("2025-02-08"),
  },
  {
    id: "proj-18",
    name: "SpecCon Buddies Primary Schools",
    description: "Primary school support and buddy system platform",
    projectType: "website",
    clientId: "user-5",
    webDeveloperId: "user-2",
    currentStage: "launch",
    status: "active",
    websiteUrl: "https://buddies.speccon.co.za",
    createdAt: new Date("2024-06-15"),
    launchDate: new Date("2024-10-20"),
    updatedAt: new Date("2025-02-06"),
  },
  {
    id: "proj-19",
    name: "Coloring",
    description: "Interactive coloring and creative activities platform for children",
    projectType: "website",
    clientId: "user-6",
    webDeveloperId: "user-3",
    socialMediaCoordinatorId: "user-4",
    currentStage: "development",
    status: "active",
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2025-02-09"),
  },
  {
    id: "proj-20",
    name: "Classrooms",
    description: "Virtual classroom management and online teaching platform",
    projectType: "website",
    clientId: "user-5",
    webDeveloperId: "user-2",
    socialMediaCoordinatorId: "user-4",
    currentStage: "testing",
    status: "active",
    websiteUrl: "https://classrooms.speccon.co.za",
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2025-02-07"),
  },
  // Social Media Projects
  {
    id: "proj-21",
    name: "SpecCon Social Media Campaign Q1 2025",
    description: "Comprehensive social media strategy for SpecCon brand awareness and lead generation",
    projectType: "social_media",
    clientId: "user-5",
    socialMediaCoordinatorId: "user-4",
    currentStage: "launch",
    status: "active",
    socialMediaPlatforms: ["facebook", "instagram", "linkedin", "twitter"],
    campaignGoals: "Increase brand awareness by 40%, generate 200+ qualified leads, boost engagement rate to 8%",
    targetAudience: "Business owners, HR managers, training coordinators in South Africa",
    createdAt: new Date("2024-12-15"),
    launchDate: new Date("2025-01-01"),
    updatedAt: new Date("2025-02-09"),
    notes: "Focus on skills development and training services",
  },
  {
    id: "proj-22",
    name: "InfinityNPO Community Outreach",
    description: "Social media campaign to raise awareness for community development initiatives",
    projectType: "social_media",
    clientId: "user-6",
    socialMediaCoordinatorId: "user-4",
    currentStage: "maintenance",
    status: "active",
    socialMediaPlatforms: ["facebook", "instagram", "twitter"],
    campaignGoals: "Increase volunteer sign-ups by 50%, raise R100k in donations, reach 50k people monthly",
    targetAudience: "Community members, potential donors, volunteers aged 25-55",
    createdAt: new Date("2024-11-20"),
    launchDate: new Date("2024-12-01"),
    updatedAt: new Date("2025-02-08"),
  },
  {
    id: "proj-23",
    name: "Wedding Ideas Influencer Campaign",
    description: "Influencer partnership campaign for wedding and venue booking platform",
    projectType: "social_media",
    clientId: "user-5",
    socialMediaCoordinatorId: "user-4",
    currentStage: "planning",
    status: "active",
    socialMediaPlatforms: ["instagram", "tiktok", "facebook"],
    campaignGoals: "Partner with 20 wedding influencers, reach 500k engaged couples, drive 10k website visits",
    targetAudience: "Engaged couples aged 24-35, wedding planners, event coordinators",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-02-09"),
  },
  {
    id: "proj-24",
    name: "Andebe Skills Development Launch",
    description: "Product launch campaign for new online training platform",
    projectType: "social_media",
    clientId: "user-5",
    socialMediaCoordinatorId: "user-4",
    currentStage: "development",
    status: "active",
    socialMediaPlatforms: ["linkedin", "facebook", "youtube"],
    campaignGoals: "Generate 500 course enrollments, establish thought leadership, reach 100k professionals",
    targetAudience: "Working professionals, career changers, recent graduates seeking upskilling",
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-02-08"),
  },
  {
    id: "proj-25",
    name: "Educational Content Series - Grade.co.za",
    description: "Educational social media content to promote academic tracking platform",
    projectType: "social_media",
    clientId: "user-6",
    socialMediaCoordinatorId: "user-4",
    currentStage: "launch",
    status: "active",
    socialMediaPlatforms: ["facebook", "instagram", "twitter"],
    campaignGoals: "Engage 5k parents, increase app downloads by 200%, position as education leader",
    targetAudience: "Parents of school-aged children, teachers, education administrators",
    createdAt: new Date("2024-12-01"),
    launchDate: new Date("2025-01-15"),
    updatedAt: new Date("2025-02-07"),
  },
]

// Mock Tickets
export const mockTickets: Ticket[] = [
  {
    id: "ticket-1",
    projectId: "proj-1",
    createdBy: "user-5",
    assignedTo: "user-2",
    title: "Update homepage hero image",
    description: "The current hero image needs to be replaced with the new brand imagery provided in the project assets folder.",
    type: "content_change",
    priority: "medium",
    status: "in_progress",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-08"),
  },
  {
    id: "ticket-2",
    projectId: "proj-1",
    createdBy: "user-5",
    assignedTo: "user-2",
    title: "Fix mobile navigation menu",
    description: "The hamburger menu on mobile devices is not opening correctly. It seems to be a JavaScript issue.",
    type: "bug_report",
    priority: "high",
    status: "open",
    createdAt: new Date("2025-02-07"),
    updatedAt: new Date("2025-02-07"),
  },
  {
    id: "ticket-3",
    projectId: "proj-2",
    createdBy: "user-6",
    assignedTo: "user-3",
    title: "Add product filtering functionality",
    description: "Users should be able to filter products by category, price range, and availability.",
    type: "feature_request",
    priority: "high",
    status: "in_progress",
    createdAt: new Date("2025-02-03"),
    updatedAt: new Date("2025-02-09"),
  },
  {
    id: "ticket-4",
    projectId: "proj-2",
    createdBy: "user-6",
    assignedTo: "user-3",
    title: "Update product descriptions",
    description: "Need to update all product descriptions with the new copywriting provided by the marketing team.",
    type: "content_change",
    priority: "low",
    status: "resolved",
    createdAt: new Date("2025-01-28"),
    updatedAt: new Date("2025-02-05"),
    resolvedAt: new Date("2025-02-05"),
  },
  {
    id: "ticket-5",
    projectId: "proj-3",
    createdBy: "user-5",
    assignedTo: "user-2",
    title: "Redesign contact form",
    description: "The contact form needs a visual redesign to match the new brand guidelines.",
    type: "design_update",
    priority: "medium",
    status: "resolved",
    createdAt: new Date("2025-01-25"),
    updatedAt: new Date("2025-02-02"),
    resolvedAt: new Date("2025-02-02"),
  },
  {
    id: "ticket-6",
    projectId: "proj-1",
    createdBy: "user-2",
    assignedTo: "user-2",
    title: "Optimize page load speed",
    description: "Homepage is loading slowly. Need to optimize images and lazy load components.",
    type: "bug_report",
    priority: "high",
    status: "open",
    createdAt: new Date("2025-02-08"),
    updatedAt: new Date("2025-02-08"),
  },
  {
    id: "ticket-7",
    projectId: "proj-4",
    createdBy: "user-6",
    title: "Add email notification system",
    description: "Customers should receive email confirmations when they make a reservation.",
    type: "feature_request",
    priority: "critical",
    status: "open",
    createdAt: new Date("2025-02-09"),
    updatedAt: new Date("2025-02-09"),
  },
  {
    id: "ticket-8",
    projectId: "proj-2",
    createdBy: "user-6",
    assignedTo: "user-3",
    title: "Shopping cart calculation error",
    description: "The shopping cart is not calculating the total correctly when discount codes are applied.",
    type: "bug_report",
    priority: "critical",
    status: "in_progress",
    createdAt: new Date("2025-02-08"),
    updatedAt: new Date("2025-02-09"),
  },
  {
    id: "ticket-9",
    projectId: "proj-3",
    createdBy: "user-5",
    assignedTo: "user-2",
    title: "Update team member bios",
    description: "Need to add two new team members to the About page and update existing bios.",
    type: "content_change",
    priority: "low",
    status: "closed",
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-28"),
    resolvedAt: new Date("2025-01-28"),
  },
  {
    id: "ticket-10",
    projectId: "proj-5",
    createdBy: "user-5",
    assignedTo: "user-2",
    title: "SEO meta tags optimization",
    description: "Update meta descriptions and keywords for better search engine visibility.",
    type: "content_change",
    priority: "medium",
    status: "resolved",
    createdAt: new Date("2025-01-30"),
    updatedAt: new Date("2025-02-04"),
    resolvedAt: new Date("2025-02-04"),
  },
]

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: "comment-1",
    ticketId: "ticket-1",
    userId: "user-2",
    content: "I've started working on this. The new image has been uploaded and I'm testing it across different screen sizes.",
    createdAt: new Date("2025-02-08T10:30:00"),
    updatedAt: new Date("2025-02-08T10:30:00"),
    isEdited: false,
  },
  {
    id: "comment-2",
    ticketId: "ticket-1",
    userId: "user-5",
    content: "Great! Could you also ensure the image is optimized for mobile devices?",
    createdAt: new Date("2025-02-08T11:15:00"),
    updatedAt: new Date("2025-02-08T11:15:00"),
    isEdited: false,
  },
  {
    id: "comment-3",
    ticketId: "ticket-3",
    userId: "user-3",
    content: "I've implemented the category filtering. Working on price range filtering now.",
    createdAt: new Date("2025-02-09T09:00:00"),
    updatedAt: new Date("2025-02-09T09:00:00"),
    isEdited: false,
  },
  {
    id: "comment-4",
    ticketId: "ticket-8",
    userId: "user-3",
    content: "Found the issue! The discount calculation was not accounting for tax. Fixing it now.",
    createdAt: new Date("2025-02-09T14:20:00"),
    updatedAt: new Date("2025-02-09T14:20:00"),
    isEdited: false,
  },
]

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: "message-1",
    senderId: "user-1", // Admin
    recipientId: "user-2", // John Developer
    subject: "Project Priority Update",
    content: "Hi John, I've updated the priority for the SpecCon project. Please focus on the mobile navigation fixes first as they're impacting user experience significantly.",
    isRead: false,
    isBroadcast: false,
    projectId: "proj-1",
    createdAt: new Date("2025-02-09T08:00:00"),
    updatedAt: new Date("2025-02-09T08:00:00"),
  },
  {
    id: "message-2",
    senderId: "user-4", // Sarah Cohen (Social Media Coordinator)
    recipientId: "user-1", // Admin
    subject: "Social Media Campaign Performance",
    content: "The Q1 social media campaign is performing well. We've exceeded engagement targets by 25%. Should we allocate additional budget for boosted posts?",
    isRead: true,
    isBroadcast: false,
    projectId: "proj-21",
    createdAt: new Date("2025-02-08T14:30:00"),
    updatedAt: new Date("2025-02-08T14:30:00"),
  },
  {
    id: "message-3",
    senderId: "user-5", // Michael Client
    recipientId: "user-3", // Jane Smith
    subject: "Andebe Platform Requirements",
    content: "For the Andebe platform, we need to ensure all training modules include progress tracking and certificate generation. The client wants this to be mandatory for all courses.",
    isRead: false,
    isBroadcast: false,
    projectId: "proj-2",
    createdAt: new Date("2025-02-09T10:15:00"),
    updatedAt: new Date("2025-02-09T10:15:00"),
  },
  {
    id: "message-4",
    senderId: "user-1", // Admin
    recipientId: undefined, // Broadcast to all
    subject: "System Maintenance Notice",
    content: "Heads up team! We'll be performing system maintenance this Friday from 10 PM to 12 AM SAST. All services will be temporarily unavailable. Please save your work before then.",
    isRead: false,
    isBroadcast: true,
    createdAt: new Date("2025-02-07T16:00:00"),
    updatedAt: new Date("2025-02-07T16:00:00"),
  },
  {
    id: "message-5",
    senderId: "user-2", // John Developer
    recipientId: "user-4", // Sarah Cohen
    subject: "Website Launch Coordination",
    content: "Sarah, the InfinityNPO website is ready for launch. Can we coordinate the social media posts to go live simultaneously with the website deployment?",
    isRead: true,
    isBroadcast: false,
    projectId: "proj-5",
    createdAt: new Date("2025-02-08T11:45:00"),
    updatedAt: new Date("2025-02-08T11:45:00"),
  },
  {
    id: "message-6",
    senderId: "user-6", // Emma Business
    recipientId: "user-1", // Admin
    subject: "New Project Timeline",
    content: "I've reviewed the proposed timeline for the Venueideas platform. The 3-month timeline seems aggressive. Can we extend it to 4 months to ensure quality?",
    isRead: false,
    isBroadcast: false,
    projectId: "proj-10",
    createdAt: new Date("2025-02-09T13:20:00"),
    updatedAt: new Date("2025-02-09T13:20:00"),
  },
  {
    id: "message-7",
    senderId: "user-3", // Jane Smith
    recipientId: "user-5", // Michael Client
    subject: "Design Feedback Request",
    content: "Michael, I've completed the initial design mockups for the Megrolowveld website. Could you please review them and let me know your thoughts on the color scheme and layout?",
    isRead: true,
    isBroadcast: false,
    projectId: "proj-3",
    createdAt: new Date("2025-02-08T09:30:00"),
    updatedAt: new Date("2025-02-08T09:30:00"),
  },
]

// Mock Website Analytics
export const mockWebsiteAnalytics: WebsiteAnalytics[] = [
  {
    id: "analytics-1",
    projectId: "proj-1",
    date: new Date("2025-02-01"),
    pageViews: 1250,
    uniqueVisitors: 890,
    bounceRate: 42.5,
    recordedBy: "user-2",
    createdAt: new Date("2025-02-02"),
  },
  {
    id: "analytics-2",
    projectId: "proj-1",
    date: new Date("2025-02-08"),
    pageViews: 1580,
    uniqueVisitors: 1120,
    bounceRate: 38.2,
    recordedBy: "user-2",
    createdAt: new Date("2025-02-09"),
  },
  {
    id: "analytics-3",
    projectId: "proj-3",
    date: new Date("2025-02-01"),
    pageViews: 2340,
    uniqueVisitors: 1650,
    bounceRate: 35.8,
    recordedBy: "user-2",
    createdAt: new Date("2025-02-02"),
  },
  {
    id: "analytics-4",
    projectId: "proj-3",
    date: new Date("2025-02-08"),
    pageViews: 2890,
    uniqueVisitors: 2010,
    bounceRate: 33.1,
    recordedBy: "user-2",
    createdAt: new Date("2025-02-09"),
  },
]

// Mock Social Media Analytics
export const mockSocialMediaAnalytics: SocialMediaAnalytics[] = [
  {
    id: "social-1",
    projectId: "proj-1",
    platform: "facebook",
    date: new Date("2025-02-01"),
    posts: 5,
    engagement: 342,
    reach: 4500,
    followers: 2300,
    likes: 280,
    comments: 42,
    shares: 20,
    recordedBy: "user-4",
    createdAt: new Date("2025-02-02"),
  },
  {
    id: "social-2",
    projectId: "proj-1",
    platform: "instagram",
    date: new Date("2025-02-01"),
    posts: 7,
    engagement: 589,
    reach: 6200,
    followers: 3100,
    likes: 520,
    comments: 69,
    recordedBy: "user-4",
    createdAt: new Date("2025-02-02"),
  },
  {
    id: "social-3",
    projectId: "proj-3",
    platform: "linkedin",
    date: new Date("2025-02-01"),
    posts: 3,
    engagement: 156,
    reach: 2800,
    followers: 980,
    likes: 120,
    comments: 36,
    recordedBy: "user-4",
    createdAt: new Date("2025-02-02"),
  },
  {
    id: "social-4",
    projectId: "proj-2",
    platform: "twitter",
    date: new Date("2025-02-05"),
    posts: 8,
    engagement: 421,
    reach: 5100,
    followers: 1850,
    likes: 340,
    comments: 51,
    shares: 30,
    recordedBy: "user-4",
    createdAt: new Date("2025-02-06"),
  },
]

// Mock Project Stage History
export const mockStageHistory: ProjectStageHistory[] = [
  {
    id: "stage-1",
    projectId: "proj-1",
    stage: "planning",
    startDate: new Date("2025-01-15"),
    endDate: new Date("2025-01-22"),
    status: "completed",
    completedBy: "user-2",
  },
  {
    id: "stage-2",
    projectId: "proj-1",
    stage: "design",
    startDate: new Date("2025-01-22"),
    endDate: new Date("2025-01-29"),
    status: "completed",
    completedBy: "user-2",
  },
  {
    id: "stage-3",
    projectId: "proj-1",
    stage: "development",
    startDate: new Date("2025-01-29"),
    status: "in_progress",
  },
]

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: "activity-1",
    userId: "user-2",
    projectId: "proj-1",
    action: "ticket_updated",
    description: "Updated ticket status to In Progress for 'Update homepage hero image'",
    createdAt: new Date("2025-02-08T10:30:00"),
  },
  {
    id: "activity-2",
    userId: "user-6",
    projectId: "proj-2",
    action: "ticket_created",
    description: "Created new ticket 'Shopping cart calculation error'",
    createdAt: new Date("2025-02-08T14:20:00"),
  },
  {
    id: "activity-3",
    userId: "user-4",
    projectId: "proj-1",
    action: "analytics_added",
    description: "Added social media analytics for Facebook",
    createdAt: new Date("2025-02-09T09:00:00"),
  },
  {
    id: "activity-4",
    userId: "user-3",
    projectId: "proj-2",
    action: "stage_updated",
    description: "Moved project to Testing stage",
    createdAt: new Date("2025-02-05T16:45:00"),
  },
]

// LocalStorage utility functions
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    return defaultValue
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

export function clearStorage(): void {
  if (typeof window === "undefined") return
  Object.values(STORAGE_KEYS).forEach((key) => {
    window.localStorage.removeItem(key)
  })
}

// Initialize mock data in localStorage
export function initializeMockData(): void {
  saveToStorage(STORAGE_KEYS.USERS, mockUsers)
  saveToStorage(STORAGE_KEYS.PROJECTS, mockProjects)
  saveToStorage(STORAGE_KEYS.TICKETS, mockTickets)
  saveToStorage(STORAGE_KEYS.COMMENTS, mockComments)
  saveToStorage(STORAGE_KEYS.MESSAGES, mockMessages)
  saveToStorage(STORAGE_KEYS.WEBSITE_ANALYTICS, mockWebsiteAnalytics)
  saveToStorage(STORAGE_KEYS.SOCIAL_ANALYTICS, mockSocialMediaAnalytics)
  saveToStorage(STORAGE_KEYS.STAGE_HISTORY, mockStageHistory)
  saveToStorage(STORAGE_KEYS.ACTIVITIES, mockActivities)
}

// Data access functions
export function getUsers(): User[] {
  return loadFromStorage(STORAGE_KEYS.USERS, mockUsers)
}

export function updateUser(userId: string, updates: Partial<User>): void {
  const currentUsers = getUsers()
  const updatedUsers = currentUsers.map(user =>
    user.id === userId ? { ...user, ...updates, updatedAt: new Date() } : user
  )
  saveToStorage(STORAGE_KEYS.USERS, updatedUsers)
}

export function toggleUserActive(userId: string): void {
  const currentUsers = getUsers()
  const updatedUsers = currentUsers.map(user =>
    user.id === userId ? { ...user, isActive: !user.isActive, updatedAt: new Date() } : user
  )
  saveToStorage(STORAGE_KEYS.USERS, updatedUsers)
}

export function getProjects(): Project[] {
  const projects = loadFromStorage(STORAGE_KEYS.PROJECTS, mockProjects)
  // If no projects in storage, initialize with mock data
  if (projects.length === 0) {
    saveToStorage(STORAGE_KEYS.PROJECTS, mockProjects)
    return mockProjects
  }
  return projects
}

export function getTickets(): Ticket[] {
  return loadFromStorage(STORAGE_KEYS.TICKETS, mockTickets)
}

export function addTicket(ticket: Ticket): void {
  const currentTickets = getTickets()
  const updatedTickets = [...currentTickets, ticket]
  saveToStorage(STORAGE_KEYS.TICKETS, updatedTickets)
}

export function updateTicket(ticketId: string, updates: Partial<Ticket>): void {
  const currentTickets = getTickets()
  const ticket = currentTickets.find(t => t.id === ticketId)
  if (!ticket) return

  const wasAssigned = ticket.assignedTo
  const newAssigned = updates.assignedTo

  const updatedTickets = currentTickets.map(t =>
    t.id === ticketId ? { ...t, ...updates, updatedAt: new Date() } : t
  )
  saveToStorage(STORAGE_KEYS.TICKETS, updatedTickets)

  // Send notification if assignment changed
  if (newAssigned && newAssigned !== wasAssigned) {
    const assignedUser = getUserById(newAssigned)
    if (assignedUser) {
      const notification: Message = {
        id: `message-${Date.now()}`,
        senderId: "system",
        recipientId: newAssigned,
        subject: "New Ticket Assigned",
        content: `You have been assigned a new ticket: "${ticket.title}". Please check your tickets.`,
        isRead: false,
        isBroadcast: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const currentMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || "[]")
      currentMessages.push(notification)
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(currentMessages))
    }
  }

  // Set resolvedAt when status changes to resolved
  if (updates.status === "resolved" && ticket.status !== "resolved") {
    updates.resolvedAt = new Date()

    // Notify the ticket creator (client)
    const creator = getUserById(ticket.createdBy)
    if (creator && creator.role === "client") {
      const notification: Message = {
        id: `message-${Date.now()}`,
        senderId: "system",
        recipientId: ticket.createdBy,
        subject: "Ticket Resolved",
        content: `Your ticket "${ticket.title}" has been resolved. Please review the changes.`,
        isRead: false,
        isBroadcast: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const currentMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || "[]")
      currentMessages.push(notification)
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(currentMessages))
    }

    // Notify all admins
    const admins = getUsers().filter(u => u.role === "admin")
    admins.forEach(admin => {
      const adminNotification: Message = {
        id: `message-${Date.now()}-admin-${admin.id}`,
        senderId: "system",
        recipientId: admin.id,
        subject: "Ticket Resolved",
        content: `Ticket "${ticket.title}" has been marked as resolved.`,
        isRead: false,
        isBroadcast: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const currentMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || "[]")
      currentMessages.push(adminNotification)
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(currentMessages))
    })
  }
}

export function addUser(user: User): void {
  const currentUsers = getUsers()
  const updatedUsers = [...currentUsers, user]
  saveToStorage(STORAGE_KEYS.USERS, updatedUsers)
}

export function getComments(): Comment[] {
  return loadFromStorage(STORAGE_KEYS.COMMENTS, mockComments)
}

export function getMessages(): Message[] {
  return loadFromStorage(STORAGE_KEYS.MESSAGES, mockMessages)
}

export function getWebsiteAnalytics(): WebsiteAnalytics[] {
  return loadFromStorage(STORAGE_KEYS.WEBSITE_ANALYTICS, mockWebsiteAnalytics)
}

export function getSocialMediaAnalytics(): SocialMediaAnalytics[] {
  return loadFromStorage(STORAGE_KEYS.SOCIAL_ANALYTICS, mockSocialMediaAnalytics)
}

export function addSocialMediaAnalytics(analytics: SocialMediaAnalytics): void {
  const currentAnalytics = getSocialMediaAnalytics()
  const updatedAnalytics = [...currentAnalytics, analytics]
  saveToStorage(STORAGE_KEYS.SOCIAL_ANALYTICS, updatedAnalytics)
}

export function getStageHistory(): ProjectStageHistory[] {
  return loadFromStorage(STORAGE_KEYS.STAGE_HISTORY, mockStageHistory)
}

export function getActivities(): Activity[] {
  return loadFromStorage(STORAGE_KEYS.ACTIVITIES, mockActivities)
}

// Finder functions
export function getUserById(id: string): User | undefined {
  return getUsers().find((user) => user.id === id)
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find((project) => project.id === id)
}

export function getTicketById(id: string): Ticket | undefined {
  return getTickets().find((ticket) => ticket.id === id)
}

export function getProjectsByUserId(userId: string, role: string): Project[] {
  const projects = getProjects()
  if (role === "admin") return projects
  if (role === "web_developer") return projects.filter((p) => p.webDeveloperId === userId)
  if (role === "social_media_coordinator") return projects.filter((p) => p.socialMediaCoordinatorId === userId)
  if (role === "client") return projects.filter((p) => p.clientId === userId)
  return []
}

export function getTicketsByProjectId(projectId: string): Ticket[] {
  return getTickets().filter((ticket) => ticket.projectId === projectId)
}

export function getTicketsByUserId(userId: string, role: string): Ticket[] {
  const tickets = getTickets()
  if (role === "admin") return tickets
  if (role === "web_developer") return tickets.filter((t) => t.assignedTo === userId)
  if (role === "client") return tickets.filter((t) => t.createdBy === userId)
  if (role === "social_media_coordinator") {
    const userProjects = getProjectsByUserId(userId, role)
    const projectIds = userProjects.map((p) => p.id)
    return tickets.filter((t) => projectIds.includes(t.projectId))
  }
  return []
}

export function getCommentsByTicketId(ticketId: string): Comment[] {
  return getComments().filter((comment) => comment.ticketId === ticketId)
}

export function getMessagesByUserId(userId: string): Message[] {
  return getMessages().filter((message) =>
    message.senderId === userId ||
    message.recipientId === userId ||
    message.isBroadcast
  )
}

export function getUnreadMessagesByUserId(userId: string): Message[] {
  return getMessagesByUserId(userId).filter((message) =>
    !message.isRead && (message.recipientId === userId || message.isBroadcast)
  )
}

export function markMessageAsRead(messageId: string): void {
  const messages = getMessages()
  const updatedMessages = messages.map(message =>
    message.id === messageId ? { ...message, isRead: true, updatedAt: new Date() } : message
  )
  saveToStorage(STORAGE_KEYS.MESSAGES, updatedMessages)
}

export function deleteMessage(messageId: string): boolean {
  const messages = getMessages()
  const filteredMessages = messages.filter(message => message.id !== messageId)
  if (filteredMessages.length < messages.length) {
    saveToStorage(STORAGE_KEYS.MESSAGES, filteredMessages)
    return true
  }
  return false
}

export function addMessage(message: Message): void {
  const currentMessages = getMessages()
  const updatedMessages = [...currentMessages, message]
  saveToStorage(STORAGE_KEYS.MESSAGES, updatedMessages)
}

export function getAnalyticsByProjectId(projectId: string): {
  website: WebsiteAnalytics[]
  social: SocialMediaAnalytics[]
} {
  return {
    website: getWebsiteAnalytics().filter((a) => a.projectId === projectId),
    social: getSocialMediaAnalytics().filter((a) => a.projectId === projectId),
  }
}

export function getStageHistoryByProjectId(projectId: string): ProjectStageHistory[] {
  return getStageHistory().filter((stage) => stage.projectId === projectId)
}

export function getActivitiesByProjectId(projectId: string): Activity[] {
  return getActivities().filter((activity) => activity.projectId === projectId)
}

// User Management Functions
export function createUser(userData: {
  email: string
  password: string
  fullName: string
  phone: string
  role: UserRole
  isActive: boolean
}): User {
  const users = getUsers()

  // Check if email already exists
  if (users.some((u) => u.email === userData.email)) {
    throw new Error("User with this email already exists")
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    email: userData.email,
    password: userData.password,
    fullName: userData.fullName,
    phone: userData.phone,
    role: userData.role,
    isActive: userData.isActive,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  users.push(newUser)
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  return newUser
}



export function deleteUser(userId: string): boolean {
  const users = getUsers()
  const filteredUsers = users.filter((u) => u.id !== userId)

  if (filteredUsers.length === users.length) {
    return false // User not found
  }

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers))
  return true
}

// Project Management Functions
export function createProject(projectData: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
  const projects = getProjects()

  const newProject: Project = {
    ...projectData,
    id: `proj-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  projects.push(newProject)
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
  return newProject
}

export function updateProject(
  projectId: string,
  updates: Partial<Omit<Project, "id" | "createdAt">>
): Project | null {
  const projects = getProjects()
  const projectIndex = projects.findIndex((p) => p.id === projectId)

  if (projectIndex === -1) {
    return null
  }

  projects[projectIndex] = {
    ...projects[projectIndex],
    ...updates,
    updatedAt: new Date(),
  }

  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
  return projects[projectIndex]
}

export function deleteProject(projectId: string): boolean {
  const projects = getProjects()
  const filteredProjects = projects.filter((p) => p.id !== projectId)

  if (filteredProjects.length === projects.length) {
    return false // Project not found
  }

  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filteredProjects))
  return true
}
