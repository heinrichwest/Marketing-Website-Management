import { useEffect, useState, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjects } from "@/lib/mock-data"
import type { MonthlyAnalytics, Project } from "@/types"
import { Edit, Trash2, Plus } from "lucide-react"

const STORAGE_KEY = "marketing_management_monthly_analytics"

export default function MonthlyAnalyticsPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()

  const [analytics, setAnalytics] = useState<MonthlyAnalytics[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    projectId: "",
    month: "",
    userEngagement: 0,
    newUsers: 0,
    clicks: 0,
    referrals: 0,
    notes: "",
  })

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (!user) {
      return
    }

    if (user.role !== "admin") {
      navigate("/dashboard")
      return
    }

    // Load projects
    setProjects(getProjects())

    // Load analytics from localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setAnalytics(JSON.parse(stored))
    }
  }, [isSignedIn, user, navigate])

  // Sort analytics by month (most recent first)
  const sortedAnalytics = useMemo(() => {
    return [...analytics].sort((a, b) => b.month.localeCompare(a.month))
  }, [analytics])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    // Get the selected project's name
    const selectedProject = projects.find(p => p.id === formData.projectId)
    const projectName = selectedProject?.name || ""

    if (editingId) {
      // Update existing entry
      const updatedAnalytics = analytics.map((item) =>
        item.id === editingId
          ? {
              ...item,
              projectId: formData.projectId,
              projectName: projectName,
              month: formData.month,
              userEngagement: Number(formData.userEngagement),
              newUsers: Number(formData.newUsers),
              clicks: Number(formData.clicks),
              referrals: Number(formData.referrals),
              notes: formData.notes,
              updatedAt: new Date(),
            }
          : item
      )
      setAnalytics(updatedAnalytics)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalytics))
      alert("Analytics updated successfully!")
    } else {
      // Add new entry
      const newEntry: MonthlyAnalytics = {
        id: `analytics-${Date.now()}`,
        projectId: formData.projectId,
        projectName: projectName,
        month: formData.month,
        userEngagement: Number(formData.userEngagement),
        newUsers: Number(formData.newUsers),
        clicks: Number(formData.clicks),
        referrals: Number(formData.referrals),
        recordedBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: formData.notes,
      }

      const updatedAnalytics = [...analytics, newEntry]
      setAnalytics(updatedAnalytics)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalytics))
      alert("Analytics added successfully!")
    }

    // Reset form
    setFormData({
      projectId: "",
      month: "",
      userEngagement: 0,
      newUsers: 0,
      clicks: 0,
      referrals: 0,
      notes: "",
    })
    setIsAddingNew(false)
    setEditingId(null)
  }

  const handleEdit = (item: MonthlyAnalytics) => {
    setFormData({
      projectId: item.projectId,
      month: item.month,
      userEngagement: item.userEngagement,
      newUsers: item.newUsers,
      clicks: item.clicks,
      referrals: item.referrals,
      notes: item.notes || "",
    })
    setEditingId(item.id)
    setIsAddingNew(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this analytics entry?")) {
      const updatedAnalytics = analytics.filter((item) => item.id !== id)
      setAnalytics(updatedAnalytics)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalytics))
      alert("Analytics deleted successfully!")
    }
  }

  const handleCancel = () => {
    setFormData({
      projectId: "",
      month: "",
      userEngagement: 0,
      newUsers: 0,
      clicks: 0,
      referrals: 0,
      notes: "",
    })
    setIsAddingNew(false)
    setEditingId(null)
  }

  if (!user || user.role !== "admin") {
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
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3 flex items-center gap-3">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Monthly Analytics
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Track User Engagement, New Users, Clicks, and Referrals by month. Total entries: {analytics.length}
                </p>
              </div>
              <div className="flex gap-3 lg:flex-shrink-0">
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Monthly Analytics
                </button>
                <Link to="/admin/dashboard" className="btn-outline flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {isAddingNew && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8 mb-8 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {editingId ? "Edit Monthly Analytics" : "Add New Monthly Analytics"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name} ({project.projectType === "website" ? "Website" : "Social Media"})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Month <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="month"
                      required
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      User Engagement <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.userEngagement}
                      onChange={(e) => setFormData({ ...formData, userEngagement: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      New Users <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.newUsers}
                      onChange={(e) => setFormData({ ...formData, newUsers: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Clicks <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.clicks}
                      onChange={(e) => setFormData({ ...formData, clicks: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Referrals <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.referrals}
                      onChange={(e) => setFormData({ ...formData, referrals: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Add any additional notes..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition"
                  >
                    {editingId ? "Update Analytics" : "Save Analytics"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Analytics Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/10 to-primary/5">
                    <th className="px-6 py-4 text-left font-semibold border-r border-border text-foreground">#</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-border text-foreground">Project Name</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-border text-foreground">Month</th>
                    <th className="px-6 py-4 text-center font-semibold border-r border-border text-foreground">User Engagement</th>
                    <th className="px-6 py-4 text-center font-semibold border-r border-border text-foreground">New Users</th>
                    <th className="px-6 py-4 text-center font-semibold border-r border-border text-foreground">Clicks</th>
                    <th className="px-6 py-4 text-center font-semibold border-r border-border text-foreground">Referrals</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-border text-foreground">Notes</th>
                    <th className="px-6 py-4 text-center font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAnalytics.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-4">
                          <svg className="w-16 h-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <div>
                            <p className="text-lg font-semibold mb-2">No analytics data yet</p>
                            <p className="text-sm">Click "Add Monthly Analytics" to start tracking your metrics</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedAnalytics.map((item, index) => {
                      const monthDate = new Date(item.month + "-01")
                      const monthYear = monthDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })

                      return (
                        <tr
                          key={item.id}
                          className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}
                        >
                          <td className="px-6 py-4 border-r border-border text-sm font-medium text-foreground">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 border-r border-border">
                            <div className="font-semibold text-foreground">{item.projectName || "Unknown Project"}</div>
                          </td>
                          <td className="px-6 py-4 border-r border-border">
                            <div className="font-semibold text-foreground">{monthYear}</div>
                            <div className="text-xs text-muted-foreground">{item.month}</div>
                          </td>
                          <td className="px-6 py-4 border-r border-border text-center">
                            <span className="text-lg font-bold text-primary">
                              {item.userEngagement.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-r border-border text-center">
                            <span className="text-lg font-bold text-green-600">
                              {item.newUsers.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-r border-border text-center">
                            <span className="text-lg font-bold text-blue-600">
                              {item.clicks.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-r border-border text-center">
                            <span className="text-lg font-bold text-purple-600">
                              {item.referrals.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-r border-border">
                            <div className="text-sm text-muted-foreground max-w-xs truncate">
                              {item.notes || "—"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
