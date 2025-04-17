import React from "react";
import PetSearchBar from "../search/SearchBar";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import GenerateMatchButton from "../match/GenerateMatch";
import SearchResults from "../search/SearchResults";

// Container for search bar layout, centers it horizontally
const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// Positioning wrapper for the Generate Match button
const ButtonContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 20,
  zIndex: 1,
  // On smaller screens, float button below navbar
  [theme.breakpoints.down('md')]: {
    float: 'right',
    top: 130,
  },
}));

/**
 * Search page component that renders:
 * - A responsive search bar for filtering dogs
 * - A floating match button to generate a dog match from favorites
 * - The main search results with dog cards and an interactive map
 */
const Search: React.FC = () => {
  return (
    <>
      <SearchContainer>
        <ButtonContainer>
          <GenerateMatchButton />
        </ButtonContainer>
        <PetSearchBar />
      </SearchContainer>
      <SearchResults />
    </>
  );
};

export default Search;
