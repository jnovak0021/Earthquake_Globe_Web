import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Globe: React.FC = () => {
   const mapContainerRef = useRef<HTMLDivElement>(null);
   const mapRef = useRef<mapboxgl.Map | null>(null);

   useEffect(() => {
      if (mapContainerRef.current) {
         mapboxgl.accessToken = "pk.eyJ1Ijoiam5vdmFrMDAyMSIsImEiOiJjbTZqanh1YzUwMW9rMnFwdDhnM2xsdW9tIn0.5T_he6q9jDjNzp1lZy4e6Q"; // Replace with your Mapbox access token
         mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/standard",
            //style: 'mapbox://styles/mapbox/standard-satellite', // Replace with your desired map style
            center: [-122.420679, 37.772537], // Initial map center [lng, lat]
            zoom: 13, // Initial map zoom level
         });

         return () => {
            if (mapRef.current) {
               mapRef.current.remove();
            }
         };
      }
   }, []);

   return <div id="map-container" ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default Globe;
