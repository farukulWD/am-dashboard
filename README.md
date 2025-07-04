# Academic Management Dashboard

A modern, responsive web application for managing academic institutions with comprehensive student, course, and faculty management capabilities. Built with Next.js 14, TypeScript, and Redux Toolkit.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-1.9-red)

## 🚀 Features

### 📊 Dashboard Overview
- **Summary Statistics**: Total students, courses, and faculty members
- **Top Students Leaderboard**: Ranked by GPA with interactive table
- **Popular Courses Chart**: Bar chart showing enrollment counts
- **Real-time Data**: Live updates with Redux state management

### 👥 Student Management
- **Student Directory**: Complete list with search and filtering
- **Advanced Filters**: Filter by course, year, and academic status
- **Student Profiles**: Detailed individual student pages
- **Academic Progress**: Course enrollments, grades, and GPA tracking
- **Progress Visualization**: Interactive charts for academic performance

### 📚 Course Management
- **Course Catalog**: Comprehensive course listing with faculty details
- **Enrollment Tracking**: Real-time enrollment counts and capacity management
- **Faculty Assignment**: Link courses to faculty members
- **Course Status**: Active, Full, and Upcoming course states
- **Add/Edit Courses**: Full CRUD operations for course management

### 👨‍🏫 Faculty Panel
- **Grade Management**: Add and update student grades for courses
- **Student Assignment**: Assign students to specific courses
- **Grade Calculation**: Automatic grade computation (midterm, final, assignments)
- **Bulk Operations**: Efficient management of multiple student-course relationships

### 📈 Reporting & Analytics
- **Enrollment Trends**: Time-series charts for course enrollments
- **Performance Reports**: Top-performing students per course
- **Academic Analytics**: GPA trends, completion rates, and success metrics
- **Data Export**: CSV export functionality for reports
- **Interactive Charts**: ApexCharts integration for data visualization

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with tablet and desktop support
- **Dark/Light Mode**: Theme switching with system preference detection
- **Smooth Animations**: Framer Motion for engaging user interactions
- **Loading States**: Comprehensive loading and error handling
- **Search & Filter**: Real-time search with multiple filter options

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **ApexCharts** - Interactive charts and graphs

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **JSON Server** - Mock API for development

### UI Components
- **Custom Component Library** - Reusable UI components
- **Lucide React** - Icon library
- **Responsive Tables** - Mobile-optimized data tables

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd am-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Start the mock API server** (in a separate terminal)
   ```bash
   npx json-server --watch db.json --port 3001
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
am-dashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── courses/           # Course management pages
│   │   ├── faculty/           # Faculty panel
│   │   ├── reports/           # Analytics and reporting
│   │   ├── students/          # Student management
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable UI components
│   │   ├── common/           # Shared components
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── faculty/          # Faculty panel components
│   │   ├── reports/          # Reporting components
│   │   └── students/         # Student management components
│   ├── store/                # Redux store configuration
│   │   ├── features/         # Redux slices
│   │   ├── hooks.ts          # Redux hooks
│   │   ├── store.ts          # Store configuration
│   │   └── types.ts          # TypeScript interfaces
│   ├── helper/               # Utility functions
│   │   └── axios.ts          # HTTP client configuration
│   └── lib/                  # Library utilities
│       └── utils.ts          # Helper functions
├── public/                   # Static assets
├── db.json                   # Mock database
└── package.json              # Dependencies and scripts
```

## 🎯 Key Features in Detail

### Dashboard Analytics
- **Summary Cards**: Real-time statistics with animated counters
- **Top Students Table**: Sortable leaderboard with GPA rankings
- **Course Enrollment Chart**: Interactive bar chart showing popular courses
- **Responsive Layout**: Optimized for all screen sizes

### Student Management System
- **Search Functionality**: Real-time search by name, email, or course
- **Advanced Filtering**: Filter by academic year, course enrollment, and GPA range
- **Student Profiles**: Comprehensive individual student pages with:
  - Personal information
  - Enrolled courses with grades
  - Academic progress tracking
  - GPA trend visualization
  - Course completion status

### Course Management
- **Course Catalog**: Complete course listing with detailed information
- **Faculty Integration**: Link courses to faculty members
- **Enrollment Management**: Track enrollment counts and capacity
- **Status Management**: Active, Full, and Upcoming course states
- **CRUD Operations**: Full create, read, update, delete functionality

### Faculty Panel
- **Grade Management**: Comprehensive grade entry and editing system
- **Student Assignment**: Assign students to courses with validation
- **Grade Calculation**: Automatic computation of overall grades
- **Bulk Operations**: Efficient management of multiple assignments

### Reporting System
- **Enrollment Analytics**: Time-series analysis of course enrollments
- **Performance Reports**: Top students per course with detailed metrics
- **Export Functionality**: CSV export for all report data
- **Interactive Visualizations**: Charts and graphs for data insights

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablet screens
- **Desktop Experience**: Full-featured desktop interface

### Theme System
- **Dark Mode**: Complete dark theme implementation
- **Light Mode**: Clean light theme design
- **System Preference**: Automatic theme detection
- **Manual Toggle**: User-controlled theme switching

### Animations
- **Page Transitions**: Smooth navigation between pages
- **Component Animations**: Engaging micro-interactions
- **Loading States**: Animated loading indicators
- **Hover Effects**: Interactive element feedback

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### API Configuration
The application uses JSON Server for development. Update the API base URL in `src/helper/axios.ts` for production deployment.

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deployment Options
- **Vercel**: Optimized for Next.js applications
- **Netlify**: Static site deployment
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment


