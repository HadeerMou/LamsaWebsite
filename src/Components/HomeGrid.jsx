import "./HomeGrid.css";
import React from "react";
import { useTranslation } from "../TranslationContext";

export default function HomeGrid() {
  const { translations } = useTranslation();
  return (
    <div class="headcontainer">
      <div className="images">
        <img src="/Group 6.jpg" alt="" />
        <div className="intro">
          <h1>LAMSA</h1>
          <p>
            Your ultimate destination for exquisite paintings, featuring
            timeless classics and modern masterpieces for every art enthusiast.
          </p>
        </div>
      </div>
    </div>
  );
}
