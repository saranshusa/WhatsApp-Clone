import styled from "styled-components";
import LoadingSVG from "../public/loading.svg";
import Image from "next/image";

function Loading() {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
        backgroundColor: "#090e11",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: "100px",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "5px",
          flexDirection: "column",
        }}
      >
        <img
          style={{ height: "200px", width: "200px", marginBottom: "50px" }}
          src="https://www.logo.wine/a/logo/WhatsApp/WhatsApp-Logo.wine.svg"
        />
        <Image src={LoadingSVG} layout='fixed' />
      </div>
    </div>
  );
}

export default Loading;
