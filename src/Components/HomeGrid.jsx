import "./HomeGrid.css";
import React from "react";
import { useTranslation } from "../TranslationContext";

export default function HomeGrid() {
  const { translations } = useTranslation();
  return (
    <div class="headcontainer !pb-20  bg-red ">
      <div className="relative flex items-center justify-center">
        <div className="img w-full">
          <img
            className="w-full h-auto object-cover"
            src="/Group 6.jpg"
            alt=""
          />
        </div>
        <div className="intro absolute top-1/4 sm:top-1/3 text-center w-full px-4">
          <h1 className="text-3xl !sm:text-4xl !md:text-5xl !lg:text-6xl font-bold text-black/80 !mb-3">
            LAMSA
          </h1>
          <p className="text-sm sm:text-base md:text-lg max-w-[600px] mx-auto ">
            Your ultimate destination for exquisite paintings, featuring
            timeless classics and modern masterpieces for every art enthusiast.
          </p>
        </div>
      </div>
    </div>
  );
}
