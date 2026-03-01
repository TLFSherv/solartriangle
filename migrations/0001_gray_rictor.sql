CREATE TABLE "countries" (
	"code" char(2) PRIMARY KEY NOT NULL,
	"name" varchar(57) NOT NULL,
	"latitude" varchar(50) NOT NULL,
	"longitude" varchar(50) NOT NULL,
	"timeZone" varchar(5) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "latitude" SET DATA TYPE varchar(60);--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "longitude" SET DATA TYPE varchar(60);--> statement-breakpoint
ALTER TABLE "polygons" ALTER COLUMN "area" SET DATA TYPE numeric(8, 3) USING "area"::numeric(8,3);--> statement-breakpoint
ALTER TABLE "polygons" ALTER COLUMN "area" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "polygons" ALTER COLUMN "azimuth" SET DATA TYPE numeric(6, 3) USING "azimuth"::numeric(6,3);--> statement-breakpoint
ALTER TABLE "polygons" ALTER COLUMN "azimuth" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "solarArrays" ALTER COLUMN "quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "countryCode" char(2) NOT NULL;--> statement-breakpoint
ALTER TABLE "solarArrays" ADD COLUMN "tilt" numeric(5, 2) DEFAULT '30';--> statement-breakpoint
ALTER TABLE "solarArrays" ADD COLUMN "losses" numeric(5, 2) DEFAULT '14';--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_countryCode_countries_code_fk" FOREIGN KEY ("countryCode") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polygons" DROP COLUMN "number_of_points";