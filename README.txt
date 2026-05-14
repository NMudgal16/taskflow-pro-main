Team Task Manager

A full-stack task management application for creating projects, assigning work to team members, and tracking progress with Admin and Member role-based access control.

Tech Stack
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose
- Auth: JWT and bcrypt
- Deployment: Railway for backend, Vercel for frontend

Features
- Signup and login with JWT authentication
- Password hashing with bcrypt
- Protected routes with token stored in localStorage
- Admin and Member role-based access control
- Admin project creation, deletion, and member assignment by email
- Admin task creation, assignment, status updates, and deletion
- Member-only view of assigned tasks
- Member task status updates
- Task assignment restricted to project members
- Automatic overdue status update when due date has passed
- Dashboard summary cards for total, completed, in progress, and overdue tasks
- Task filters by status, priority, and project
- Responsive Tailwind UI with sidebar navigation
- Loading states, toast notifications, and empty states

How To Run Locally

1. Clone or open the project folder.

2. Install backend dependencies:
   cd backend
   npm install

3. Create backend environment file:
   copy .env.example .env

4. Add real backend values in backend/.env:
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret

5. Start the backend:
   npm run dev

6. Install frontend dependencies from a second terminal:
   cd frontend
   npm install

7. Create frontend environment file:
   copy .env.example .env

8. Add local frontend API value in frontend/.env:
   REACT_APP_API_URL=http://localhost:5000

9. Start the frontend:
   npm start

10. Open:
   http://localhost:3000

API Routes
- POST /api/auth/register
- POST /api/auth/login
- GET /api/projects
- POST /api/projects
- DELETE /api/projects/:id
- POST /api/projects/:id/members
- DELETE /api/projects/:id/members/:memberId
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

Environment Variables

Backend:
- PORT: Express server port. Example: 5000
- MONGODB_URI: MongoDB Atlas connection string
- JWT_SECRET: Secret used to sign and verify JWT tokens
- CLIENT_URL: Optional comma-separated list of allowed frontend origins

Frontend:
- REACT_APP_API_URL: Backend API URL. Use http://localhost:5000 locally and your Railway URL in production.

Deployment Instructions

Railway Backend:
1. Push this project to GitHub.
2. Create a new Railway project from the GitHub repository.
3. Set the Railway start command through the included Procfile:
   web: node backend/server.js
4. Add environment variables in the Railway dashboard:
   MONGODB_URI
   JWT_SECRET
   PORT
   CLIENT_URL
5. Deploy and copy the Railway backend URL.

Vercel Frontend:
1. Import the same GitHub repository in Vercel.
2. Set the root directory to frontend.
3. Add environment variable:
   REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app
4. Deploy the frontend.
5. Add the Vercel frontend URL to Railway as CLIENT_URL.

Live URL
- Frontend: Not deployed yet
- Backend: Not deployed yet

GitHub Repo Link
- https://github.com/Dev123dahiya/taskflow-pro.git

Demo Video Link
- Not recorded yet
