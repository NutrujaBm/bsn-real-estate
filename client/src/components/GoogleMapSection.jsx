import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 13.7563, // พิกัดเริ่มต้น (กรุงเทพฯ)
  lng: 100.5018,
};

function GoogleMapSection({ onLocationSelect }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(center);

  const onLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = (event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedPosition(newPosition);
    if (onLocationSelect) {
      onLocationSelect(newPosition); // ส่งพิกัดกลับไปยังฟอร์ม
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newPosition = {
      ...selectedPosition,
      [name]: parseFloat(value) || 0, // แปลงค่าเป็นตัวเลข
    };
    setSelectedPosition(newPosition);

    if (onLocationSelect) {
      onLocationSelect(newPosition);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedPosition}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        <Marker position={selectedPosition} />
      </GoogleMap>
      <p className="text-center mt-3 mb-5 text-base/6 text-gray-600">
        กรุณากดคลิกตำแหน่งในแผนที่ เพื่อระบุตำแหน่ง
      </p>
      <div className="mb-4">
        <label className="block mb-2 text-lg font-medium text-gray-900">
          ละติจูด
        </label>
        <input
          type="number"
          name="lat"
          value={selectedPosition.lat}
          onChange={handleInputChange}
          className="w-full p-3 rounded-lg border"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-lg font-medium text-gray-900">
          ลองจิจูด
        </label>
        <input
          type="number"
          name="lng"
          value={selectedPosition.lng}
          onChange={handleInputChange}
          className="w-full p-3 rounded-lg border"
        />
      </div>
    </div>
  );
}

export default GoogleMapSection;
