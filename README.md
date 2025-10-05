# Money Lens

A comprehensive financial tracking platform built as a Turborepo monorepo with two specialized applications for managing and analyzing personal expenses.

## Overview

Money Lens consists of two complementary applications:

1. **Mobile App** - React Native Expo app that automatically tracks expenses by reading and parsing SMS messages from banks
2. **Website** - Next.js web application for uploading CSV transaction data and visualizing spending analytics

Both applications share core Redux state management logic through a monorepo architecture, ensuring consistent data models and business logic across platforms.

## Features

### Mobile App Features
- **Automatic SMS Expense Tracking** - Reads bank SMS messages to automatically detect transactions
- **Multi-Bank Support** - Extensible parser system supporting multiple Egyptian banks (CIB, etc.)
- **Smart Transaction Parsing** - Extracts amounts, merchants, dates, and categories from SMS text
- **Bank Management** - Select and manage multiple bank accounts
- **Transaction Grouping** - Organize transactions into custom categories
- **Rule-Based Categorization** - Define rules to automatically categorize future transactions
- **Real-time Monitoring** - Polls SMS inbox every 5 seconds for new transactions

### Website Features
- **CSV File Upload** - Drag-and-drop interface for uploading transaction CSVs
- **Transaction Management** - View, edit, and categorize imported transactions
- **Analytics Dashboard** - Comprehensive visualizations including:
  - Spending pie charts by category
  - Top categories bar charts
  - Transaction frequency trends
  - Top merchants analysis
  - Total spending summaries
- **Custom Grouping** - Create and manage transaction groups/categories
- **Smart Rules Engine** - Pattern-based automatic categorization
- **Data Persistence** - localStorage-based state persistence
- **Material-UI Components** - Modern, responsive interface

## Tech Stack

### Mobile App
- **React Native** 0.79.5
- **Expo** ~53.0.23 with Expo Router for file-based routing
- **Redux Toolkit** 2.9.0 for state management
- **TanStack React Form** for form handling
- **react-native-get-sms-android** for SMS access
- **TypeScript** 5.8.3

### Website
- **Next.js** 15.5.3 (App Router)
- **React** 19.1.0
- **Redux Toolkit** 2.9.0 with redux-logger
- **Material-UI** 7.3.2
- **Recharts** 3.2.1 for data visualization
- **React Dropzone** 14.3.8 for file uploads
- **Tailwind CSS** 4.0
- **TypeScript** 5.x

### Shared Packages
- **@money-lens/core** - Redux slices, store configuration, SMS parsing logic
- **@money-lens/utils** - Shared utility functions
- **@money-lens/eslint-config** - Shared ESLint configurations
- **@money-lens/typescript-config** - Shared TypeScript configurations

## Project Structure

