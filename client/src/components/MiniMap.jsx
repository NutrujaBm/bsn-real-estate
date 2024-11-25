import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

function MiniMap({ latitude, longitude }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const position = {
    lat: latitude || 13.7563,
    lng: longitude || 100.5018,
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-[300px] md:h-[400px] xl:h-[300px] 2xl:h-[400px]"
      center={position}
      zoom={18}
      options={{
        disableDefaultUI: true,
      }}
    >
      <Marker position={position} />
    </GoogleMap>
  );
}

export default MiniMap;
