Goal: Create a frontend prototype for an "Employee Time Management System" called SolarSync using Next.js, shadcn/ui, and lucide-react.

The application should be a single-page dashboard with two main views, selectable by tabs: one for the Employee and one for the HR Admin.

1. Project Setup
   Create a new Next.js project.

Initialize shadcn/ui (including the default components.json).

Install lucide-react.

Use shadcn/ui components for all UI elements (Cards, Buttons, Tables, Tabs, Dialogs, etc.).

2. Main Page Layout (app/page.tsx)
   Create a central layout with a Card component.

Inside the Card, use the Tabs component with two triggers: "Employee View" and "HR View".

The "Employee View" tab will contain the EmployeeDashboard component.

The "HR View" tab will contain the HRDashboard component.

3. Employee Dashboard Component (components/EmployeeDashboard.tsx)
   This component should fulfill features 4.1, 4.2, and 4.3 (from the employee's perspective).

A. Attendance Card (Feature 4.1)

A Card titled "My Attendance".

Show a "Current Status" Badge (e.g., "Clocked Out").

A Button with a LogIn icon to "Clock In".

When "Clock In" is clicked, it should change to a "Clock Out" Button with a LogOut icon, and the status Badge should change to "Clocked In".

Mock Inactivity Prompt (Feature 4.3): Add a Button with an AlertTriangle icon labeled "Trigger Inactivity Prompt". Clicking this opens an AlertDialog that says "Are you still active?" with a single "Confirm Activity" button.

B. Requests Card (Feature 4.2)

A Card titled "My Requests".

A Button with a Coffee icon to "Request Break". This opens a Dialog with a simple form.

A Button with a Plane icon to "Request Leave". This opens a Dialog with a Calendar component and an Input for "Reason".

C. History Tables (Features 4.1 & 4.2)

A Tabs component with two tabs: "Attendance History" and "Request History".

Attendance History: A Table with mock data for Date, Clock In, Clock Out, Total Hours.

Request History: A Table with mock data for Date, Type (Break/Leave), Reason, Status (use Badge for 'Pending', 'Approved', 'Rejected').

4. HR Dashboard Component (components/HRDashboard.tsx)
   This component should fulfill feature 4.4 (The unified dashboard).

A. Team Overview Table (Feature 4.4)

A Card titled "Employee Dashboard".

A Table showing a list of mock employees.

Columns: Employee Name, Status (use Badge: 'Clocked In', 'Clocked Out', 'Idle'), Last Clock In.

B. Pending Requests (Feature 4.2)

A Card titled "Pending Requests".

A Table listing mock leave/break requests.

Columns: Employee Name, Request Type, Date, Reason.

Add an "Actions" column containing two Button components (small size):

"Approve" (variant="outline", icon: Check)

"Reject" (variant="destructive", icon: X)

C. Inactivity Log (Feature 4.3)

A Card titled "Recent Inactivity".

A Table showing a log of missed prompts.

Columns: Employee Name, Date, Time, Details (e.g., "Missed 3-minute prompt").
