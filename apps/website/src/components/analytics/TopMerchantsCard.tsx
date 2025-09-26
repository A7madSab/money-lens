import React from "react";
import { Card, Typography, Box, List, ListItem, ListItemText, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ITransaction } from "@/store/slices/transactionsSlice";

interface TopMerchantsCardProps {
  transactions: ITransaction[];
  formatCurrency: (amount: number) => string;
}

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const TopMerchantsCard: React.FC<TopMerchantsCardProps> = ({
  transactions,
  formatCurrency,
}) => {
  const topMerchants = React.useMemo(() => {
    const merchantMap = new Map<string, { count: number; totalAmount: number }>();

    transactions.forEach((transaction) => {
      const description = transaction.description.trim();
      if (!description) return;

      const absAmount = Math.abs(transaction.amountNumeric || 0);

      const current = merchantMap.get(description) || { count: 0, totalAmount: 0 };
      current.count += 1;
      current.totalAmount += absAmount;

      merchantMap.set(description, current);
    });

    return Array.from(merchantMap.entries())
      .map(([description, data]) => ({
        description,
        count: data.count,
        totalAmount: data.totalAmount,
        avgAmount: data.totalAmount / data.count,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 8);
  }, [transactions]);

  return (
    <Card
      variant="outlined"
      sx={{
        p: 4,
        height: 500,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Top Merchants
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Most frequent transaction sources by total amount
      </Typography>

      {topMerchants.length > 0 ? (
        <Box sx={{ maxHeight: 380, overflowY: "auto" }}>
          <List>
            {topMerchants.map((merchant, index) => (
              <StyledListItem key={merchant.description}>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Chip
                        label={index + 1}
                        size="small"
                        sx={{
                          minWidth: 24,
                          height: 24,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                        color="primary"
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {merchant.description}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {merchant.count} transaction{merchant.count !== 1 ? "s" : ""}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg: {formatCurrency(merchant.avgAmount)}
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ ml: 2, textAlign: "right" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {formatCurrency(merchant.totalAmount)}
                  </Typography>
                </Box>
              </StyledListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <Typography variant="h6">No transaction data available</Typography>
        </Box>
      )}
    </Card>
  );
};

export default TopMerchantsCard;