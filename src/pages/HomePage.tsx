import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/auth-context"

export default function HomePage() {
  const { isSignedIn } = useAuth()

  return (
    <>
      <Navbar />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-3 h-3 bg-accent rounded-full animate-bounce delay-100"></div>
            <div className="absolute top-40 right-32 w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></div>
            <div className="absolute bottom-32 left-32 w-4 h-4 bg-secondary rounded-full animate-bounce delay-500"></div>
            <div className="absolute bottom-40 right-20 w-2 h-2 bg-accent rounded-full animate-bounce delay-700"></div>
          </div>

          {/* Content */}
          <div className="container text-center relative z-10 px-4 py-20">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                Welcome to the Future of Marketing Management
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent leading-tight">
                Manage Websites.<br />
                <span className="text-foreground">Track Social Media.</span><br />
                <span className="text-primary">Collaborate Better.</span>
              </h1>

              {/* Subheading */}
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Your complete project management platform for website development and social media
                coordination with team collaboration, real-time analytics, and intelligent ticketing.
              </p>

              {/* CTA Buttons */}
              <div className="flex gap-8 justify-center items-center flex-wrap mb-16">
                <Link
                  to={isSignedIn ? "/dashboard" : "/register"}
                  className="group relative bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden w-[220px] text-center whitespace-nowrap"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <span className="truncate">
                      {isSignedIn ? "Go to Dashboard" : "Get Started"}
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <Link
                  to="/login"
                  className="group border-2 border-primary/30 text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 transform hover:-translate-y-1 w-[220px] text-center whitespace-nowrap"
                >
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                    </svg>
                    <span className="truncate">Sign In</span>
                  </span>
                </Link>
              </div>


            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2312265E' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="container relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                How Marketing Management Website Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Streamline your marketing operations with our comprehensive suite of tools designed for modern teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-card border border-border/50 rounded-2xl p-8 text-center hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">Team Collaboration</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Assign developers and coordinators to projects. Track progress and manage team workload efficiently with real-time updates and notifications.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-card border border-border/50 rounded-2xl p-8 text-center hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent to-accent-dark rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-accent transition-colors">Project Tracking</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Monitor website building stages from planning to launch. View progress and milestones in real-time with detailed analytics and status updates.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="w-12 h-1 bg-gradient-to-r from-accent to-primary rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-card border border-border/50 rounded-2xl p-8 text-center hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-secondary transition-colors">Analytics Dashboard</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Track website traffic and social media engagement. Get comprehensive insights into performance metrics with beautiful visualizations.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="w-12 h-1 bg-gradient-to-r from-secondary to-accent rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Features Grid */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: "🎫", title: "Smart Ticketing", desc: "AI-powered ticket management" },
                { icon: "📱", title: "Mobile Ready", desc: "Access anywhere, anytime" },
                { icon: "🔒", title: "Secure", desc: "Enterprise-grade security" },
                { icon: "⚡", title: "Fast", desc: "Lightning-quick performance" }
              ].map((item, index) => (
                <div key={index} className="text-center p-6 rounded-xl bg-card/50 border border-border/50 hover:bg-card hover:shadow-lg transition-all duration-300">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-24 bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-primary/5 to-accent/5"></div>
          </div>

          <div className="container relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                Role-Based Experience
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Built for Every Role
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tailored experiences designed specifically for each team member's workflow and responsibilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Administrator */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-3xl transform rotate-2 group-hover:rotate-3 transition-transform duration-500"></div>
                <div className="relative bg-card border border-border/50 rounded-3xl p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 transform group-hover:-translate-y-3">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Role</div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg">
                        Administrator
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-foreground">System Administrator</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Full system control with user management, project oversight, analytics access, and system configuration.
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-foreground">
                      <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      User Management
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      System Analytics
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Full Access
                    </div>
                  </div>
                </div>
              </div>

              {/* Web Developer */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-dark/10 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-500"></div>
                <div className="relative bg-card border border-border/50 rounded-3xl p-8 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 transform group-hover:-translate-y-3">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Role</div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                        Web Developer
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-foreground">Web Developer</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Code, build, and deploy websites with ticket management, project tracking, and development tools.
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-foreground">
                      <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Ticket Management
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Code Repository
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Deploy Tools
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Coordinator */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent-dark/10 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-500"></div>
                <div className="relative bg-card border border-border/50 rounded-3xl p-8 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 transform group-hover:-translate-y-3">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent-dark rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m4 0H8l.5 16h7L16 4z"/>
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Role</div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
                        Coordinator
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-foreground">Social Media Coordinator</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Manage social media campaigns, track engagement metrics, and coordinate content across platforms.
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-foreground">
                      <svg className="w-4 h-4 text-accent mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Campaign Management
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <svg className="w-4 h-4 text-accent mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Analytics Dashboard
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <svg className="w-4 h-4 text-accent mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Content Calendar
                    </div>
                  </div>
                </div>
              </div>

              {/* Client */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-success-dark/10 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-500"></div>
                <div className="relative bg-card border border-border/50 rounded-3xl p-8 hover:shadow-2xl hover:shadow-success/10 transition-all duration-500 transform group-hover:-translate-y-3">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-success to-success-dark rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Role</div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-success/10 text-success border border-success/20">
                        Client
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-foreground">Client Portal</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    View project progress, submit feedback, create support tickets, and communicate directly with your team.
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-foreground">
                      <svg className="w-4 h-4 text-success mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Project Dashboard
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <svg className="w-4 h-4 text-success mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Support Tickets
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <svg className="w-4 h-4 text-success mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      File Sharing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-primary relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="1" fill="white" opacity="0.1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern)"/>
              </svg>
            </div>
            <div className="absolute top-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                Start Your Journey Today
              </div>

              {/* Main Heading */}
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Ready to Transform Your<br />
                <span className="text-accent">Marketing Workflow?</span>
              </h2>

              {/* Subheading */}
              <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
                Join thousands of teams already managing their websites and social media campaigns
                more efficiently with our comprehensive marketing management platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex gap-8 justify-center items-center flex-wrap mb-16">
                <Link
                  to={isSignedIn ? "/dashboard" : "/register"}
                  className="group relative bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden w-[240px] text-center whitespace-nowrap"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    <span className="truncate">
                      {isSignedIn ? "Go to Dashboard" : "Get Started"}
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <Link
                  to="/login"
                  className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm w-[240px] text-center whitespace-nowrap"
                >
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                    </svg>
                    <span className="truncate">Sign In</span>
                  </span>
                </Link>
              </div>


            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
