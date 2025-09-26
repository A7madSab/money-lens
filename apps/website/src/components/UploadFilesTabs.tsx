import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  LinearProgress,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useAppDispatch, useAppSelector } from "@/store";
import { useDropzone } from "react-dropzone";
import {
  processFiles,
  removeFileAndTransactions,
} from "@/store/slices/fileSlice";

export const UploadFilesTabs = () => {
  const dispatch = useAppDispatch();
  const files = useAppSelector((state) => state.files);
  const transactions = useAppSelector(
    (state) => state.transactions.transactions
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => dispatch(processFiles(files)),
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    multiple: true,
  });

  const handleRemoveFile = (fileName: string) => {
    dispatch(removeFileAndTransactions(fileName));
  };

  const getFileStats = (fileName: string) => {
    const fileTransactions = transactions.filter(
      (t) => t.fileName === fileName
    );
    return {
      count: fileTransactions.length,
      totalAmount: fileTransactions.reduce(
        (sum, t) => sum + Math.abs(t.amountNumeric || 0),
        0
      ),
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <UploadFileIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h5" fontWeight={600}>
              File Upload
            </Typography>
          </Box>
          <Typography color="text.secondary" gutterBottom>
            Upload your transaction CSV files to begin processing and analysis
          </Typography>

          {files.loading && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">Processing files...</Typography>
            </Alert>
          )}

          {files.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {files.error}
            </Alert>
          )}

          {/* Drag & Drop Box */}
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed",
              borderColor: isDragActive ? "primary.main" : "divider",
              backgroundColor: isDragActive ? "action.hover" : "transparent",
              borderRadius: 2,
              py: 6,
              textAlign: "center",
              color: "text.secondary",
              transition: "border-color 0.2s, background-color 0.2s",
              cursor: "pointer",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "action.hover",
              },
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon
              sx={{
                fontSize: 48,
                mb: 2,
                color: isDragActive ? "primary.main" : "inherit",
              }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {isDragActive
                ? "Drop the files here…"
                : "Drag & drop your CSV files here"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to browse files • Multiple files supported
            </Typography>
            <Chip
              label="CSV files only"
              size="small"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>

          {/* Expected format */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Expected CSV format:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2, color: "text.secondary" }}>
              <Typography component="li" variant="body2">
                Column 1: Transaction Date (e.g., &quot;Wed Jul 02 2025&quot;)
              </Typography>
              <Typography component="li" variant="body2">
                Column 2: Description
              </Typography>
              <Typography component="li" variant="body2">
                Column 3: Amount (e.g., &quot;-40 EGP&quot;, &quot;100
                USD&quot;)
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* File Management Section */}
      {files.files.length > 0 && (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Uploaded Files ({files.files.length})
            </Typography>

            <List>
              {files.files.map((file, index) => {
                const stats = getFileStats(file.name);
                return (
                  <React.Fragment key={file.name}>
                    <ListItem sx={{ px: 0 }}>
                      <Box sx={{ mr: 2 }}>
                        {file.status === "completed" && (
                          <CheckCircleIcon sx={{ color: "success.main" }} />
                        )}
                        {file.status === "error" && (
                          <ErrorIcon sx={{ color: "error.main" }} />
                        )}
                        {file.status === "uploading" && (
                          <CloudUploadIcon sx={{ color: "primary.main" }} />
                        )}
                      </Box>

                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body1" fontWeight={500}>
                              {file.name}
                            </Typography>
                            <Chip
                              label={file.status}
                              size="small"
                              color={
                                file.status === "completed"
                                  ? "success"
                                  : file.status === "error"
                                  ? "error"
                                  : "primary"
                              }
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            {file.status === "uploading" && (
                              <LinearProgress
                                variant="determinate"
                                value={file.progress}
                                sx={{ mt: 1, mb: 1 }}
                              />
                            )}
                            {file.status === "completed" && stats.count > 0 && (
                              <>
                                {stats.count} transactions • Total:{" "}
                                {formatCurrency(stats.totalAmount)}
                              </>
                            )}
                            {file.status === "error" && (
                              <>Failed to process file</>
                            )}
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveFile(file.name)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < files.files.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
