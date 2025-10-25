import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1Ijoia2FpZHJvZ2VyIiwiYSI6ImNtaDM4bnB2cjBuN28ybnM5NmV0ZTluZHEifQ.YHW9Erg1h5egssNhthQiZw';

const Map = ({
  hubs,
  destinations,
  selectedHub,
  selectedDestinations,
  showBoundaries,
  showRoutes,
  calculatedRoutes
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const hubMarkersRef = useRef([]);
  const routeLayersRef = useRef([]);
  const routeDestMarkersRef = useRef([]); // Markers for route destinations
  const hubTerritoryLayerRef = useRef(null);
  const initialCenter = [104.9, 12.5]; // Center of Cambodia
  const initialZoom = 6.5;

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: initialZoom
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');

    // Wait for map to load before adding sources
    map.current.on('load', () => {
      // Add destinations source with clustering
      map.current.addSource('destinations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Cluster circles
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'destinations',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            10,
            '#f1f075',
            30,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            10,
            30,
            30,
            40
          ]
        }
      });

      // Cluster count
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'destinations',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      // Unclustered points with carrier type colors
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'destinations',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'case',
            ['boolean', ['get', 'selected'], false],
            // Selected: brighter version of carrier color
            [
              'case',
              ['==', ['get', 'carrier_type'], '2PL'],
              '#4264fb', // 2PL blue
              '#ff8c00'  // 3PL orange
            ],
            // Not selected: carrier type color
            [
              'case',
              ['==', ['get', 'carrier_type'], '2PL'],
              '#4264fb', // 2PL blue
              '#ff8c00'  // 3PL orange
            ]
          ],
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'oders_per_month'],
            0, 8,      // 0 orders = 8px radius (increased from 5px)
            10, 12,    // 10 orders = 12px (increased from 8px)
            20, 16,    // 20 orders = 16px (increased from 11px)
            50, 22,    // 50 orders = 22px (increased from 15px)
            100, 28    // 100+ orders = 28px (increased from 20px)
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
          'circle-opacity': [
            'case',
            ['boolean', ['get', 'selected'], false],
            1,
            0.8
          ]
        }
      });

      // Click on cluster to zoom
      map.current.on('click', 'clusters', (e) => {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.current.getSource('destinations').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;

            map.current.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

      // Show popup on unclustered point click
      map.current.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const props = e.features[0].properties;

        const carrierColor = props.carrier_type === '2PL' ? '#4264fb' : '#ff8c00';

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #333; font-weight: bold;">
                📍 ${props.name}
              </h3>
              <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                🏠 ${props.address || 'N/A'}
              </div>
              ${props.hub_name ? `
                <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                  🏭 Hub: ${props.hub_name}
                </div>
              ` : ''}
              <div style="font-size: 12px; margin-bottom: 4px;">
                <span style="
                  background-color: ${carrierColor}15;
                  color: ${carrierColor};
                  padding: 2px 8px;
                  border-radius: 4px;
                  font-weight: bold;
                ">
                  🏢 ${props.carrier_type}
                </span>
              </div>
              <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                📦 ${props.oders_per_month || 0} orders/tháng
              </div>
              ${props.distance_from_hub ? `
                <div style="
                  font-size: 12px;
                  color: #fff;
                  background-color: #28a745;
                  padding: 4px 8px;
                  border-radius: 4px;
                  margin-top: 6px;
                  font-weight: bold;
                ">
                  📏 ${props.distance_from_hub} km từ hub
                </div>
              ` : ''}
            </div>
          `)
          .addTo(map.current);
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'clusters', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'clusters', () => {
        map.current.getCanvas().style.cursor = '';
      });
      map.current.on('mouseenter', 'unclustered-point', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'unclustered-point', () => {
        map.current.getCanvas().style.cursor = '';
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update hub markers
  useEffect(() => {
    if (!map.current || !hubs || hubs.length === 0) return;

    // Remove old hub markers
    hubMarkersRef.current.forEach(marker => marker.remove());
    hubMarkersRef.current = [];

    // Add hub markers
    hubs.forEach(hub => {
      const el = document.createElement('div');
      const isSelected = selectedHub && selectedHub.id === hub.id;

      // Calculate hub statistics
      const hubDestinations = destinations.filter(d => d.hub_id === hub.id);
      const totalOrders = hubDestinations.reduce((sum, d) => sum + (d.oders_per_month || 0), 0);
      const twoPlCount = hubDestinations.filter(d => d.carrier_type === '2PL').length;
      const threePlCount = hubDestinations.filter(d => d.carrier_type === '3PL').length;

      // Calculate marker size based on total orders
      // Base size: 18px, scale up to 36px for high-volume hubs
      let baseSize = 18;
      if (totalOrders > 500) baseSize = 36;
      else if (totalOrders > 300) baseSize = 30;
      else if (totalOrders > 150) baseSize = 26;
      else if (totalOrders > 50) baseSize = 22;

      const markerSize = isSelected ? baseSize + 4 : baseSize;

      el.style.cssText = `
        background-color: ${isSelected ? '#FF0000' : '#FF6B6B'};
        width: ${markerSize}px;
        height: ${markerSize}px;
        border-radius: 50%;
        border: 3px solid white;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([hub.long, hub.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25, maxWidth: '320px' })
            .setHTML(`
              <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #333; font-weight: bold; border-bottom: 2px solid #4264fb; padding-bottom: 6px;">
                  🏭 ${hub.name}
                </h3>

                <div style="margin-bottom: 8px;">
                  <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                    📍 <strong>Địa chỉ:</strong>
                  </div>
                  <div style="font-size: 12px; color: #333; margin-left: 20px;">
                    ${hub.address || `${hub.province_name}, Cambodia`}
                  </div>
                </div>

                <div style="margin-bottom: 8px;">
                  <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                    🌐 <strong>Tọa độ:</strong>
                  </div>
                  <div style="font-size: 11px; color: #333; margin-left: 20px; font-family: monospace;">
                    Lat: ${hub.lat.toFixed(6)}<br/>
                    Lng: ${hub.long.toFixed(6)}
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                  <div style="background: #f0f7ff; padding: 8px; border-radius: 6px; border-left: 3px solid #4264fb;">
                    <div style="font-size: 11px; color: #666; margin-bottom: 2px;">📦 Destinations</div>
                    <div style="font-size: 16px; font-weight: bold; color: #4264fb;">
                      ${hubDestinations.length}
                    </div>
                    <div style="font-size: 10px; color: #999; margin-top: 2px;">
                      2PL: ${twoPlCount} | 3PL: ${threePlCount}
                    </div>
                  </div>

                  <div style="background: #fff5e6; padding: 8px; border-radius: 6px; border-left: 3px solid #ff8c00;">
                    <div style="font-size: 11px; color: #666; margin-bottom: 2px;">📊 Orders/tháng</div>
                    <div style="font-size: 16px; font-weight: bold; color: #ff8c00;">
                      ${totalOrders.toLocaleString()}
                    </div>
                    <div style="font-size: 10px; color: #999; margin-top: 2px;">
                      Avg: ${hubDestinations.length > 0 ? (totalOrders / hubDestinations.length).toFixed(1) : 0}/dest
                    </div>
                  </div>
                </div>

                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee; text-align: center;">
                  <button
                    onclick="window.dispatchEvent(new CustomEvent('hub-click', { detail: { hubId: '${hub.id}' } }))"
                    style="
                      background: #4264fb;
                      color: white;
                      border: none;
                      padding: 6px 12px;
                      border-radius: 4px;
                      font-size: 11px;
                      cursor: pointer;
                      font-weight: 500;
                    "
                  >
                    🔍 Xem khu vực phủ sóng
                  </button>
                </div>
              </div>
            `)
        )
        .addTo(map.current);

      hubMarkersRef.current.push(marker);
    });
  }, [hubs, selectedHub]);

  // Update destinations layer
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    if (!destinations || destinations.length === 0) return;

    // Filter destinations for selected hub
    const hubDestinations = selectedHub
      ? destinations.filter(d => d.hub_id === selectedHub.id && d.lat && d.long)
      : [];

    // Helper function to calculate distance (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    // Create GeoJSON features with distance calculation
    const features = hubDestinations.map(dest => {
      let distanceFromHub = null;
      if (selectedHub) {
        distanceFromHub = calculateDistance(
          selectedHub.lat,
          selectedHub.long,
          dest.lat,
          dest.long
        ).toFixed(2);
      }

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [dest.long, dest.lat]
        },
        properties: {
          id: dest.id,
          name: dest.name,
          address: dest.address,
          carrier_type: dest.carrier_type,
          oders_per_month: dest.oders_per_month || 0,
          selected: selectedDestinations.includes(dest.id),
          distance_from_hub: distanceFromHub,
          hub_name: selectedHub ? selectedHub.name : 'N/A'
        }
      };
    });

    const source = map.current.getSource('destinations');
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: features
      });
    }

    // Fit bounds to show all destinations
    if (features.length > 0 && selectedHub) {
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add hub to bounds
      bounds.extend([selectedHub.long, selectedHub.lat]);
      
      // Add destinations to bounds
      features.forEach(feature => {
        bounds.extend(feature.geometry.coordinates);
      });

      map.current.fitBounds(bounds, {
        padding: { top: 100, bottom: 100, left: 450, right: 100 },
        maxZoom: 12,
        duration: 1000
      });
    }
  }, [destinations, selectedHub, selectedDestinations]);

  // Draw routes from calculated routes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Remove old routes
    routeLayersRef.current.forEach(layerId => {
      if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
      if (map.current.getSource(layerId)) map.current.removeSource(layerId);
    });
    routeLayersRef.current = [];

    // Remove old route destination markers
    routeDestMarkersRef.current.forEach(marker => marker.remove());
    routeDestMarkersRef.current = [];

    // If no routes to show, return
    if (!showRoutes || !calculatedRoutes || calculatedRoutes.length === 0) {
      return;
    }

    // Draw routes from calculated data
    calculatedRoutes.forEach((route, index) => {
      if (!route.geometry) return;

      const layerId = `route-${route.destId}`;

      // Add source
      map.current.addSource(layerId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: route.geometry
        }
      });

      // Add layer with gradient colors
      const colors = ['#4264fb', '#ff8c00', '#28a745', '#dc3545', '#6f42c1'];
      const color = colors[index % colors.length];

      map.current.addLayer({
        id: layerId,
        type: 'line',
        source: layerId,
        paint: {
          'line-color': color,
          'line-width': 4,
          'line-opacity': 0.7
        }
      });

      routeLayersRef.current.push(layerId);

      // Add destination marker with number label
      const dest = destinations.find(d => d.id === route.destId);
      if (dest && dest.lat && dest.long) {
        const el = document.createElement('div');
        el.style.cssText = `
          background-color: ${color};
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(0,0,0,0.4);
          transition: all 0.2s;
        `;
        el.textContent = index + 1;

        // Add hover effect
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
          el.style.zIndex = '1000';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.zIndex = '1';
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([dest.long, dest.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="padding: 8px; min-width: 180px;">
                  <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #333;">
                    📍 Điểm ${index + 1}: ${dest.name}
                  </h4>
                  <div style="font-size: 11px; color: #666; margin-bottom: 3px;">
                    🏠 ${dest.address || 'N/A'}
                  </div>
                  <div style="font-size: 11px; color: #666; margin-bottom: 3px;">
                    🏢 ${dest.carrier_type} • 📦 ${dest.oders_per_month || 0} orders/tháng
                  </div>
                  <div style="
                    font-size: 12px;
                    color: white;
                    background-color: ${color};
                    padding: 4px 8px;
                    border-radius: 4px;
                    margin-top: 6px;
                    font-weight: bold;
                    text-align: center;
                  ">
                    📏 ${route.distance.toFixed(2)} km • ⏱️ ${Math.round(route.duration)} phút
                  </div>
                </div>
              `)
          )
          .addTo(map.current);

        routeDestMarkersRef.current.push(marker);
      }
    });
  }, [calculatedRoutes, showRoutes, destinations]);

  // Handle hub territory visualization
  useEffect(() => {
    if (!map.current) return;

    const handleHubClick = (event) => {
      const hubId = event.detail.hubId;
      const hub = hubs.find(h => h.id === hubId);

      if (!hub) return;

      console.log('🗺️ Showing territory for hub:', hub.name);

      // Get all destinations for this hub
      const hubDestinations = destinations.filter(d => d.hub_id === hubId);

      if (hubDestinations.length === 0) {
        alert(`Hub "${hub.name}" chưa có destinations nào.`);
        return;
      }

      // Filter destinations with valid coordinates
      const validDests = hubDestinations.filter(d => d.lat && d.long && d.lat !== '' && d.long !== '');

      if (validDests.length === 0) {
        alert(`Hub "${hub.name}" có ${hubDestinations.length} destinations nhưng tất cả đều thiếu tọa độ (lat/long).\n\nVui lòng cập nhật tọa độ trong file destinations.json.`);
        return;
      }

      // Calculate bounds to fit all destinations + hub
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([hub.long, hub.lat]); // Add hub

      validDests.forEach(dest => {
        bounds.extend([dest.long, dest.lat]);
      });

      // Dispatch event to select this hub (so destinations will be displayed)
      window.dispatchEvent(new CustomEvent('select-hub-from-map', {
        detail: { hubId: hub.id }
      }));

      // Zoom to bounds with padding (after a small delay to let destinations load)
      setTimeout(() => {
        map.current.fitBounds(bounds, {
          padding: { top: 100, bottom: 100, left: 100, right: 100 },
          maxZoom: 12,
          duration: 1500
        });
      }, 100);
    };

    window.addEventListener('hub-click', handleHubClick);

    return () => {
      window.removeEventListener('hub-click', handleHubClick);
    };
  }, [hubs, destinations]);

  // Handle reset map event
  useEffect(() => {
    const handleResetMap = () => {
      if (!map.current) return;

      // Fly back to initial view
      map.current.flyTo({
        center: initialCenter,
        zoom: initialZoom,
        duration: 1500
      });

      // Close all popups
      const popups = document.getElementsByClassName('mapboxgl-popup');
      if (popups.length) {
        Array.from(popups).forEach(popup => popup.remove());
      }
    };

    window.addEventListener('reset-map', handleResetMap);

    return () => {
      window.removeEventListener('reset-map', handleResetMap);
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%'
      }}
    />
  );
};

export default Map;

