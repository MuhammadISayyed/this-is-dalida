# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **brand personality management system** built with Next.js 15, TypeScript, and Drizzle ORM. It manages brand characteristics, personality traits, adjectives, and rules for AI-powered brand voice generation.

## Development Commands

### Core Development
```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build with Turbopack
npm start           # Start production server
npm run lint        # Run ESLint
```

### Database Commands
```bash
npx drizzle-kit generate    # Generate migrations from schema changes
npx drizzle-kit migrate     # Apply migrations to database
npx drizzle-kit studio      # Open Drizzle Studio for database management
```

## Tech Stack & Architecture

- **Frontend**: Next.js 15.5.2 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS v4 with PostCSS
- **Database**: PostgreSQL via Neon serverless + Drizzle ORM 0.44.5
- **Build**: Turbopack for fast development and production builds

## Database Schema

The system uses 4 main tables with proper foreign key relationships:

1. **brand** - Core brand information (`id`, `name`, `createdAt`)
2. **personality** - Q&A pairs for brand personality (`brandId` FK, `question`, `answer`)
3. **adjectives** - 3 brand adjectives with intensity levels (`brandId` FK, `name`, `description`, `subtleExample`, `obviousExample`, `intenseExample`)
4. **rules** - Actionable writing rules derived from personality/adjectives (`brandId` FK, `title`, `description`, `doExample`, `dontExample`, `isActive`)

Tables `personality`, `adjectives`, and `rules` include `updatedAt` timestamps for collaborative editing.

## Key File Locations

- **Database config**: `drizzle.config.ts` (PostgreSQL dialect, migrations in `./migrations`)
- **Database connection**: `db/drizzle.ts` (uses `DATABASE_URL` env var)
- **Schema definitions**: `db/schema.ts` (Drizzle schema with relationships)
- **App Router pages**: `app/` directory (layout.tsx, page.tsx, globals.css)

## Environment Setup

Required environment variable:
- `DATABASE_URL` - PostgreSQL connection string for Neon database

## Development Workflow

1. Schema changes → `npx drizzle-kit generate` → `npx drizzle-kit migrate`
2. Use `npx drizzle-kit studio` for visual database management
3. All database operations should use the Drizzle client from `db/drizzle.ts`
4. Follow the existing pattern of foreign key relationships between brand and related tables

## Current State

- Database schema is defined but migrations may need to be generated/applied
- Basic Next.js app structure is in place
- No API routes or CRUD operations implemented yet
- No testing framework configured