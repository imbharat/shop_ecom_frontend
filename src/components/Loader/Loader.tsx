import React, { useState, useEffect } from "react";

function Loader({ show }: { show: boolean }) {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const timer = setInterval(() => {
      const dotStr = dots.length < 3 ? `${dots}.` : ``;
      setDots(dotStr);
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, [dots]);
  return (
    <div>
      <div
        style={{
          position: "absolute",
          zIndex: 99,
          margin: "auto",
          left: "50%",
          top: "60%",
          transform: "translate(-50%, -50%)",
          fontWeight: "bolder",
          fontSize: "1.5rem",
          color: "var(--primary-color)",
          fontFamily: "system-ui",
          fontStyle: "italic",
        }}
      >
        Please Wait
        <span
          style={{
            position: "absolute",
            zIndex: 99,
            color: "var(--primary-color)",
            fontFamily: "system-ui",
            fontStyle: "italic",
          }}
        >
          {dots}
        </span>
      </div>
    </div>
  );
}

export default Loader;
