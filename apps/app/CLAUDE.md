# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` or `npx expo start` - Start the development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset to a blank project structure

## Architecture Overview

This is a React Native Expo app for expense tracking that reads SMS messages to automatically categorize financial transactions. Key architectural patterns:

### SMS-Based Transaction Detection
- Uses `react-native-get-sms-android` to read SMS messages
- `useSms()` hook polls messages with configurable delay and filtering
- Transaction parsing logic extracts merchant names, amounts, and categories from SMS text
- Permission handling in `utils/permissions.ts` and SMS operations in `utils/sms.ts`

### File-Based Routing Structure
- Expo Router with tab navigation: Transactions (`index.tsx`), Groups (`groups.tsx`), Rules (`rules.tsx`)
- Root layout (`app/_layout.tsx`) handles theming and navigation setup
- Tab layout (`app/(tabs)/_layout.tsx`) configures bottom navigation with Feather icons

### Transaction Processing Pipeline
1. SMS messages polled via `useSms()` hook
2. Parsed using regex patterns in transaction screen
3. Categorized by merchant patterns (Amazon → Shopping, Swiggy → Food, etc.)
4. Displayed in `TransactionCard` components with category badges

### Component Architecture
- UI components in `components/ui/`: `TransactionCard`, `GroupCard`, `RuleCard`
- Themed components using React Navigation's theme system
- Custom hooks: `useColorScheme()`, `useThemeColor()`, `useSms()`

### State Management
- Local React state throughout the app
- No global state management library
- SMS data managed through polling hook with error handling

## Path Resolution

Uses `@/*` alias for imports configured in tsconfig.json - import with `@/` prefix for root-level modules.

## Platform Notes

Designed primarily for Android SMS functionality. iOS support limited by SMS access restrictions.