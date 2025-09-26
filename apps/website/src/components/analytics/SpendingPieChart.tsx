import React from "react";
import { Card, Typography, Box } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface IProps {
  data: { groupName: string; amount: number; color: string }[];
  formatCurrency: (amount: number) => string;
}

const SpendingPieChart: React.FC<IProps> = ({ data, formatCurrency }) => {
  return (
    <Card variant="outlined" sx={{ width: "100%", p: 3, height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Spending by Group
      </Typography>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="amount"
              label={({ groupName, amount }) =>
                `${groupName}: ${formatCurrency(amount as number)}`
              }
              stroke="#fff"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [formatCurrency(value as number), "Amount"]}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <Box sx={{ textAlign: "center", py: 10, color: "text.secondary" }}>
          <Typography>No data available</Typography>
        </Box>
      )}
    </Card>
  );
};

export default SpendingPieChart;
