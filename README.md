markdown
# SheriaKE - Legal Tech Platform

A comprehensive legal technology platform connecting clients with lawyers in Kenya. The platform facilitates case management, lawyer discovery, legal AI assistance, and secure messaging.

## 🚀 Features

### For Clients
- **User Registration & Authentication** - Sign up as a client with email verification
- **Case Management** - Post, edit, view, and delete legal cases
- **Find Lawyers** - Browse lawyer profiles with search and filters
- **View Lawyer Profiles** - See lawyer credentials, reviews, and fees
- **Apply to Cases** - Submit applications to represent clients (lawyer feature)
- **Secure Messaging** - Communicate directly with lawyers
- **Case Tracking** - Track application status and case progress

### For Lawyers
- **Professional Profile** - Create and manage legal profile with LSK verification
- **Browse Cases** - Find relevant cases based on practice areas
- **Submit Applications** - Apply to cases with proposed fees and cover letters
- **Track Applications** - View application status (pending/accepted/rejected)
- **Client Messaging** - Communicate with clients when applications are accepted
- **LSK Integration** - Verify credentials with Law Society of Kenya

### General Features
- **AI Legal Assistant** - Get answers to legal questions
- **Public Case Directory** - Browse open cases
- **Lawyer Directory** - Search and filter lawyers by practice area, location, and fees
- **Review System** - Clients can review lawyers after case completion
- **Responsive Design** - Mobile-friendly interface with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - API client
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend (Django REST Framework)
- **Django** - Backend framework
- **Django REST Framework** - API development
- **JWT Authentication** - Secure authentication
- **PostgreSQL** - Database
- **DRF Spectacular** - API documentation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (Django)

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/sheriake-frontend.git
cd sheriake-frontend
2. Install dependencies
bash
npm install
3. Environment Configuration
Create a .env file in the root directory:

env
VITE_API_URL=http://localhost:8000/api
For production:

env
VITE_API_URL=https://your-backend-url.com/api
4. Start the development server
bash
npm run dev
The app will be available at http://localhost:3000

5. Build for production
bash
npm run build
📁 Project Structure
text
src/
├── Components/
│   ├── contexts/
│   │   └── AuthContext.jsx        # Authentication context
│   ├── layout/
│   │   └── Layout.jsx              # Main layout wrapper
│   ├── services/
│   │   ├── api.js                  # Axios configuration
│   │   └── auth.js                 # Auth service
│   └── ProtectedRoute.jsx          # Route protection
├── pages/
│   ├── login.jsx                   # Login page
│   ├── signup.jsx                  # Registration page
│   ├── landingpage.jsx             # Landing page
│   ├── chatAI.jsx                  # AI chat assistant
│   ├── ClientDashboard.jsx         # Client dashboard
│   ├── LawyerDashboard.jsx         # Lawyer dashboard
│   ├── PostCase.jsx                # Post a new case
│   ├── ClientCases.jsx             # View my cases
│   ├── AllCases.jsx                # Browse all cases
│   ├── CaseDetail.jsx              # Case details view
│   ├── FindLawyers.jsx             # Lawyer directory
│   ├── PublicLawyerProfile.jsx     # Public lawyer profile
│   ├── MyLawyerProfile.jsx         # Lawyer's own profile
│   ├── LawyerProfileSetup.jsx      # Create/edit lawyer profile
│   ├── LawyerApplications.jsx      # View applications
│   ├── ApplyToCase.jsx             # Apply to a case
│   └── EditCase.jsx                # Edit case
└── App.jsx                         # Main app with routes
🗺 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register/	User registration
POST	/api/auth/token/	Login (get JWT)
POST	/api/auth/token/refresh/	Refresh JWT token
GET	/api/auth/me/	Get current user
Cases
Method	Endpoint	Description
GET	/api/marketplace/cases/	List all cases
POST	/api/marketplace/cases/	Create a case
GET	/api/marketplace/cases/{id}/	Get case details
PATCH	/api/marketplace/cases/{id}/	Update case
DELETE	/api/marketplace/cases/{id}/	Delete case
Lawyers
Method	Endpoint	Description
GET	/api/marketplace/lawyers/	List all lawyers
GET	/api/marketplace/lawyers/{id}/	Get lawyer profile
GET	/api/marketplace/my-lawyer-profile/	Get own profile
POST	/api/marketplace/my-lawyer-profile/	Create profile
PATCH	/api/marketplace/my-lawyer-profile/{id}/	Update profile
POST	/api/marketplace/my-lawyer-profile/verify-lsk/	LSK verification
Applications
Method	Endpoint	Description
GET	/api/marketplace/applications/	List applications
POST	/api/marketplace/applications/	Submit application
PATCH	/api/marketplace/applications/{id}/status/	Update status
Messaging
Method	Endpoint	Description
GET	/api/messaging/conversations/	List conversations
POST	/api/messaging/conversations/	Create conversation
GET	/api/messaging/messages/	List messages
POST	/api/messaging/messages/	Send message
🔐 Authentication Flow
User registers with email/username and password

User logs in to receive JWT access and refresh tokens

Access token is stored in localStorage

Token is automatically attached to all API requests

Token refreshes automatically when expired

On logout, tokens are removed from localStorage

🎨 Styling
The project uses Tailwind CSS with a custom color scheme:

Primary Navy: #1e4a6e, #153a56, #081c2b

Primary Gold: #d47a1a, #e89432, #f4ab5b

📱 Responsive Design
Mobile-first approach

Collapsible navigation menu on mobile

Responsive grid layouts

Touch-friendly buttons and inputs

🧪 Testing
Run the development server and test the following flows:

Client Flow
Register as client

Login

Post a case

Browse lawyers

View lawyer profiles

Check case status

Lawyer Flow
Register as lawyer

Complete profile with LSK verification

Browse open cases

Apply to cases

Track applications

Message client when accepted

🚢 Deployment
Build for production
bash
npm run build
The build output will be in the dist/ directory.

Environment Variables for Production
env
VITE_API_URL=https://your-backend-api.com/api
Deploy to Vercel
bash
npm install -g vercel
vercel
Deploy to Netlify
bash
npm install -g netlify-cli
netlify deploy
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open a Pull Request

📄 License
This project is proprietary and confidential.

👥 Authors
Your Name - Initial work

🙏 Acknowledgments
Law Society of Kenya for lawyer verification API

Django REST Framework community

React community

📞 Support
For support, email support@sheriake.com or open an issue in the repository.

🔄 Version History
v1.0.0 - Initial release

User authentication (client/lawyer)

Case posting and management

Lawyer directory and profiles

Case applications

Basic messaging

AI chat assistant

🐛 Known Issues
Lawyer LSK verification may take a few seconds

File attachments in messages limited to 10MB

Real-time messaging requires page refresh (WebSocket coming soon)

🗓 Roadmap
Real-time WebSocket messaging

Video consultation integration

Payment gateway integration

Mobile app (React Native)

Email notifications

Document sharing

Case timeline tracking

Advanced search filters

Calendar integration for consultations

Made with ❤️ for the Kenyan legal community

text

This README provides:
1. **Project overview** - What SheriaKE does
2. **Tech stack** - Technologies used
3. **Installation instructions** - How to set up
4. **Project structure** - File organization
5. **API endpoints** - Backend integration points
6. **Authentication flow** - How auth works
7. **Testing flows** - How to test features
8. **Deployment** - How to deploy
9. **Roadmap** - Future features

Would you like me to add or modify any sections?
