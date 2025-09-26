import { useAppSelector } from "@/store";
import { Chip } from "@mui/material";

export const GroupChip = ({ groupId }: { groupId: string }) => {
  const { groups } = useAppSelector((state) => state.groups);
  const group = groups.find((g) => g.id === groupId);

  if (!group) return <Chip label="Unknown" size="small" color="error" />;

  return (
    <Chip
      label={group.name}
      size="small"
      sx={{
        backgroundColor: group.color,
        color: "white",
        fontWeight: 500,
      }}
    />
  );
};
