import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import DogPreviewCard from "../dog/DogPreviewCard";
import { Dog, MapCoordinates } from "../../types";

const MAP_CENTER = { lat: 39.8283, lng: -98.5795 };
const MAP_STYLES = { height: "100%", width: "100%" };

/**
 * DogMap renders a Google Map displaying dog locations as markers.
 * Clicking a marker opens an InfoWindow with dog details.
 * Automatically tracks map bounds and notifies parent via onBoundsChanged.
 *
 * @param dogs - Array of Dog objects to show on the map
 * @param locations - Map of dogId to MapCoordinates
 * @param onBoundsChanged - Callback triggered when map bounds change
 * @param initialBounds - Optional initial bounding box to fit all dogs
 */
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

  const getDogLocation = (dog: Dog) => locations[dog.id];

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    if (initialBounds && !hasInitializedRef.current) {
      mapInstance.fitBounds(initialBounds);
      hasInitializedRef.current = true;
    }
  };

  const onIdle = useCallback(() => {
    if (boundsTimeoutRef.current) clearTimeout(boundsTimeoutRef.current);

    boundsTimeoutRef.current = setTimeout(() => {
      const bounds = map?.getBounds();
      if (bounds) onBoundsChanged(bounds);
    }, 500);
  }, [map, onBoundsChanged]);

  const handleMarkerClick = (dog: Dog) => {
    const position = getDogLocation(dog);
    setSelectedDog(dog);
    if (position && map) {
      map.panTo(position);
      map.setZoom(10);
    }
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={MAP_STYLES}
      zoom={3}
      center={MAP_CENTER}
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
            onClick={() => handleMarkerClick(dog)}
          />
        );
      })}

      {selectedDog && (
        <InfoWindow
          position={getDogLocation(selectedDog)!}
          onCloseClick={() => {
            map?.panTo(getDogLocation(selectedDog) ?? MAP_CENTER);
            map?.setZoom(7);
            setSelectedDog(null);
          }}
        >
          <DogPreviewCard dog={selectedDog} />
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default DogMap;
