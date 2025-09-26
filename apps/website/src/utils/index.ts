import { ITransaction } from "@/store/slices/transactionsSlice";
import { IRule } from "@/store/slices/rulesSlice";
import { v4 as uuidv4 } from "uuid";
import { IGroup } from "@/store/slices/groupsSlice";

export const parseAndFormatDate = (rawDate: string): string => {
  if (!rawDate) return "";

  try {
    // Try to parse the date string (handles formats like "Tue Jul 22 2025")
    const parsedDate = new Date(rawDate);

    // Check if the date is valid
    if (!isNaN(parsedDate.getTime())) {
      // Format as YYYY-MM-DD for consistent filtering
      return parsedDate.toISOString().split("T")[0];
    }
  } catch (error) {
    // If parsing fails, keep the original string
    console.warn(`Failed to parse date "${rawDate}":`, error);
  }

  // Return original string if parsing fails
  return rawDate;
};

export const parseAmountWithCurrency = (
  rawAmount: string
): {
  amountNumeric: number;
  currency: string;
  originalAmount: string;
} => {
  if (!rawAmount) {
    return {
      amountNumeric: 0,
      currency: "",
      originalAmount: rawAmount,
    };
  }

  const trimmedAmount = rawAmount.trim();

  try {
    // Common currency codes and symbols
    const currencyPattern = /([A-Z]{3}|\$|€|£|¥|₹|₽|¢)/i;

    // Extract currency
    const currencyMatch = trimmedAmount.match(currencyPattern);
    const currency = currencyMatch ? currencyMatch[1].toUpperCase() : "";

    // Remove currency and extract numeric value
    // This handles cases like "-433.2 EGP", "USD 100.50", "$-25.75", etc.
    const numericString = trimmedAmount
      .replace(currencyPattern, "") // Remove currency
      .replace(/[^\d.-]/g, "") // Keep only digits, dots, and minus signs
      .trim();

    // Parse the numeric value
    const amountNumeric = parseFloat(numericString);

    return {
      amountNumeric: isNaN(amountNumeric) ? 0 : amountNumeric,
      currency: currency || "USD", // Default to USD if no currency found
      originalAmount: trimmedAmount,
    };
  } catch (error) {
    console.warn(`Failed to parse amount "${rawAmount}":`, error);
    return {
      amountNumeric: 0,
      currency: "USD",
      originalAmount: trimmedAmount,
    };
  }
};

export const parseCSV = async (file: File): Promise<ITransaction[]> => {
  const csvText = await file.text();

  const lines = csvText.split("\n").filter((line) => line.trim());
  const records: ITransaction[] = [];

  // Skip header row and process data
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by comma, handling quoted values
    const values = line
      .split(",")
      .map((val) => val.trim().replace(/^"|"$/g, ""));

    if (values[2].toLowerCase().includes("amount")) continue;

    const parsedAmount = parseAmountWithCurrency(values[2] || "");

    if (values.length >= 2 && parsedAmount.amountNumeric < 0) {
      records.push({
        id: `${file.name}-${i}`,
        date: parseAndFormatDate(values[0] || ""),
        amount: parsedAmount.originalAmount,
        amountNumeric: parsedAmount.amountNumeric,
        currency: parsedAmount.currency,
        description: values[1] || "",
        fileName: file.name,
        groupIds: [],
      });
    }
  }

  return records;
};

export const applyRules = (
  data: ITransaction[],
  rules: IRule[]
): ITransaction[] => {
  return data.map((transaction) => {
    const applicableRules = rules.filter((rule) => {
      const conditions = rule.contains
        .toLowerCase()
        .split(",")
        .map((c) => c.trim()) // clean up spaces
        .filter(Boolean); // remove empty strings

      console.log({
        description: transaction.description,
        conditions,
        ruleName: rule.name,
      });

      return (
        rule.isActive &&
        conditions.some((cond) =>
          transaction.description?.toLowerCase().includes(cond)
        )
      );
    });

    if (applicableRules.length > 0) {
      const newGroupIds = [...(transaction.groupIds || [])];
      applicableRules.forEach((rule) => {
        if (!newGroupIds.includes(rule.groupId)) {
          newGroupIds.push(rule.groupId);
        }
      });
      return { ...transaction, groupIds: newGroupIds };
    }

    return transaction;
  });
};

export const parseCSVWithRules = async (
  file: File,
  rules: IRule[]
): Promise<ITransaction[]> => {
  const transactions = await parseCSV(file);
  return applyRules(transactions, rules);
};

export const WARM_COLORS = [
  "#FF6B6B",
  "#FF8E53",
  "#FF9F43",
  "#FFC048",
  "#FFD93D",
  "#6BCF7F",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#F8BBD9",
  "#E17055",
  "#FDCB6E",
  "#A29BFE",
  "#74B9FF",
  "#FD79A8",
  "#FDCB6E",
  "#E84393",
  "#00B894",
  "#00CEC9",
  "#FFEAA7",
  "#FAB1A0",
  "#FF7675",
  "#A29BFE",
];

