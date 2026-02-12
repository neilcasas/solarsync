CREATE TYPE "public"."account_status" AS ENUM('Active', 'Locked');--> statement-breakpoint
CREATE TYPE "public"."break_type" AS ENUM('morning', 'lunch', 'afternoon');--> statement-breakpoint
CREATE TYPE "public"."leave_status" AS ENUM('Pending', 'Approved', 'Rejected', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."leave_type" AS ENUM('Vacation', 'Sick', 'Emergency', 'Personal');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('employee', 'hr', 'admin');--> statement-breakpoint
CREATE TABLE "attendance_log" (
	"attendance_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"time_in" timestamp,
	"time_out" timestamp,
	"total_hours" interval
);
--> statement-breakpoint
CREATE TABLE "break_log" (
	"break_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
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
CREATE TABLE "inactivity_log" (
	"inactivity_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"prompt_sent" timestamp NOT NULL,
	"response_time_limit" timestamp NOT NULL,
	"missed_timestamp" timestamp,
	"has_responded" boolean
);
--> statement-breakpoint
CREATE TABLE "leave_request" (
	"leave_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"leave_type" varchar(50) NOT NULL,
	"leave_date_from" date NOT NULL,
	"leave_date_to" date NOT NULL,
	"reason_employee" text,
	"reason_hr" text,
	"status" "leave_status" DEFAULT 'Pending' NOT NULL,
	"remaining_leaves" real NOT NULL,
	"decided_by" uuid,
	"decision_timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"department_id" uuid,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'employee' NOT NULL,
	"timezone" varchar(50) DEFAULT 'Asia/Manila',
	"status" "account_status" DEFAULT 'Active' NOT NULL,
	"last_login" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "attendance_log" ADD CONSTRAINT "attendance_log_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "break_log" ADD CONSTRAINT "break_log_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inactivity_log" ADD CONSTRAINT "inactivity_log_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_request" ADD CONSTRAINT "leave_request_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_request" ADD CONSTRAINT "leave_request_decided_by_users_user_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_department_id_department_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("department_id") ON DELETE no action ON UPDATE no action;