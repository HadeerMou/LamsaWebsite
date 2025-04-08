import React from "react";
import "./approach.css";
import { useTranslation } from "../TranslationContext";

function Featured() {
  const { translations } = useTranslation();
  return (
    <>
      <div className="featured !mt-20 !mb-20 !p-5 sm:p-10">
        <h2 className="!text-5xl sm:text-3xl font-bold text-center !mb-7">
          Featured
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="card p-4 bg-white rounded-lg shadow-md">
              <div className="img bg-gray-100 !p-18 sm:p-16 flex justify-center items-center rounded-md">
                <img
                  className="rounded-md shadow-[rgba(0,0,0,0.488)_-4px_4px_15px] max-w-[250px]"
                  src="\assets\Untitled-10-03.jpg"
                  alt="Product"
                />
              </div>

              <div className="desc !py-2 text-center">
                <h5 className="text-lg font-bold">Product Name</h5>
                <p className="text-sm text-gray-600">
                  Short product description
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="inspire items-center !p-15 !mb-8 sm:flex !gap-30">
        <div className="img !p-10 rounded-md bg-black/8">
          {" "}
          <img
            className="max-w-[500px] rounded-md"
            src="assets\9008 mockup.jpg"
            alt=""
          />
        </div>
        <div className="text !py-10">
          <h2 className="!text-5xl !sm:text-2xl !lg:text-5xl !max-w-[400px] !mb-10">
            {translations.ourpassion}{" "}
            <span className="text-red-300/80">{translations.inspairation}</span>
          </h2>
          <p className="max-w-120 !mb-6">{translations.passioncont}</p>
          <button>{translations.shopnow}</button>
        </div>
      </div>
    </>
  );
}

export default Featured;
