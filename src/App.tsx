import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/auth-context'
import { ThemeProvider } from '@/components/theme-provider'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AdminDashboardPage from './pages/admin/DashboardPage'
import AdminUsersPage from './pages/admin/UsersPage'
import AdminEditUserPage from '../app/admin/users/[id]/edit/page'
import AdminProjectsPage from './pages/admin/ProjectsPage'
import AdminTicketsPage from './pages/admin/TicketsPage'
import AdminEditProjectPage from './pages/admin/EditProjectPage'
import AdminProjectAnalyticsPage from './pages/admin/ProjectAnalyticsPage'
import AdminNotificationsPage from './pages/admin/NotificationsPage'
import NewUserPage from './pages/admin/NewUserPage'
import DeveloperDashboardPage from './pages/developer/DashboardPage'
import DeveloperTicketsPage from './pages/developer/TicketsPage'
import CoordinatorDashboardPage from './pages/coordinator/DashboardPage'
import ClientDashboardPage from './pages/client/DashboardPage'
import ClientProjectsPage from './pages/client/ProjectsPage'
import ClientTicketsPage from './pages/client/TicketsPage'
import ClientNewTicketPage from './pages/client/tickets/NewTicketPage'
import SwitchRolePage from './pages/SwitchRolePage'
import NewProjectPage from './pages/admin/NewProjectPage'
import MessagesPage from '../app/messages/page'

import ClientPortalDashboardPage from '../app/client-portal/dashboard/page'
import ClientPortalProjectPage from '../app/client-portal/project/[id]/page'
import ClientFileSharingPage from '../app/client-portal/files/page'
import ClientFeedbackPage from '../app/client-portal/feedback/page'
import AnalyticsDashboardPage from '../app/analytics/page'
import CalendarPage from '../app/calendar/page'
import TimeTrackingPage from '../app/time-tracking/page'
import ProjectTemplatesPage from '../app/templates/page'
import ExecutiveDashboardPage from '../app/reports/page'
import GlobalSearchPage from '../app/search/page'
import NotificationsPage from '../app/notifications/page'
import AIInsightsPage from '../app/ai-insights/page'
import APIIntegrationsPage from '../app/integrations/page'
import WorkflowAutomationPage from '../app/automation/page'
import EnhancedDashboardPage from '../app/dashboard/enhanced/page'
import AdminProjectDetailPage from '../app/admin/projects/[id]/page'

// Wrapper component to handle auth-based component keys
function AdminDashboardWrapper() {
  const { user } = useAuth()
  return <AdminDashboardPage key={user?.id || 'guest'} />
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="marketing-website-theme">
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* General Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Messages */}
          <Route path="/messages" element={<MessagesPage />} />

           {/* Admin Routes */}
           <Route path="/admin/dashboard" element={<AdminDashboardWrapper />} />
           <Route path="/admin/users" element={<AdminUsersPage />} />
           <Route path="/admin/users/:id/edit" element={<AdminEditUserPage />} />
           <Route path="/admin/users/new" element={<NewUserPage />} />
           <Route path="/admin/projects" element={<AdminProjectsPage />} />
           <Route path="/admin/projects/new" element={<NewProjectPage />} />
           <Route path="/admin/projects/:id" element={<AdminProjectDetailPage />} />
           <Route path="/admin/projects/:id/edit" element={<AdminEditProjectPage />} />
          <Route path="/analytics" element={<AnalyticsDashboardPage />} />
          <Route path="/admin/analytics/:id" element={<AdminProjectAnalyticsPage />} />

          {/* Calendar */}
          <Route path="/calendar" element={<CalendarPage />} />

          {/* Time Tracking */}
          <Route path="/time-tracking" element={<TimeTrackingPage />} />

          {/* Templates */}
          <Route path="/templates" element={<ProjectTemplatesPage />} />

          {/* Reports */}
          <Route path="/reports" element={<ExecutiveDashboardPage />} />

          {/* Search */}
          <Route path="/search" element={<GlobalSearchPage />} />

          {/* Notifications */}
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Advanced Features */}
          <Route path="/ai-insights" element={<AIInsightsPage />} />
          <Route path="/integrations" element={<APIIntegrationsPage />} />
          <Route path="/automation" element={<WorkflowAutomationPage />} />

          {/* Enhanced Dashboard */}
          <Route path="/dashboard/enhanced" element={<EnhancedDashboardPage />} />
          <Route path="/admin/tickets" element={<AdminTicketsPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />

          {/* Developer Routes */}
          <Route path="/developer/dashboard" element={<DeveloperDashboardPage />} />
          <Route path="/developer/tickets" element={<DeveloperTicketsPage />} />

          {/* Coordinator Routes */}
          <Route path="/coordinator/dashboard" element={<CoordinatorDashboardPage />} />

           {/* Client Routes */}
           <Route path="/client/dashboard" element={<ClientDashboardPage />} />
           <Route path="/client/projects" element={<ClientProjectsPage />} />
           <Route path="/client/tickets" element={<ClientTicketsPage />} />
           <Route path="/client/tickets/new" element={<ClientNewTicketPage />} />

          {/* Role Switch */}
          <Route path="/switch-role" element={<SwitchRolePage />} />

           {/* Client Portal login handled by main login */}
          <Route path="/client-portal/dashboard" element={<ClientPortalDashboardPage />} />
          <Route path="/client-portal/project/:id" element={<ClientPortalProjectPage />} />
          <Route path="/client-portal/files" element={<ClientFileSharingPage />} />
          <Route path="/client-portal/feedback" element={<ClientFeedbackPage />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
