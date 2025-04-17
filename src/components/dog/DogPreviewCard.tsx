import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Dog } from "../../types";

interface DogPreviewCardProps {
  dog: Dog;
}

const StyledCard = styled(Card)({
  maxWidth: 300,
  cursor: "pointer",
});

/**
 * DogPreviewCard renders a styled card used inside a map InfoWindow
 * to display key details about a selected dog.
 */

const DogPreviewCard: React.FC<DogPreviewCardProps> = ({ dog }) => {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="140"
        image={dog.img}
        alt={dog.name}
      />
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          {dog.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {dog.breed}
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {dog.age}
          <span style={{ color: "gray" }}> years old</span>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {dog.zip_code}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default DogPreviewCard;
