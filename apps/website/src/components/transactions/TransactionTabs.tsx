import React from "react";
import { Chip, Box, Grid, Typography } from "@mui/material";
import { useAppSelector } from "@/store";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { ITransaction } from "@/store/slices/transactionsSlice";
import RulesTab from "../rules/RulesTab";
import { GroupsTab } from "../groups/GroupsTabs";
import { GroupsFilter } from "./TransactionGroupFilter";
import { GroupChip } from "./GroupChip";
import { TransactionActions } from "./TransactionActions";

const columns: MRT_ColumnDef<ITransaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
    size: 2,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 2,
    Cell: ({ row }) => {
      const { amountNumeric, amount } = row.original;

      return (
        <Typography sx={{ color: amountNumeric > 0 ? "green" : "red" }}>
          {amount}
        </Typography>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 2,
  },
  {
    accessorKey: "groupIds",
    header: "Groups",
    size: 2,
    Filter: ({ column }) => <GroupsFilter column={column} />,
    filterFn: (row, _columnId, filterValue) => {
      const groupIds = row.original.groupIds || [];

      // If no filter value, show all rows
      if (!filterValue || filterValue.length === 0) {
        return true;
      }

      // Handle "Ungrouped" filter - show transactions with no groups
      if (filterValue.includes("ungrouped") && groupIds.length === 0) {
        return true;
      }

      // Check if any of the transaction's groups match the filter (OR logic)
      return groupIds.some((groupId) => filterValue.includes(groupId));
    },
    Cell: ({ row }) => {
      const groupIds = row.original.groupIds || [];
      return (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {groupIds.length === 0 ? (
            <Chip label="Ungrouped" size="small" variant="outlined" />
          ) : (
            groupIds.map((groupId) => (
              <GroupChip key={groupId} groupId={groupId} />
            ))
          )}
        </Box>
      );
    },
  },
  {
    header: "",
    id: "actions",
    size: 2,
    Cell: ({ row }) => {
      return <TransactionActions transaction={row.original} />;
    },
  },
];

export const TransactionTabs = () => {
  const { transactions } = useAppSelector((state) => state.transactions);

  const table = useMaterialReactTable({
    columns,
    data: transactions,
    enableColumnFilters: true,
    enableFilters: true,
    initialState: {
      pagination: { pageSize: 100, pageIndex: 0 },
      showColumnFilters: true,
    },
  });

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 7 }}>
        <MaterialReactTable table={table} />
      </Grid>
      <Grid container flexDirection="column" size={{ xs: 12, md: 5 }}>
        <GroupsTab />
        <RulesTab />
      </Grid>
    </Grid>
  );
};
