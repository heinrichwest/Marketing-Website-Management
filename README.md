# VoucherTrade - Frontend Prototype

A complete, responsive Next.js frontend for VoucherTrade, a South African digital voucher and gift card trading platform.

## Features

- **Homepage**: Hero section with value proposition, testimonials, and CTA
- **Browse Vouchers**: Grid layout with filtering, search, and sorting
- **Voucher Details**: Full pricing breakdown showing buyer savings and seller payout
- **Seller Upload**: Form with automatic pricing calculations
- **Authentication**: Login and registration with role selection
- **User Dashboard**: Tabbed interface for My Vouchers, Sales, Payouts, and Settings
- **Admin Panel**: Voucher verification queue with approve/reject functionality

## Pricing Model

- **Buyers**: Pay 90% of face value (10% discount)
- **Sellers**: Receive 70% of face value
- **Minimum Voucher**: R500

## Project Structure

\`\`\`
app/
├── page.tsx                    # Homepage
├── vouchers/
│   └── page.tsx               # Browse vouchers
├── voucher/[id]/
│   └── page.tsx               # Voucher detail
├── upload/
│   └── page.tsx               # Seller upload form
├── login/
│   └── page.tsx               # Login page
├── register/
│   └── page.tsx               # Registration page
├── dashboard/
│   └── page.tsx               # User dashboard
├── admin/
│   └── page.tsx               # Admin panel
└── globals.css                # Global styles

components/
├── navbar.tsx                 # Navigation bar
├── footer.tsx                 # Footer
├── toast.tsx                  # Toast notifications
├── voucher-card.tsx           # Reusable voucher card
├── price-breakdown.tsx        # Pricing display
├── verified-badge.tsx         # Verification badge
├── stats-grid.tsx             # Stats display grid
├── form-field.tsx             # Form field wrapper
└── filter-sidebar.tsx         # Filter component

data/
├── vouchers.json              # Mock voucher data
└── categories.json            # Categories

\`\`\`

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

## Mock Data

The app uses static JSON data in `/data/` directory with 10 sample vouchers across popular SA outlets (Takealot, Woolworths, Netflix, Spotify, etc.).

## Backend Integration Points

The following pages/components are ready for backend wiring:

1. **Upload Form** (`/upload`) - Connect to voucher submission API
2. **Login** (`/login`) - Integrate auth service
3. **Register** (`/register`) - Integrate user creation
4. **Browse/Detail** (`/vouchers`) - Connect to voucher listing API
5. **Dashboard** (`/dashboard`) - Connect to user data API
6. **Admin** (`/admin`) - Connect to verification queue API

Each page includes comments indicating where backend hooks should be added.

## Design System

- **Primary Color**: Teal (#0D9488)
- **Accent**: Gold (#F59E0B)
- **Font**: Inter
- **UI Framework**: Tailwind CSS v4

## Key Features for Implementation

### Form Validation
- Minimum R500 voucher value
- Required field validation
- Email format validation

### UI Interactions
- Toast notifications for user feedback
- Tab-based navigation
- Filter and search functionality
- Responsive grid layouts

### Security Considerations
- Row Level Security (RLS) ready for database
- Form validation on client and backend (to be added)
- Secure file upload handling (to be added)

## Future Enhancements

- Payment processing integration (Stripe)
- Email notifications
- User authentication with JWT
- Database persistence
- File upload to cloud storage
- Advanced search and filtering
- User ratings and reviews
- Transaction history and analytics

## Support

This is a static frontend prototype. All functionality is UI-only and ready for backend integration.

For backend integration, connect the API endpoints and implement the following services:
- User authentication
- Voucher database
- Payment processing
- Email notifications
# Marketing-Website-Management-
# Marketing-Website-Management-
