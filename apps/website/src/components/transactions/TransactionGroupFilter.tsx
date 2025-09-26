import { useAppSelector } from "@/store";
import { ITransaction } from "@/store/slices/transactionsSlice";
import {
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { MRT_Column } from "material-react-table";

export const GroupsFilter = ({
  column,
}: {
  column: MRT_Column<ITransaction, unknown>;
}) => {
  const { groups } = useAppSelector((state) => state.groups);
  const filterValue: string[] = (column.getFilterValue() as []) || [];

  const filterOptions = [
    { id: "ungrouped", name: "Ungrouped" },
    ...groups.map((group) => ({ id: group.id, name: group.name })),
  ];

  const handleFilterChange = (selectedValues: string[]) => {
    if (selectedValues.includes("all") || selectedValues.length === 0) {
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue(selectedValues);
    }
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <Select
        multiple
        variant="standard"
        value={filterValue}
        onChange={(e) => handleFilterChange(e.target.value as string[])}
        label="Filter Groups"
        renderValue={(selected: string[]) => {
          console.log({ selected });

          if (!selected || selected.length === 0) return "All Groups";
          return `${selected.length} selected`;
        }}
      >
        {filterOptions.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            <Checkbox checked={filterValue.includes(option.id)} />
            <ListItemText primary={option.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
