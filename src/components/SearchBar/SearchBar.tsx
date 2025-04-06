import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
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
import { DogSearchParams, getDogBreeds } from "../../apis/dogs";
import { useSearchParams, useNavigate } from "react-router-dom";

// Sample options for breeds and zip codes

const zipCodeOptions = ["10001", "90001", "60601", "94101", "33101"];

interface AutocompleteFieldProps {
  options: string[];
  onChange: (value: React.SetStateAction<string[]>) => void;
  renderInput: (params: AutocompleteRenderInputParams) => React.ReactNode;
  selected: string[];
  onDelete: (value: string) => void;
}

const ErrorMessage = ({ children }: { children: React.ReactNode }) => (
  <div style={{ color: 'red', marginTop: '8px', fontSize: '0.875rem' }}>
    {children}
  </div>
);

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  options,
  onChange,
  renderInput,
  selected,
  onDelete,
}) => {
  return (
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
};

// Input fields:
// breeds - autocomplete, multiple options
// -> /dogs/breeds we can use for autocomplete here
// zipCodes - autocomplete, multiple options
// -> /locations will return 100 zip codes, we can use for autocomplete
// ageMin - number
// ageMax - number
const PetSearchBar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // TODO: use searchParams as default values
  const [breeds, setBreeds] = useState<string[]>([]);
  const [zipCodes, setZipCodes] = useState<string | undefined>();
  const [ageMin, setAgeMin] = useState<number | undefined>();
  const [ageMax, setAgeMax] = useState<number | undefined>();

  const [breedOptions, setBreedOptions] = useState<string[]>([]);

  // TODO -> update breedOptions and zipCodeOptions to use from APIs
  // TODO -> improve design for how selected items are displayed:
  // maybe the search just has breeds and other things are in filter tab
  // then breeds can all be inside OR outside the search box (longer box) but align horizontally instead of vertically expanding the input
  // TODO -> Make it responsive - not sure how this would work
  // TODO -> add selections to URL on search
  // TODO -> design for search button
  // TODO -> onSubmit search

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
    <><SearchBarContainer>
      {/* Breeds Input */}
      <SearchSection style={{ flex: 2 }}>
        <SearchLabel>Breeds</SearchLabel>
        <Autocomplete
          multiple
          options={breedOptions}
          value={breeds}
          onChange={(_, newValue) => setBreeds(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select breeds"
              variant="standard"
              sx={{
                '& .MuiInputBase-root': {
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': {
                    height: '4px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '2px'
                  }
                }
              }}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
        />
      </SearchSection>

      {/* Zip Codes Input */}
      <SearchSection style={{ flex: 2 }}>
        <SearchLabel>Zip Codes</SearchLabel>
        <TextField
          type="number"
          placeholder="Zip Code"
          variant="standard"
          value={zipCodes}
          onChange={(e) => setZipCodes(e.target.value)}
        />
        {/* <Autocomplete
          multiple
          options={zipCodeOptions}
          value={zipCodes}
          onChange={(_, newValue) => setZipCodes(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Enter zip codes"
              variant="standard"
              sx={{
                '& .MuiInputBase-root': {
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': {
                    height: '4px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '2px'
                  }
                }
              }}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
        /> */}
      </SearchSection>

      {/* Age Min Input */}
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

      {/* Age Max Input */}
      <SearchSection style={{ flex: 0.5 }}>
        <SearchLabel>Age Max</SearchLabel>
        <TextField
          type="number"
          placeholder="Max age"
          variant="standard"
          value={ageMax ?? ""}
          onChange={(e) => handleAgeMaxChange(e.target.value)}
          error={ageMax !== undefined && ageMin !== undefined && ageMax < ageMin}
          inputProps={{
            min: ageMin || 0,
            step: 1
          }}
        />
      </SearchSection>

      {/* Search Button */}
      <SearchButton
        onClick={() => handleSearch()}
      >
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
