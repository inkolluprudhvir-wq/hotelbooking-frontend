
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function AddHotel() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    price: "",
    rating: "",
    image: "",
    description: "",
    rooms: "",
    amenities: "",
    checkIn: "",
    checkOut: ""
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await api.post("/hotels", {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating),
      rooms: Number(formData.rooms),
      amenities: formData.amenities
        .split(",")
        .map(item => item.trim())
    });

    navigate("/hotels");
  }

  return (
    <div className="form-container">

      <h2>Add New Hotel</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Hotel Name"
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category (Luxury / Budget / Resort)"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price Per Night"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="rating"
          placeholder="Rating"
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="Hotel Image URL"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Hotel Description"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="rooms"
          placeholder="Available Rooms"
          onChange={handleChange}
        />

        <input
          name="amenities"
          placeholder="Amenities (WiFi, Pool, Restaurant)"
          onChange={handleChange}
        />

        <input
          name="checkIn"
          placeholder="Check In Time"
          onChange={handleChange}
        />

        <input
          name="checkOut"
          placeholder="Check Out Time"
          onChange={handleChange}
        />

        <button className="submit-btn">
          Add Hotel
        </button>

      </form>
    </div>
  );
}

export default AddHotel;
