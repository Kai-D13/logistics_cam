# 📈 Hướng dẫn Scale Ứng dụng Logistics Map

## 🎯 Mục tiêu Scale

Khi scale ứng dụng này lên production với nhiều hub và nhiều điểm giao hàng hơn, bạn cần:

1. **Boundary thực tế của xã** (không phải vòng tròn)
2. **Cấu trúc dữ liệu tốt hơn** để quản lý nhiều hub
3. **Performance optimization** cho nhiều markers

---

## 🗺️ 1. Sử dụng Boundary Thực Tế của Xã

### Vấn đề hiện tại:
- Đang dùng vòng tròn 8km radius để khoanh vùng xã
- Không chính xác, không phản ánh ranh giới thực tế

### Giải pháp: Sử dụng GeoJSON từ OpenStreetMap

#### **Cách 1: Tải boundary từ OpenStreetMap (Overpass API)**

```javascript
// Ví dụ: Lấy boundary của xã Thma Puok
const fetchCommuneBoundary = async (communeName) => {
  const query = `
    [out:json];
    area["name"="${communeName}"]["admin_level"="7"]->.a;
    (
      relation(area.a)["boundary"="administrative"];
    );
    out geom;
  `;
  
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  
  // Convert to GeoJSON
  return convertOSMToGeoJSON(data);
};
```

#### **Cách 2: Sử dụng Mapbox Boundaries (Paid)**

Mapbox cung cấp enterprise boundaries dataset:
- https://docs.mapbox.com/data/tilesets/reference/mapbox-boundaries/

```javascript
map.addSource('commune-boundaries', {
  type: 'vector',
  url: 'mapbox://mapbox.enterprise-boundaries-a0-v2'
});

map.addLayer({
  id: 'commune-fill',
  type: 'fill',
  source: 'commune-boundaries',
  'source-layer': 'boundaries_admin_7', // Admin level 7 = commune
  paint: {
    'fill-color': '#088',
    'fill-opacity': 0.3
  },
  filter: ['==', 'iso_3166_1', 'KH'] // Cambodia
});
```

#### **Cách 3: Tự tạo GeoJSON file (Recommended cho bạn)**

1. Vào https://geojson.io/
2. Vẽ polygon theo ranh giới xã trên map
3. Export GeoJSON
4. Lưu vào file `commune_boundaries.json`

**Cấu trúc file:**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "commune": "Thma Puok",
        "district": "Thma Puok",
        "province": "Banteay Meanchey",
        "area_km2": 245.5
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [102.5, 13.9],
            [102.6, 13.9],
            [102.6, 14.0],
            [102.5, 14.0],
            [102.5, 13.9]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "commune": "Phsar",
        "district": "Paoy Paet",
        "province": "Banteay Meanchey",
        "area_km2": 180.3
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [...]
      }
    }
  ]
}
```

**Code để load và hiển thị:**

```javascript
// Load commune boundaries
const response = await fetch('/commune_boundaries.json');
const boundariesData = await response.json();

// Add to map
map.addSource('commune-boundaries', {
  type: 'geojson',
  data: boundariesData
});

// Add fill layer
map.addLayer({
  id: 'commune-fill',
  type: 'fill',
  source: 'commune-boundaries',
  paint: {
    'fill-color': [
      'match',
      ['get', 'commune'],
      'Thma Puok', '#FF6B6B',
      'Phsar', '#4ECDC4',
      'Poipet', '#45B7D1',
      '#CCCCCC' // default
    ],
    'fill-opacity': 0.3
  }
});

// Add outline layer
map.addLayer({
  id: 'commune-outline',
  type: 'line',
  source: 'commune-boundaries',
  paint: {
    'line-color': '#000',
    'line-width': 2
  }
});
```

---

## 📊 2. Cấu trúc Dữ liệu Tốt Hơn

### Vấn đề hiện tại:
- File `markers.json` chỉ có 1 hub (Hub Poipet)
- Mỗi destination lặp lại thông tin hub_departer
- Không scale được khi có nhiều hub

### Giải pháp: Tách riêng Hubs và Destinations

#### **File 1: `hubs.json`** - Danh sách các Hub

```json
{
  "hubs": [
    {
      "id": "hub_poipet",
      "name": "Hub Poipet",
      "address": "Poipet, Banteay Meanchey, Cambodia",
      "lat": 13.6281,
      "lng": 102.6770,
      "province": "Banteay Meanchey",
      "capacity": 500,
      "operating_hours": "06:00-22:00",
      "contact": "+855 12 345 678"
    },
    {
      "id": "hub_siem_reap",
      "name": "Hub Siem Reap",
      "address": "Siem Reap, Siem Reap Province, Cambodia",
      "lat": 13.3633,
      "lng": 103.8564,
      "province": "Siem Reap",
      "capacity": 800,
      "operating_hours": "06:00-22:00",
      "contact": "+855 12 345 679"
    },
    {
      "id": "hub_battambang",
      "name": "Hub Battambang",
      "address": "Battambang, Battambang Province, Cambodia",
      "lat": 13.0957,
      "lng": 103.2022,
      "province": "Battambang",
      "capacity": 600,
      "operating_hours": "06:00-22:00",
      "contact": "+855 12 345 680"
    }
  ]
}
```

#### **File 2: `destinations.json`** - Danh sách điểm giao hàng

```json
{
  "destinations": [
    {
      "id": "dest_001",
      "name": "Thma Puok",
      "address": "Thma Puok, Thma Puok, Banteay Meanchey",
      "lat": 13.940397833521008,
      "lng": 102.56854057312012,
      "commune": "Thma Puok",
      "district": "Thma Puok",
      "province": "Banteay Meanchey",
      "hub_id": "hub_poipet",
      "orders_per_month": 1,
      "priority": "low",
      "delivery_days": ["Monday", "Wednesday", "Friday"]
    },
    {
      "id": "dest_002",
      "name": "Phsar",
      "address": "Phsar Kandal, Paoy Paet, Banteay Meanchey",
      "lat": 13.638428781920434,
      "lng": 102.60076522827148,
      "commune": "Phsar",
      "district": "Paoy Paet",
      "province": "Banteay Meanchey",
      "hub_id": "hub_poipet",
      "orders_per_month": 12,
      "priority": "high",
      "delivery_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    }
  ]
}
```

#### **File 3: `routes.json`** - Pre-calculated routes (Optional)

```json
{
  "routes": [
    {
      "id": "route_001",
      "hub_id": "hub_poipet",
      "destination_id": "dest_001",
      "distance_km": 45.2,
      "duration_minutes": 52,
      "geometry": {
        "type": "LineString",
        "coordinates": [[102.677, 13.628], [102.568, 13.940]]
      },
      "last_updated": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

## 💻 3. Code để Load Dữ liệu Mới

### **App.jsx - Load tất cả data**

```javascript
function App() {
  const [hubs, setHubs] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedHub, setSelectedHub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/hubs.json').then(r => r.json()),
      fetch('/destinations.json').then(r => r.json())
    ])
    .then(([hubsData, destsData]) => {
      setHubs(hubsData.hubs);
      setDestinations(destsData.destinations);
      setSelectedHub(hubsData.hubs[0]); // Default to first hub
      setLoading(false);
    })
    .catch(error => {
      console.error('Error loading data:', error);
      setLoading(false);
    });
  }, []);

  // Filter destinations by selected hub
  const filteredDestinations = destinations.filter(
    dest => dest.hub_id === selectedHub?.id
  );

  return (
    <div>
      <HubSelector 
        hubs={hubs} 
        selectedHub={selectedHub} 
        onSelectHub={setSelectedHub} 
      />
      <Map 
        hub={selectedHub} 
        destinations={filteredDestinations} 
      />
    </div>
  );
}
```

---

## 🚀 4. Performance Optimization

### Khi có nhiều markers (>100):

#### **1. Clustering**

```javascript
import Supercluster from 'supercluster';

const cluster = new Supercluster({
  radius: 40,
  maxZoom: 16
});

cluster.load(destinations.map(d => ({
  type: 'Feature',
  properties: { ...d },
  geometry: {
    type: 'Point',
    coordinates: [d.lng, d.lat]
  }
})));

// Get clusters for current zoom
const clusters = cluster.getClusters(bounds, zoom);
```

#### **2. Lazy Loading Routes**

Chỉ load routes khi user click vào marker:

```javascript
const handleMarkerClick = async (destination) => {
  const route = await fetchRoute(selectedHub, destination);
  displayRoute(route);
};
```

#### **3. Use Mapbox GL JS Layers thay vì DOM Markers**

```javascript
// Thay vì tạo nhiều Marker objects
// Dùng GeoJSON source + symbol layer
map.addSource('destinations', {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: destinations.map(d => ({
      type: 'Feature',
      properties: { name: d.name, orders: d.orders_per_month },
      geometry: { type: 'Point', coordinates: [d.lng, d.lat] }
    }))
  }
});

map.addLayer({
  id: 'destination-circles',
  type: 'circle',
  source: 'destinations',
  paint: {
    'circle-radius': 10,
    'circle-color': '#4264fb'
  }
});
```

---

## 📝 5. Recommended Data Structure Summary

```
logistics_map/
├── frontend/
│   └── public/
│       ├── hubs.json              # Danh sách hubs
│       ├── destinations.json      # Danh sách điểm giao hàng
│       ├── commune_boundaries.json # Ranh giới xã (GeoJSON)
│       └── routes.json            # Pre-calculated routes (optional)
```

**Lợi ích:**
- ✅ Dễ thêm/xóa hub mới
- ✅ Dễ quản lý destinations theo hub
- ✅ Có thể filter, search, sort dễ dàng
- ✅ Có thể cache routes để tăng performance
- ✅ Có thể tích hợp database sau này

---

## 🎯 Next Steps

1. **Ngay bây giờ:** Tôi sẽ fix lỗi toggle boundaries/routes
2. **Sau đó:** Bạn quyết định có muốn:
   - Tạo file `commune_boundaries.json` với boundary thực tế?
   - Chuyển sang cấu trúc data mới (hubs.json + destinations.json)?
   - Hay giữ nguyên và chỉ fix bugs?

Bạn muốn tôi làm gì tiếp theo? 😊

