import React from "react";
import "./approach.css";

function Approach() {
  return (
    <div className="flex flex-wrap approachContainer !p-7 justify-around items-center gap-6">
      <div className="left">
        <h1 className="!mb-[5rem] !text-[3rem]">Our Approach</h1>
        <div className="three flex flex-wrap !sm:flex-col gap-6">
          <div className="part bg-black/1 !p-[50px] !sm:p-8 rounded-[5px] flex-col  !border-l !border-[rgba(0, 0, 0, 0.44)]">
            <i class="fa-solid fa-truck-fast"></i>
            <h5 className="font-bold text-lg !mb-2">FAST SHIPPING</h5>
            <p className="max-w-50">
              We take care of shipping our products safe and fast
            </p>
          </div>
          <div className="part bg-black/1 !p-[50px] flex-col !border-l !border-[rgba(0, 0, 0, 0.44)] rounded-[5px]">
            <i class="fa-solid fa-truck-fast"></i>
            <h5 className="font-bold text-lg !mb-2">HIGH QUALITY</h5>
            <p className="max-w-50">our products is of high quality</p>
          </div>
          <div className="part bg-black/1 !p-[50px] flex-col !border-l !border-[rgba(0, 0, 0, 0.44)] rounded-[5px]">
            <i class="fa-regular fa-face-grin-stars"></i>
            <h5 className="font-bold text-lg !mb-2">SUPPORT 24/7</h5>
            <p className="max-w-50">
              our support is available for 24/7 to help you
            </p>
          </div>
        </div>
      </div>
      <div className="right flex justify-center w-full !sm:w-3/4 md:w-1/2 lg:w-1/3">
        <div className="w-full sm:w-[350px] md:w-[400px] h-auto rounded-md shadow-xl">
          <img
            className="w-[400px] h-[430px] rounded-[5px] shadow-[ -4px_4px_15px_rgba(0,0,0,0.488)]"
            src="assets\Untitled-1-20.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default Approach;
