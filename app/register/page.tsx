import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Link, useNavigate } from "react-router-dom"
import { useToast, ToastContainer } from "@/components/toast"
import type { UserRole } from "@/types"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { toasts, showToast } = useToast()
  const [userRole, setUserRole] = useState<UserRole>("client")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      showToast("Please fill in all fields", "error")
      return
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error")
      return
    }

    if (!agreeTerms) {
      showToast("Please agree to terms and conditions", "error")
      return
    }

    showToast(`Welcome to SpecCon Marketing Management Website! Account created as ${userRole}.`, "success")
    setTimeout(() => {
      navigate("/login")
    }, 1000)
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted py-12">
        <div className="container max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">Join SpecCon Marketing Management Website platform</p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6 max-w-xl mx-auto">
              <p className="text-sm text-foreground">
                <span className="font-semibold">💡 Note:</span> Select your role carefully. Admin approval may be required for certain roles.
              </p>
            </div>
          </div>

          <div className="card">
            {/* User Role Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-foreground mb-4">
                Select Your Role
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setUserRole("client")}
                  className={`p-6 rounded-lg border-2 transition text-center ${
                    userRole === "client" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-4xl mb-2">👤</div>
                  <h3 className="font-bold text-foreground mb-1">Client</h3>
                  <p className="text-sm text-muted-foreground">View project progress, create tickets, communicate with team</p>
                </button>

                <button
                  onClick={() => setUserRole("web_developer")}
                  className={`p-6 rounded-lg border-2 transition text-center ${
                    userRole === "web_developer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-4xl mb-2">💻</div>
                  <h3 className="font-bold text-foreground mb-1">Web Developer</h3>
                  <p className="text-sm text-muted-foreground">Work on assigned projects, manage tickets, track development stages</p>
                </button>

                <button
                  onClick={() => setUserRole("social_media_coordinator")}
                  className={`p-6 rounded-lg border-2 transition text-center ${
                    userRole === "social_media_coordinator" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-4xl mb-2">📱</div>
                  <h3 className="font-bold text-foreground mb-1">Social Media Coordinator</h3>
                  <p className="text-sm text-muted-foreground">Track social media metrics, manage analytics for assigned projects</p>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+27 123 456 7890"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-2">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-foreground">
                    I agree to SpecCon Marketing Management Website's{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => setShowPrivacy(true)}
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>
              </div>

              <button type="submit" className="w-full btn-primary py-3 font-bold text-lg">
                Create Account
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} />

      {/* Terms of Service Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Terms of Service</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-foreground mb-2">1. Acceptance of Terms</h3>
                <p className="text-muted-foreground">
                  By accessing and using SpecCon Marketing Management Website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">2. Eligibility</h3>
                <p className="text-muted-foreground">
                  You must be at least 18 years old to use SpecCon Marketing Management Website. By using our platform, you represent and warrant that you meet this age requirement and have the legal capacity to enter into binding contracts.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">3. User Accounts</h3>
                <p className="text-muted-foreground mb-2">
                  When creating an account, you agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Not create multiple accounts or share accounts</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">4. User Responsibilities</h3>
                <p className="text-muted-foreground mb-2">
                  All users agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Perform assigned tasks professionally and on time</li>
                  <li>Maintain confidentiality of client information</li>
                  <li>Communicate effectively with team members</li>
                  <li>Provide accurate project updates and analytics</li>
                  <li>Not engage in unauthorized access or data manipulation</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">5. Service Terms</h3>
                <p className="text-muted-foreground">
                  SpecCon Marketing Management Website provides project management and collaboration tools. All project data remains the property of the client organization.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">6. Prohibited Activities</h3>
                <p className="text-muted-foreground mb-2">
                  Users are prohibited from:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Unauthorized access to other users&apos; projects or data</li>
                  <li>Sharing confidential client information</li>
                  <li>Submitting false or misleading analytics data</li>
                  <li>Harassing other users or team members</li>
                  <li>Attempting to circumvent security measures</li>
                  <li>Reverse engineering or scraping the platform</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">7. Account Termination</h3>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate accounts that violate these terms or engage in unauthorized activity.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">8. Governing Law</h3>
                <p className="text-muted-foreground">
                  These terms are governed by the laws of South Africa. Any disputes will be resolved in the courts of South Africa.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Last Updated:</strong> January 2025<br />
                  <strong>Effective Date:</strong> January 2025
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-background border-t border-border p-6">
              <button onClick={() => setShowTerms(false)} className="w-full btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacy(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-foreground mb-2">1. Information We Collect</h3>
                <p className="text-muted-foreground mb-2">
                  When you use SpecCon Marketing Management Website, we collect the following information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>Project files, documents, and assets</li>
                  <li>Website analytics and social media metrics</li>
                  <li>Ticket history and communications</li>
                  <li>Device information and IP address for security purposes</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">2. How We Use Your Information</h3>
                <p className="text-muted-foreground mb-2">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Manage and track website development projects</li>
                  <li>Facilitate team collaboration and communication</li>
                  <li>Store and track analytics data</li>
                  <li>Communicate with you about your projects and tickets</li>
                  <li>Prevent unauthorized access and ensure platform security</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">3. Information Sharing</h3>
                <p className="text-muted-foreground">
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                  <li>Payment processors to complete transactions</li>
                  <li>Service providers who assist in operating our platform</li>
                  <li>Law enforcement when required by law</li>
                  <li>Other users (limited information) necessary to complete transactions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">4. Data Security</h3>
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">5. Data Retention</h3>
                <p className="text-muted-foreground">
                  We retain your personal information for as long as your account is active or as needed to provide services. Transaction records are kept for 7 years to comply with South African tax and financial regulations.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">6. Your Rights</h3>
                <p className="text-muted-foreground mb-2">
                  Under the Protection of Personal Information Act (POPIA), you have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information (subject to legal requirements)</li>
                  <li>Object to processing of your information</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">7. Cookies</h3>
                <p className="text-muted-foreground">
                  We use cookies and similar technologies to improve your experience, analyze site usage, and assist in our marketing efforts. You can control cookie preferences through your browser settings.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">8. Third-Party Links</h3>
                <p className="text-muted-foreground">
                  Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to review their privacy policies.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">5. Children&apos;s Privacy</h3>
                <p className="text-muted-foreground">
                  SpecCon Marketing Management Website is a business platform not intended for users under the age of 18. We do not knowingly collect personal information from children.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">6. Contact Us</h3>
                <p className="text-muted-foreground">
                  If you have questions about this privacy policy, please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: privacy@speccon.co.za<br />
                  Address: Cape Town, South Africa
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Last Updated:</strong> January 2025<br />
                  <strong>Effective Date:</strong> January 2025
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-background border-t border-border p-6">
              <button onClick={() => setShowPrivacy(false)} className="w-full btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
