import React, { useState, useEffect } from "react";
import PetSearchBar from "./SearchBar/SearchBar";
import {
  Box,
  Grid2,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DogSearchParams, DogSearchResponse, fetchDogsById, searchDogs } from "../apis/dogs";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Dog, Location } from "../types";
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// Styled Components
const ListingsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100vh",
  width: "50%",
  overflowY: "auto",
}));

const MapContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "50%",
  position: "sticky",
  top: 0,
}));

const StyledCard = styled(Card)({
  maxWidth: 300,
  cursor: "pointer",
});

const DogMap: React.FC<{
  dogs: Dog[];
  locations: Location[];
}> = ({ dogs, locations }) => {
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  const center = {
    lat: 39.8283,
    lng: -98.5795,
  };

  const mapStyles = {
    height: "100%",
    width: "100%",
  };

  const getDogLocation = (dog: Dog) => {
    const location = locations.find(loc => loc.zip_code === dog.zip_code);
    return location ? { lat: location.latitude, lng: location.longitude } : null;
  };

  return (
    // TODO: Get API KEY & add to env
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={4}
        center={center}
      >
        {dogs.map((dog) => {
          const position = getDogLocation(dog);
          if (!position) return null;
          
          return (
            <Marker
              key={dog.id}
              position={position}
              onClick={() => setSelectedDog(dog)}
            />
          );
        })}

        {selectedDog && (
          <InfoWindow
            position={getDogLocation(selectedDog)!}
            onCloseClick={() => setSelectedDog(null)}
          >
            <StyledCard>
              <CardMedia
                component="img"
                height="140"
                image={selectedDog.img}
                alt={selectedDog.name}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {selectedDog.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedDog.breed}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {selectedDog.age}
                  <span style={{ color: "gray" }}>{" years old"}</span>
                </Typography>
              </CardContent>
            </StyledCard>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

const Results: React.FC = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<DogSearchResponse | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 25;

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const getAllParams = () => ({
    breeds: searchParams.getAll('breeds'),
    zipCodes: searchParams.getAll('zipCodes'),
    ageMin: Number(searchParams.get('ageMin')) || undefined,
    ageMax: Number(searchParams.get('ageMax')) || undefined,
  });

  useEffect(() => {
    searchDogs({
      size: itemsPerPage,
      from: (page*itemsPerPage) - itemsPerPage,
      ...getAllParams(),
    })
      .then((data) => setData(() => data)); 
  }, [page, searchParams.toString()]);

  useEffect(() => {
    if (data?.resultIds && data?.resultIds.length > 0) {
      fetchDogsById(data?.resultIds as string[]).then((res) => setDogs(res))
    }
  }, [data?.resultIds]);

  return (
    <Box display="flex">
      <ListingsContainer>
        <Grid2 container spacing={2}>
          {dogs.map((listing) => (
            <Grid2 key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="180"
                  image={listing.img}
                  alt={listing.name}
                />
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
                  <Typography variant="body2">
                    {listing.zip_code}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid2>
          ))}
        </Grid2>

        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil((data?.total || 0) / itemsPerPage) - 1}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      </ListingsContainer>
      
      <MapContainer>
        <DogMap dogs={dogs} locations={locations} />
      </MapContainer>
    </Box>
  );
};

const Search: React.FC = () => {
  return (
    <>
      <PetSearchBar />
      <Results />
    </>
  );
};

export default Search;
// Show search page here
// we want to here fetch all the dogs
// show paginated result of all the dogs
// have a search bar
// call search api and update shown result
// a button to sort ascending/descending (FontAwesomeIcon)

// We can build a separate filter component
// here fetch all the dog breeds
// this can be a side menu or a dropdown menu, find a good design

// Helper component to show a Dog
// we can have it click to open "info" for the dog
// see where to add a favorites option
// like giphy or dribbble

// Redux Store Setup
// we probably want a store to save favorites
// do we want to also store the dogs and breeds so it doesn't have to fetch again? Might be hard on memory though if not needed
// maybe just store breeds?

// Design Notes
// We should build a map view like zillow
// on the right, show all options resulting from the search from general search input fields
// we can display these on the map, with the map zoomed out to the search's bounding box

// If the user moves the map around or zooms in, we can call /locations/search to the given bounding box
// we do want to limit the size here so it doesn't take too much loading time
// -> this will return Location objects, and then we can call the /dogs/search api with those zipcodes
// // along with the previous breeds and age filters to update results
// and we add markers for this on the map
