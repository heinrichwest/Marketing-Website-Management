# Marketing Website Management System

A comprehensive Next.js application for managing marketing websites and social media presence, enabling admins to assign projects to developers, track progress, and view analytics.

## Features

- **User Authentication**: Secure login and registration with role-based access (Admin, Developer, Client, Social Media Coordinator).
- **Admin Dashboard**:
  - View and manage all projects.
  - Assign developers, clients, and social media coordinators to projects.
  - Edit project details (name, description, URL, stage, status, analytics IDs).
  - Monitor overall project progress and user activity.
- **Developer Dashboard**:
  - View assigned projects and their details.
  - Track assigned tickets, update their status, and add comments.
  - Access project-specific notes and requirements.
- **Client Dashboard**:
  - Create and manage tickets for their projects.
  - Assign tickets to developers.
  - Monitor project progress and verify completed work.
- **Social Media Coordinator Dashboard**:
  - Manage social media analytics and track engagement metrics.
  - Coordinate social media strategies for assigned projects.
- **Role Switching**: Allows users to switch between different roles if they have multiple assignments.
- **Dynamic Routing**: Role-based navigation and access control for different dashboards and project views.



## Project Structure

```
.
├── app/
│   ├── (auth)/                         # Authentication routes (login, register)
│   ├── (main)/                         # Main application routes (dashboard, projects)
│   ├── admin/                          # Admin specific routes and dashboards
│   ├── client/                         # Client specific routes and dashboards
│   ├── coordinator/                    # Social Media Coordinator routes and dashboards
│   ├── developer/                      # Developer specific routes and dashboards
│   ├── switch-role/                    # Role switching interface
│   ├── globals.css                     # Global styles
│   └── layout.tsx                      # Root layout
├── components/                         # Reusable UI components
│   ├── ui/                             # Shadcn UI components
│   └── (custom)/                       # Custom components (navbar, footer, badges, etc.)
├── context/                            # React context providers (e.g., AuthContext)
├── lib/                                # Utility functions and mock data
│   ├── mock-data.ts                    # Mock data for development
│   └── utils.ts                        # General utility functions
├── public/                             # Static assets (images, icons)
├── types/                              # TypeScript type definitions
└── ...                                 # Other configuration files (package.json, next.config.mjs, etc.)
```

## Getting Started

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the app.



## Backend Integration Points

The following areas are designed for backend integration:

1.  **Authentication**: User login, registration, and role management.
2.  **User Management**: CRUD operations for users and their roles.
3.  **Project Management**: CRUD operations for projects, including assignments of users.
4.  **Ticket Management**: CRUD operations for tickets, including assignment and status updates.
5.  **Analytics Integration**: Connecting to external analytics services (e.g., Google Analytics).
6.  **File Storage**: For handling uploaded assets like images and documents.

## Design System

- **Primary Color**: Teal (#0D9488)
- **Accent**: Gold (#F59E0B)
- **Font**: Inter
- **UI Framework**: Tailwind CSS v4

## Key Features for Implementation

### Form Validation
- Required field validation
- Email format validation
- Specific validation rules for project and ticket data

### UI Interactions
- Toast notifications for user feedback
- Tab-based navigation
- Filter, search, and sorting functionality for projects and tickets
- Responsive layouts for all dashboards and forms

### Security Considerations
- Role-Based Access Control (RBAC) implementation
- Secure API communication
- Form validation on client and backend
- Secure file upload handling

## Future Enhancements

-   Integration with various marketing platforms (e.g., social media APIs, email marketing services).
-   Advanced reporting and analytics features.
-   Customizable project templates.
-   Enhanced user collaboration tools (e.g., in-app messaging).
-   Multi-language support.
-   Integration with CI/CD pipelines for website deployments.
-   Automated testing frameworks.

## Support

This is a static frontend prototype. All functionality is UI-only and ready for backend integration.

For backend integration, connect the API endpoints and implement the following services:
- User authentication
- Voucher database
- Payment processing
- Email notifications

