import React from "react";
import PetSearchBar from "../search/SearchBar";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import GenerateMatchButton from "../match/GenerateMatch";
import SearchResults from "../search/SearchResults";

const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

// TODO: On smaller screens where width is less than 900px, place the button with these styles: float: right;
    // top: 130px;
    // position: absolute;
const ButtonContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 20,
  zIndex: 1,
  // Responsive overrides
  [theme.breakpoints.down('md')]: {
    float: 'right',
    top: 130,
  },
}));

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
