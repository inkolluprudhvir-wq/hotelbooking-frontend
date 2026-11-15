
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../services/api";
import "./CheckIn.css";

function CheckIn() {
  const [message, setMessage] = useState(
    "Scan the guest's booking QR code."
  );
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState("");
  const scannerRef = useRef(null);
  const processingRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true
      },
      false
    );

    scannerRef.current = scanner;

    async function handleScan(decodedText) {
      if (processingRef.current) return;

      processingRef.current = true;

      try {
        const qrData = JSON.parse(decodedText);

        if (!qrData.bookingId || !qrData.hotelId) {
          throw new Error("Invalid booking QR code.");
        }

        const response = await api.get(
          `/bookings/${qrData.bookingId}`
        );

        const foundBooking = response.data;

        if (
          String(foundBooking.hotelId) !==
          String(qrData.hotelId)
        ) {
          throw new Error("Hotel details do not match.");
        }

        if (foundBooking.status === "cancelled") {
          setBooking(foundBooking);
          setStatus("error");
          setMessage("This booking has been cancelled.");
          return;
        }

        if (foundBooking.checkInStatus === "checked-in") {
          setBooking(foundBooking);
          setStatus("warning");
          setMessage("Guest has already checked in.");
          return;
        }

        const updatedBooking = {
          ...foundBooking,
          checkInStatus: "checked-in",
          actualCheckInAt: new Date().toISOString()
        };

        await api.patch(
          `/bookings/${foundBooking.id}`,
          updatedBooking
        );

        setBooking(updatedBooking);
        setStatus("success");
        setMessage("Booking verified. Check-in successful!");
      } catch (error) {
        console.error("QR verification error:", error);
        setBooking(null);
        setStatus("error");
        setMessage(
          error.response?.status === 404
            ? "Booking not found."
            : error.message || "Invalid QR code."
        );
      } finally {
        processingRef.current = false;
      }
    }

    scanner.render(
      (decodedText) => handleScan(decodedText),
      () => {}
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="checkin-page">
      <div className="checkin-header">
        <h1>StayNest Check-in</h1>
        <p>Scan and verify guest booking QR codes</p>
      </div>

      <div className="checkin-card">
        <h2>Scan Booking QR</h2>

        <div id="qr-reader"></div>

        <div className={`checkin-message ${status}`}>
          {message}
        </div>

        {booking && (
          <div className="verified-booking">
            <h3>Booking Details</h3>

            <p>
              <strong>Booking ID:</strong> {booking.id}
            </p>

            <p>
              <strong>Guest:</strong> {booking.name}
            </p>

            <p>
              <strong>Hotel:</strong>{" "}
              {booking.hotelName || booking.hotelId}
            </p>

            <p>
              <strong>Check-in Date:</strong> {booking.checkIn}
            </p>

            <p>
              <strong>Check-out Date:</strong> {booking.checkOut}
            </p>

            <p>
              <strong>Guests:</strong> {booking.guests}
            </p>

            <p>
              <strong>Check-in Status:</strong>{" "}
              {booking.checkInStatus || "Not checked in"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckIn;
