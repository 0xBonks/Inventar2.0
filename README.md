# Inventory Management System

A web-based inventory management system built with Vue.js and Node.js.

## Features

- Real-time inventory tracking
- User authentication and authorization
- Role-based access control
- Real-time updates using WebSocket
- Comprehensive reporting system
- RESTful API with Swagger documentation

## Tech Stack

### Frontend
- Vue.js 2.x
- Vuex for state management
- Vue Router for routing
- Bootstrap Vue for UI components
- Socket.io client for real-time updates
- Axios for API communication

### Backend
- Node.js with Express
- MySQL database with Sequelize ORM
- JWT for authentication
- Socket.io for WebSocket
- Joi for validation
- Jest for testing

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn
- Docker and Docker Compose (for Docker installation)

## Docker Installation and Usage Guide

### Initial Setup

1. Verify Docker installation:
```bash
docker --version
docker-compose --version
```

2. Clone the repository:
```bash
git clone <repository-url>
cd inventory-management-system
```

3. Start the application:
```bash
docker-compose up --build
```

### Services Setup

The application consists of three main services:
- Frontend (Vue.js) - Port 8080
- Backend (Node.js) - Port 3000
- MySQL Database - Port 3306

### Database Initialization

Once containers are running, open a new terminal and run:

```bash
# Run database migrations
docker-compose exec backend npm run migrate

# Seed the database with initial data
docker-compose exec backend npm run seed
```

### Accessing the Application

1. Frontend Application: http://localhost:8080
2. Backend API: http://localhost:3000
3. API Documentation: http://localhost:3000/api-docs

### Default User Accounts

```
Admin User:
- Email: admin@example.com
- Password: admin123

Manager User:
- Email: manager@example.com
- Password: admin123
```

### Common Docker Commands

#### Container Management
```bash
# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build

# Remove all containers and volumes
docker-compose down -v
```

#### Viewing Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Follow logs in real-time
docker-compose logs -f
```

#### Service Management
```bash
# Restart specific service
docker-compose restart backend
docker-compose restart frontend

# View running containers
docker-compose ps
```

#### Database Operations
```bash
# Access MySQL CLI
docker-compose exec mysql mysql -u user -p

# Run migrations
docker-compose exec backend npm run migrate

# Run seeders
docker-compose exec backend npm run seed
```

### Troubleshooting

1. **Port Conflicts**
   - Error: `port is already allocated`
   - Solution: Check if ports 3000, 8080, or 3306 are in use
   ```bash
   # On Linux/Mac
   sudo lsof -i :3000
   sudo lsof -i :8080
   sudo lsof -i :3306
   ```

2. **Database Connection Issues**
   - Wait for MySQL to fully initialize
   - Check database credentials in docker-compose.yml
   - Verify MySQL container is running:
   ```bash
   docker-compose ps mysql
   ```

3. **Container Build Issues**
   ```bash
   # Clean rebuild
   docker-compose down -v
   docker-compose build --no-cache
   docker-compose up
   ```

4. **Hot Reload Not Working**
   ```bash
   # Restart the frontend service
   docker-compose restart frontend
   ```

### ARM64 Support (M1/M2 Macs)

If you're running on an ARM64 architecture (like M1/M2 Macs), the Docker setup has been configured to support this. However, you might need to:

1. Use MySQL ARM64 image or Mariadb:
```bash
# If MySQL gives ARM64 issues, modify docker-compose.yml to use MariaDB:
image: mariadb:10.6
```

2. If you encounter any platform-specific issues:
```bash
# Clean all containers and volumes
docker-compose down -v

# Rebuild with platform specification
docker-compose build --no-cache

# Start services
docker-compose up
```

## Development

### Code Structure
```
.
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── seeders/
│   ├── tests/
│   └── validations/
└── frontend/
    ├── public/
    └── src/
        ├── assets/
        ├── components/
        ├── router/
        ├── services/
        ├── store/
        └── views/
```
