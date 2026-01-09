"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { Project, Ticket } from "@/types"

// Mock automation workflows
interface AutomationAction {
  type: string
  config: Record<string, unknown>
}

interface AutomationWorkflow {
  id: string
  name: string
  description: string
  trigger: {
    type: string
    conditions: unknown[]
  }
  actions: AutomationAction[]
  isActive: boolean
  createdAt: Date
  lastTriggered: Date | null
  triggerCount: number
}

const sampleWorkflows: AutomationWorkflow[] = [
  {
    id: "workflow-1",
    name: "New Project Welcome Email",
    description: "Automatically send welcome email when a new project is created",
    trigger: {
      type: "project_created",
      conditions: []
    },
    actions: [
      {
        type: "send_email",
        config: {
          to: "{{client.email}}",
          subject: "Welcome to {{project.name}}!",
          template: "welcome_email"
        }
      },
      {
        type: "create_task",
        config: {
          title: "Send project brief to client",
          assignee: "account_manager",
          dueDate: "2 days from now"
        }
      }
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastTriggered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    triggerCount: 15
  },
  {
    id: "workflow-2",
    name: "High Priority Ticket Escalation",
    description: "Escalate high-priority tickets and notify team leads",
    trigger: {
      type: "ticket_created",
      conditions: [
        { field: "priority", operator: "equals", value: "critical" }
      ]
    },
    actions: [
      {
        type: "notify_user",
        config: {
          user: "team_lead",
          message: "Critical ticket created: {{ticket.title}}",
          channel: "urgent"
        }
      },
      {
        type: "update_ticket",
        config: {
          status: "in_progress",
          assignee: "senior_developer"
        }
      },
      {
        type: "create_meeting",
        config: {
          title: "Urgent Ticket Review: {{ticket.title}}",
          attendees: ["team_lead", "project_manager"],
          duration: 30
        }
      }
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    lastTriggered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    triggerCount: 8
  },
  {
    id: "workflow-3",
    name: "Project Completion Celebration",
    description: "Celebrate project completion with automated notifications",
    trigger: {
      type: "project_completed",
      conditions: []
    },
    actions: [
      {
        type: "send_notification",
        config: {
          to: "all_team_members",
          message: "🎉 Project {{project.name}} completed successfully!",
          type: "celebration"
        }
      },
      {
        type: "create_task",
        config: {
          title: "Schedule project retrospective meeting",
          assignee: "project_manager",
          dueDate: "1 week from now"
        }
      },
      {
        type: "send_email",
        config: {
          to: "{{client.email}}",
          subject: "Project {{project.name}} Completed!",
          template: "completion_email"
        }
      }
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    lastTriggered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    triggerCount: 12
  }
]

// Available triggers and actions
const availableTriggers = [
  { id: "project_created", name: "Project Created", icon: "📁", description: "When a new project is created" },
  { id: "project_completed", name: "Project Completed", icon: "✅", description: "When a project status changes to completed" },
  { id: "ticket_created", name: "Ticket Created", icon: "🎫", description: "When a new ticket is created" },
  { id: "ticket_updated", name: "Ticket Updated", icon: "🔄", description: "When a ticket is updated" },
  { id: "client_feedback", name: "Client Feedback", icon: "⭐", description: "When client submits feedback" },
  { id: "deadline_approaching", name: "Deadline Approaching", icon: "⏰", description: "When a deadline is within 24 hours" }
]

const availableActions = [
  { id: "send_email", name: "Send Email", icon: "📧", description: "Send an email notification" },
  { id: "send_notification", name: "Send Notification", icon: "🔔", description: "Send in-app notification" },
  { id: "create_task", name: "Create Task", icon: "📝", description: "Create a new task" },
  { id: "update_ticket", name: "Update Ticket", icon: "🎫", description: "Update ticket properties" },
  { id: "create_meeting", name: "Create Meeting", icon: "📅", description: "Schedule a meeting" },
  { id: "notify_user", name: "Notify User", icon: "👤", description: "Send notification to specific user" },
  { id: "webhook", name: "Webhook", icon: "🔗", description: "Send data to external service" }
]

export default function WorkflowAutomationPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const [workflows, setWorkflows] = useState(sampleWorkflows)
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null)
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    trigger: { type: "", conditions: [] },
    actions: []
  })

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (user?.role !== "admin") {
      navigate("/dashboard")
      return
    }
  }, [isSignedIn, user, navigate])

  const handleCreateWorkflow = () => {
    const workflow = {
      ...newWorkflow,
      id: `workflow-${Date.now()}`,
      isActive: true,
      createdAt: new Date(),
      lastTriggered: null as Date | null,
      triggerCount: 0
    }

    setWorkflows(prev => [workflow, ...prev])
    setNewWorkflow({
      name: "",
      description: "",
      trigger: { type: "", conditions: [] },
      actions: []
    })
    setIsCreatingWorkflow(false)
  }

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w =>
      w.id === workflowId ? { ...w, isActive: !w.isActive } : w
    ))
  }

  const deleteWorkflow = (workflowId: string) => {
    if (confirm("Are you sure you want to delete this workflow?")) {
      setWorkflows(prev => prev.filter(w => w.id !== workflowId))
    }
  }

  const getTriggerName = (triggerType: string) => {
    const trigger = availableTriggers.find(t => t.id === triggerType)
    return trigger?.name || triggerType
  }

  const getActionName = (actionType: string) => {
    const action = availableActions.find(a => a.id === actionType)
    return action?.name || actionType
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
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Link to="/admin/dashboard" className="btn-outline text-sm">
                  ← Back to Dashboard
                </Link>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">
                ⚡ Workflow Automation
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Create powerful automations to streamline your business processes
              </p>
            </div>

            <button
              onClick={() => setIsCreatingWorkflow(true)}
              className="btn-primary px-6 py-3"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Workflow
            </button>
          </div>

          {/* Active Workflows */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">{workflow.name}</h3>
                    <p className="text-sm text-muted-foreground">{workflow.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${workflow.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <button
                      onClick={() => setSelectedWorkflow(workflow)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Trigger:</span>
                    <span className="font-medium">{getTriggerName(workflow.trigger.type)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Actions:</span>
                    <span className="font-medium">{workflow.actions.length} configured</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Triggered:</span>
                    <span className="font-medium">{workflow.triggerCount} times</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWorkflow(workflow.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        workflow.isActive ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          workflow.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {workflow.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteWorkflow(workflow.id)}
                    className="p-1 text-muted-foreground hover:text-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Available Triggers & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Triggers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Available Triggers</h2>
              <div className="space-y-3">
                {availableTriggers.map((trigger) => (
                  <div key={trigger.id} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                    <span className="text-2xl">{trigger.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{trigger.name}</h3>
                      <p className="text-sm text-muted-foreground">{trigger.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Available Actions</h2>
              <div className="space-y-3">
                {availableActions.map((action) => (
                  <div key={action.id} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                    <span className="text-2xl">{action.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{action.name}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workflow Builder Modal */}
          {isCreatingWorkflow && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Create New Workflow</h2>
                    <button
                      onClick={() => setIsCreatingWorkflow(false)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Workflow Name
                      </label>
                      <input
                        type="text"
                        value={newWorkflow.name}
                        onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter workflow name"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Description
                      </label>
                      <textarea
                        value={newWorkflow.description}
                        onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what this workflow does"
                        rows={3}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Trigger Event
                      </label>
                      <select
                        value={newWorkflow.trigger.type}
                        onChange={(e) => setNewWorkflow(prev => ({
                          ...prev,
                          trigger: { ...prev.trigger, type: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      >
                        <option value="">Select a trigger</option>
                        {availableTriggers.map((trigger) => (
                          <option key={trigger.id} value={trigger.id}>
                            {trigger.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-secondary/10 dark:bg-secondary/20 p-4 rounded-lg">
                      <p className="text-sm text-primary dark:text-primary">
                        💡 <strong>Pro Tip:</strong> Start with simple workflows and gradually add complexity.
                        Test your workflows thoroughly before deploying to production.
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-border">
                      <button
                        onClick={() => setIsCreatingWorkflow(false)}
                        className="btn-outline px-6 py-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateWorkflow}
                        disabled={!newWorkflow.name.trim() || !newWorkflow.trigger.type}
                        className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create Workflow
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workflow Detail Modal */}
          {selectedWorkflow && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{selectedWorkflow.name}</h2>
                      <p className="text-muted-foreground">{selectedWorkflow.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedWorkflow(null)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Workflow Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Workflow Details</h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Status:</span>
                          <span className={`ml-2 text-sm px-2 py-1 rounded-full ${
                            selectedWorkflow.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedWorkflow.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Trigger:</span>
                          <span className="ml-2 text-sm">{getTriggerName(selectedWorkflow.trigger.type)}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Actions:</span>
                          <span className="ml-2 text-sm">{selectedWorkflow.actions.length} configured</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Triggered:</span>
                          <span className="ml-2 text-sm">{selectedWorkflow.triggerCount} times</span>
                        </div>
                        {selectedWorkflow.lastTriggered && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Last Run:</span>
                            <span className="ml-2 text-sm">
                              {new Date(selectedWorkflow.lastTriggered).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions List */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Configured Actions</h3>
                      <div className="space-y-3">
                        {selectedWorkflow.actions.map((action: AutomationAction, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <span className="text-xl">
                              {availableActions.find(a => a.id === action.type)?.icon || "⚡"}
                            </span>
                            <div>
                              <h4 className="font-medium text-foreground">
                                {getActionName(action.type)}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Configured with {Object.keys(action.config || {}).length} settings
                              </p>
                            </div>
                          </div>
                        ))}
                        {selectedWorkflow.actions.length === 0 && (
                          <p className="text-muted-foreground text-sm">No actions configured yet</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-border mt-8">
                    <button
                      onClick={() => setSelectedWorkflow(null)}
                      className="btn-outline px-6 py-2"
                    >
                      Close
                    </button>
                    <button className="btn-primary px-6 py-2">
                      Edit Workflow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Automation Benefits */}
          <div className="bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-green-500/5 rounded-xl border border-primary/10 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">🔄 Automation Benefits</h2>
              <p className="text-muted-foreground">Transform your business with intelligent workflows</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-bold text-foreground mb-2">Reduce Manual Work</h3>
                <p className="text-sm text-muted-foreground">
                  Automate repetitive tasks and focus on strategic work that matters
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-lg font-bold text-foreground mb-2">Increase Efficiency</h3>
                <p className="text-sm text-muted-foreground">
                  Streamline processes and reduce response times across your organization
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-bold text-foreground mb-2">Improve Consistency</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure standardized processes and reduce human error in workflows
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}