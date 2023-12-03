import React from 'react';
import "../css/user/modal.css"

export default function ProductSmall() {
  return (
    <div>
      <div className="notification-toast" data-toast>
        {/* <button className="toast-close-btn" data-toast-close>
      <i className="fa-solid fa-xmark"></i>
      </button> */}

        <div className="toast-banner">
          <img
            src="images/best-saler-4.jpg"
            alt="Diamond"
            style={{ width: "100%" }}
          />
        </div>

        <div className="toast-detail">
          <p className="toast-message">Someone in new just bought</p>

          <p className="toast-title">Rose Gold Earrings</p>

          <p className="toast-meta">
            <time dateTime="PT2M">2 Minutes</time> ago
          </p>
        </div>
      </div>
    </div>
  )
}
