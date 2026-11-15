
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import api from "../services/api";

function BookingInvoice({ booking }) {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getHotel() {
      try {
        const response = await api.get(`/hotels/${booking.hotelId}`);
        setHotel(response.data);
      } catch (error) {
        console.log("Hotel details not found:", error);
      }
    }

    getHotel();
  }, [booking.hotelId]);

  function downloadInvoice() {
    if (!hotel) {
      alert("Hotel details are still loading. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const doc = new jsPDF();

      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);

      const nights = Math.max(
        1,
        Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      );

      const rooms = Number(booking.rooms || 1);
      const price = Number(hotel.price || 0);
      const total = nights * rooms * price;

      const invoiceNumber = `SN-${booking.id}`;

      // Header
      doc.setFillColor(21, 25, 22);
      doc.rect(0, 0, 210, 42, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("STAYNEST", 20, 20);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Your Journey, Our Comfort", 20, 29);

      doc.setFontSize(18);
      doc.text("BOOKING INVOICE", 135, 23);

      // Invoice details
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(11);

      doc.setFont("helvetica", "bold");
      doc.text("Invoice Information", 20, 58);

      doc.setFont("helvetica", "normal");
      doc.text(`Invoice Number: ${invoiceNumber}`, 20, 68);
      doc.text(`Booking ID: ${booking.id}`, 20, 76);
      doc.text(`Invoice Date: ${new Date().toLocaleDateString("en-IN")}`, 20, 84);

      // Customer details
      doc.setFont("helvetica", "bold");
      doc.text("Customer Details", 20, 103);

      doc.setFont("helvetica", "normal");
      doc.text(`Customer Name: ${booking.name || "Guest"}`, 20, 113);
      doc.text(`Number of Guests: ${booking.guests || 1}`, 20, 121);

      // Hotel details
      doc.setFont("helvetica", "bold");
      doc.text("Hotel Details", 20, 142);

      doc.setFont("helvetica", "normal");
      doc.text(`Hotel: ${hotel.name || "Hotel"}`, 20, 152);
      doc.text(`Location: ${hotel.location || "N/A"}`, 20, 160);
      doc.text(`Check-in: ${booking.checkIn}`, 20, 168);
      doc.text(`Check-out: ${booking.checkOut}`, 20, 176);
      doc.text(`Rooms: ${rooms}`, 20, 184);
      doc.text(`Duration: ${nights} night(s)`, 20, 192);

      // Price details
      doc.setFillColor(235, 242, 236);
      doc.roundedRect(20, 207, 170, 39, 3, 3, "F");

      doc.setTextColor(36, 91, 69);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("PRICE SUMMARY", 28, 219);

      doc.setTextColor(40, 40, 40);
      doc.setFontSize(10);
      doc.text(`Price per room / night: Rs. ${price}`, 28, 229);

      doc.setFontSize(14);
      doc.setTextColor(36, 91, 69);
      doc.text(`Estimated Total: Rs. ${total.toLocaleString("en-IN")}`, 28, 240);

      // Booking status
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Booking Status: ${(booking.status || "Confirmed").toUpperCase()}`, 20, 263);

      if (booking.refundStatus) {
        doc.setFont("helvetica", "normal");
        doc.text(`Refund Status: ${booking.refundStatus}`, 20, 273);
      }

      // Footer
      doc.setDrawColor(36, 91, 69);
      doc.line(20, 282, 190, 282);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for choosing StayNest!", 105, 290, {
        align: "center"
      });

      doc.save(`StayNest-Invoice-${booking.id}.pdf`);

    } catch (error) {
      console.log("Invoice generation error:", error);
      alert("Unable to generate invoice.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={downloadInvoice}
      disabled={loading || !hotel}
      className="invoice-download-btn"
    >
      {loading
        ? "Generating..."
        : !hotel
        ? "Loading Hotel..."
        : "📄 Download Invoice"}
    </button>
  );
}

export default BookingInvoice;
