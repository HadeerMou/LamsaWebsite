import React from "react";
import "./approach.css";

function Approach() {
  return (
    <div className="approachContainer">
      <div className="left">
        <h1>Our Approach</h1>
        <div className="three flex">
          <div className="part flex-col">
            <i class="fa-solid fa-truck-fast"></i>
            <h5>FAST SHIPPING</h5>
            <p className="max-w-50">
              We take care of shipping our products safe and fast
            </p>
          </div>
          <div className="part flex-col">
            <i class="fa-solid fa-truck-fast"></i>
            <h5>HIGH QUALITY</h5>
            <p className="max-w-50">our products is of high quality</p>
          </div>
          <div className="part flex-col">
            <i class="fa-regular fa-face-grin-stars"></i>
            <h5>SUPPORT 24/7</h5>
            <p className="max-w-50">
              our support is available for 24/7 to help you
            </p>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="img">
          <img src="assets\Untitled-1-20.jpg" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Approach;
