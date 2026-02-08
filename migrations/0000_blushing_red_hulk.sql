CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"latitude" varchar(50) NOT NULL,
	"longitude" varchar(50) NOT NULL,
	"name" varchar(125) NOT NULL,
	CONSTRAINT "addresses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "polygons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"area" varchar(12),
	"number_of_points" integer,
	"azimuth" varchar(12),
	"coords" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solarArrays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(24) NOT NULL,
	"capacity" integer NOT NULL,
	"quantity" integer,
	"user_id" uuid,
	"address_id" uuid,
	"polygon_id" uuid,
	"date_created" timestamp DEFAULT now(),
	"last_modified" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(75) NOT NULL,
	"password" varchar(255) NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"last_modified" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "solarArrays" ADD CONSTRAINT "solarArrays_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solarArrays" ADD CONSTRAINT "solarArrays_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solarArrays" ADD CONSTRAINT "solarArrays_polygon_id_polygons_id_fk" FOREIGN KEY ("polygon_id") REFERENCES "public"."polygons"("id") ON DELETE cascade ON UPDATE no action;