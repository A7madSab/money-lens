import React, { FC } from "react";
import { Card, Typography } from "@mui/material";

interface IProps {
  totalSpending: number;
  transactionCount: number;
  formatCurrency: (amount: number) => string;
}

const TotalSpendingCard: FC<IProps> = ({
  totalSpending,
  transactionCount,
  formatCurrency,
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 4,
        width: "100%",
        textAlign: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
        Total Spending
      </Typography>
      <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
        {formatCurrency(totalSpending)}
      </Typography>
      <Typography variant="h6" sx={{ opacity: 0.85 }}>
        Across {transactionCount} transactions
      </Typography>
    </Card>
  );
};

export default TotalSpendingCard;
