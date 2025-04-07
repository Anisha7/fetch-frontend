import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { searchLocations, getLocations } from "../apis/locations";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Dog, Location } from "../types";
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

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
  onBoundsChanged: (bounds: google.maps.LatLngBounds) => void;
  initialBounds?: google.maps.LatLngBounds;
}> = ({ dogs, locations, onBoundsChanged, initialBounds }) => {
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const boundsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);

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

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
    if (initialBounds && !hasInitializedRef.current) {
      map.fitBounds(initialBounds);
      const listener = google.maps.event.addListener(map, 'zoom_changed', () => {
        if (map.getZoom()! > 12) {
          map.setZoom(12);
        }
      });
      hasInitializedRef.current = true;
    }
  };

  // Add effect to handle initialBounds changes
  useEffect(() => {
    if (map && initialBounds && !hasInitializedRef.current) {
      map.fitBounds(initialBounds);
      hasInitializedRef.current = true;
    }
  }, [map, initialBounds]);

  const onIdle = useCallback(() => {
    if (boundsTimeoutRef.current) {
      clearTimeout(boundsTimeoutRef.current);
    }

    boundsTimeoutRef.current = setTimeout(() => {
      const bounds = map && map.getBounds();
      if (bounds) {
        onBoundsChanged(bounds);
      }
    }, 500);
  }, [map, onBoundsChanged]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={9}
        center={center}
        onLoad={onLoad}
        onIdle={onIdle}
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
  const [isLoading, setIsLoading] = useState(false);
  const [initialBounds, setInitialBounds] = useState<google.maps.LatLngBounds | null>(null);
  const itemsPerPage = 25;
  const lastBoundsRef = useRef<google.maps.LatLngBounds | null>(null);
  const isInitialLoadRef = useRef(true);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const getAllParams = useCallback(() => ({
    breeds: searchParams.getAll('breeds'),
    zipCodes: searchParams.getAll('zipCodes'),
    ageMin: Number(searchParams.get('ageMin')) || undefined,
    ageMax: Number(searchParams.get('ageMax')) || undefined,
  }), [searchParams]);

  const handleBoundsChanged = useCallback(async (bounds: google.maps.LatLngBounds) => {
    if (!isInitialLoadRef.current) {
      if (lastBoundsRef.current) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const lastNe = lastBoundsRef.current.getNorthEast();
        const lastSw = lastBoundsRef.current.getSouthWest();

        if (
          Math.abs(ne.lat() - lastNe.lat()) < 0.1 &&
          Math.abs(ne.lng() - lastNe.lng()) < 0.1 &&
          Math.abs(sw.lat() - lastSw.lat()) < 0.1 &&
          Math.abs(sw.lng() - lastSw.lng()) < 0.1
        ) {
          return;
        }
      }

      if (isLoading) return;
      setIsLoading(true);
      lastBoundsRef.current = bounds;

      try {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        
        const locations = await searchLocations({
          geoBoundingBox: {
            top: ne.lat(),
            bottom: sw.lat(),
            left: sw.lng(),
            right: ne.lng(),
          }
        });
        
        setLocations(locations?.results);
        
        if (locations.total > 0) {
          const zipCodes = locations.results.map(loc => loc.zip_code);
          const searchData = await searchDogs({
            size: itemsPerPage,
            from: 0,
            ...getAllParams(),
            zipCodes,
          });
          
          setData(searchData);
          if (searchData.resultIds.length > 0) {
            const dogsData = await fetchDogsById(searchData.resultIds);
            setDogs(dogsData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [getAllParams, isLoading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const zipCodes = searchParams.getAll('zipCodes');
        if (zipCodes.length > 0) {
          const locations = await getLocations(zipCodes);
          setLocations(locations);
          
          if (locations.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            locations.forEach(loc => {
              bounds.extend({ lat: loc.latitude, lng: loc.longitude });
            });
            setInitialBounds(bounds);
            
            const searchData = await searchDogs({
              size: itemsPerPage,
              from: (page*itemsPerPage) - itemsPerPage,
              ...getAllParams(),
            });
            setData(searchData);
          }
        } else {
          const searchData = await searchDogs({
            size: itemsPerPage,
            from: (page*itemsPerPage) - itemsPerPage,
            ...getAllParams(),
          });
          setData(searchData);
        }
      } catch (error) {
        console.error('Error fetching search data:', error);
      }
    };
    
    fetchData();
  }, [page, searchParams.toString(), getAllParams]);

  useEffect(() => {
    if (data?.resultIds && data?.resultIds.length > 0) {
      fetchDogsById(data?.resultIds as string[]).then(setDogs);
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
        <DogMap 
          dogs={dogs} 
          locations={locations} 
          onBoundsChanged={handleBoundsChanged}
          initialBounds={initialBounds || undefined}
        />
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
