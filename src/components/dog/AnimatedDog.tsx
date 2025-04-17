import React from "react";
import "./AnimatedDog.css";

const AnimatedDog = () => {
  return (
    <div className="dog-container">
      <div className="dog">
        <div className="dog-body">
          <div className="tail-wrapper">
            <div className="dog-tail">
              <div className="dog-tail">
                <div className="dog-tail"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="dog-torso"></div>
        <div className="dog-head">
          <div className="dog-ears">
            <div className="dog-ear left"></div>
            <div className="dog-ear right"></div>
          </div>
          <div className="dog-eyes">
            <div className="dog-eye"></div>
            <div className="dog-eye"></div>
          </div>
          <div className="dog-muzzle">
            <div className="dog-nose"></div>
            <div className="dog-tongue"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedDog;
