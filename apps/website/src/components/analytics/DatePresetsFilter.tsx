import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Chip } from "@mui/material";

interface DatePreset {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
}

interface IProps {
  selectedPreset: string;
  onPresetChange: (preset: DatePreset | null) => void;
}

const DatePresetsFilter: React.FC<IProps> = ({
  selectedPreset,
  onPresetChange,
}) => {
  const getDatePresets = (): DatePreset[] => {
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    return [
      {
        label: "Last 7 days",
        value: "last7days",
        startDate: formatDate(
          new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        ),
        endDate: formatDate(today),
      },
      {
        label: "Last 30 days",
        value: "last30days",
        startDate: formatDate(
          new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        ),
        endDate: formatDate(today),
      },
      {
        label: "This Month",
        value: "thisMonth",
        startDate: formatDate(
          new Date(today.getFullYear(), today.getMonth(), 1)
        ),
        endDate: formatDate(today),
      },
      {
        label: "Last Month",
        value: "lastMonth",
        startDate: formatDate(
          new Date(today.getFullYear(), today.getMonth() - 1, 1)
        ),
        endDate: formatDate(new Date(today.getFullYear(), today.getMonth(), 0)),
      },
      {
        label: "This Year",
        value: "thisYear",
        startDate: formatDate(new Date(today.getFullYear(), 0, 1)),
        endDate: formatDate(today),
      },
      {
        label: "Last Year",
        value: "lastYear",
        startDate: formatDate(new Date(today.getFullYear() - 1, 0, 1)),
        endDate: formatDate(new Date(today.getFullYear() - 1, 11, 31)),
      },
    ];
  };

  const datePresets = getDatePresets();

  const handlePresetChange = (value: string) => {
    if (value === "") {
      onPresetChange(null);
      return;
    }

    const preset = datePresets.find((p) => p.value === value);
    if (preset) {
      onPresetChange(preset);
    }
  };

  return (
    <FormControl fullWidth sx={{ minWidth: 200 }}>
      <InputLabel>Quick Date Range</InputLabel>
      <Select
        value={selectedPreset}
        onChange={(e) => handlePresetChange(e.target.value as string)}
        label="Quick Date Range"
        renderValue={(selected) => {
          if (!selected) return "";
          const preset = datePresets.find((p) => p.value === selected);
          return preset ? (
            <Chip label={preset.label} size="small" color="primary" />
          ) : (
            ""
          );
        }}
      >
        <MenuItem value="">
          <em>Custom Range</em>
        </MenuItem>
        {datePresets.map((preset) => (
          <MenuItem key={preset.value} value={preset.value}>
            {preset.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DatePresetsFilter;
