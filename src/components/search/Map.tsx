import React, { useState, useCallback, useRef } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Dog, MapCoordinates } from "../../types";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";


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
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    });
  
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
  
    if (!isLoaded) return <p>Loading map...</p>;
    
    return (
      // <LoadScript
      //   googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
      // >
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
                map?.panTo(getDogLocation(selectedDog) ?? center);
                map?.setZoom(7);
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
      // </LoadScript>
    );
  };

  export default DogMap;