import { useState } from "react"

export default function Footer() {
  const [showHelpCenter, setShowHelpCenter] = useState<boolean>(false)
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false)
  const [showTerms, setShowTerms] = useState<boolean>(false)

  return (
    <>
      <footer className="border-t border-border bg-muted py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-4">SpecCon Marketing Management Website</h4>
              <p className="text-muted-foreground text-sm">
                Comprehensive project management platform for website development and social media coordination.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-foreground mb-3">Platform</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/dashboard" className="hover:text-primary">
                    Dashboard
                  </a>
                </li>
              
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-foreground mb-3">Features</h5>
               <ul className="space-y-2 text-sm text-muted-foreground">
                 <li>
                   <a href="/dashboard" className="hover:text-primary">
                     Project Management
                   </a>
                 </li>
                 <li>
                   <a href="/tickets" className="hover:text-primary">
                     Ticketing System
                   </a>
                 </li>
                 <li>
                   <a href="/analytics" className="hover:text-primary">
                     Analytics Tracking
                   </a>
                 </li>
               </ul>
            </div>

            <div>
              <h5 className="font-bold text-foreground mb-3">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => setShowHelpCenter(true)} className="hover:text-primary">
                    Help Center
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowPrivacy(true)} className="hover:text-primary">
                    Privacy
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowTerms(true)} className="hover:text-primary">
                    Terms
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">© 2026 SpecCon Marketing Management Website. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Help Center Modal */}
      {showHelpCenter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Help Center</h2>
              <button
                onClick={() => setShowHelpCenter(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-foreground mb-2">Getting Started</h3>
                <p className="text-muted-foreground mb-2">
                  Welcome to SpecCon Marketing Management Website! Here&apos;s how to get started:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Create an account with your assigned role</li>
                  <li>Access your role-specific dashboard</li>
                  <li>View assigned projects and tasks</li>
                  <li>Collaborate with your team members</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">For Clients</h3>
                <p className="text-muted-foreground mb-2">
                  How to manage your website projects:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>View progress of your website through different stages</li>
                  <li>Create tickets for bug reports or content changes</li>
                  <li>Track analytics and social media performance</li>
                  <li>Communicate with your development team</li>
                  <li>Monitor project milestones and deadlines</li>
                </ul>
              </div>

               <div>
                 <h3 className="font-bold text-foreground mb-2">For Developers</h3>
                 <p className="text-muted-foreground mb-2">
                   Managing your assigned projects:
                 </p>
                 <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                   <li>Access all your assigned website projects</li>
                   <li>Update project stages as work progresses</li>
                   <li>Manage and resolve technical tickets</li>
                   <li>Track time and deliverables</li>
                   <li>Collaborate with social media coordinators</li>
                 </ul>
               </div>

               <div>
                 <h3 className="font-bold text-foreground mb-2">For Social Media Coordinators</h3>
                 <p className="text-muted-foreground">
                   Track and manage social media analytics for your assigned projects. Add analytics entries for reach, engagement, and posts across different platforms. Generate reports, monitor performance trends, and handle support tickets related to social media coordination.
                 </p>
               </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">Ticketing System</h3>
                <p className="text-muted-foreground">
                  Create tickets for bug reports, content changes, design updates, or feature requests. All tickets are tracked and assigned to the appropriate team member. Monitor ticket status from creation to resolution.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">Account Security</h3>
                <p className="text-muted-foreground mb-2">
                  Keep your account secure:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Use a strong, unique password</li>
                  <li>Never share your login credentials</li>
                  <li>Enable two-factor authentication when available</li>
                  <li>Log out from shared devices</li>
                  <li>Report suspicious activity immediately</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">Contact Support</h3>
                <p className="text-muted-foreground">
                  Need more help? Contact our support team:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: support@speccon.co.za<br />
                  Phone: +27 21 123 4567<br />
                  Hours: Monday - Friday, 9:00 AM - 5:00 PM SAST
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-background border-t border-border p-6">
              <button onClick={() => setShowHelpCenter(false)} className="w-full btn-primary">
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
                  <li>Team members assigned to the same projects</li>
                  <li>Service providers who assist in operating our platform</li>
                  <li>Law enforcement when required by law</li>
                  <li>Other users (limited information) necessary for project collaboration</li>
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
                  We retain your personal information for as long as your account is active or as needed to provide services. Project records and analytics data are kept for 7 years to comply with South African business regulations.
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
                <h3 className="font-bold text-foreground mb-2">9. Children&apos;s Privacy</h3>
                <p className="text-muted-foreground">
                  SpecCon Marketing Management Website is a business platform not intended for users under the age of 18. We do not knowingly collect personal information from children.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">10. Changes to This Policy</h3>
                <p className="text-muted-foreground">
                  We may update this privacy policy from time to time. We will notify you of any significant changes by email or through a notice on our platform.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">11. Contact Us</h3>
                <p className="text-muted-foreground">
                  If you have questions about this privacy policy or how we handle your personal information, please contact us at:
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

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Terms & Conditions</h2>
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
                  By accessing and using SpecCon Marketing Management Website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">2. Eligibility</h3>
                <p className="text-muted-foreground">
                  You must be at least 18 years old and authorized to use SpecCon Marketing Management Website. By using our platform, you represent and warrant that you meet this age requirement and have the legal capacity to enter into binding contracts.
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
                <h3 className="font-bold text-foreground mb-2">5. Project Management</h3>
                <p className="text-muted-foreground mb-2">
                  Users agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Update project stages accurately as work progresses</li>
                  <li>Respond to tickets within agreed timeframes</li>
                  <li>Submit accurate analytics data</li>
                  <li>Respect intellectual property rights</li>
                  <li>Maintain professional communication standards</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">6. Service Terms</h3>
                <p className="text-muted-foreground">
                  SpecCon Marketing Management Website provides project management and collaboration tools. Service levels and pricing are determined by your organization's agreement. All project data remains the property of the client organization.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">7. Prohibited Activities</h3>
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
                <h3 className="font-bold text-foreground mb-2">8. Dispute Resolution</h3>
                <p className="text-muted-foreground">
                  In case of disputes between team members or regarding project deliverables, administrators will act as mediators. We reserve the right to suspend accounts or take legal action if terms are violated.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">9. Limitation of Liability</h3>
                <p className="text-muted-foreground">
                  SpecCon Marketing Management Website provides project management tools as-is. We are not responsible for project outcomes, the actions of users, or disputes arising from collaborations. Our liability is limited to the service fees paid.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">10. Intellectual Property</h3>
                <p className="text-muted-foreground">
                  All platform content, trademarks, and intellectual property belong to SpecCon or our licensors. Project content belongs to the respective client organizations. You may not use, copy, or distribute our platform content without written permission.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">11. Account Termination</h3>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a risk to the platform or other users. Termination may result in forfeiture of pending transactions.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">12. Changes to Terms</h3>
                <p className="text-muted-foreground">
                  We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes via email.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">13. Governing Law</h3>
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
    </>
  )
}
