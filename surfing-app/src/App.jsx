import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet-fix';
import './index.css';
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
    map.flyTo(position, 12); 
  }
  return null;
}

async function geocodeCity(cityName) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`
  );
  const data = await res.json();
  if (data.length > 0) {
    const { lat, lon } = data[0];
    return { lat: parseFloat(lat), lng: parseFloat(lon) };
  }
  return null;
}


function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const coords = await geocodeCity(query);
    if (coords) {
      onSearch(coords);
    } else {
      alert("Location not found");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for a city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "8px 12px",
          fontSize: "14px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "200px"
        }}
      />
    </form>
  );
}

function App() {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [searchTarget, setSearchTarget] = useState(null);
  const [currentInfo, setCurrentInfo] = useState(null);

  const handleMapClick = async (latlng) => {
    setMarkerPosition(latlng);
    const data = await fetchCurrentData(latlng.lat, latlng.lng);
    setCurrentInfo(data);
  };
  
  const handleCitySearch = async (coords) => {
    setSearchTarget(coords);
    setMarkerPosition(coords);
    const data = await fetchCurrentData(coords.lat, coords.lng);
    setCurrentInfo(data);
  };

  return (
    <div className="map-wrapper">
      <SearchBar onSearch={handleCitySearch} />

      <MapContainer
        center={[30, -90]}
        zoom={3}
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToClick position={searchTarget || markerPosition} />
        <ClickMarker onMapClick={handleMapClick} />

        {markerPosition && (
          <Marker position={markerPosition}>
            <Popup>
              <div>
                Lat: {markerPosition.lat.toFixed(4)}<br />
                Lng: {markerPosition.lng.toFixed(4)}<br />
                {currentInfo ? (
                  <>
                    <b>Wave Current:</b><br />
                    Speed: {currentInfo.prediction.v} knots<br />
                    Direction: {currentInfo.prediction.d}°
                  </>
                ) : (
                  <i>No current data nearby</i>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default App;