# InternTrack Frontend

InternTrack is an internship and task management application developed with React, TypeScript, and Vite.

## Features

- Role-based authentication for Admin, HR, and Intern users
- Internship management
- Department management
- Task management
- Active / inactive record management
- Dashboard statistics
- Protected routes
- Cookie-based authentication
- Centralized API communication
- Centralized error handling
- Responsive dashboard layout

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Axios
- CSS

## Project Structure

```text
src/
├── api/
├── assets/
├── components/
├── context/
├── interfaces/
├── pages/
├── services/
├── styles/
└── utils/
```

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

## Type Checking

```bash
npm run typecheck
```

## Lint

```bash
npm run lint
```

## Production Build

```bash
npm run build
```

## Authentication

The application uses cookie-based authentication with access and refresh tokens.

Authentication state is managed centrally through React Context, and protected routes are used to restrict access based on the authenticated user.

## User Roles

### Admin

- Manage interns
- Manage departments
- Manage tasks
- Activate and deactivate records
- Restore inactive records

### HR

- Manage active interns
- Manage active departments
- Manage tasks
- Edit permitted records

### Intern

- View personal internship information
- View assigned tasks
- Update permitted task statuses
- Manage tasks according to assigned authorization rules

## Backend

This repository contains the frontend application of InternTrack.

The backend is developed separately using ASP.NET Core Web API, Entity Framework Core, and SQLite.

## Verification

The frontend is verified using:

```bash
npm run typecheck
npm run lint
npm run build
```

## Project Status

InternTrack Frontend v1 is functionally complete.

The current version includes authentication, role-based authorization, task management, internship management, department management, dashboard statistics, and frontend structure cleanup.
