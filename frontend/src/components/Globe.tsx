import React, { useRef, useEffect, useState } from "react";
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

type Coordinates = [number, number];

const Globe: React.FC<GlobeProps> = ({ earthquakes }) => {
   const mapContainerRef = useRef<HTMLDivElement>(null);
   const mapRef = useRef<mapboxgl.Map | null>(null);
   const isShiftPressedRef = useRef(false);
   const isDrawingRef = useRef(false);
   const startPointRef = useRef<Coordinates | null>(null);
   const [bounds, setBounds] = useState<mapboxgl.LngLatBounds | null>(null);

   const getDepthColor = (depth: number) => {
      const depthX = Math.min(Math.max(depth / 1000, 0), 1);
      const red = 255;
      const green = Math.floor(255 * (1 - depthX));
      const blue = 0;
      return `rgba(${red}, ${green}, ${blue}, 0.6)`;
   };

   useEffect(() => {
      if (mapContainerRef.current && !mapRef.current) {
         mapboxgl.accessToken = "pk.eyJ1Ijoiam5vdmFrMDAyMSIsImEiOiJjbTZqanh1YzUwMW9rMnFwdDhnM2xsdW9tIn0.5T_he6q9jDjNzp1lZy4e6Q";

         const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/satellite-streets-v12",
            center: [0, 0],
            zoom: 2,
            projection: "globe",
            antialias: true,
         });

         mapRef.current = map;

         map.on("style.load", () => {
            map.setPaintProperty("background", "background-color", "rgba(0, 0, 0, 0)");

            map.addSource("select-box", {
               type: "geojson",
               data: {
                  type: "FeatureCollection",
                  features: [],
               },
            });

            map.addLayer({
               id: "select-box-fill",
               type: "fill",
               source: "select-box",
               paint: {
                  "fill-color": "#0080ff",
                  "fill-opacity": 0.2,
               },
            });

            map.addLayer({
               id: "select-box-outline",
               type: "line",
               source: "select-box",
               paint: {
                  "line-color": "#0080ff",
                  "line-width": 2,
               },
            });
         });

         map.on("mousedown", (e) => {
            if (!isShiftPressedRef.current) return;
            isDrawingRef.current = true;
            startPointRef.current = [e.lngLat.lng, e.lngLat.lat];
            updateSelectionBox(map, null, null);
         });

         map.on("mousemove", (e) => {
            if (!isDrawingRef.current || !startPointRef.current || !isShiftPressedRef.current) return;
            const currentPoint: Coordinates = [e.lngLat.lng, e.lngLat.lat];
            updateSelectionBox(map, startPointRef.current, currentPoint);
         });

         map.on("mouseup", (e) => {
            if (isDrawingRef.current && startPointRef.current && isShiftPressedRef.current) {
               isDrawingRef.current = false;
               const endPoint: Coordinates = [e.lngLat.lng, e.lngLat.lat];

               const startLngLat = new mapboxgl.LngLat(startPointRef.current[0], startPointRef.current[1]);
               const endLngLat = new mapboxgl.LngLat(endPoint[0], endPoint[1]);

               const newBounds = new mapboxgl.LngLatBounds(startLngLat, endLngLat);
               setBounds(newBounds);

               console.log("Selected Area Bounds:", {
                  minLng: newBounds.getWest().toFixed(4),
                  maxLng: newBounds.getEast().toFixed(4),
                  minLat: newBounds.getSouth().toFixed(4),
                  maxLat: newBounds.getNorth().toFixed(4),
               });

               startPointRef.current = null;
            }
         });

         const nav = new mapboxgl.NavigationControl();
         map.addControl(nav);

         const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Shift") {
               isShiftPressedRef.current = true;
               if (map) {
                  map.getCanvas().style.cursor = "crosshair";
               }
            }
         };

         const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Shift") {
               isShiftPressedRef.current = false;
               if (map) {
                  map.getCanvas().style.cursor = "";
                  if (!isDrawingRef.current) {
                     updateSelectionBox(map, null, null);
                  }
               }
            }
         };

         window.addEventListener("keydown", handleKeyDown);
         window.addEventListener("keyup", handleKeyUp);

         return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            map.remove();
            mapRef.current = null;
         };
      }
   }, []);

   const updateSelectionBox = (map: mapboxgl.Map, start: Coordinates | null, end: Coordinates | null) => {
      if (!start || !end) {
         const source = map.getSource("select-box") as mapboxgl.GeoJSONSource;
         if (source) {
            source.setData({
               type: "FeatureCollection",
               features: [],
            });
         }
         return;
      }

      const coordinates: Coordinates[] = [start, [start[0], end[1]], end, [end[0], start[1]], start];

      const source = map.getSource("select-box") as mapboxgl.GeoJSONSource;
      if (source) {
         source.setData({
            type: "FeatureCollection",
            features: [
               {
                  type: "Feature",
                  properties: {},
                  geometry: {
                     type: "Polygon",
                     coordinates: [coordinates],
                  },
               },
            ],
         });
      }
   };

   useEffect(() => {
      if (mapRef.current && earthquakes.length > 0) {
         const markers = document.getElementsByClassName("marker");
         while (markers[0]) {
            markers[0].remove();
         }
         console.log("Earthquakes in globe.tsx:");
         console.log(earthquakes);
         // Add new markers
         earthquakes.forEach((earthquake) => {
            const { latitude, longitude, depth, mag, place } = earthquake;

            if (bounds) {
               if (!bounds.contains([longitude, latitude])) {
                  return;
               }
            }

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
   }, [earthquakes, bounds]);

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
