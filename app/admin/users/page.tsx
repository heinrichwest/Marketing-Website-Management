import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getUsers, updateUser, toggleUserActive, deleteUser } from "@/lib/mock-data"
import RoleBadge from "@/components/role-badge"
import StatusBadge from "@/components/status-badge"
import { formatRelativeTime } from "@/lib/utils"
import type { User } from "@/types"

export default function AdminUsersPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
    } else if (user?.role !== "admin") {
      navigate("/dashboard")
    }
  }, [isSignedIn, user, navigate])

  useEffect(() => {
    setUsers(getUsers())
  }, [])

  const handleEditUser = (userId: string) => {
    navigate("/admin/users/" + userId + "/edit")
  }

  const handleToggleActive = (userId: string) => {
    toggleUserActive(userId)
    setUsers(getUsers()) // Refresh the users list
  }

  const handleDeleteUser = (userId: string) => {
    if (!user) return
    if (userId === user.id) {
      alert("You cannot delete your own account.")
      return
    }
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      if (deleteUser(userId)) {
        setUsers(getUsers()) // Refresh the users list
      } else {
        alert("Failed to delete user.")
      }
    }
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
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Manage Users</h1>
                <p className="text-muted-foreground">View and manage all system users and their roles.</p>
              </div>
              <Link to="/admin/dashboard" className="btn-outline">
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Users Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">All Users ({users.length})</h2>
              <Link to="/admin/users/new" className="btn-primary">
                + New User
              </Link>
            </div>
            <div className="flex items-center gap-4">
                <label className="text-sm text-muted-foreground">
                  Show{" "}
                  <select className="border border-border rounded px-2 py-1 bg-background text-foreground">
                    <option>10</option>
                    <option>25</option>
                    <option selected>50</option>
                    <option>100</option>
                  </select>{" "}
                  entries
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Search:</span>
                  <input
                    type="text"
                    className="border border-border rounded px-3 py-1 bg-background text-foreground"
                    placeholder="Search users..."
                  />
                </div>
             </div>

             <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                   <tr className="bg-primary text-primary-foreground">
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">#</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Name</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Email</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Role</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Status</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Phone</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Joined</th>
                     <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userData, index) => (
                    <tr
                      key={userData.id}
                      className={`${
                        index % 2 === 0 ? "bg-background" : "bg-muted/30"
                      } hover:bg-secondary/10 transition border-b border-border`}
                    >
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-semibold text-foreground">{userData.fullName}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {userData.email}
                      </td>
                      <td className="px-4 py-3">
                        <RoleBadge role={userData.role} />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            userData.isActive
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {userData.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {userData.phone}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatRelativeTime(userData.createdAt)}
                       </td>
                       <td className="px-4 py-3">
                         <div className="flex items-center gap-2">
                           <button
                             className="text-xs text-primary hover:underline"
                             onClick={() => handleEditUser(userData.id)}
                           >
                             Edit
                           </button>
                            <button
                              className="text-xs text-red-600 hover:underline"
                              onClick={() => handleToggleActive(userData.id)}
                            >
                              {userData.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              className="text-xs text-red-600 hover:underline"
                              onClick={() => handleDeleteUser(userData.id)}
                            >
                              Delete
                            </button>
                         </div>
                       </td>
                    </tr>
                  ))}
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