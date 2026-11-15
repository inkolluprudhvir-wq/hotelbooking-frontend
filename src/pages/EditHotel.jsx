
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditHotel() {
  const { id } = useParams();
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

  useEffect(() => {
    async function getHotel() {
      try {
        const response = await api.get(`/hotels/${id}`);

        setFormData({
          ...response.data,
          amenities: Array.isArray(response.data.amenities)
            ? response.data.amenities.join(", ")
            : ""
        });
      } catch (error) {
        console.log(error);
      }
    }

    getHotel();
  }, [id]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.put(`/hotels/${id}`, {
        ...formData,
        price: Number(formData.price),
        rating: Number(formData.rating),
        rooms: Number(formData.rooms),
        amenities: formData.amenities
          .split(",")
          .map(item => item.trim())
          .filter(Boolean)
      });

      alert("Hotel Updated Successfully!");
      navigate("/hotels");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="form-container">
      <h2>Edit Hotel</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Hotel Name"
          value={formData.name} onChange={handleChange} required />

        <input name="location" placeholder="Location"
          value={formData.location} onChange={handleChange} required />

        <input name="category" placeholder="Category"
          value={formData.category} onChange={handleChange} required />

        <input type="number" name="price" placeholder="Price Per Night"
          value={formData.price} onChange={handleChange} required />

        <input type="number" name="rating" placeholder="Rating"
          value={formData.rating} onChange={handleChange} />

        <input name="image" placeholder="Image URL"
          value={formData.image} onChange={handleChange} required />

        <textarea name="description" placeholder="Description"
          value={formData.description} onChange={handleChange} />

        <input type="number" name="rooms" placeholder="Available Rooms"
          value={formData.rooms} onChange={handleChange} />

        <input name="amenities" placeholder="WiFi, Pool, Restaurant"
          value={formData.amenities} onChange={handleChange} />

        <input name="checkIn" placeholder="Check In"
          value={formData.checkIn} onChange={handleChange} />

        <input name="checkOut" placeholder="Check Out"
          value={formData.checkOut} onChange={handleChange} />

        <button type="submit" className="submit-btn">
          Update Hotel
        </button>
      </form>
    </div>
  );
}

export default EditHotel;
