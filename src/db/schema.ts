import { pgTable, uuid, timestamp, interval, pgEnum, varchar, text, boolean, date, real } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum('user_role', ['employee', 'hr', 'admin']);
export const breakTypeEnum = pgEnum('break_type', ['morning', 'lunch', 'afternoon']);
export const accountStatusEnum = pgEnum('account_status', ['Active', 'Locked']);
export const leaveTypeEnum = pgEnum('leave_type', ['Vacation', 'Sick', 'Emergency', 'Personal']);
export const leaveStatusEnum = pgEnum('leave_status', ['Pending', 'Approved', 'Rejected', 'Cancelled']);

export const departmentTable = pgTable('department', {
    department_id: uuid().primaryKey().defaultRandom(),
    department_name: varchar({ length: 100 }).notNull(),
    department_description: text(),
});

export const usersTable = pgTable('users', {
    user_id: uuid().primaryKey().defaultRandom(),
    department_id: uuid().references(() => departmentTable.department_id),
    first_name: varchar({ length: 50 }).notNull(),
    last_name: varchar({ length: 50 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    role: userRoleEnum().notNull().default('employee'),
    timezone: varchar({ length: 50 }).default('Asia/Manila'),
    status: accountStatusEnum().notNull().default('Active'),
    last_login: timestamp(),
});

export const attendanceLogTable = pgTable('attendance_log', {
    attendance_id: uuid().primaryKey().defaultRandom(),
    user_id: uuid().references(() => usersTable.user_id).notNull(),
    time_in: timestamp(),
    time_out: timestamp(),
    total_hours: interval(),
});

export const breakLogTable = pgTable('break_log', {
    break_id: uuid().primaryKey().defaultRandom(),
    user_id: uuid().references(() => usersTable.user_id).notNull(),
    break_type: varchar({ length: 50 }).notNull(),
    break_start: timestamp(),
    break_end: timestamp(),
    break_duration: interval(),
    remaining_break: interval(),
});

export const inactivityLogTable = pgTable('inactivity_log', {
    inactivity_id: uuid().primaryKey().defaultRandom(),
    user_id: uuid().references(() => usersTable.user_id).notNull(),
    prompt_sent: timestamp().notNull(),
    response_time_limit: timestamp().notNull(),
    missed_timestamp: timestamp(),
    has_responded: boolean(),
});

export const leaveRequestTable = pgTable('leave_request', {
    leave_id: uuid().primaryKey().defaultRandom(),
    user_id: uuid().references(() => usersTable.user_id).notNull(),
    leave_type: varchar({ length: 50 }).notNull(),
    leave_date_from: date().notNull(),
    leave_date_to: date().notNull(),
    reason_employee: text(),
    reason_hr: text(),
    status: leaveStatusEnum().notNull().default('Pending'),
    remaining_leaves: real().notNull(),
    decided_by: uuid().references(() => usersTable.user_id),
    decision_timestamp: timestamp(),
});
