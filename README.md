# 🤖 Enterprise AI Assistant

An enterprise-grade AI-powered management platform designed to help organizations manage employees, attendance, leaves, documents, and internal knowledge through a centralized web application.

The application combines **FastAPI, React, PostgreSQL, JWT authentication, document management, RAG, and Generative AI** to provide a secure and intelligent enterprise assistant.

---


## 🚀 Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Secure login
- Current-user authentication
- Role-based access control
- Protected frontend routes
- Backend API permission validation
- Unauthorized access handling

### 👥 Employee Management

- Add employees
- View employee list
- View employee details
- Update employee information
- Delete employees
- Employee status management
- Role-based employee access

### 🏖️ Leave Management

- Apply for leave
- View leave requests
- Employee leave history
- Update leave requests
- Approve leave requests
- Reject leave requests
- Delete leave requests
- Role-based leave permissions

### 🕐 Attendance Management

- Attendance records
- Attendance listing
- Attendance filtering
- Attendance details
- Attendance management based on user permissions

### 📄 Document Management

- Upload documents
- View uploaded documents
- Document details
- PDF/document viewing
- Document metadata
- Document reindexing
- Delete documents
- Knowledge-base document management

### 🧠 AI Assistant

- AI-powered enterprise assistant
- Document-based question answering
- Retrieval-Augmented Generation (RAG)
- Knowledge-base integration
- Vector-based document retrieval
- Generative AI integration

### 📊 Dashboard

- Employee statistics
- Department information
- Leave statistics
- Organization overview
- Dashboard analytics
- Quick actions
- Recent activity
- Role-based dashboard access

### 🛡️ Security

- JWT authentication
- Role-based authorization
- Protected API endpoints
- Frontend route protection
- Backend permission validation
- Environment-based configuration
- Sensitive files excluded through `.gitignore`

---

## 👤 User Roles

The application supports the following enterprise roles:

| Role | Access |
|------|--------|
| **Admin** | Full system access |
| **HR** | Employee, leave, and document management |
| **Employee** | Personal employee features, leave requests, and permitted resources |

Backend permissions are enforced using role-based access control (RBAC), and the frontend mirrors these permissions through protected routes and role-gated navigation.

---

## 🧠 AI & RAG Architecture

The AI Assistant uses a Retrieval-Augmented Generation (RAG) approach.

### Basic Flow

```text
User
  │
  ▼
React Frontend
  │
  ▼
FastAPI Backend
  │
  ▼
AI / RAG Service
  │
  ├── Document Processing
  ├── Embedding Generation
  ├── Vector Store
  └── Relevant Context Retrieval
  │
  ▼
Generative AI
  │
  ▼
AI Response
```

Documents can be uploaded into the knowledge base and indexed for retrieval by the AI assistant.

---

## 🏗️ Project Architecture

```text
Enterprise-AI-Assistant/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── .gitignore
├── package.json
├── package-lock.json
└── requirements.txt
```

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Axios
- React Icons

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication

### Database
- PostgreSQL

### AI
- Generative AI
- Retrieval-Augmented Generation (RAG)
- Embeddings
- Vector Store
- Gemini / OpenAI integration

### Development Tools
- Git
- GitHub
- VS Code
- Python Virtual Environment
- npm

---

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/ankitiqcode/Enterprise-AI-Assistant.git
cd Enterprise-AI-Assistant
```

### ⚙️ Backend Setup

Go to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Activate it on macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
uvicorn app.main:app --reload
```

Backend will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

### 💻 Frontend Setup

Open another terminal and go to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

Create the required environment configuration for the backend (e.g. `backend/.env`).

Example:

```env
DATABASE_URL=your_database_connection_string
SECRET_KEY=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

> ⚠️ Never commit `.env` files or API keys to GitHub.

---

## 🔒 Role-Based Access Control

The backend validates user roles before allowing access to protected endpoints.

Example:

```python
require_roles(
    "admin",
    "hr"
)
```

This provides an additional security layer beyond frontend route protection.

---

## 📡 API Modules

The backend provides API modules for:

- `/auth`
- `/employees`
- `/leave`
- `/documents`
- `/attendance`
- `/departments`
- `/ai`

Interactive API documentation is available through FastAPI Swagger:

```text
http://127.0.0.1:8000/docs
```

---

## 📄 Document Processing

The document management module supports:

```text
Upload
   ↓
Document Storage
   ↓
Text / Document Processing
   ↓
Embedding Generation
   ↓
Vector Store
   ↓
RAG Retrieval
   ↓
AI Assistant
```

This allows the AI assistant to use uploaded enterprise documents as a knowledge source.

---

## 🧪 Testing Checklist

Before deployment, verify the following:

### Authentication
- [ ] Login works
- [ ] Logout works
- [ ] Invalid credentials are rejected
- [ ] Protected routes require authentication

### Employee
- [ ] Add employee
- [ ] Edit employee
- [ ] Delete employee
- [ ] Employee list loads correctly

### Leave
- [ ] Employee can apply for leave
- [ ] Leave history works
- [ ] HR/Admin can approve leave
- [ ] HR/Admin can reject leave
- [ ] Unauthorized roles receive a 403 response

### Documents
- [ ] Upload document
- [ ] View document
- [ ] PDF view works
- [ ] Reindex document
- [ ] Delete document

### AI Assistant
- [ ] AI Assistant opens
- [ ] Questions can be submitted
- [ ] Knowledge-base retrieval works
- [ ] AI response is returned

### Dashboard
- [ ] Employee count is correct
- [ ] Department information is correct
- [ ] Leave statistics are correct
- [ ] Dashboard loads without errors

---

## 🔐 Security Notes

The following files and directories should **not** be committed:

```text
.env
venv/
backend/venv/
node_modules/
backend/app/chroma_db/
backend/app/uploads/
*.sqlite3
```

These are excluded through `.gitignore`.

---

## 📸 Screenshots

Add project screenshots to a `docs/` directory:

```text
docs/
├── login.png
├── dashboard.png
├── employees.png
├── leave.png
├── documents.png
└── ai-assistant.png
```

Then reference them in this README using Markdown:

```markdown
![Dashboard](docs/dashboard.png)
```

---

## 🚀 Future Enhancements

Possible future improvements:

- Email notifications
- Advanced analytics
- Employee performance tracking
- Automated HR reports
- AI-generated reports
- Multi-document conversational search
- Production deployment
- Cloud storage integration
- Automated testing
- CI/CD pipeline

---

## 👨‍💻 Author

**Ankit Verma**

GitHub: [https://github.com/ankitiqcode](https://github.com/ankitiqcode)

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📜 License

This project is intended for educational, development, and portfolio purposes.
