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

### Mobile App Commands

The mobile app (`apps/app/`) has additional Expo-specific commands:

- `npm start` or `npx expo start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run reset-project` - Reset to blank project structure

## Architecture Overview

### Monorepo Structure

This Turborepo contains two main applications and shared packages:

**Applications:**
- `apps/app/` - React Native Expo mobile app for SMS-based expense tracking
- `apps/website/` - Next.js web application for CSV transaction analysis

**Shared Packages:**
- `packages/core/` - Shared Redux state management (slices, store, middleware)
- `packages/utils/` - Shared utility functions and helpers
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
- `filesSlice` - CSV file management and upload state
- `transactionsSlice` - Parsed transaction data and operations
- `groupsSlice` - Transaction categorization and grouping
- `rulesSlice` - Automatic categorization rules and pattern matching

**State Management Flow:**
1. Redux store configured in `packages/core/store.ts` with combined reducers
2. Persistence layer with localStorage for data retention
3. Redux Toolkit with logger middleware for development debugging

## Shared Packages Architecture

### `packages/core/`
Contains shared Redux state management logic used by the website:
- Redux slices for files, transactions, groups, and rules
- Store configuration with combined reducers
- Middleware setup including logger for development
- Type definitions for the global application state

### `packages/utils/`
Shared utility functions and helpers that can be used across applications.

### `packages/eslint-config/` & `packages/typescript-config/`
Shared configuration files that ensure consistent code style and TypeScript settings across all applications.

## Package Management

- Uses npm workspaces with npm@10.9.2
- Node.js >= 18 required
- TypeScript 5.9.2 across all packages
- Internal packages use `@money-lens/` namespace

## Path Resolution

Both applications use `@/*` path aliases configured in their respective tsconfig.json files for imports.

## Platform Notes

- Mobile app designed primarily for Android (SMS access limitations on iOS)
- Website works across all modern browsers
- Mobile app requires Android permissions for SMS reading