export const getRandomWarmColor = (): string => {
  return WARM_COLORS[Math.floor(Math.random() * WARM_COLORS.length)];
};

export const generateUUID = (): string => {
  return uuidv4();
};

// Analytics utility functions
export const calculateTotalSpending = (
  transactions: ITransaction[]
): number => {
  return transactions.reduce((total, transaction) => {
    return total + Math.abs(transaction.amountNumeric || 0);
  }, 0);
};

export const calculateSpendingByGroup = (
  transactions: ITransaction[],
  groups: IGroup[]
): Array<{
  groupName: string;
  amount: number;
  color: string;
  count: number;
}> => {
  const groupMap = new Map<string, { amount: number; count: number }>();

  transactions.forEach((transaction) => {
    const absAmount = Math.abs(transaction.amountNumeric || 0);

    if (transaction.groupIds.length === 0) {
      // Ungrouped transactions
      const current = groupMap.get("ungrouped") || { amount: 0, count: 0 };
      groupMap.set("ungrouped", {
        amount: current.amount + absAmount,
        count: current.count + 1,
      });
    } else {
      // Distribute amount across groups if multiple groups
      const amountPerGroup = absAmount / transaction.groupIds.length;
      transaction.groupIds.forEach((groupId) => {
        const current = groupMap.get(groupId) || { amount: 0, count: 0 };
        groupMap.set(groupId, {
          amount: current.amount + amountPerGroup,
          count: current.count + 1,
        });
      });
    }
  });

  return Array.from(groupMap.entries())
    .map(([groupId, data]) => {
      if (groupId === "ungrouped") {
        return {
          groupName: "Ungrouped",
          amount: data.amount,
          color: "#9CA3AF",
          count: data.count,
        };
      }

      const group = groups.find((g) => g.id === groupId);
      return {
        groupName: group?.name || "Unknown",
        amount: data.amount,
        color: group?.color || "#9CA3AF",
        count: data.count,
      };
    })
    .sort((a, b) => b.amount - a.amount);
};

export const getTopCategories = (
  spendingByGroup: Array<{
    groupName: string;
    amount: number;
    color: string;
    count: number;
  }>,
  limit: number = 5
): Array<{
  groupName: string;
  amount: number;
  color: string;
  count: number;
}> => {
  return spendingByGroup.slice(0, limit);
};

export const calculateTransactionMetrics = (transactions: ITransaction[]) => {
  let totalIncome = 0;
  let totalExpenses = 0;
  const transactionCount = transactions.length;
  let largestExpense = 0;
  let smallestExpense = 0;

  // Get currency from first transaction or default to EGP
  const currency = transactions.length > 0 ? transactions[0].currency || "EGP" : "EGP";

  // Group transactions by date for per-day calculations
  const transactionsByDate = new Map<string, number>();

  transactions.forEach((transaction) => {
    const amount = transaction.amountNumeric || 0;

    if (amount > 0) {
      totalIncome += amount;
    } else {
      const absAmount = Math.abs(amount);
      totalExpenses += absAmount;
      if (absAmount > largestExpense) {
        largestExpense = absAmount;
      }
    }

    if (amount < smallestExpense) {
      smallestExpense = amount;
    }

    // Count transactions per day
    const date = transaction.date;
    if (date) {
      const currentCount = transactionsByDate.get(date) || 0;
      transactionsByDate.set(date, currentCount + 1);
    }
  });

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  const avgTransactionAmount =
    transactionCount > 0 ? (totalIncome + totalExpenses) / transactionCount : 0;

  // Calculate transactions per day statistics
  const transactionsPerDayArray = Array.from(transactionsByDate.values());
  const avgTransactionsPerDay = transactionsPerDayArray.length > 0
    ? transactionsPerDayArray.reduce((sum, count) => sum + count, 0) / transactionsPerDayArray.length
    : 0;

  const uniqueDays = transactionsByDate.size;

  return {
    totalIncome: `${totalIncome.toFixed(2)} ${currency}`,
    totalExpenses: `${totalExpenses.toFixed(2)} ${currency}`,
    netSavings: `${netSavings.toFixed(2)} ${currency}`,
    savingsRate: `${savingsRate.toFixed(1)}%`,
    transactionCount: transactionCount,
    largestExpense: `${largestExpense.toFixed(2)} ${currency}`,
    smallestExpense: `${smallestExpense.toFixed(2)} ${currency}`,
    avgTransactionAmount: `${avgTransactionAmount.toFixed(2)} ${currency}`,
    transactionsPerDay: {
      average: avgTransactionsPerDay.toFixed(1),
      uniqueDays,
      byDate: transactionsByDate,
    },
  };
};
