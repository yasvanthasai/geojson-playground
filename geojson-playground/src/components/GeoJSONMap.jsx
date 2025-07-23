import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, Polygon, Polyline, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '8px',
  border: '1px solid #ddd'
};

const center = {
  lat: 40.7589,
  lng: -73.9851
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
};

// Map data for different tabs
const mapData = {
  basic: {
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [-73.9857, 40.7484] },
        properties: { name: "Times Square", type: "landmark" }
      },
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[-74.0060, 40.7128], [-73.9857, 40.7484], [-73.9581, 40.7831]]
        },
        properties: { name: "Manhattan Route", type: "path" }
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[[-73.9581, 40.8006], [-73.9581, 40.7681], [-73.9441, 40.7681], [-73.9441, 40.8006], [-73.9581, 40.8006]]]
        },
        properties: { name: "Central Park", type: "area" }
      }
    ]
  },
  points: {
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [-74.0060, 40.7128] },
        properties: { name: "Empire State Building" }
      },
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [-73.9857, 40.7484] },
        properties: { name: "Times Square" }
      },
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [-73.9442, 40.8006] },
        properties: { name: "Central Park North" }
      }
    ]
  },
  lines: {
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[-74.0060, 40.7128], [-73.9857, 40.7484]]
        },
        properties: { name: "Route 1" }
      },
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[-73.9857, 40.7484], [-73.9581, 40.7831]]
        },
        properties: { name: "Route 2" }
      }
    ]
  },
  polygons: {
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[[-73.9581, 40.8006], [-73.9581, 40.7681], [-73.9441, 40.7681], [-73.9441, 40.8006], [-73.9581, 40.8006]]]
        },
        properties: { name: "Central Park" }
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[[-74.0200, 40.7000], [-74.0200, 40.7200], [-73.9800, 40.7200], [-73.9800, 40.7000], [-74.0200, 40.7000]]]
        },
        properties: { name: "Financial District" }
      }
    ]
  }
};

const geoJSONToGoogleMaps = (coordinates) => {
  if (Array.isArray(coordinates[0])) {
    return coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
  } else {
    return { lat: coordinates[1], lng: coordinates[0] };
  }
};

const getStyleOptions = (geometryType) => {
  const styles = {
    LineString: {
      strokeColor: '#FF6B6B',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      clickable: true
    },
    Polygon: {
      fillColor: '#4ECDC4',
      fillOpacity: 0.35,
      strokeColor: '#4ECDC4',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      clickable: true
    }
  };
  return styles[geometryType] || {};
};

const GeoJSONMap = ({ activeTab }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'your-api-key-here',
  });

  const onFeatureClick = useCallback((feature, index, position = null) => {
    setSelectedFeature({ feature, index });
    if (position) {
      setInfoWindowPosition(position);
    } else if (feature.geometry.type === 'Point') {
      setInfoWindowPosition(geoJSONToGoogleMaps(feature.geometry.coordinates));
    }
  }, []);

  const onCloseInfoWindow = useCallback(() => {
    setSelectedFeature(null);
    setInfoWindowPosition(null);
  }, []);

  if (!isLoaded) {
    return (
      <div style={{ 
        ...mapContainerStyle, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div>Loading map...</div>
      </div>
    );
  }

  const currentData = mapData[activeTab] || mapData.basic;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={mapOptions}
      >
        {currentData.features.map((feature, index) => {
          const { geometry, properties } = feature;
          
          switch (geometry.type) {
            case 'Point':
              const pointCoords = geoJSONToGoogleMaps(geometry.coordinates);
              return (
                <Marker
                  key={`point-${index}`}
                  position={pointCoords}
                  onClick={() => onFeatureClick(feature, index)}
                  title={properties.name}
                />
              );
              
            case 'LineString':
              const lineCoords = geoJSONToGoogleMaps(geometry.coordinates);
              return (
                <Polyline
                  key={`line-${index}`}
                  path={lineCoords}
                  options={getStyleOptions('LineString')}
                  onClick={(e) => onFeatureClick(feature, index, { 
                    lat: e.latLng.lat(), 
                    lng: e.latLng.lng() 
                  })}
                />
              );
              
            case 'Polygon':
              const polygonCoords = geoJSONToGoogleMaps(geometry.coordinates[0]);
              return (
                <Polygon
                  key={`polygon-${index}`}
                  paths={polygonCoords}
                  options={getStyleOptions('Polygon')}
                  onClick={(e) => onFeatureClick(feature, index, { 
                    lat: e.latLng.lat(), 
                    lng: e.latLng.lng() 
                  })}
                />
              );
              
            default:
              return null;
          }
        })}
        
        {selectedFeature && infoWindowPosition && (
          <InfoWindow
            position={infoWindowPosition}
            onCloseClick={onCloseInfoWindow}
          >
            <div style={{ minWidth: 150 }}>
              <strong>{selectedFeature.feature.properties.name}</strong>
              <div style={{ fontSize: 12, marginTop: 5, color: '#666' }}>
                Type: {selectedFeature.feature.geometry.type}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      <div style={{ 
        marginTop: 15, 
        padding: 15, 
        backgroundColor: '#f8f9fa', 
        borderRadius: 8,
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Map Legend</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ 
              width: 12, 
              height: 12, 
              backgroundColor: '#FF6B6B', 
              borderRadius: '50%' 
            }}></div>
            <span style={{ fontSize: 13 }}>Points</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ 
              width: 20, 
              height: 3, 
              backgroundColor: '#FF6B6B' 
            }}></div>
            <span style={{ fontSize: 13 }}>Lines</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ 
              width: 12, 
              height: 12, 
              backgroundColor: '#4ECDC4', 
              opacity: 0.5 
            }}></div>
            <span style={{ fontSize: 13 }}>Polygons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoJSONMap;
