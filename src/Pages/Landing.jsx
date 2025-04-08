import React from "react";
import { useTranslation } from "../TranslationContext";
import { useNavigate } from "react-router-dom";

function Landing() {
  const { translations } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col min-h-screen lg:hidden">
      <div className="background absolute top-0 left-0 w-full h-full sm:h-1/2">
        <img
          className="w-full h-full object-cover"
          src="assets/9008 mockup.jpg"
          alt=""
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/20 to-black/40"></div>
      </div>
      <div className="content relative z-10 text-center !mt-auto !px-6 !py-12">
        <h1 className="text-2xl text-black/80 !mb-6">
          LAMSA is not just a brand it's an addiction
        </h1>
        <p className="text-sm text-black/70 !mb-30">{translations.intro}</p>
        <button
          onClick={() => {
            console.log("Navigating to /signup");
            navigate("/signup");
          }}
          className="!bg-gray-950 text-white text-md !py-4 w-full rounded-2xl"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Landing;
