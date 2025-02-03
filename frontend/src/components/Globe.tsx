import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Globe: React.FC = () => {
   const mapContainerRef = useRef<HTMLDivElement>(null);
   const mapRef = useRef<mapboxgl.Map | null>(null);

   useEffect(() => {
      if (mapContainerRef.current) {
         mapboxgl.accessToken = "pk.eyJ1Ijoiam5vdmFrMDAyMSIsImEiOiJjbTZqanh1YzUwMW9rMnFwdDhnM2xsdW9tIn0.5T_he6q9jDjNzp1lZy4e6Q";
         mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/standard",
            center: [0, 0],
            zoom: 2,
            projection: "globe", // Ensures spherical view
            antialias: true, // Improves rendering quality
         });

         // Make background completely transparent
         mapRef.current.on("style.load", () => {
            mapRef.current?.setPaintProperty("background", "background-color", "rgba(0, 0, 0, 0)");
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

   return (
      <div
         id="map-container"
         ref={mapContainerRef}
         className="absolute top-0 left-0 w-full h-full"
         style={{
            background: "transparent",
            pointerEvents: "auto", // Ensure interactions work properly
         }}
      />
   );
};

export default Globe;
