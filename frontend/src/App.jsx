import { useState, useEffect } from 'react'
import Map from './components/Map'
import Dashboard from './components/Dashboard'
import './App.css'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FpZHJvZ2VyIiwiYSI6ImNtaDM4bnB2cjBuN28ybnM5NmV0ZTluZHEifQ.YHW9Erg1h5egssNhthQiZw';

function App() {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [focusedDestinations, setFocusedDestinations] = useState([]);

  useEffect(() => {
    fetch('/markers.json')
      .then(response => response.json())
      .then(data => {
        setMarkers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading markers:', error);
        setLoading(false);
      });
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    console.log('Selected marker:', marker);
  };

  const handleCalculateDistance = async (selectedDestinations) => {
    const hubDeparter = markers[0];
    const departerCoords = [hubDeparter.departer_long, hubDeparter.departer_lat];
    const results = [];

    // Enable focus mode - chỉ hiển thị các điểm đã chọn
    setFocusMode(true);
    const focusedMarkers = markers.filter(m =>
      selectedDestinations.includes(m.hub_destination)
    );
    setFocusedDestinations(focusedMarkers);

    for (const destName of selectedDestinations) {
      const marker = markers.find(m => m.hub_destination === destName);
      if (!marker) continue;

      const destCoords = [marker.destination_long, marker.destination_lat];
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${departerCoords[0]},${departerCoords[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          results.push({
            destination: destName,
            distance: data.routes[0].distance / 1000,
            duration: data.routes[0].duration / 60
          });
        }
      } catch (error) {
        console.error(`Error fetching route for ${destName}:`, error);
      }
    }

    return results;
  };

  const handleToggleBoundaries = (show) => {
    setShowBoundaries(show);
  };

  const handleToggleRoutes = (show) => {
    setShowRoutes(show);
  };

  const handleExitFocusMode = () => {
    setFocusMode(false);
    setFocusedDestinations([]);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        color: '#4264fb'
      }}>
        Loading map data...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Dashboard Sidebar */}
      <Dashboard
        markers={markers}
        onCalculateDistance={handleCalculateDistance}
        onToggleBoundaries={handleToggleBoundaries}
        showBoundaries={showBoundaries}
        onToggleRoutes={handleToggleRoutes}
        showRoutes={showRoutes}
        focusMode={focusMode}
        onExitFocusMode={handleExitFocusMode}
      />

      {/* Map Container */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Header */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '15px 20px',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
              🗺️ Logistics Hub Optimization - Cambodia
            </h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              Banteay Meanchey Province - Hub Poipet
            </p>
          </div>
          <div style={{
            backgroundColor: '#4264fb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {markers.length} Destinations
          </div>
        </div>

        {/* Map */}
        <div style={{ height: '100%', paddingTop: '80px' }}>
          <Map
            markers={markers}
            onMarkerClick={handleMarkerClick}
            showBoundaries={showBoundaries}
            showRoutes={showRoutes}
            focusMode={focusMode}
            focusedDestinations={focusedDestinations}
          />
        </div>
      </div>
    </div>
  )
}

export default App
