import React, { useState, useMemo } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  Stack,
  Card,
  Grid,
} from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

import { useAppSelector } from "@/store";
import {
  calculateSpendingByGroup,
  getTopCategories,
  calculateTransactionMetrics,
} from "@/utils";
import { SummaryCards } from "./SummaryCards";

import SpendingPieChart from "./SpendingPieChart";
import TopCategoriesBarChart from "./TopCategoriesBarChart";
import DatePresetsFilter from "./DatePresetsFilter";
import TransactionFrequencyChart from "./TransactionFrequencyChart";
import TopMerchantsCard from "./TopMerchantsCard";

export const AnalyticsTab = () => {
  const { transactions } = useAppSelector((state) => state.transactions);
  const { groups } = useAppSelector((state) => state.groups);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  // unique file list
  const uniqueFiles = useMemo(() => {
    const fileSet = new Set(transactions.map((t) => t.fileName));
    return Array.from(fileSet).sort();
  }, [transactions]);

  // filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (selectedFiles.length > 0) {
      filtered = filtered.filter((t) => selectedFiles.includes(t.fileName));
    }
    if (startDate || endDate) {
      filtered = filtered.filter((t) => {
        const d = new Date(t.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start && d < start) return false;
        if (end && d > end) return false;
        return true;
      });
    }
    return filtered;
  }, [transactions, selectedFiles, startDate, endDate]);

  // analytics data
  const spendingByGroup = calculateSpendingByGroup(
    filteredTransactions,
    groups
  );
  const topCategories = getTopCategories(spendingByGroup, 5);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const { totalExpenses, avgTransactionAmount } = React.useMemo(
    () => calculateTransactionMetrics(transactions),
    [transactions]
  );

  const cards = [
    {
      title: "Total Expenses",
      value: totalExpenses,
      subtitle: `Avg: ${avgTransactionAmount}`,
      icon: <TrendingDownIcon />,
      color: "#E74C3C",
      bgColor: "rgba(231, 76, 60, 0.1)",
    },
    // {
    //   title: "Largest Expense",
    //   value: largestExpense,
    //   subtitle: `${smallestExpense}% smallest expense`,
    //   icon: <AccountBalanceWalletIcon />,
    //   color: "#E74C3C",
    //   bgColor: "rgba(0, 184, 148, 0.1)",
    // },
    // {
    //   title: "Transaction Count",
    //   value: transactionCount,
    //   subtitle: `${transactionCount} total transactions`,
    //   icon: <ReceiptIcon sx={{ fontSize: 24 }} />,
    //   color: "#9B59B6",
    //   bgColor: "rgba(155, 89, 182, 0.1)",
    // },
  ];

  return (
    <Card sx={{ padding: 3 }}>
      <Grid container gap={2}>
        <Grid size={12}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <DatePresetsFilter
              selectedPreset={selectedPreset}
              onPresetChange={(preset) => {
                if (preset) {
                  setSelectedPreset(preset.value);
                  setStartDate(preset.startDate);
                  setEndDate(preset.endDate);
                } else {
                  setSelectedPreset("");
                  setStartDate("");
                  setEndDate("");
                }
              }}
            />

            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel>Files</InputLabel>
              <Select
                multiple
                value={selectedFiles}
                onChange={(e) => setSelectedFiles(e.target.value as string[])}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {uniqueFiles.map((fileName) => (
                  <MenuItem key={fileName} value={fileName}>
                    {fileName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setSelectedPreset(""); // Clear preset when manual date is selected
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 180 }}
            />

            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setSelectedPreset(""); // Clear preset when manual date is selected
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 180 }}
            />
          </Stack>
        </Grid>

        <Grid size={12}>
          <SummaryCards cards={cards} />
        </Grid>

        <Grid size={12}>
          <SpendingPieChart
            data={spendingByGroup}
            formatCurrency={formatCurrency}
          />
        </Grid>

        <Grid size={12}>
          <TransactionFrequencyChart
            transactions={filteredTransactions}
            formatCurrency={formatCurrency}
          />
        </Grid>
        <Grid size={12}>
          <TopMerchantsCard
            transactions={filteredTransactions}
            formatCurrency={formatCurrency}
          />
        </Grid>

        <Grid size={12}>
          <TopCategoriesBarChart
            data={topCategories}
            formatCurrency={formatCurrency}
          />
        </Grid>
      </Grid>
    </Card>
  );
};
