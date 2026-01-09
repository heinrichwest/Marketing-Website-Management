"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { getProjectsByUserId } from "@/lib/mock-data"
import type { Project } from "@/types"
import { Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ClientFileSharingPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (user && user.role === "client") {
      const userProjects = getProjectsByUserId(user.id, user.role)
      setProjects(userProjects)
      if (userProjects.length > 0) {
        setSelectedProject(userProjects[0].id)
      }
    }
  }, [user])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const handleUpload = async () => {
    if (!selectedProject || uploadedFiles.length === 0) return

    setIsUploading(true)

    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In a real app, you would upload to a cloud storage service

    setUploadedFiles([])
    setIsUploading(false)
    alert("Files uploaded successfully!")
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!user || user.role !== "client") {
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
        <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Share Files with Your Team</h2>
            <p className="text-muted-foreground">Upload documents, images, or any files your project team needs to access</p>
          </div>

          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8 mb-8">
            <div className="space-y-6">
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Project
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload Files
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.svg,.zip,.rar"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <svg className="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-medium text-foreground mb-2">Drop files here or click to browse</p>
                    <p className="text-sm text-muted-foreground">
                      Supports: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG, ZIP, RAR (max 10MB each)
                    </p>
                  </label>
                </div>
              </div>

              {/* File List */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Files to Upload</h3>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {uploadedFiles.length > 0 && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading Files...
                    </div>
                  ) : (
                    `Upload ${uploadedFiles.length} File${uploadedFiles.length > 1 ? 's' : ''}`
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Shared Files History */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Previously Shared Files</h3>

            <div className="space-y-4">
              {/* This would show files that have been shared before */}
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-muted-foreground">No files shared yet</p>
                <p className="text-sm text-muted-foreground mt-1">Files you upload will appear here for your team&apos;s access</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </>
  )
}