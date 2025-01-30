import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const Globe: React.FC = () => {
   const globeRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (!globeRef.current) return;

      const width = globeRef.current.clientWidth;
      const height = globeRef.current.clientHeight;

      // Scene, camera, and renderer setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      globeRef.current.appendChild(renderer.domElement);

      // Sphere (globe) setup
      const geometry = new THREE.SphereGeometry(5, 32, 32);
      const material = new THREE.MeshBasicMaterial({
         color: 0x0077be,
         wireframe: true,
      });
      const globe = new THREE.Mesh(geometry, material);
      scene.add(globe);

      // Camera positioning
      camera.position.z = 15;

      // Animation loop

      const animate = () => {
         requestAnimationFrame(animate);
         //globe.rotation.y += 0.01; // Rotate globe
         renderer.render(scene, camera);
      };

      animate();

      // Handle resizing
      const handleResize = () => {
         const newWidth = globeRef.current?.clientWidth || width;
         const newHeight = globeRef.current?.clientHeight || height;
         camera.aspect = newWidth / newHeight;
         camera.updateProjectionMatrix();
         renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener("resize", handleResize);

      // Clean up
      return () => {
         window.removeEventListener("resize", handleResize);
         renderer.dispose();
         geometry.dispose();
         material.dispose();
         scene.remove(globe);
         globeRef.current?.removeChild(renderer.domElement);
      };
   }, []);

   return (
      <div
         ref={globeRef}
         className="w-full h-full overflow-auto"
         style={{ height: "500px", border: "1px solid #ccc" }} // Optional styles for scrollable behavior
      />
   );
};

export default Globe;
