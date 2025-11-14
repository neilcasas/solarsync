# SolarSync - Employee Time Management System

A modern, full-featured employee time management prototype built with Next.js, shadcn/ui, and Lucide React icons.

## 🚀 Features

### Employee View (/)

- **Attendance Management**

  - Clock In/Clock Out functionality with status badges
  - Inactivity prompt simulation
  - Attendance history table showing clock times and total hours

- **Request Management**

  - Break request form with reason input
  - Leave request form with calendar date picker
  - Request history with status badges (Approved, Pending, Rejected)

- **History Tracking**
  - Tabbed interface for Attendance and Request history
  - Complete audit trail of all employee activities

### HR Admin View (/hr)

- **Employee Dashboard**

  - Real-time overview of all employees
  - Status tracking (Clocked In, Clocked Out, Idle)
  - Last clock-in time for each employee

- **Request Management**

  - View all pending leave and break requests
  - Approve/Reject actions with icon buttons
  - Employee name, request type, date, and reason details

- **Inactivity Monitoring**
  - Log of missed activity prompts
  - Timestamp and details for each incident
  - Employee accountability tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📦 Installed Components

The following shadcn/ui components are installed:

- Card
- Button
- Tabs
- Badge
- Table
- Dialog
- Alert Dialog
- Input
- Calendar

## 🎨 Design Features

- Clean, modern interface with gradient backgrounds
- Responsive layout that works on all screen sizes
- Dark mode support
- Consistent color scheme and spacing
- Interactive elements with hover states
- Modal dialogs for form submissions
- Alert dialogs for critical user actions

## 🚦 Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000` (or 3001 if 3000 is in use).

## 📱 Navigation

- **Employee View**: Main page at `/`
- **HR Admin View**: Navigate to `/hr` or use the "Switch to HR Dashboard" button

## 🔄 Routes

- `/` - Employee Dashboard (main page)
- `/hr` - HR Admin Dashboard

## 💡 Mock Data

The prototype uses mock data to demonstrate functionality:

- Sample attendance records
- Sample request history
- Sample employee roster
- Sample inactivity logs

In a production environment, this would be replaced with real API calls to a backend service.

## 🎯 Key Interactions

### Employee View

1. Click "Clock In" to start work session
2. Click "Clock Out" to end work session
3. Use "Trigger Inactivity Prompt" to see the alert dialog
4. Submit break requests with reasons
5. Submit leave requests with date selection
6. View historical data in tabbed tables

### HR View

1. Monitor all employee statuses in real-time
2. Review pending requests
3. Approve or reject requests with one click
4. Track employee inactivity incidents

## 📝 Future Enhancements

- Backend API integration
- Real-time WebSocket updates
- Authentication and authorization
- Email notifications
- Report generation
- Advanced analytics dashboard
- Mobile app version

## 🤝 Contributing

This is a prototype project. Feel free to extend and customize it for your needs.

## 📄 License

MIT License - feel free to use this prototype for your projects.
