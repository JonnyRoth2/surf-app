import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet-fix';
import { useState } from 'react';
import { getDistance } from 'geolib';


function ClickMarker({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng); 
    },
  });
  return null;
}

function FlyToClick({ position }) {
  const map = useMapEvents({});
  if (position) {
    map.flyTo(position, map.getZoom());
  }
  return null;
}

function App() {
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleMapClick = (latlng) => {
    setMarkerPosition(latlng);
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer center={[30, -90]} zoom={3} style={{ height: "50%", width: "50%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FlyToClick position={markerPosition} />
        <ClickMarker onMapClick={handleMapClick} />

        
        {markerPosition && (
          <Marker position={markerPosition}>
            <Popup>
              You clicked here: <br />
              Lat: {markerPosition.lat.toFixed(4)},<br />
              Lng: {markerPosition.lng.toFixed(4)}
              
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default App;