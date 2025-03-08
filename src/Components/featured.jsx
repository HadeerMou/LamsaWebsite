import React from "react";
import "./approach.css";

function Featured() {
  return (
    <>
      <div className="featured">
        <h2>Feature Artworks</h2>
        <div className="grid grid-cols-4 sm:flex justify-around">
          <div className="card">
            <div className="img">
              <img
                className="w-96 max-w-3xs"
                src="assets\Untitled-1-20.jpg"
                alt=""
              />
            </div>
            <div className="desc">
              <h5>Oil painting</h5>
              <p>$25.00</p>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                className="w-96 max-w-3xs"
                src="assets\Untitled-1-20.jpg"
                alt=""
              />
            </div>
            <div className="desc">
              <h5>Oil painting</h5>
              <p>$25.00</p>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                className="w-96 max-w-3xs"
                src="assets\Untitled-1-20.jpg"
                alt=""
              />
            </div>
            <div className="desc">
              <h5>Oil painting</h5>
              <p>$25.00</p>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                className="w-96 max-w-3xs"
                src="assets\Untitled-1-20.jpg"
                alt=""
              />
            </div>
            <div className="desc">
              <h5>Oil painting</h5>
              <p>$25.00</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 sm:flex justify-around">
          <div className="card">
            <div className="img">
              <img
                className="w-96 max-w-3xs"
                src="assets\Untitled-1-20.jpg"
                alt=""
              />
            </div>
            <div className="desc">
              <h5>Oil painting</h5>
              <p>$25.00</p>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                className="w-96 max-w-3xs"
                src="assets\Untitled-1-20.jpg"
                alt=""
              />
            </div>
            <div className="desc">
              <h5>Oil painting</h5>
              <p>$25.00</p>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                className="w-96 max-w-3xs"
                src="assets\Untitled-1-20.jpg"
                alt=""
              />
            </div>
            <div className="desc">
              <h5>Oil painting</h5>
              <p>$25.00</p>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                className="w-96 max-w-3xs"
                src="assets\Untitled-1-20.jpg"
                alt=""
              />
            </div>
            <div className="desc">
              <h5>Oil painting</h5>
              <p>$25.00</p>
            </div>
          </div>
        </div>
      </div>
      <div className="inspire sm:flex gap-30">
        <div className="img">
          {" "}
          <img src="assets\9008 mockup.jpg" alt="" />
        </div>
        <div className="text">
          <h2>
            Our Passion is Your{" "}
            <span className="text-red-300/80">Inspiriation</span>
          </h2>
          <p className="max-w-120">
            With each livary wall we send you our passion for beautiful things
            for your home. The content of each wall is agreed with the Creators.
          </p>
          <button>Shop Now</button>
        </div>
      </div>
    </>
  );
}

export default Featured;
