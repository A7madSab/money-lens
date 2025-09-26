# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a Turborepo monorepo with multiple applications and shared packages. Commands should be run from the root directory:

- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all applications and packages
- `npm run lint` - Lint all applications and packages
- `npm run check-types` - Type check all TypeScript code
- `npm run format` - Format code with Prettier

### Application-Specific Commands

Filter commands to specific applications using Turbo filters:

- `npx turbo dev --filter=app` - Start mobile app only
- `npx turbo dev --filter=money-lens-website` - Start website only
- `npx turbo build --filter=money-lens-website` - Build website only

## Architecture Overview

### Monorepo Structure

This Turborepo contains two main applications and shared packages:

**Applications:**
- `apps/app/` - React Native Expo mobile app for SMS-based expense tracking
- `apps/website/` - Next.js web application for CSV transaction analysis

**Shared Packages:**
- `packages/ui/` - Shared React component library
- `packages/eslint-config/` - Shared ESLint configurations
- `packages/typescript-config/` - Shared TypeScript configurations

### Mobile App (`apps/app/`)

React Native Expo app that automatically tracks expenses by reading SMS messages from banks and payment providers.

**Key Features:**
- SMS permission handling and message parsing
- Automatic transaction categorization from SMS text
- Tab-based navigation (Transactions, Groups, Rules)
- File-based routing with Expo Router

**SMS Processing Flow:**
1. `useSms()` hook polls device SMS messages
2. Transaction parsing extracts amounts, merchants, categories
3. Categorization rules match patterns (Amazon → Shopping, etc.)
4. Display in `TransactionCard` components

### Website (`apps/website/`)

Next.js 15 application for uploading and analyzing financial transaction data from CSV files.

**Key Technologies:**
- Redux Toolkit for state management with localStorage persistence
- Material-UI for component library
- Recharts for data visualization
- React Dropzone for file uploads

**Data Flow:**
1. CSV file upload via drag-and-drop
2. Transaction parsing with currency/amount extraction
3. Manual or rule-based group assignment
4. Analytics dashboards and visualizations

**Redux State Structure:**
- `filesSlice` - CSV file management
- `transactionsSlice` - Parsed transaction data
- `groupsSlice` - Transaction categorization
- `rulesSlice` - Automatic categorization rules

## Package Management

- Uses npm workspaces with npm@10.9.2
- Node.js >= 18 required
- TypeScript 5.9.2 across all packages

## Path Resolution

Both applications use `@/*` path aliases configured in their respective tsconfig.json files for imports.

## Platform Notes

- Mobile app designed primarily for Android (SMS access limitations on iOS)
- Website works across all modern browsers
- Mobile app requires Android permissions for SMS reading