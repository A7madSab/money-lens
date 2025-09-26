import { useAppDispatch, useAppSelector } from "@/store";
import { addGroupToTransaction, ITransaction, removeGroupFromTransaction } from "@/store/slices/transactionsSlice";
import { Chip, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export const TransactionActions = ({
  transaction,
}: {
  transaction: ITransaction;
}) => {
  const dispatch = useAppDispatch();
  const { groups } = useAppSelector((state) => state.groups);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleGroup = (groupId: string) => {
    if (transaction.groupIds.includes(groupId)) {
      dispatch(
        removeGroupFromTransaction({
          transactionId: transaction.id,
          groupId,
        })
      );
    } else {
      dispatch(
        addGroupToTransaction({
          transactionId: transaction.id,
          groupId,
        })
      );
    }
    handleClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {groups.map((group) => {
          const isAssigned = transaction.groupIds.includes(group.id);
          return (
            <MenuItem
              key={group.id}
              onClick={() => handleToggleGroup(group.id)}
            >
              <ListItemIcon>
                <Chip
                  size="small"
                  sx={{
                    backgroundColor: group.color,
                    color: "#fff",
                    opacity: isAssigned ? 1 : 0.3,
                  }}
                  label={isAssigned ? "✓" : " "}
                />
              </ListItemIcon>
              <ListItemText>
                {group.name} {isAssigned ? "(assigned)" : ""}
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
