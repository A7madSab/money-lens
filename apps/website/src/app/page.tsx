"use client";
import React, { useState, useEffect } from "react";
import { Container, Tab, Tabs, Typography } from "@mui/material";
import { UploadFilesTabs } from "@/components/UploadFilesTabs";
import { TransactionTabs } from "@/components/transactions/TransactionTabs";
import { AnalyticsTab } from "@/components/analytics/AnalyticsTab";
import { useAppSelector } from "../store";

export default function CsvTransactionManager() {
  const [tab, setTab] = useState(0);
  const [mounted, setMounted] = useState(false);

  const transactions = useAppSelector((state) => state.transactions.transactions);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        CSV Transaction Manager
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        Upload, queue, and analyze your financial transaction data
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab value={0} label="Upload" />
        <Tab
          value={1}
          disabled={!mounted || transactions.length === 0}
          label={mounted ? `Transactions (${transactions.length})` : "Transactions"}
        />
        <Tab value={3} label="Analytics" />
      </Tabs>

      {tab === 0 && <UploadFilesTabs />}
      {tab === 1 && <TransactionTabs />}
      {tab === 3 && <AnalyticsTab />}
    </Container>
  );
}
