# School Equipment Lending Platform - Frontend

A React-based frontend application for managing equipment lending in schools. This system allows students and teachers to request equipment, and lab assistants/admins to approve, issue, and track items.

## Features

### 🔐 User Authentication
- User login and registration
- Role-based access control (student, staff, admin)
- Protected routes
- Profile management

### 📱 User Interface
- **Dashboard**: Overview of statistics and recent activity
- **Equipment Browser**: Browse and search available equipment
- **Request Management**: Submit and track borrowing requests
- **Admin Panel**: Manage requests and view system statistics
- **Profile Page**: Update personal information and password

### 🛠️ Equipment Management
- Browse equipment by category and condition
- Search functionality
- Real-time availability tracking
- Filter by availability status

### 📋 Borrowing System
- Submit borrowing requests with date ranges
- Track request status (pending, approved, borrowed, returned, rejected)
- Admin approval workflow
- Return management

## Tech Stack

- **Frontend**: React 18 with JavaScript
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: CSS3 with responsive design
- **State Management**: React Context API

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Navigation component
│   │   ├── PrivateRoute.js    # Route protection
│   │   └── BorrowModal.js     # Borrow request modal
│   ├── pages/
│   │   ├── Login.js           # Login page
│   │   ├── Register.js        # Registration page
│   │   ├── Dashboard.js       # Main dashboard
│   │   ├── Equipment.js       # Equipment browser
│   │   ├── BorrowRequests.js  # User's requests
│   │   ├── Profile.js         # User profile
│   │   └── AdminPanel.js      # Admin management
│   ├── services/
│   │   ├── api.js             # API configuration
│   │   ├── authService.js     # Authentication services
│   │   ├── equipmentService.js # Equipment services
│   │   └── borrowService.js   # Borrowing services
│   ├── context/
│   │   └── AuthContext.js     # Authentication context
│   ├── App.js                 # Main app component
│   └── index.js               # Entry point
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running on http://localhost:5000

### 1. Clone and Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

If not provided, the app will default to `http://localhost:5000/api`.

### 3. Start Development Server
```bash
npm start
```

The application will start on http://localhost:3000

### 4. Build for Production
```bash
npm run build
```

## Usage

### For Students and Teachers
1. **Register/Login**: Create an account or log in with existing credentials
2. **Browse Equipment**: Navigate to the Equipment page to see available items
3. **Request Equipment**: Click "Request to Borrow" on any available item
4. **Track Requests**: View your request status in "My Requests"
5. **Manage Profile**: Update your information in the Profile section

### For Lab Assistants/Admins
1. **Login**: Use admin credentials (username: `admin`, password: `admin123`)
2. **Approve Requests**: Navigate to Admin Panel → Borrow Requests
3. **Manage Equipment**: View equipment status and availability
4. **Monitor System**: Check statistics and system overview

### Demo Accounts
- **Admin Account**: 
  - Username: `admin`
  - Password: `admin123`
- **Student Account**: Register a new account with role "student"

## API Integration

The frontend integrates with the backend API through the following services:

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Equipment Endpoints
- `GET /equipment` - Get all equipment (with filters)
- `GET /equipment/categories` - Get equipment categories
- `GET /equipment/:id` - Get equipment by ID

### Borrow Request Endpoints
- `GET /borrow` - Get borrow requests
- `POST /borrow` - Create borrow request
- `GET /borrow/stats` - Get dashboard statistics
- `PUT /borrow/:id/approve-reject` - Approve/reject request
- `PUT /borrow/:id/mark-borrowed` - Mark as borrowed
- `PUT /borrow/:id/mark-returned` - Mark as returned

## Features Overview

### Dashboard
- User statistics and quick actions
- Recent borrow requests
- System overview for admins

### Equipment Browser
- Search and filter equipment
- Category and condition filters
- Real-time availability
- Request borrowing modal

### Request Management
- View all personal requests
- Filter by status
- Track request progress
- View admin notes

### Admin Panel
- Approve/reject borrow requests
- Mark items as borrowed/returned
- View system statistics
- Equipment management overview

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development

### Available Scripts
- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routing in `App.js`
4. Add API services in `src/services/`

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure backend server is running on http://localhost:5000
   - Check CORS configuration in backend
   - Verify API endpoints are accessible

2. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token validity
   - Verify backend authentication endpoints

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for JavaScript syntax errors
   - Verify all imports are correct

### Getting Help
- Check browser console for error messages
- Review network tab for API call failures
- Ensure backend API is running and accessible

## Security Features

- JWT token-based authentication
- Protected routes
- Role-based access control
- Automatic token refresh handling
- Secure password handling (frontend validation)



