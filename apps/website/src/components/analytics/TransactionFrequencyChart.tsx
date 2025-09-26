import React from "react";
import { Card, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ITransaction } from "@/store/slices/transactionsSlice";

interface TransactionFrequencyChartProps {
  transactions: ITransaction[];
  formatCurrency: (amount: number) => string;
}

const TransactionFrequencyChart: React.FC<TransactionFrequencyChartProps> = ({
  transactions,
  formatCurrency,
}) => {
  const frequencyData = React.useMemo(() => {
    const dayMap = new Map<string, { count: number; totalAmount: number }>();

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

      const absAmount = Math.abs(transaction.amountNumeric || 0);

      const current = dayMap.get(dayName) || { count: 0, totalAmount: 0 };
      current.count += 1;
      current.totalAmount += absAmount;

      dayMap.set(dayName, current);
    });

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return daysOrder.map(day => ({
      day: day.substring(0, 3), // Abbreviated day name
      count: dayMap.get(day)?.count || 0,
      totalAmount: dayMap.get(day)?.totalAmount || 0,
      avgAmount: dayMap.get(day) ? dayMap.get(day)!.totalAmount / dayMap.get(day)!.count : 0,
    }));
  }, [transactions]);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F8BBD9'];

  return (
    <Card
      variant="outlined"
      sx={{
        p: 4,
        height: 400,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Transaction Frequency by Day
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Number of transactions per day of the week
      </Typography>

      {frequencyData.some(d => d.count > 0) ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={frequencyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="day"
              fontSize={12}
              fontWeight={500}
            />
            <YAxis
              fontSize={12}
              fontWeight={500}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "count") return [value, "Transactions"];
                return [formatCurrency(value as number), "Total Amount"];
              }}
              labelStyle={{ fontWeight: 600, fontSize: "14px" }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "14px",
              }}
            />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              stroke="#fff"
              strokeWidth={1}
            >
              {frequencyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <Typography variant="h6">No transaction data available</Typography>
        </Box>
      )}
    </Card>
  );
};

export default TransactionFrequencyChart;