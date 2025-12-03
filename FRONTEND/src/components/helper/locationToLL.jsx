import { useEffect, useState } from 'react';
import React from 'react';

export function GetLatLongFromGoogleMapLink({ googleMapLink }) {
    // Helper function to extract lat and long from the Google Map URL
    const extractLatLong = (url) => {
        // Regex to capture latitude and longitude after the '@' symbol
        const regex = /@([-+]?[0-9]*\.?[0-9]+),([-+]?[0-9]*\.?[0-9]+)/;
        const match = url.match(regex);
        if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            return [lat, lng]; // Return the array [latitude, longitude]
        }
        return null; // Return null if URL does not match expected format
    };

    // Extract the latitude and longitude array
    const latLongArray = extractLatLong(googleMapLink);

    const sorce = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&center=lonlat:${latLongArray[1]},${latLongArray[0]}&zoom=12.5386&apiKey=f07ebc0bd09b41e6896af8823869a5a9`
    return (
        <div>
            {latLongArray ? (
                <p>Latitude: {latLongArray[0]}, Longitude: {latLongArray[1]}</p>
            ) : (
                <p>Invalid Google Map link</p>
            )}
            <div className="w-full bg-amber-400 h-full" >
                <img
                    className='w-full h-full'
                    src={sorce}
                    alt="739 South Thistle Street, Seattle, WA 98108, United States of America" />
            </div>

        </div>

    );
};

import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const RouteMap = ({ routeData }) => {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [waypoints, setWaypoints] = useState([]);

  useEffect(() => {
    // Extract coordinates and waypoints from the routeData
    const coordinates = routeData?.features[0]?.geometry?.coordinates[0] || [];
    setRouteCoordinates(coordinates);

    const wp = routeData?.features[0]?.properties?.waypoints || [];
    setWaypoints(wp);
  }, [routeData]);

  // Check if waypoints are available before accessing them
  if (waypoints.length === 0) {
    return <div>Loading...</div>; // Or return an empty div or some placeholder
  }

  // Safely extract start and end coordinates, or use default coordinates
  const startLatLng = [
    waypoints[0]?.lat ?? 30.385969,  // Default to the first available waypoint if lat is undefined
    waypoints[0]?.lon ?? 76.174906  // Default to the first available waypoint if lon is undefined
  ];

  const endLatLng = [
    waypoints[1]?.lat ?? 30.383535,  // Default to the second available waypoint if lat is undefined
    waypoints[1]?.lon ?? 76.179067  // Default to the second available waypoint if lon is undefined
  ];

  // Log coordinates to make sure they are valid
  console.log('Start LatLng:', startLatLng);
  console.log('End LatLng:', endLatLng);

  // Ensure valid coordinates before rendering the map
  if (!startLatLng[0] || !startLatLng[1] || !endLatLng[0] || !endLatLng[1]) {
    return <div>Error: Invalid coordinates</div>;  // Fallback for invalid coordinates
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <MapContainer center={startLatLng} zoom={14} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />

        {/* Polyline to represent the route */}
        <Polyline positions={routeCoordinates} color="blue" weight={5} />

        {/* Markers for the start and end points */}
        <Marker position={startLatLng}>
          <Popup>Gurmeett</Popup>
        </Marker>
        <Marker position={endLatLng}>
          <Popup>End Point</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};






