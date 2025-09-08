CREATE TABLE "adjectives" (
	"id" integer PRIMARY KEY NOT NULL,
	"brand_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"subtle_example" text NOT NULL,
	"obvious_example" text NOT NULL,
	"intense_example" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand" (
	"id" integer PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personality" (
	"id" integer PRIMARY KEY NOT NULL,
	"brand_id" integer NOT NULL,
	"question_index" integer NOT NULL,
	"answer" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rules" (
	"id" integer PRIMARY KEY NOT NULL,
	"brand_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"do_example" text NOT NULL,
	"dont_example" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "adjectives" ADD CONSTRAINT "adjectives_brand_id_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personality" ADD CONSTRAINT "personality_brand_id_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rules" ADD CONSTRAINT "rules_brand_id_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON DELETE no action ON UPDATE no action;