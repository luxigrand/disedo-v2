ALTER TABLE "categories" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "channels" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "channels" ALTER COLUMN "type" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "server_members" ALTER COLUMN "role" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "servers" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "servers" ALTER COLUMN "password" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "username" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "last_online" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "status";