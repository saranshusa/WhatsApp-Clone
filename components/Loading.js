import styled from "styled-components";

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
        <img src="https://download1638.mediafire.com/h9g10u3i71wg/jals99b1xg2d5ww/294.svg" />
      </div>
    </div>
  );
}

export default Loading;
