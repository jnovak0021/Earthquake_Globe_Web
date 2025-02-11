import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Earthquake {
   id: string;
   time: string;
   place: string;
   latitude: number;
   longitude: number;
   depth: number;
   mag: number;
   status: string;
}
interface GlobeProps {
   earthquakes: Earthquake[];
}

const Globe: React.FC<GlobeProps> = ({ earthquakes }) => {
   const mapContainerRef = useRef<HTMLDivElement>(null);
   const mapRef = useRef<mapboxgl.Map | null>(null);

   // Function to get color based on depth
   const getDepthColor = (depth: number) => {
      const depthX = Math.min(Math.max(depth / 1000, 0), 1);
      const red = 255;
      const green = Math.floor(255 * (1 - depthX));
      const blue = 0;
      return `rgba(${red}, ${green}, ${blue}, 0.6)`;
   };

   useEffect(() => {
      if (mapContainerRef.current) {
         mapboxgl.accessToken = "pk.eyJ1Ijoiam5vdmFrMDAyMSIsImEiOiJjbTZqanh1YzUwMW9rMnFwdDhnM2xsdW9tIn0.5T_he6q9jDjNzp1lZy4e6Q";
         mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/satellite-streets-v12",
            center: [0, 0],
            zoom: 2,
            projection: "globe",
            antialias: true,
         });

         // Make background transparent
         mapRef.current.on("style.load", () => {
            mapRef.current?.setPaintProperty("background", "background-color", "rgba(0, 0, 0, 0)");
         });

         // Add navigation controls
         mapRef.current.addControl(new mapboxgl.NavigationControl());

         return () => {
            mapRef.current?.remove();
         };
      }
   }, []);

   // Update markers when earthquakes data changes
   useEffect(() => {
      if (mapRef.current && earthquakes.length > 0) {
         // Remove existing markers
         const markers = document.getElementsByClassName("marker");
         while (markers[0]) {
            markers[0].remove();
         }
         console.log("Earthquakes in globe.tsx:");
         console.log(earthquakes);
         // Add new markers
         earthquakes.forEach((earthquake) => {
            const { latitude, longitude, depth, mag, place } = earthquake;

            const el = document.createElement("div");
            const size = Math.min(50, Math.log10(mag) * 25);
            el.className = "marker";
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.backgroundColor = getDepthColor(depth);
            el.style.borderRadius = "50%";
            el.style.border = "2px solid white";

            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
               `<div style="background: rgba(50, 50, 50, 0.7); padding: 8px; border-radius: 5px;">
                  <strong style="color: white;">${place}</strong><br>
                  <span style="color: white;">Magnitude: ${mag}</span><br>
                  <span style="color: white;">Depth: ${depth.toFixed(2)} km</span>
                </div>`
            );

            if (mapRef.current) {
               new mapboxgl.Marker(el).setLngLat([longitude, latitude]).setPopup(popup).addTo(mapRef.current);
            }
         });
      }
   }, [earthquakes]);

   return (
      <div
         id="map-container"
         ref={mapContainerRef}
         className="absolute top-0 left-0 w-full h-full"
         style={{
            background: "transparent",
            pointerEvents: "auto",
         }}
      />
   );
};

export default Globe;
