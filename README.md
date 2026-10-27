# User Management System

A full-stack User Management application built with React and ASP.NET Core Web API.

This personal project focuses on developing modern React frontend applications, integrating RESTful APIs, implementing authentication, and managing data using Entity Framework Core and SQL Server.

## Tech Stack

**Frontend**
- React
- JavaScript
- React Router
- HTML5 / CSS3
- React Hooks

**Backend**
- C#
- ASP.NET Core Web API
- Entity Framework Core
- RESTful APIs

**Database**
- SQL Server / Azure SQL Database

**Authentication**
- Cookie-based Authentication
- CSRF Protection
- ASP.NET Core Password Hasher

## Features

### User Management
- Create, view, update and delete users
- Search users by name or email
- Server-side pagination
- Form validation
- Loading and error handling

### Authentication
- User login and logout
- Cookie-based authentication
- Authentication state verification
- Protected API endpoints
- CSRF protection for authenticated requests
- Secure password hashing

### React Frontend
- Reusable components for user tables and forms
- State management using React Hooks
- Custom `useUsers` Hook for user management
- REST API integration using Fetch API
- Client-side routing using React Router

## Application Architecture

The application separates the frontend, backend API and database layers.

- **React:** Handles the user interface, form inputs, component state and API requests.
- **ASP.NET Core Web API:** Handles HTTP requests, business logic, authentication and data access.
- **Entity Framework Core:** Provides database access and LINQ queries.
- **SQL Server:** Stores user and application data.

## Getting Started

### Prerequisites

- .NET SDK
- Node.js and npm
- SQL Server or Azure SQL Database

### Backend

1. Configure the SQL Server connection string using local configuration or .NET User Secrets.
2. Configure the required database tables.
3. Start the ASP.NET Core Web API.

### Frontend

1. Navigate to the React project directory.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local URL displayed in the terminal.

Ensure the frontend API configuration points to the running backend.

## Future Improvements

- Complete role-based access control
- Expand application features with additional management modules
- Deploy the application to Azure App Service
- Implement automated CI/CD using GitHub Actions

## Project Purpose

This project was developed to strengthen practical experience with React, modern frontend development, ASP.NET Core Web API integration, authentication and full-stack application development.

## Project Status

Work in Progress

This project is currently under active development.

Core functionality, including user management and authentication,
has been implemented.

UI styling, responsive design, and additional features
are still under development.
