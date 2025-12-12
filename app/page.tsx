"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export default function Home() {
  const { isSignedIn } = useAuth()

  return (
    <>
      <Navbar />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div className="container text-center relative z-10">
            <h1 className="text-5xl font-bold mb-6 text-balance text-white !text-white">
  Manage Websites. Track Social Media. Collaborate Better
</h1>
            <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto text-balance">
              Marketing Management Website is your complete project management platform for website development and social media
              coordination with team collaboration and ticketing.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href={isSignedIn ? "/dashboard" : "/register"}
                className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                {isSignedIn ? "Go to Dashboard" : "Get Started"}
              </Link>
              <Link
                href="/login"
                className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition border-2 border-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How Marketing Management Website Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">👥</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Assign developers and coordinators to projects. Track progress and manage team workload efficiently.
                </p>
              </div>

              <div className="card text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🎯</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">Project Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor website building stages from planning to launch. View progress and milestones in real-time.
                </p>
              </div>

              <div className="card text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">📊</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Track website traffic and social media engagement. Get insights into performance metrics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-16 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">Built for Every Role</h2>
            <p className="text-center text-muted-foreground mb-12">Tailored experiences for your entire team</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">
                    Administrator
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">Admin</h3>
                <p className="text-sm text-muted-foreground">
                  Manage all projects, assign team members, and oversee the entire system.
                </p>
              </div>

              <div className="card">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                    Web Developer
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">Developer</h3>
                <p className="text-sm text-muted-foreground">
                  Work on assigned projects, manage tickets, and track development stages.
                </p>
              </div>

              <div className="card">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-700 border border-pink-200">
                    Social Media Coordinator
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">Coordinator</h3>
                <p className="text-sm text-muted-foreground">
                  Track social media metrics and manage analytics for assigned projects.
                </p>
              </div>

              <div className="card">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                    Client
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">Client</h3>
                <p className="text-sm text-muted-foreground">
                  View project progress, create tickets, and communicate with your team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join teams managing their websites and social media with Marketing Management Website.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href={isSignedIn ? "/dashboard" : "/register"}
                className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                {isSignedIn ? "Go to Dashboard" : "Get Started Now"}
              </Link>
              <Link
                href="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
