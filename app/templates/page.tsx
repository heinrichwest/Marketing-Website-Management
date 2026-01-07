"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { ProjectTemplate } from "@/types"

// Mock project templates
const mockTemplates: ProjectTemplate[] = [
  {
    id: "template-1",
    name: "Basic Business Website",
    description: "A professional website for small businesses including homepage, about, services, and contact pages.",
    category: "website",
    estimatedDuration: 21,
    estimatedBudget: 3500,
    difficulty: "beginner",
    tags: ["business", "professional", "responsive"],
    isPublic: true,
    createdBy: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    phases: [
      {
        id: "phase-1",
        name: "Planning & Design",
        description: "Wireframes, mockups, and design approval",
        order: 1,
        estimatedDuration: 7,
        dependencies: [],
        deliverables: ["design-mockups", "wireframes"]
      },
      {
        id: "phase-2",
        name: "Development",
        description: "Website coding and implementation",
        order: 2,
        estimatedDuration: 10,
        dependencies: ["phase-1"],
        deliverables: ["homepage", "about-page", "services-page", "contact-page"]
      },
      {
        id: "phase-3",
        name: "Testing & Launch",
        description: "Quality assurance and deployment",
        order: 3,
        estimatedDuration: 4,
        dependencies: ["phase-2"],
        deliverables: ["testing-report", "live-website"]
      }
    ],
    deliverables: [
      {
        id: "design-mockups",
        name: "Design Mockups",
        description: "Visual design concepts for all pages",
        phaseId: "phase-1",
        type: "design",
        estimatedHours: 16,
        isRequired: true
      },
      {
        id: "wireframes",
        name: "Wireframes",
        description: "Page structure and layout planning",
        phaseId: "phase-1",
        type: "design",
        estimatedHours: 8,
        isRequired: true
      },
      {
        id: "homepage",
        name: "Homepage",
        description: "Main landing page with hero section",
        phaseId: "phase-2",
        type: "code",
        estimatedHours: 12,
        isRequired: true
      },
      {
        id: "about-page",
        name: "About Page",
        description: "Company information and team section",
        phaseId: "phase-2",
        type: "code",
        estimatedHours: 8,
        isRequired: true
      },
      {
        id: "services-page",
        name: "Services Page",
        description: "Business services and offerings",
        phaseId: "phase-2",
        type: "code",
        estimatedHours: 10,
        isRequired: true
      },
      {
        id: "contact-page",
        name: "Contact Page",
        description: "Contact form and business information",
        phaseId: "phase-2",
        type: "code",
        estimatedHours: 6,
        isRequired: true
      }
    ],
    teamRoles: [
      {
        id: "role-1",
        role: "web_developer",
        required: true,
        estimatedHours: 36,
        skills: ["HTML", "CSS", "JavaScript", "React"]
      },
      {
        id: "role-2",
        role: "social_media_coordinator",
        required: false,
        estimatedHours: 8,
        skills: ["Social Media", "Content Creation"]
      }
    ],
    checklists: []
  },
  {
    id: "template-2",
    name: "E-commerce Website",
    description: "Complete online store with product catalog, shopping cart, and payment integration.",
    category: "ecommerce",
    estimatedDuration: 35,
    estimatedBudget: 8500,
    difficulty: "intermediate",
    tags: ["ecommerce", "shopping", "payments"],
    isPublic: true,
    createdBy: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    phases: [
      {
        id: "phase-1",
        name: "Planning & Requirements",
        description: "Product analysis and technical planning",
        order: 1,
        estimatedDuration: 5,
        dependencies: [],
        deliverables: ["requirements-doc", "tech-spec"]
      },
      {
        id: "phase-2",
        name: "Design & UI/UX",
        description: "User interface and experience design",
        order: 2,
        estimatedDuration: 8,
        dependencies: ["phase-1"],
        deliverables: ["ui-design", "user-flows"]
      },
      {
        id: "phase-3",
        name: "Development",
        description: "Full-stack development and integration",
        order: 3,
        estimatedDuration: 18,
        dependencies: ["phase-2"],
        deliverables: ["frontend-code", "backend-api", "database-setup", "payment-integration"]
      },
      {
        id: "phase-4",
        name: "Testing & Deployment",
        description: "Quality assurance and production launch",
        order: 4,
        estimatedDuration: 4,
        dependencies: ["phase-3"],
        deliverables: ["testing-report", "live-site"]
      }
    ],
    deliverables: [
      {
        id: "requirements-doc",
        name: "Requirements Document",
        description: "Detailed project requirements and specifications",
        phaseId: "phase-1",
        type: "document",
        estimatedHours: 16,
        isRequired: true
      },
      {
        id: "ui-design",
        name: "UI Design System",
        description: "Complete design system and component library",
        phaseId: "phase-2",
        type: "design",
        estimatedHours: 24,
        isRequired: true
      }
    ],
    teamRoles: [
      {
        id: "role-1",
        role: "web_developer",
        required: true,
        estimatedHours: 80,
        skills: ["React", "Node.js", "Database", "API Development"]
      }
    ],
    checklists: []
  },
  {
    id: "template-3",
    name: "Social Media Campaign",
    description: "Complete social media strategy and content creation for brand awareness.",
    category: "social_media",
    estimatedDuration: 28,
    estimatedBudget: 4200,
    difficulty: "intermediate",
    tags: ["social", "content", "branding"],
    isPublic: true,
    createdBy: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    phases: [
      {
        id: "phase-1",
        name: "Strategy & Planning",
        description: "Audience analysis and campaign strategy",
        order: 1,
        estimatedDuration: 7,
        dependencies: [],
        deliverables: ["strategy-doc", "content-calendar"]
      },
      {
        id: "phase-2",
        name: "Content Creation",
        description: "Design and create social media content",
        order: 2,
        estimatedDuration: 14,
        dependencies: ["phase-1"],
        deliverables: ["social-posts", "graphics", "videos"]
      },
      {
        id: "phase-3",
        name: "Launch & Monitoring",
        description: "Campaign execution and performance tracking",
        order: 3,
        estimatedDuration: 7,
        dependencies: ["phase-2"],
        deliverables: ["campaign-report", "analytics"]
      }
    ],
    deliverables: [],
    teamRoles: [
      {
        id: "role-1",
        role: "social_media_coordinator",
        required: true,
        estimatedHours: 56,
        skills: ["Social Media", "Content Creation", "Graphic Design", "Analytics"]
      }
    ],
    checklists: []
  }
]

