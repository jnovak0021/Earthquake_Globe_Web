import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Globe: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapboxgl.accessToken = 'pk.eyJ1Ijoiam5vdmFrMDAyMSIsImEiOiJjbTZqanh1YzUwMW9rMnFwdDhnM2xsdW9tIn0.5T_he6q9jDjNzp1lZy4e6Q'; // Replace with your Mapbox access token
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/standard',
        //style: 'mapbox://styles/mapbox/standard-satellite', // Replace with your desired map style
        center: [-122.420679, 37.772537], // Initial map center [lng, lat]
        zoom: 13, // Initial map zoom level
      });

      
      mapRef.current.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}));

      /*

    for (const marker of geojson.features) {
      const el = document.createElement('div');
      const width = marker.properties.iconSize[0];
      const height = marker.properties.iconSize[1];
      el.className = 'marker';
      el.style.backgroundImage = `url(https://picsum.photos/id/${marker.properties.imageId}/${width}/${height})`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';
      el.style.display = 'block';
      el.style.border = 'none';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.padding = 0;

      el.addEventListener('click', () => {
        window.alert(marker.properties.message);
      });

      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(mapRef.current);
    }
      */ 



      //https://docs.mapbox.com/mapbox-gl-js/api/markers/
      // Create a new marker.
      /*
      const marker = new mapboxgl.Marker()
         .setLngLat([30.5, 50.5])
         .addTo(mapRef.current);
      */
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
        }
      };
    }
  }, []);

  return <div id="map-container" ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Globe;