```
money-lens/
├── apps/
│   ├── app/                      # React Native Expo mobile app
│   │   ├── app/                  # File-based routing
│   │   │   ├── (tabs)/          # Tab navigation screens
│   │   │   │   ├── index.tsx    # Transactions screen
│   │   │   │   ├── cards.tsx    # Banks screen
│   │   │   │   ├── groups.tsx   # Groups screen
│   │   │   │   └── rules.tsx    # Rules screen
│   │   │   └── _layout.tsx      # Root layout
│   │   ├── components/          # React Native components
│   │   ├── hooks/               # Custom React hooks (useSms, etc.)
│   │   └── utils/               # SMS utilities and permissions
│   │
│   └── website/                 # Next.js website
│       ├── src/
│       │   ├── app/             # Next.js App Router
│       │   ├── components/      # React components
│       │   │   ├── analytics/   # Chart and analytics components
│       │   │   ├── groups/      # Group management components
│       │   │   ├── rules/       # Rules management components
│       │   │   └── transactions/# Transaction components
│       │   ├── store/           # Redux store with persistence
│       │   └── utils/           # Utility functions
│       └── public/              # Static assets
│
└── packages/
    ├── core/                    # Shared Redux state management
    │   ├── slices/              # Redux slices
    │   │   ├── fileSlice.ts
    │   │   ├── transactionsSlice.ts
    │   │   ├── groupsSlice.ts
    │   │   ├── rulesSlice.ts
    │   │   ├── banksSlice.ts
    │   │   └── smsSlice/        # SMS parsing logic
    │   │       ├── index.ts
    │   │       ├── types.ts
    │   │       └── utilities.ts # Bank parsers (Strategy Pattern)
    │   └── store.ts             # Base store configuration
    │
    ├── utils/                   # Shared utilities
    ├── eslint-config/           # Shared ESLint config
    └── typescript-config/       # Shared TypeScript config
```

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** 10.9.2 or higher
- **Android Studio** (for mobile app development)
- **Expo CLI** (optional, but recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd money-lens

# Install all dependencies
npm install
```

### Development

#### Run All Applications
```bash
npm run dev
```

#### Run Mobile App Only
```bash
# Start Expo development server
cd apps/app
npm start

# Or from root with Turbo filter
npx turbo dev --filter=app

# Run on Android device/emulator
npm run android

# Run on iOS simulator (macOS only, limited SMS functionality)
npm run ios
```

#### Run Website Only
```bash
# Start Next.js dev server
npx turbo dev --filter=money-lens-website

# Or directly
cd apps/website
npm run dev
```

The website will be available at `http://localhost:3000`

### Building

```bash
# Build all applications
npm run build

# Build specific application
npx turbo build --filter=money-lens-website
npx turbo build --filter=app
```

### Code Quality

```bash
# Lint all code
npm run lint

# Type check all TypeScript
npm run check-types

# Format code with Prettier
npm run format
```

## Architecture

### SMS Parsing Architecture

The mobile app uses a **Strategy Pattern** for parsing bank-specific SMS messages:

```typescript
// Define a parser for a new bank
class NewBankParser implements ISmsParser {
  bank = "NEW_BANK";

  match(message: ISms): boolean {
    return message.address?.includes("NEWBANK");
  }

  parse(message: ISms): IParsedSms {
    // Extract transaction data from SMS body
    return {
      ...message,
      messageType: EMessageType.transaction,
      amount: extractedAmount,
      currency: extractedCurrency,
      vendor: extractedVendor,
      // ... other fields
    };
  }
}

// Register the parser
smsParserRegistry.register(new NewBankParser());
```

Currently supported banks:
- **CIB (Commercial International Bank)** - Comprehensive transaction parsing including:
  - Credit card payments
  - Apple Pay transactions
  - International transactions
  - InstaPay transfers
  - ATM withdrawals
  - Bank statements
  - Refunds

### State Management

#### Shared Redux Slices (packages/core)

All Redux state is centralized in the `@money-lens/core` package:

- **filesSlice** - Manages uploaded CSV files
- **transactionsSlice** - Stores parsed transaction records
- **groupsSlice** - Manages transaction categories/groups
- **rulesSlice** - Stores categorization rules (pattern matching)
- **banksSlice** - Manages bank configurations
- **smsSlice** - Handles SMS messages and parsed transactions (mobile only)

#### Platform-Specific Stores

**Website** (`apps/website/src/store/`):
- Extends core store with localStorage persistence middleware
- Automatically saves/loads state from browser storage
- Includes redux-logger for development debugging

**Mobile App**:
- Uses core Redux store directly
- In-memory state (no persistence)
- State resets on app restart

### Component Structure

#### Mobile App Components
- **TransactionCard** - Displays individual transaction details
- **BankCard** - Shows bank account information
- **GroupCard** - Displays transaction groups
- **RuleCard** - Shows categorization rules
- **Modals** - CreateGroupModal, EditGroupModal, BankSelectionModal, etc.

#### Website Components
- **UploadFilesTabs** - CSV file upload interface
- **TransactionTabs** - Transaction list with filtering
- **GroupsTabs** - Group management interface
- **RulesTab** - Rules configuration
- **AnalyticsTab** - Dashboard with multiple chart types

## Configuration

### Path Aliases

Both applications use `@/*` path aliases for cleaner imports:

```typescript
// Instead of: import { store } from '../../store'
import { store } from '@/store'
```

Configured in `tsconfig.json` of each app.

### Environment Variables

Create `.env.local` files in application directories as needed:

```bash
# apps/website/.env.local
NEXT_PUBLIC_API_URL=your_api_url
```

## Mobile App Permissions

The mobile app requires the following Android permissions:

- **READ_SMS** - To read bank transaction SMS messages

Permissions are requested at runtime through the `requestSmsPermission()` utility.

### iOS Limitations

Due to iOS restrictions on SMS access, the mobile app is primarily designed for Android. iOS support is limited and SMS parsing will not function.

## Data Flow

### Mobile App Flow
1. `useSms()` hook polls device SMS every 5 seconds
2. SMS messages filtered by bank criteria
3. Messages passed to `SmsParserRegistry`
4. Appropriate bank parser extracts transaction data
5. Parsed transactions stored in Redux (`smsSlice`)
6. UI components read from Redux and display transactions
7. Users can manually group transactions or create rules

### Website Flow
1. User uploads CSV file via drag-and-drop
2. CSV parsed into transaction records
3. Transactions stored in Redux (`transactionsSlice`)
4. User assigns groups or creates categorization rules
5. Rules auto-categorize matching transactions
6. Analytics components aggregate data for visualizations
7. State persisted to localStorage

## Extending the Platform

### Adding a New Bank Parser

1. Create a parser class in `packages/core/slices/smsSlice/utilities.ts`:

```typescript
export class YourBankParser implements ISmsParser {
  bank = "YOUR_BANK";

  match(message: ISms): boolean {
    return message.address?.includes("YOURBANK");
  }

  parse(message: ISms): IParsedSms {
    // Your parsing logic
    const amountMatch = message.body.match(/amount pattern/);
    // ... extract other fields

    return {
      ...message,
      messageType: EMessageType.transaction,
      amount: extractedAmount,
      currency: extractedCurrency,
      vendor: extractedVendor,
    };
  }
}
```

2. Register the parser:

```typescript
smsParserRegistry.register(new YourBankParser());
```

### Adding a New Redux Slice

1. Create slice in `packages/core/slices/yourSlice.ts`
2. Add to `rootReducer` in `packages/core/store.ts`
3. Export types from `packages/core/index.ts`
4. Use in applications via `useAppSelector` and `useAppDispatch`

## Monorepo Commands

### Filtering by Application

Turborepo allows running commands for specific apps:

```bash
# Run linting only for website
npx turbo lint --filter=money-lens-website

# Type check only mobile app
npx turbo check-types --filter=app

# Build both apps in parallel
npx turbo build --filter=app --filter=money-lens-website
```

### Parallel Execution

Turborepo automatically parallelizes independent tasks across workspaces for faster builds.

## Package Management

This monorepo uses **npm workspaces**:

```json
{
  "workspaces": [
    "apps/website",
    "apps/app",
    "packages/*"
  ]
}
```

All internal packages use the `@money-lens/` namespace for clarity.

## Contributing

### Code Style

- TypeScript strict mode enabled
- ESLint configured with shared rules
- Prettier for consistent formatting
- Run `npm run format` before committing

### Development Workflow

1. Create a feature branch
2. Make changes in relevant app or package
3. Run `npm run check-types` and `npm run lint`
4. Test in both applications if touching shared packages
5. Commit with descriptive messages

## License

[Your License Here]

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation in `CLAUDE.md`

---

Built with ❤️ using Turborepo, Next.js, Expo, and Redux Toolkit
