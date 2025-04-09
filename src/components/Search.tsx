import React, { useState, useEffect, useCallback, useRef } from "react";
import PetSearchBar from "./SearchBar/SearchBar";
import {
  Box,
  Grid2,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DogSearchResponse, fetchDogsById, searchDogs } from "../apis/dogs";
import { searchLocations, getLocations } from "../apis/locations";
import { useSearchParams } from "react-router-dom";
import { Coordinates, Dog, Location, MapCoordinates } from "../types";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

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
  locations: Record<string, MapCoordinates>;
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
    // Handle initial load
    return locations[dog.id]
  };

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
    if (initialBounds && !hasInitializedRef.current) {
      map.fitBounds(initialBounds);
      hasInitializedRef.current = true;
    }
  };

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

  const handleMarkerClick = (dog: Dog) => {
    setSelectedDog(dog);
    const position = getDogLocation(dog);
    if (position && map) {
      const offset = { lat: 0.1, lng: 0.1 }; // Offset to move marker to corner
      map.panTo(position);
      map.setZoom(10);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
    >
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={3}
        center={center}
        onLoad={onLoad}
        onIdle={onIdle}
      >
        {dogs.map((dog) => {
          const position = getDogLocation(dog);
          console.log(position);
          // console.log(position)
          if (!position) return null;
          // update bounds to include positions
          // initialBounds?.extend(new google.maps.LatLng(position.lat, position.lng));
          return (
            <Marker
              key={dog.id}
              position={position}
              onClick={() => handleMarkerClick(dog)}
            />
          );
        })}

        {selectedDog && (
          <InfoWindow
            position={getDogLocation(selectedDog)!}
            onCloseClick={() => {
              console.log(getDogLocation(selectedDog));
              map?.panTo(getDogLocation(selectedDog) ?? center);
              map?.setZoom(10);
              setSelectedDog(null);
            }}
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
  const [locations, setLocations] = useState<Record<string, MapCoordinates>>({});
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [initialBounds, setInitialBounds] =
    useState<google.maps.LatLngBounds | null>(null);
  const itemsPerPage = 25;
  const lastBoundsRef = useRef<google.maps.LatLngBounds | null>(null);
  const isInitialLoadRef = useRef(true);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const getAllParams = useCallback(
    () => ({
      breeds: searchParams.getAll("breeds"),
      zipCodes: searchParams.getAll("zipCodes"),
      ageMin: Number(searchParams.get("ageMin")) || undefined,
      ageMax: Number(searchParams.get("ageMax")) || undefined,
    }),
    [searchParams]
  );

  const updateLocations = (allLocations: Location[], dogsToUse: Dog[]) => {
    const locsMap: Record<string, MapCoordinates> = {};
  
    dogsToUse.forEach((d) => {
      const location = allLocations.find(
        (loc) => loc?.zip_code === d?.zip_code
      );
  
      const offsetLat = (Math.random() - 0.5) * 0.002;
      const offsetLng = (Math.random() - 0.5) * 0.002;
  
      if (location) {
        locsMap[d.id] = {
          lat: location.latitude + offsetLat,
          lng: location.longitude + offsetLng,
        };
      }
    });
  
    setLocations(locsMap);
  };

  const handleBoundsChanged = useCallback(
    async (bounds: google.maps.LatLngBounds) => {
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

          const ls = await searchLocations({
            geoBoundingBox: {
              top: ne.lat(),
              bottom: sw.lat(),
              left: sw.lng(),
              right: ne.lng(),
            },
          });

          if (ls.total > 0) {
            const zipCodes = ls.results.map((loc) => loc.zip_code);
            console.log("locations empty search dogs");
            const searchData = await searchDogs({
              size: itemsPerPage,
              from: 0,
              ...getAllParams(),
              zipCodes,
            });

            setData(searchData);
            if (searchData.resultIds.length > 0) {
              const dogsData = await fetchDogsById(searchData.resultIds);
              updateLocations(ls?.results, dogsData);
              setDogs(dogsData);
            }
          }

        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [getAllParams, isLoading]
  );

  // Handle search params changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchData = await searchDogs({
          size: itemsPerPage,
          from: page * itemsPerPage - itemsPerPage,
          ...getAllParams(),
        });

        setData(searchData);
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    };

    fetchData();
  }, [page, searchParams.toString()]);

  useEffect(() => {
    if (data?.resultIds && data?.resultIds.length > 0) {
      fetchDogsById(data?.resultIds as string[]).then(async (ds) => {
        setDogs(ds);
        // Get unique zip codes from all dogs
        const uniqueZipCodes = Array.from(
          new Set(ds.map((dog) => dog?.zip_code))
        );

        // Get locations for all zip codes
        // lets instead have locations be a map from dog id to its location
        const allLocations = await getLocations(uniqueZipCodes);
        //setLocations
        console.log(dogs)
        updateLocations(allLocations, ds)
      });
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
                  <Typography variant="body2">{listing.zip_code}</Typography>
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
