import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Box,
  Grid2
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { addFavoriteDog, removeFavoriteDog, getFavoriteDogs } from "../../store/favoritesStore";
import { styled } from "@mui/material/styles";

interface DogListing {
  id: string;
  name: string;
  img: string;
  breed: string;
  age: number;
  zip_code: string;
}

interface DogCardProps {
  listing: DogListing;
}

const StyledCard = styled(Card)({
  position: "relative",
});

/**
 * DogCard component displays individual dog information in a card layout,
 * including name, breed, age, and zip code. It also includes a toggleable
 * favorite button that updates localStorage and UI state.
 *
 * @param listing - DogListing object containing metadata for one dog.
 */
const DogCard: React.FC<DogCardProps> = ({ listing }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // On mount or when the dog ID changes, check if the current dog is already a favorite
  useEffect(() => {
    const favorites = getFavoriteDogs();
    setIsFavorite(favorites.includes(listing.id));
  }, [listing.id]);

  // Toggles the favorite state of the current dog and updates localStorage
  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavoriteDog(listing.id);
    } else {
      addFavoriteDog(listing.id);
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <Grid2 key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}><StyledCard>
      <Box position="relative">
        <CardMedia
          component="img"
          height="180"
          image={listing.img}
          alt={listing.name}
        />
        <IconButton
          onClick={toggleFavorite}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "white",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </Box>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          {listing.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {listing.breed}
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {listing.age}
          <span style={{ color: "gray" }}>{" years old"}</span>
        </Typography>
        <Typography variant="body2">{listing.zip_code}</Typography>
      </CardContent>
    </StyledCard>
    </Grid2>
  );
};

export default DogCard;