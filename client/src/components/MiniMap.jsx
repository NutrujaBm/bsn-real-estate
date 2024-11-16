import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const miniMapStyle = {
  width: "650px", // ขนาดของ mini map
  height: "400px",
};

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
      mapContainerStyle={miniMapStyle}
      center={position}
      zoom={18}
      options={{
        disableDefaultUI: true, // ปิด UI เช่นปุ่ม Zoom หรือ Street View
      }}
    >
      <Marker position={position} />
    </GoogleMap>
  );
}

export default MiniMap;
