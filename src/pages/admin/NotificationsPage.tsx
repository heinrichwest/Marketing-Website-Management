import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../../../components/navbar"
import Footer from "../../../components/footer"
import { useAuth } from "../../../context/auth-context"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [useMockAuth, setUseMockAuth] = useState(() => {
    // Check current auth mode from localStorage or default to true
    return localStorage.getItem('useMockAuth') !== 'false'
  })

  const handleAuthToggle = () => {
    const newMode = !useMockAuth
    setUseMockAuth(newMode)
    localStorage.setItem('useMockAuth', newMode.toString())

    // Show warning about needing to reload
    alert(`Authentication mode changed to ${newMode ? 'Mock' : 'Firebase'}. Please refresh the page for changes to take effect.`)
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">System Notifications</h1>
                <p className="text-muted-foreground">Important system information and connection guides</p>
              </div>
              <Link to="/admin/dashboard" className="btn-outline">
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Authentication Connection Guide */}
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">🔗 Authentication System Connection Guide</h2>

            <div className="space-y-6">
              {/* Current Status */}
              <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-2">Current Authentication Status</h3>
                <p className="text-primary/80 mb-4">
                  <strong>Status:</strong> {useMockAuth ? 'Mock Authentication Active (localStorage-based)' : 'Firebase Authentication Active'}
                  <br />
                  <strong>Note:</strong> {useMockAuth ? 'Currently using demo authentication for testing.' : 'Using production Firebase authentication.'}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAuthToggle}
                    className="btn-primary"
                  >
                    Switch to {useMockAuth ? 'Firebase' : 'Mock'} Auth
                  </button>
                  <span className="text-sm text-primary">
                    ⚠️ Requires page refresh to take effect
                  </span>
                </div>
              </div>

              {/* Mock Authentication */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">🗂️ Mock Authentication (Current)</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Uses localStorage for authentication state and data persistence. Perfect for development and testing.
                  </p>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">How to Use:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Use test credentials (admin@system.com, dev@system.com, etc.)</li>
                      <li>Data persists in browser localStorage</li>
                      <li>No Firebase setup required</li>
                      <li>Clear localStorage to reset all data</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Advantages:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                      <li>Works offline</li>
                      <li>Fast development setup</li>
                      <li>No external dependencies</li>
                      <li>Data persists across sessions</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Firebase Authentication */}
              <div className="border border-orange-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">🔥 Firebase Authentication</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Production-ready authentication with Firebase Auth and Firestore database.
                  </p>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Setup Steps:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Create a Firebase project at <a href="https://console.firebase.google.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
                      <li>Enable Authentication and Firestore Database</li>
                      <li>Copy your Firebase config to <code className="bg-gray-100 px-1 rounded">src/lib/firebase.ts</code></li>
                      <li>In <code className="bg-gray-100 px-1 rounded">context/auth-context.tsx</code>, change <code className="bg-gray-100 px-1 rounded">USE_MOCK_AUTH = false</code></li>
                      <li>Create user accounts in Firebase Auth for testing</li>
                      <li>Set up Firestore security rules for data access</li>
                    </ol>
                  </div>

                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">🔧 Switching to Firebase:</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono mb-2">
                      // In context/auth-context.tsx<br/>
                      const USE_MOCK_AUTH = false
                    </div>
                    <p className="text-sm text-primary/80">
                      After changing this setting, restart the development server and use Firebase accounts.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Production Benefits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                      <li>Secure user authentication</li>
                      <li>Real-time data synchronization</li>
                      <li>Scalable database solution</li>
                      <li>User management dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Connection Status */}
              <div className="border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">🔍 Connection Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 border rounded-lg ${useMockAuth ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className="font-semibold text-green-800">Mock Auth</h4>
                    <p className="text-sm text-green-700">
                      {useMockAuth ? '✅ Connected (Active)' : '⏸️ Not Connected (Inactive)'}
                    </p>
                  </div>
                  <div className={`p-4 border rounded-lg ${!useMockAuth ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className="font-semibold text-gray-800">Firebase</h4>
                    <p className="text-sm text-gray-700">
                      {!useMockAuth ? '✅ Connected (Active)' : '⏸️ Not Connected (Inactive)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-foreground mb-4">⚡ Quick Actions</h2>
            <div className="flex gap-4 flex-wrap">
              <Link to="/admin/dashboard" className="btn-primary">
                Admin Dashboard
              </Link>
              <Link to="/login" className="btn-outline">
                Test Login
              </Link>
              <button
                onClick={() => {
                  if (confirm('Clear all localStorage data? This will reset mock authentication.')) {
                    localStorage.clear()
                    window.location.reload()
                  }
                }}
                className="btn-outline border-red-200 text-red-600 hover:bg-red-50"
              >
                Reset Mock Data
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}