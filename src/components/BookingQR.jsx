
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./BookingQR.css";

function BookingQR({ booking }) {
  const [showQR, setShowQR] = useState(false);

  const qrData = JSON.stringify({
    bookingId: booking.id,
    hotelId: booking.hotelId,
    hotelName: booking.hotelName || "StayNest Hotel",
    customerName: booking.name,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: booking.guests,
    status: booking.status || "confirmed"
  });

  if (booking.status === "cancelled") {
    return null;
  }

  return (
    <div className="booking-qr-container">
      <button
        className="qr-generate-btn"
        onClick={() => setShowQR(!showQR)}
      >
        {showQR ? "Hide QR Code" : "Generate Check-in QR"}
      </button>

      {showQR && (
        <div className="booking-qr-card">
          <h3>StayNest Digital Check-in</h3>
          <p>Show this QR code at hotel reception</p>

          <div className="qr-code">
            <QRCodeSVG
              value={qrData}
              size={190}
              level="H"
              includeMargin={true}
            />
          </div>

          <p className="qr-booking-id">
            Booking ID: {booking.id}
          </p>

          <p className="qr-customer-name">
            Guest: {booking.name}
          </p>

          <p className="qr-note">
            Keep this QR code ready during check-in.
          </p>
        </div>
      )}
    </div>
  );
}

export default BookingQR;
