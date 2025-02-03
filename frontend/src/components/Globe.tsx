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

         return () => {
            mapRef.current?.remove();
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
