import React from "react";
import Nav from "./Nav";

const Error404 = () => {
  return (
    <>
      <Nav />
      <h1 style={{ position: "absolute", top: "20%", left: "20%" }}>
        Page Not Found!
      </h1>
    </>
  );
};

export default Error404;
