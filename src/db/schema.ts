import { pgTable, uuid, timestamp, interval, pgEnum, varchar, text, boolean, date, real } from "drizzle-orm/pg-core";

export const breakTypeEnum = pgEnum('break_type', ['Lunch', 'Short Break']);
export const accountStatusEnum = pgEnum('account_status', ['Active', 'Locked']);
export const leaveTypeEnum = pgEnum('leave_type', ['Vacation', 'Sick', 'Emergency', 'Personal']);
export const leaveStatusEnum = pgEnum('leave_status', ['Pending', 'Approved', 'Rejected', 'Cancelled']);

export const departmentTable = pgTable('department', {
    department_id: uuid().primaryKey().defaultRandom(),
    department_name: varchar({ length: 100 }).notNull(),
    department_description: text(),
});

export const employeeTable = pgTable('employee', {
    employee_id: uuid().primaryKey().defaultRandom(),
    department_id: uuid().references(() => departmentTable.department_id),
    first_name: varchar({ length: 50 }).notNull(),
    last_name: varchar({ length: 50 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    timezone: varchar({ length: 50 }).default('Asia/Manila'),
    status: accountStatusEnum().notNull().default('Active'),
    last_login: timestamp(),
});

export const hrPersonnelTable = pgTable('hr_personnel', {
    hr_id: uuid().primaryKey().defaultRandom(),
    first_name: varchar({ length: 50 }).notNull(),
    last_name: varchar({ length: 50 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    role_permission: varchar({ length: 50 }),
    status: accountStatusEnum().notNull().default('Active'),
    last_login: timestamp(),
});

export const attendanceLogTable = pgTable('attendance_log', {
    attendance_id: uuid().primaryKey().defaultRandom(),
    employee_id: uuid().references(() => employeeTable.employee_id).notNull(),
    time_in: timestamp(),
    time_out: timestamp(),
    total_hours: interval(),
});

export const breakLogTable = pgTable('break_log', {
    break_id: uuid().primaryKey().defaultRandom(),
    employee_id: uuid().references(() => employeeTable.employee_id).notNull(),
    break_type: varchar({ length: 50 }).notNull(),
    break_start: timestamp(),
    break_end: timestamp(),
    break_duration: interval(),
    remaining_break: interval(),
});

export const inactivityLogTable = pgTable('inactivity_log', {
    inactivity_id: uuid().primaryKey().defaultRandom(),
    employee_id: uuid().references(() => employeeTable.employee_id).notNull(),
    prompt_sent: timestamp().notNull(),
    response_time_limit: timestamp().notNull(),
    missed_timestamp: timestamp(),
    has_responded: boolean(),
});

export const leaveRequestTable = pgTable('leave_request', {
    leave_id: uuid().primaryKey().defaultRandom(),
    employee_id: uuid().references(() => employeeTable.employee_id).notNull(),
    leave_type: varchar({ length: 50 }).notNull(),
    leave_date_from: date().notNull(),
    leave_date_to: date().notNull(),
    reason_employee: text(),
    reason_hr: text(),
    status: leaveStatusEnum().notNull().default('Pending'),
    remaining_leaves: real().notNull(),
    hr_id: uuid().references(() => hrPersonnelTable.hr_id),
    decision_timestamp: timestamp(),
});
