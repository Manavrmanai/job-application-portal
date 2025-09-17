# Job Application Portal API

A comprehensive RESTful API built with Node.js that enables job seekers to register, upload resumes, apply for jobs, and track their applications. Employers can manage job postings and review applications.

## 🚀 Features

- **User Authentication**: Secure registration and login using JWT tokens
- **Role-Based Access**: Separate functionality for job seekers and employers  
- **Resume Management**: Upload, download, and delete resume files (PDF/DOC/DOCX)
- **Job Management**: Create, update, delete, and search job listings
- **Application System**: Apply for jobs and track application status
- **File Upload**: Secure file handling with validation using Multer

## 🛠 Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer middleware
- **Password Security**: bcryptjs for hashing
- **Environment**: dotenv for configuration

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn package manager

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Manavrmanai/job-application-portal.git
cd job-application-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/jobportal

# For MongoDB Atlas (Production/Cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal?retryWrites=true&w=majority

PORT=10000
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 4. Database Setup
Choose one of the following options:

#### Option A: Local MongoDB
Make sure MongoDB is running on your system:
```bash
# For Windows
net start MongoDB

# For macOS
brew services start mongodb/brew/mongodb-community

# For Linux
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Recommended for Production)
1. Create account at https://www.mongodb.com/atlas
2. Create a free M0 cluster
3. Create database user and get connection string
4. Update your `.env` file with the Atlas connection string
5. Whitelist your IP address (or 0.0.0.0/0 for testing)


### 5. Seed Sample Data (Optional)
```bash
node seedjobs.js
```

### 6. Start the Server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:10000`

## 📁 Project Structure

```
job-application-portal/
├── models/
│   ├── user.js              # User schema (job seekers & employers)
│   ├── jobs.js              # Job posting schema
│   └── application.js       # Job application schema
├── routes/
│   ├── users.js             # User auth & profile routes
│   ├── job.js               # Job management routes
│   └── applications.js      # Application management routes
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── errorHandler.js      # Global error handling middleware
├── utils/
│   ├── db.js                # Database connection
│   └── multer.js            # File upload configuration
├── uploads/
│   └── resumes/             # Uploaded resume files
├── .env                     # Environment variables
├── server.js                # Main application entry point
├── seedjobs.js              # Sample data seeder
└── package.json             # Dependencies and scripts
```

## 📚 API Documentation

### Base URL
```
http://localhost:10000/api
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 User Authentication

### Register User
**POST** `/api/users/register`

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "role": "jobseeker",
    "location": "New York",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": 2
}
```

**Response (201):**
```json
{
    "message": "user registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "66e123abc456def789012345",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "jobseeker"
    }
}
```

### Login User
**POST** `/api/users/login`

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response (200):**
```json
{
    "message": "user logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "66e123abc456def789012345",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "jobseeker"
    }
}
```

---

## 👤 User Profile Management

### Get User Profile
**GET** `/api/users/profile`
- **Headers**: `Authorization: Bearer <token>`

**Response (200):**
```json
{
    "user": {
        "id": "66e123abc456def789012345",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "location": "New York",
        "skills": ["JavaScript", "React"],
        "experience": 2,
        "role": "jobseeker",
        "resume": "uploads/resumes/1726477200000-66e123abc.pdf",
        "hasResume": true
    }
}
```

### Upload Resume
**POST** `/api/users/upload-resume`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `form-data` with key `resume` (file upload)
- **Accepted formats**: PDF, DOC, DOCX
- **Max size**: 5MB

**Response (200):**
```json
{
    "message": "Resume uploaded successfully",
    "fileName": "1726477200000-66e123abc.pdf",
    "filePath": "uploads/resumes/1726477200000-66e123abc.pdf",
    "user": {
        "id": "66e123abc456def789012345",
        "name": "John Doe",
        "email": "john@example.com",
        "resume": "uploads/resumes/1726477200000-66e123abc.pdf",
        "hasResume": true
    }
}
```

### Download Resume
**GET** `/api/users/:userId/resume`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: File download

### Delete Resume
**DELETE** `/api/users/resume`
- **Headers**: `Authorization: Bearer <token>`

**Response (200):**
```json
{
    "message": "Resume deleted successfully"
}
```

---

## 💼 Job Management

### Create Job (Employer Only)
**POST** `/api/jobs/`
- **Headers**: `Authorization: Bearer <employer_token>`

**Request Body:**
```json
{
    "title": "Senior Frontend Developer",
    "company": "Google",
    "description": "Build amazing user interfaces with React and TypeScript",
    "requirements": ["React", "TypeScript", "Node.js", "5+ years experience"],
    "location": "Mountain View, CA",
    "salary": "₹25,00,000",
    "jobtype": "full-time"
}
```

**Response (201):**
```json
{
    "message": "Job created successfully",
    "job": {
        "_id": "66e123abc456def789012345",
        "title": "Senior Frontend Developer",
        "company": "Google",
        "description": "Build amazing user interfaces with React and TypeScript",
        "requirements": ["React", "TypeScript", "Node.js"],
        "location": "Mountain View, CA",
        "salary": "₹25,00,000",
        "jobtype": "full-time",
        "employer": "66e123abc456def789012344",
        "isActive": true,
        "createdAt": "2024-09-17T10:30:00.000Z"
    }
}
```

### Get All Jobs (Public)
**GET** `/api/jobs/`

**Response (200):**
```json
{
    "message": "Jobs retrieved successfully",
    "count": 10,
    "jobs": [
        {
            "_id": "66e123abc456def789012345",
            "title": "Frontend Developer",
            "company": "Google",
            "description": "Build responsive UI using React and Next.js",
            "location": "Bangalore",
            "salary": "₹12,00,000",
            "jobtype": "full-time",
            "employer": {
                "name": "Google HR",
                "email": "hr@google.com"
            },
            "createdAt": "2024-09-17T10:30:00.000Z"
        }
    ]
}
```

