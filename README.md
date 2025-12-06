<<<<<<< HEAD
# Job Portal - CareersNepal

A full-stack job portal application built with React and Node.js, connecting job seekers with employers in Nepal.

## 🚀 Features

### For Job Seekers
- **Browse Jobs**: View all available job listings
- **Search & Filter**: Filter jobs by location, industry, and salary range
- **Job Details**: View detailed job descriptions
- **Apply for Jobs**: Submit applications for positions
- **Profile Management**: Update profile information and view applied jobs
- **Session Management**: Automatic session tracking to prevent auto-logout

### For Recruiters/Admins
- **Company Management**: Create and manage company profiles
- **Post Jobs**: Create and publish job listings
- **Manage Applications**: View and manage job applications
- **Update Jobs**: Edit existing job postings
- **View Statistics**: See total applications per job

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **Redux Persist** - State persistence
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **Cookie Parser** - Cookie management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd job-portal
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## ⚙️ Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend
Update API endpoints in `frontend/src/utils/constant.js` if needed:
- Default backend URL: `http://localhost:3000`

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
The backend server will run on `http://localhost:3000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── controllers/        # Request handlers
│   │   ├── user.controller.js
│   │   ├── job.controller.js
│   │   ├── company.controller.js
│   │   └── application.controller.js
│   ├── middlewares/         # Custom middlewares
│   │   ├── isAuthenticated.js
│   │   └── multer.js
│   ├── models/              # Database models
│   │   ├── user.model.js
│   │   ├── job.model.js
│   │   ├── company.model.js
│   │   └── application.model.js
│   ├── routes/               # API routes
│   │   ├── user.route.js
│   │   ├── job.route.js
│   │   ├── company.route.js
│   │   └── application.route.js
│   ├── utils/                # Utility functions
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── datauri.js
│   └── index.js              # Server entry point
│
└── frontend/
    ├── src/
    │   ├── components/       # React components
    │   │   ├── admin/        # Admin-specific components
    │   │   ├── auth/         # Authentication components
    │   │   ├── shared/        # Shared components (Navbar, etc.)
    │   │   └── ui/            # UI components
    │   ├── hooks/             # Custom React hooks
    │   │   ├── useActivityTracker.jsx
    │   │   └── useGetAllJobs.jsx
    │   ├── redux/            # Redux store and slices
    │   │   ├── store.js
    │   │   ├── authSlice.js
    │   │   ├── jobSlice.js
    │   │   ├── companySlice.js
    │   │   └── applicationSlice.js
    │   ├── utils/            # Utility functions
    │   │   └── constant.js
    │   ├── App.jsx           # Main app component
    │   └── main.jsx          # Entry point
    └── package.json
```

## 🔌 API Endpoints

### User Routes (`/api/v1/user`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /logout` - User logout
- `PUT /update` - Update user profile

### Job Routes (`/api/v1/job`)
- `GET /get` - Get all jobs (public)
- `GET /get/:id` - Get job by ID (public)
- `POST /post` - Create new job (authenticated)
- `PUT /update/:id` - Update job (authenticated)
- `GET /getadminjobs` - Get admin's jobs (authenticated)

### Company Routes (`/api/v1/company`)
- `POST /create` - Create company (authenticated)
- `GET /get` - Get all companies (authenticated)
- `GET /get/:id` - Get company by ID (authenticated)
- `PUT /update/:id` - Update company (authenticated)

### Application Routes (`/api/v1/application`)
- `POST /apply/:jobId` - Apply for a job (authenticated)
- `GET /get` - Get user's applications (authenticated)
- `GET /check` - Check if user applied (authenticated)
- `GET /:jobId/applicants` - Get job applicants (authenticated)

## ✨ Key Features Implemented

### 1. Authentication & Authorization
- JWT-based authentication with cookie storage
- Role-based access (Student/Recruiter)
- Protected routes for authenticated users
- Session persistence with Redux Persist

### 2. Job Management
- Public job listings (no authentication required)
- Advanced filtering (location, industry, salary)
- Job search functionality
- Job detail pages with application tracking

### 3. Activity Tracking
- Automatic session management
- Prevents auto-logout during active browsing
- Tracks user interactions (mouse, keyboard, scroll)
- Maintains session state automatically

### 4. User Experience
- Responsive design with Tailwind CSS
- Toast notifications for user feedback
- Loading states and error handling
- Smooth navigation with React Router

### 5. Admin Features
- Company profile management
- Job posting and editing
- Application management
- Applicant status updates

## 🎨 UI Components

The application uses a custom UI component library built with:
- Radix UI primitives
- Tailwind CSS for styling
- Shadcn/ui patterns

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Cookie-based session management
- Protected API routes
- Input validation

## 📝 Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React community
- Express.js documentation
- MongoDB documentation
- All open-source contributors

---

**Note**: Make sure to set up your environment variables before running the application. The application requires a MongoDB database connection and Cloudinary account for image uploads.

=======
# shakshis_project
>>>>>>> 917a724056f542e23277d08d4e6beb8146acad25
