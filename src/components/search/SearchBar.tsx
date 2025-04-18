import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  SearchBarContainer,
  SearchSection,
  SearchLabel,
  SearchButton,
} from "./StyledComponents";
import { getDogBreeds } from "../../apis/dogs";
import { useSearchParams } from "react-router-dom";
import { styled } from "@mui/material/styles";

const ErrorMessage = styled("div")(({ theme }) => ({
  color: theme.palette.error.main,
  marginTop: 8,
  fontSize: "0.875rem",
}));

const ScrollableTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      height: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#888',
      borderRadius: '2px',
    },
  },
});

/**
 * PetSearchBar renders a dynamic search form that allows users to filter dogs
 * by breed, zip code, and age range. The selected filters are synced with the URL
 * query params and trigger search behavior across the app.
 */
const PetSearchBar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [breeds, setBreeds] = useState<string[]>(searchParams.getAll('breeds') || []);
  const [zipCodes, setZipCodes] = useState<string | undefined>(
    searchParams.get('zipCodes') || undefined
  );
  const [ageMin, setAgeMin] = useState<number | undefined>(
    searchParams.get('ageMin') ? Number(searchParams.get('ageMin')) : undefined
  );
  const [ageMax, setAgeMax] = useState<number | undefined>(
    searchParams.get('ageMax') ? Number(searchParams.get('ageMax')) : undefined
  );

  const [breedOptions, setBreedOptions] = useState<string[]>([]);

  useEffect(() => {
    getDogBreeds()
      .then((res) => res.json())
      .then((data) => setBreedOptions(data));
  }, []);

  const handleAgeMinChange = (value: string) => {
    const newValue = value === "" ? undefined : Number(value);
    setAgeMin(newValue);
    if (newValue !== undefined && ageMax !== undefined && newValue > ageMax) {
      setAgeMax(undefined);
    }
  };

  const handleAgeMaxChange = (value: string) => {
    const newValue = value === "" ? undefined : Number(value);
    setAgeMax(newValue);
    if (newValue !== undefined && ageMin !== undefined && newValue < ageMin) {
      setAgeMax(undefined);
    }
  };

  const handleSearch = () => {
    const params: Record<string, string | string[]> = {
      breeds,
      zipCodes: zipCodes ? [zipCodes] : [],
    };

    if (ageMin !== undefined) {
      params.ageMin = ageMin.toString();
    }
    if (ageMax !== undefined && (ageMin === undefined || ageMax > ageMin)) {
      params.ageMax = ageMax.toString();
    }

    setSearchParams(params);
  };

  return (
    <>
      <SearchBarContainer>
        <SearchSection style={{ flex: 2 }}>
          <SearchLabel>Breeds</SearchLabel>
          <Autocomplete
            multiple
            options={breedOptions}
            value={breeds}
            onChange={(_, newValue) => setBreeds(newValue)}
            renderInput={(params) => (
              <ScrollableTextField
                {...params}
                placeholder="Select breeds"
                variant="outlined"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        </SearchSection>

        <SearchSection style={{ flex: 1 }}>
          <SearchLabel>Zip Code</SearchLabel>
          <TextField
            type="number"
            placeholder="Zip Code"
            variant="standard"
            value={zipCodes}
            onChange={(e) => setZipCodes(e.target.value)}
          />
        </SearchSection>

        <SearchSection style={{ flex: 0.5 }}>
          <SearchLabel>Age Min</SearchLabel>
          <TextField
            type="number"
            placeholder="Min age"
            variant="standard"
            value={ageMin ?? ""}
            onChange={(e) => handleAgeMinChange(e.target.value)}
          />
        </SearchSection>

        <SearchSection style={{ flex: 0.5 }}>
          <SearchLabel>Age Max</SearchLabel>
          <TextField
            type="number"
            placeholder="Max age"
            variant="standard"
            value={ageMax ?? ""}
            onChange={(e) => handleAgeMaxChange(e.target.value)}
            error={ageMax !== undefined && ageMin !== undefined && ageMax < ageMin}
            inputProps={{ min: ageMin || 0, step: 1 }}
          />
        </SearchSection>

        <SearchButton onClick={handleSearch}>
          <SearchIcon />
        </SearchButton>
      </SearchBarContainer>

      {ageMax !== undefined && ageMin !== undefined && ageMax < ageMin && (
        <ErrorMessage>Max age must be greater than min age</ErrorMessage>
      )}
    </>
  );
};

export default PetSearchBar;
