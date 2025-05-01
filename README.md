# Warranty Management System

Warranty management system for a US-based company, developed with Next.js, PostgreSQL, and Prisma.

## Getting Started

### 1. Instalar dependencias
```
npm install
```

### 2. Configurar variables de entorno
Copia `.env.example` a `.env.local` y completa los valores.

### 3. Migrar la base de datos
Para desarrollo local o Neon:
```
npm run db:migrate
```

### 4. Ejecutar el servidor
```
npm run dev
```

### 5. Ejecutar pruebas E2E
```
npm run test:e2e
```

### 6. CI/CD y Previews
El workflow `.github/workflows/pr-neon-db.yml` crea una base Neon temporal por PR, corre migraciones y tests automáticamente.

- Asegúrate de tener los secrets `NEON_PROJECT_ID` y `NEON_API_KEY` en GitHub.
- Puedes agregar deploy previews usando la variable `DATABASE_URL` generada por Neon.

## Main Features

- **User Authentication**
  - JWT login
  - Roles: Admin and Seller
  - Route protection by role

- **Admin Panel**
  - Dashboard with statistics
  - User management
  - Warranty management
  - Analysis and reporting
  - System configuration

- **Seller Panel**
  - Custom dashboard
  - Warranty management
  - Create new warranties
  - Track pending warranties
  - User profile

## Technologies Used

- **Frontend**
  - Next.js 14+
  - React
  - Tailwind CSS
  - Heroicons

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL
  - JWT authentication

- **Database**
  - PostgreSQL
  - Prisma ORM

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

## Environment Setup

1. Create a `.env.local` file:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/warranty_system?schema=public
JWT_SECRET=your_jwt_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
PORT=3000
```

2. Install dependencies:
```bash
npm install
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Run the development server:
```bash
npm run dev
```

## Security

- JWT authentication
- Role-based route protection
- Password encryption (bcrypt)
- Token validation

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

## Deployment

The project is ready for deployment on Vercel:
1. Connect your repository to Vercel
2. Set environment variables
3. Deploy automatically

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.