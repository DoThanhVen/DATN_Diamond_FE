import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

export default function ProductIntroduction() {
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Open the modal automatically after 500 milliseconds (0.5 seconds) when the web page is loaded
    const openModalTimer = setTimeout(() => {
      setShowModal(true);
    }, 500); // Modal will open after 0.5 seconds

    // Update the countdown every second
    const endDate = new Date("2023-12-25 23:59:59");

    const calculateTime = () => {
      const currentDate = new Date();
      const timeRemaining = endDate - currentDate;

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
      });
    };

    const countdownTimer = setInterval(calculateTime, 1000);

    return () => {
      clearTimeout(openModalTimer); // Clear the open modal timer if the component unmounts
      clearInterval(countdownTimer); // Clean up the countdown timer on unmount
    };

    calculateTime(); // Initial calculation
  }, []);

  const handleClose = () => {
    // Close the modal when the user clicks the Close button or clicks outside the modal
    setShowModal(false);
  };
  return (
    <div className="Introduction">
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="newsletter">
            <form action="#">
              <img
                src="/images/sale_christmas.gif"
                style={{ width: "260px" }}
                alt=""
              ></img>
              <div className="newsletter-header">
                {" "}
                <div className="countdown-box mt-2">
                  <p className="countdown-desc">
                    Nhanh lên! Ưu đãi kết thúc sau:
                  </p>

                  <div className="countdown">
                    <div className="countdown-content">
                      <p className="display-number">{countdown.days} Days</p>
                    </div>

                    <div className="countdown-content">
                      <p className="display-number">{countdown.hours} Hours</p>
                    </div>

                    <div className="countdown-content">
                      <p className="display-number">{countdown.minutes} Min</p>
                    </div>

                    <div className="countdown-content">
                      <p className="display-number">{countdown.seconds} Sec</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}
