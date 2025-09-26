import React from "react";
import { Card, Typography, Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

interface ICard {
  title: string;
  value: string;
  subtitle: string;
  icon: React.JSX.Element;
  color: string;
  bgColor: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  height: 200,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.spacing(1.5),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(1),
}));

interface IProps {
  cards: ICard[];
}

export const SummaryCards: React.FC<IProps> = ({ cards }) => {
  return (
    <Grid container flexDirection="row" spacing={1}>
      {cards.map((card) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.title}>
          <StyledCard variant="outlined">
            <Box>
              <IconWrapper sx={{ backgroundColor: card.bgColor }}>
                <Box sx={{ color: card.color }}>{card.icon}</Box>
              </IconWrapper>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {card.title}
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: card.color, mb: 1 }}
              >
                {card.value}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {card.subtitle}
            </Typography>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};
