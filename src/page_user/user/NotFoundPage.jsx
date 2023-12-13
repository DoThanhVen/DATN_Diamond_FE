import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <img
        src="/images/404.jpg"
        alt="404"
        style={{ width: "500px", marginBottom: "20px" }}
      />
      <span>Vui lòng kiểm tra lại đường dẫn ...... </span>
      <Link to="/">
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#ffc801",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Back to Home
        </button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
