import React from "react";
import { Spotlight } from "./ui/Spotlight";
import { BackgroundLines } from "./ui/Background-lines";

export function GridBackgroundDemo() {
  return (
    <div className="h-screen w-screen dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center overflow-hidden">
      {/* Radial gradient for the container to give a faded look */}
      <Spotlight />
      <div className="absolute pointer-events-none inset-0 items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] w-full"></div>
      <BackgroundLines />
      <p className=" absolute text-4xl sm:text-7xl font-bold  z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Get Your Repository Reviewed By AI
      </p>
    </div>
  );
}