### Get Job Details
**GET** `/api/jobs/:id`

### Search Jobs
**GET** `/api/jobs/?title=developer&location=bangalore&jobtype=full-time`

### Update Job (Employer Only)
**PATCH** `/api/jobs/:id`
- **Headers**: `Authorization: Bearer <employer_token>`

### Delete Job (Employer Only)
**DELETE** `/api/jobs/:id`
- **Headers**: `Authorization: Bearer <employer_token>`

### Get Employer's Jobs
**GET** `/api/jobs/jobs`
- **Headers**: `Authorization: Bearer <employer_token>`

---

## 📄 Job Applications

### Apply for Job (Job Seeker Only)
**POST** `/api/applications/:jobId`
- **Headers**: `Authorization: Bearer <jobseeker_token>`
- **Note**: User must have uploaded resume first

**Request Body:**
```json
{
    "coverletter": "I am very excited to apply for this position. My experience with React and Node.js makes me a perfect fit..."
}
```

**Response (201):**
```json
{
    "message": "Application submitted successfully",
    "application": {
        "_id": "66e123abc456def789012346",
        "job": {
            "_id": "66e123abc456def789012345",
            "title": "Frontend Developer",
            "company": "Google",
            "location": "Bangalore"
        },
        "applicant": {
            "_id": "66e123abc456def789012347",
            "name": "John Doe",
            "email": "john@example.com",
            "resume": "uploads/resumes/1726477200000-66e123abc.pdf"
        },
        "status": "pending",
        "appliedAt": "2024-09-17T10:30:00.000Z"
    }
}
```

### Get User's Applications
**GET** `/api/applications/`
- **Headers**: `Authorization: Bearer <jobseeker_token>`

**Response (200):**
```json
{
    "message": "Applications retrieved successfully",
    "count": 2,
    "applications": [
        {
            "_id": "66e123abc456def789012346",
            "job": {
                "_id": "66e123abc456def789012345",
                "title": "Frontend Developer",
                "company": "Google",
                "location": "Bangalore",
                "salary": "₹12,00,000"
            },
            "status": "pending",
            "appliedAt": "2024-09-17T10:30:00.000Z"
        }
    ]
}
```

### Get Applications for Job (Employer Only)
**GET** `/api/applications/:jobId/applications`
- **Headers**: `Authorization: Bearer <employer_token>`

### Update Application Status (Employer Only)
**PATCH** `/api/applications/:id/status`
- **Headers**: `Authorization: Bearer <employer_token>`

**Request Body:**
```json
{
    "status": "reviewed"
}
```
*Valid statuses: "pending", "reviewed", "accepted", "rejected"*

---

## 🔒 Authentication & Authorization

### Role-Based Access Control

- **Public Endpoints**:
  - Get all jobs
  - Get job details
  - Search jobs
  - User registration
  - User login

- **Job Seeker Only**:
  - Apply for jobs
  - View own applications

- **Employer Only**:
  - Create jobs
  - Update own jobs
  - Delete own jobs
  - View applications for own jobs
  - Update application status

- **Authenticated Users**:
  - Upload/download/delete resume
  - View profile
  - View specific application details

### Error Responses

#### 400 - Bad Request
```json
{
    "message": "File too large. Maximum size allowed is 5MB.",
    "error": "FILE_TOO_LARGE"
}
```
```json
{
    "message": "Invalid file type. Only PDF, DOC, and DOCX files are allowed.",
    "error": "INVALID_FILE_TYPE"
}
```

#### 401 - Unauthorized
```json
{
    "message": "Invalid token",
    "error": "INVALID_TOKEN"
}
```

#### 403 - Forbidden
```json
{
    "message": "Access denied, insufficient permissions",
    "error": "ACCESS_DENIED"
}
```

#### 404 - Not Found
```json
{
    "message": "Resource not found",
    "error": "NOT_FOUND"
}
```

#### 500 - Server Error
```json
{
    "message": "Internal server error occurred.",
    "error": "SERVER_ERROR"
}
```

---

## 🧪 Testing the API

### Using Postman

1. **Import the collection** (you can create one with all endpoints)
2. **Set up environment variables**:
   - `baseURL`: `http://localhost:10000/api`
   - `token`: `{{token}}` (will be set automatically after login)

### Sample Testing Workflow

1. **Register a job seeker and employer**
2. **Login to get JWT tokens**
3. **Upload resume** (job seeker)
4. **Create a job** (employer)
5. **Apply for the job** (job seeker)
6. **View applications** (both roles)
7. **Update application status** (employer)

---

## 🚀 Deployment

### Deploy to Render

1. **Push code to GitHub**
2. **Create new Web Service on Render**
3. **Connect your GitHub repository**
4. **Set environment variables**:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_production_jwt_secret
   NODE_ENV=production
   ```
5. **Deploy and get live URL**

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal
PORT=10000
JWT_SECRET=your_super_secure_production_jwt_secret_key
NODE_ENV=production
```

---

## ⚠️ Important Notes

### Security Considerations
- JWT tokens expire in 7 hours
- Passwords are hashed using bcrypt
- File uploads are validated for type and size
- Role-based access control prevents unauthorized actions

---

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid token" error**:
   - Ensure token format: `Bearer <token>`
   - Check if token is expired
   - Verify JWT_SECRET in environment

2. **File upload fails**:
   - Check file size (max 5MB)
   - Verify file type (PDF/DOC/DOCX only)
   - Ensure uploads directory exists

3. **Database connection error**:
   - Verify MongoDB is running
   - Check MONGODB_URI in .env file
   - Ensure database permissions

---

##  License

This project is created for educational/internship purposes.