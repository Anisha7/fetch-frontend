import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Chip,
  AutocompleteRenderInputParams,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  SearchBarContainer,
  SearchSection,
  SearchLabel,
  ChipsContainer,
  SearchButton,
} from "./StyledComponents";

// Sample options for breeds and zip codes
const breedOptions = [
  "Labrador",
  "Golden Retriever",
  "Poodle",
  "Bulldog",
  "Beagle",
];
const zipCodeOptions = ["10001", "90001", "60601", "94101", "33101"];

interface AutocompleteFieldProps {
  options: string[];
  onChange: (value: React.SetStateAction<string[]>) => void;
  renderInput: (params: AutocompleteRenderInputParams) => React.ReactNode;
  selected: string[];
  onDelete: (value: string) => void;
}
const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  options,
  onChange,
  renderInput,
  selected,
  onDelete,
}) => (
  <>
    <Autocomplete
      multiple
      options={options}
      value={selected}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={renderInput}
      disableClearable
      forcePopupIcon={false}
      renderTags={() => null} // Prevents tags from appearing inside the input
    />
    {selected.length > 0 && (
      <ChipsContainer>
        {selected.map((item: string) => (
          <Chip key={item} label={item} onDelete={() => onDelete(item)} />
        ))}
      </ChipsContainer>
    )}
  </>
);

const PetSearchBar: React.FC = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState<number | null>(null);
  const [ageMax, setAgeMax] = useState<number | null>(null);

  const handleSearch = () => {
    console.log({ breeds, zipCodes, ageMin, ageMax });
  };

  // TODO -> update breedOptions and zipCodeOptions to use from APIs
  // TODO -> improve design for how selected items are displayed
    // TODO -> Make it responsive
  // TODO -> add selections to URL on search
  // TODO -> design for search button

  return (
    <SearchBarContainer>
      {/* Breeds Input */}
      <SearchSection>
        <SearchLabel>Breeds</SearchLabel>
        <AutocompleteField
          options={breedOptions}
          onChange={setBreeds}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select breeds"
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">🐾</InputAdornment>
                ),
              }}
            />
          )}
          selected={breeds}
          onDelete={(breed) => setBreeds(breeds.filter((b) => b !== breed))}
        />
      </SearchSection>

      {/* Zip Codes Input */}
      <SearchSection>
        <SearchLabel>Zip Codes</SearchLabel>
        <AutocompleteField
          options={zipCodeOptions}
          onChange={setZipCodes}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Enter zip codes"
              variant="standard"
            />
          )}
          selected={zipCodes}
          onDelete={(zip) => setZipCodes(zipCodes.filter((z) => z !== zip))}
        />
      </SearchSection>

      {/* Age Min Input */}
      <SearchSection>
        <SearchLabel>Age Min</SearchLabel>
        <TextField
          type="number"
          placeholder="Min age"
          variant="standard"
          value={ageMin ?? ""}
          onChange={(e) => setAgeMin(Number(e.target.value))}
        />
      </SearchSection>

      {/* Age Max Input */}
      <SearchSection>
        <SearchLabel>Age Max</SearchLabel>
        <TextField
          type="number"
          placeholder="Max age"
          variant="standard"
          value={ageMax ?? ""}
          onChange={(e) => setAgeMax(Number(e.target.value))}
        />
      </SearchSection>

      {/* Search Button */}
      <SearchButton onClick={handleSearch}>
        <SearchIcon />
      </SearchButton>
    </SearchBarContainer>
  );
};

export default PetSearchBar;
