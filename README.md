# Warranty Management System (v0)

A comprehensive warranty management system built with Next.js 14, designed for US-based companies. The system is fully implemented in English and includes all necessary features for warranty tracking, customer management, and administrative functions.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: Neon (Serverless PostgreSQL)
- **Authentication**: JWT, bcrypt
- **Email**: SendGrid
- **PDF Generation**: @react-pdf/renderer
- **Deployment**: Vercel

## Key Features

1. **Authentication System**
   - JWT-based authentication
   - Role-based access control (Admin, User)
   - Secure password hashing with bcrypt
   - Session management

2. **Warranty Management**
   - Create and track warranty claims
   - Document upload and management
   - Status tracking
   - PDF generation for warranty documents

3. **User Management**
   - User registration and profile management
   - Role-based permissions
   - User activity logging

4. **Email Notifications**
   - Automated email notifications
   - Status updates
   - Document sharing

5. **Admin Dashboard**
   - Comprehensive analytics
   - User management
   - System configuration

## Project Structure

```text
app/
├── admin/                 # Admin panel
│   ├── layout.jsx         # Admin layout
│   ├── page.jsx           # Admin dashboard
│   └── users/             # User management
├── seller/                # Seller panel
│   ├── layout.jsx         # Seller layout
│   ├── page.jsx           # Seller dashboard
│   └── warranties/        # Warranty management
├── dashboard/             # General dashboards
├── warranty-form/         # Public warranty form
├── api/                   # API endpoints
│   └── auth/              # Authentication
└── login/                 # Login page

components/                # Reusable components
prisma/                    # Prisma configuration
public/                    # Static files
```

## Database Models

### User
- id: String (UUID)
- email: String (unique)
- name: String
- role: String
- password: String
- createdAt: DateTime
- updatedAt: DateTime

### Warranty
- id: String (UUID)
- customerName: String
- address: String
- brand: String
- customerPhone: String
- customerSignature: String
- damageDate: DateTime
- damageDescription: String
- model: String
- purchaseDate: DateTime
- serial: String
- warrantyStatus: String (default: "pending")

### MenuItem
- id: String (UUID)
- name: String
- link: String
- icon: String (optional)
- order: Int
- role: String (default: "admin")
- createdAt: DateTime
- updatedAt: DateTime

## Form Fields

### Customer Warranty Form
Fields filled by the customer:

1. **Personal Information**
   - Full Name (required)
   - Email Address (required)
   - Phone Number (required)
   - Address (required)
   - City (required)
   - State (required)
   - ZIP Code (required)
   - Country (required)

2. **Product Information**
   - Product Brand (required)
   - Product Model (required)
   - Serial Number (required)
   - Purchase Date (required)
   - Purchase Location (required)
   - Purchase Receipt (file upload)

3. **Warranty Claim Details**
   - Issue Description (required)
   - Issue Date (required)
   - Issue Photos (file upload, multiple)
   - Additional Comments

4. **Digital Signature**
   - Customer Signature (required)
   - Date Signed (auto-filled)

### Admin/Seller Form Fields
Fields filled by system users (Admin/Seller):

1. **Warranty Processing**
   - Claim Status (dropdown)
     - Pending
     - In Review
     - Approved
     - Rejected
     - Completed
   - Processing Notes
   - Internal Reference Number
   - Assigned Technician
   - Priority Level
     - Low
     - Medium
     - High
     - Urgent

2. **Technical Assessment**
   - Technical Diagnosis
   - Required Repairs
   - Parts Needed
   - Estimated Repair Time
   - Repair Cost Estimate
   - Warranty Coverage Status
     - Covered
     - Not Covered
     - Partial Coverage

3. **Resolution Details**
   - Resolution Date
   - Resolution Type
     - Repair
     - Replacement
     - Refund
   - Resolution Notes
   - Follow-up Required
   - Follow-up Date

4. **Documentation**
   - Technician Report (file upload)
   - Repair Photos (file upload)
   - Replacement Authorization (file upload)
   - Final Report (file upload)

5. **Communication Log**
   - Customer Contact Date
   - Contact Method
   - Contact Summary
   - Next Steps
   - Follow-up Required

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database (Neon)
DATABASE_URL="your-neon-database-url"

# Authentication
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="24h"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Email (SendGrid)
SENDGRID_API_KEY="your-sendgrid-api-key"
EMAIL_FROM="noreply@yourdomain.com"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
PORT=3000
```

## Database Setup (Neon)

1. Create a Neon database instance
2. Get your connection string from the Neon dashboard
3. Configure Neon for optimal performance:
   - Enable connection pooling
   - Set up automatic scaling
   - Configure read replicas if needed
4. Run Prisma migrations:
```bash
npx prisma migrate dev
```
5. Seed the database:
```bash
npx prisma db seed
```

## Development Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Generate Prisma client:
```bash
npx prisma generate
```
4. Set up environment variables
5. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/login
  - User login
  - Returns JWT token and user data

### Admin Menu
- GET /api/admin/menu
  - Admin menu
  - Requires valid JWT token

### Seller Menu
- GET /api/seller/menu
  - Seller menu
  - Requires valid JWT token

## Production Deployment (Vercel)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard:
   - Add your Neon database URL
   - Add JWT secret
   - Add SendGrid API key
   - Set NODE_ENV to "production"
4. Configure Neon for production:
   - Set up connection pooling
   - Configure automatic scaling
   - Set up monitoring
5. Deploy

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS is properly configured
- Input validation on all forms
- Rate limiting implemented
- Secure headers configured
- Neon-specific security:
  - Connection pooling for better security
  - Automatic scaling for DDoS protection
  - Built-in backup and recovery

## API Documentation

The API is documented using Swagger. Access the documentation at:
```
/api/docs
```

## Testing

Run tests with:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details