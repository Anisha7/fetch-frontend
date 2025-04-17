import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Box,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getFavoriteDogs } from "../../store/favoritesStore";
import { matchDog, fetchDogsById } from "../../apis/dogs";

/**
 * GenerateMatchButton allows users to find their best dog match based on favorites.
 * It fetches a match from the server and displays it in a modal.
 * If no favorites are selected, it informs the user accordingly.
 */
const GenerateMatchButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [noFavorites, setNoFavorites] = useState(false);

  // Handles the button click to find a dog match
  const handleMatchClick = async () => {
    setLoading(true);
    setMatch(null);
    const favoriteIds = getFavoriteDogs();

    // If user has no favorites, show info dialog
    if (favoriteIds.length === 0) {
      setNoFavorites(true);
      setOpen(true);
      setLoading(false);
      return;
    }

    try {
      // Fetch matched dog ID and then get full dog details
      const { match } = await matchDog(favoriteIds);
      const dogDetails = await fetchDogsById([match]);
      setMatch(dogDetails[0]);
      setNoFavorites(false);
      setOpen(true);
    } catch (err) {
      console.error("Failed to generate match", err);
    } finally {
      setLoading(false);
    }
  };

  // Resets state and closes the dialog
  const handleClose = () => {
    setOpen(false);
    setMatch(null);
    setNoFavorites(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleMatchClick}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Match"}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {noFavorites ? "No favorites yet" : "You've been matched! 🐶"}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {noFavorites ? (
            <Typography>Please favorite at least one dog first.</Typography>
          ) : match ? (
            <Card>
              <Box position="relative">
                <CardMedia
                  component="img"
                  height="180"
                  image={match.img}
                  alt={match.name}
                />
              </Box>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {match.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {match.breed}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {match.age}
                  <span style={{ color: "gray" }}>{" years old"}</span>
                </Typography>
                <Typography variant="body2">{match.zip_code}</Typography>
              </CardContent>
            </Card>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenerateMatchButton;