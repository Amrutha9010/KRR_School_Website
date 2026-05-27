import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different markers
const schoolIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/167/167707.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const stopIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png', // Placeholder
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Component to handle map view updates
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const TransportMap = ({ 
  schoolLocation, 
  routes, 
  buses, 
  pickupPoints, 
  searchedLocation,
  selectedRouteId 
}) => {
  const center = searchedLocation 
    ? [searchedLocation.lat, searchedLocation.lng] 
    : [schoolLocation.lat, schoolLocation.lng];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10"
    >
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <ChangeView center={center} zoom={12} />

        {/* School Marker */}
        <Marker position={[schoolLocation.lat, schoolLocation.lng]} icon={schoolIcon}>
          <Popup>
            <div className="font-bold">KRR BrightMinds School</div>
            <p>Main Campus</p>
          </Popup>
        </Marker>

        {/* Searched Location Marker */}
        {searchedLocation && (
          <Marker position={[searchedLocation.lat, searchedLocation.lng]}>
            <Popup>
              <div className="font-bold text-blue-600">Your Location</div>
              <p className="text-xs">{searchedLocation.name}</p>
            </Popup>
          </Marker>
        )}

        {/* Routes and Stops */}
        {routes.map((route, idx) => (
          <React.Fragment key={route._id}>
            <Polyline
              positions={route.path.map(p => [p.lat, p.lng])}
              color={selectedRouteId === route._id ? '#3b82f6' : '#94a3b8'}
              weight={selectedRouteId === route._id ? 5 : 3}
              opacity={selectedRouteId === route._id ? 1 : 0.6}
            />
          </React.Fragment>
        ))}

        {/* Pickup Points */}
        {pickupPoints.map((point) => (
          <Marker 
            key={point._id} 
            position={[point.location.lat, point.location.lng]}
          >
            <Tooltip permanent direction="top" offset={[0, -10]} className="bg-slate-900 border-none text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
              {point.name}
            </Tooltip>
            <Popup>
              <div className="font-bold text-blue-600">{point.name}</div>
              <p className="text-xs">Route: {point.route?.routeName}</p>
              <p className="text-[10px] text-gray-500">Official KRR Pickup Point</p>
            </Popup>
          </Marker>
        ))}

        {/* Active Buses */}
        {buses.map((bus) => (
          <Marker 
            key={bus._id} 
            position={[bus.currentLocation.lat, bus.currentLocation.lng]}
            icon={busIcon}
          >
            <Popup>
              <div className="font-bold">Bus: {bus.busNumber}</div>
              <p className="text-xs">Driver: {bus.driverName}</p>
              <p className="text-xs">Seats: {bus.availableSeats}/{bus.totalSeats}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  );
};

export default TransportMap;