export default function ProjectTemplatesPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const [templates, setTemplates] = useState<ProjectTemplate[]>(mockTemplates)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }
  }, [isSignedIn, navigate])

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "website", label: "Website" },
    { value: "social_media", label: "Social Media" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "branding", label: "Branding" },
    { value: "mobile", label: "Mobile App" }
  ]

  const difficulties = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
  ]

  const filteredTemplates = templates.filter(template => {
    const categoryMatch = selectedCategory === "all" || template.category === selectedCategory
    const difficultyMatch = selectedDifficulty === "all" || template.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800"
    }
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      website: "bg-primary/10 text-primary",
      social_media: "bg-pink-100 text-pink-800",
      ecommerce: "bg-purple-100 text-purple-800",
      branding: "bg-orange-100 text-orange-800",
      mobile: "bg-indigo-100 text-indigo-800",
      custom: "bg-gray-100 text-gray-800"
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-8 lg:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Project Templates</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Jumpstart your projects with professionally designed templates and predefined workflows
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </div>

              {user.role === "admin" && (
                <div className="flex items-end">
                  <button className="btn-primary px-6 py-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Template
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(template.category)}`}>
                      {template.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {template.phases.length} phases
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium text-foreground ml-1">
                        {template.estimatedDuration} days
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium text-foreground ml-1">
                        ${template.estimatedBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{template.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <button className="w-full btn-primary py-2 text-sm">
                      Use This Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-muted-foreground text-lg">No templates found matching your criteria</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or create a custom template</p>
            </div>
          )}

          {/* Template Detail Modal */}
          {selectedTemplate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-foreground mb-2">{selectedTemplate.name}</h2>
                      <p className="text-muted-foreground">{selectedTemplate.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Template Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Duration</h4>
                      <p className="text-2xl font-bold text-primary">{selectedTemplate.estimatedDuration} days</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Estimated Budget</h4>
                      <p className="text-2xl font-bold text-primary">${selectedTemplate.estimatedBudget.toLocaleString()}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Difficulty</h4>
                      <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                        {selectedTemplate.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Project Phases */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-foreground mb-4">Project Phases</h3>
                    <div className="space-y-4">
                      {selectedTemplate.phases.map((phase, index) => (
                        <div key={phase.id} className="flex items-start gap-4 p-4 border border-border/50 rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{phase.name}</h4>
                            <p className="text-muted-foreground text-sm mb-2">{phase.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                Duration: <span className="font-medium text-foreground">{phase.estimatedDuration} days</span>
                              </span>
                              <span className="text-muted-foreground">
                                Deliverables: <span className="font-medium text-foreground">{phase.deliverables.length}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Requirements */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-foreground mb-4">Team Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTemplate.teamRoles.map((role) => (
                        <div key={role.id} className="p-4 border border-border/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground capitalize">
                              {role.role.replace('_', ' ')}
                            </h4>
                            {role.required && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Est. {role.estimatedHours} hours
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {role.skills.map((skill) => (
                              <span key={skill} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-border">
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="btn-outline px-6 py-2"
                    >
                      Close
                    </button>
                    <button className="btn-primary px-6 py-2">
                      Use This Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}