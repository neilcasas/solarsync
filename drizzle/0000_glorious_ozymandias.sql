CREATE TYPE "public"."account_status" AS ENUM('Active', 'Locked');--> statement-breakpoint
CREATE TYPE "public"."break_type" AS ENUM('Lunch', 'Short Break');--> statement-breakpoint
CREATE TYPE "public"."leave_status" AS ENUM('Pending', 'Approved', 'Rejected', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."leave_type" AS ENUM('Vacation', 'Sick', 'Emergency', 'Personal');--> statement-breakpoint
CREATE TABLE "attendance_log" (
	"attendance_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"time_in" timestamp,
	"time_out" timestamp,
	"total_hours" interval
);
--> statement-breakpoint
CREATE TABLE "break_log" (
	"break_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"break_type" varchar(50) NOT NULL,
	"break_start" timestamp,
	"break_end" timestamp,
	"break_duration" interval,
	"remaining_break" interval
);
--> statement-breakpoint
CREATE TABLE "department" (
	"department_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"department_name" varchar(100) NOT NULL,
	"department_description" text
);
--> statement-breakpoint
CREATE TABLE "employee" (
	"employee_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"department_id" uuid,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"timezone" varchar(50) DEFAULT 'Asia/Manila',
	"status" "account_status" DEFAULT 'Active' NOT NULL,
	"last_login" timestamp,
	CONSTRAINT "employee_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "hr_personnel" (
	"hr_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role_permission" varchar(50),
	"status" "account_status" DEFAULT 'Active' NOT NULL,
	"last_login" timestamp,
	CONSTRAINT "hr_personnel_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "inactivity_log" (
	"inactivity_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"prompt_sent" timestamp NOT NULL,
	"response_time_limit" timestamp NOT NULL,
	"missed_timestamp" timestamp,
	"has_responded" boolean
);
--> statement-breakpoint
CREATE TABLE "leave_request" (
	"leave_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"leave_type" varchar(50) NOT NULL,
	"leave_date_from" date NOT NULL,
	"leave_date_to" date NOT NULL,
	"reason_employee" text,
	"reason_hr" text,
	"status" "leave_status" DEFAULT 'Pending' NOT NULL,
	"remaining_leaves" real NOT NULL,
	"hr_id" uuid,
	"decision_timestamp" timestamp
);
--> statement-breakpoint
ALTER TABLE "attendance_log" ADD CONSTRAINT "attendance_log_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "break_log" ADD CONSTRAINT "break_log_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_department_id_department_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("department_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inactivity_log" ADD CONSTRAINT "inactivity_log_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_request" ADD CONSTRAINT "leave_request_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_request" ADD CONSTRAINT "leave_request_hr_id_hr_personnel_hr_id_fk" FOREIGN KEY ("hr_id") REFERENCES "public"."hr_personnel"("hr_id") ON DELETE no action ON UPDATE no action;