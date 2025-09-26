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

interface TopCategoriesBarChartProps {
  data: { groupName: string; amount: number; color: string }[];
  formatCurrency: (amount: number) => string;
}

const TopCategoriesBarChart: React.FC<TopCategoriesBarChartProps> = ({
  data,
  formatCurrency,
}) => {
  return (
    <Card variant="outlined" sx={{ width: "100%", p: 3, height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Top 5 Spending Categories
      </Typography>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="groupName"
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip
              formatter={(value) => [formatCurrency(value as number), "Amount"]}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Box sx={{ textAlign: "center", py: 10, color: "text.secondary" }}>
          <Typography>No data available</Typography>
        </Box>
      )}
    </Card>
  );
};

export default TopCategoriesBarChart;
