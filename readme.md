# Nova – Full Stack Video Platform

Nova is a production-ready full-stack video platform that allows users to discover and organize videos with synchronized playlists and secure authentication.

The project focuses on **building a reliable, scalable backend system** with modern deployment practices rather than just UI features.

## Tech Stack

Frontend
- React
- Vite
- Axios
- Nginx (production serving)

Backend
- Node.js
- Express.js
- MongoDB
- Redis (caching)

Infrastructure
- Docker
- Nginx Reverse Proxy
- Production deployment on Render

Security
- JWT Authentication
- Role Based Access Control (RBAC)
- Rate Limiting
- Security Headers (Helmet)
- Request Validation
- Account Locking
- Password Reset Flow

Observability
- Winston Logging
- Morgan Request Logging
- Centralized Error Handling

---

# Key Features

### Authentication & Security
- Secure JWT based authentication with **access token expiry handling**
- **Role-Based Access Control (RBAC)** to restrict sensitive actions
- **Account lock after multiple failed login attempts**
- **Password reset flow with secure token verification**
- Email notifications triggered after repeated failed login attempts

### Reliability & Error Handling
- Implemented **centralized error handling** using custom `ApiError` and `ApiResponse` classes
- Structured error responses across all API endpoints
- Request validation middleware for all protected routes

### Performance Optimization
- Implemented **Redis caching layer** to reduce API latency
- Integrated **rate limiting on authentication routes** to prevent brute-force attacks
- Optimized YouTube API usage with error handling and request management

### Logging & Observability
- **Winston based centralized logging system**
- **Morgan HTTP request logging**
- Logs structured for debugging production issues and monitoring API behavior

### Infrastructure & Deployment
- Containerized the entire application using **Docker**
- Configured **Nginx as a reverse proxy for frontend serving**
- Multi-service architecture with frontend and backend containers
- Production deployment on Render for real-world hosting

---

# Architecture
Client (Browser) <-> Nginx Reverse Proxy <-> Frontend (React) <-> Backend (Express) <-> MongoDB / Redis


---

# Local Development

Clone the repository


git clone https://github.com/VaishnaviNagrale/Nova.git

cd nova


Run using Docker


docker-compose up --build


Application will be available at


http://localhost:5173


---

# Environment Variables

Frontend


VITE_API_BASE_URL=http://localhost:8000


Backend


PORT=8000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
YOUTUBE_API_KEY=your_key


---

# Future Improvements

- Distributed caching strategy
- CI/CD pipeline for automated deployments
- Metrics monitoring (Prometheus / Grafana)
- Horizontal scaling using Kubernetes