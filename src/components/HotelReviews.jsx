
import { useEffect, useState } from "react";
import api from "../services/api";
import "./HotelReviews.css";

function HotelReviews({ hotelId }) {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);

        const response = await api.get(
          `/reviews?hotelId=${hotelId}`
        );

        setReviews(response.data);
      } catch (error) {
        console.error("Reviews loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [hotelId]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) => total + Number(review.rating),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !comment.trim()) {
      alert("Please enter your name and review.");
      return;
    }

    try {
      setSubmitting(true);

      const newReview = {
        hotelId: String(hotelId),
        userName: name.trim(),
        rating: Number(rating),
        comment: comment.trim(),
        createdAt: new Date().toISOString()
      };

      const response = await api.post("/reviews", newReview);

      setReviews((previous) => [
        response.data,
        ...previous
      ]);

      setName("");
      setRating(5);
      setComment("");

      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Review submit error:", error);
      alert("Unable to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="hotel-reviews">

      <div className="reviews-heading">
        <h2>Reviews & Ratings</h2>
        <p>Customer experiences and feedback</p>
      </div>

      <div className="reviews-summary">
        <h1>{averageRating} ⭐</h1>
        <p>
          Based on {reviews.length} customer reviews
        </p>
      </div>

      {/* REVIEW FORM */}
      <form
        className="review-form"
        onSubmit={handleSubmit}
      >
        <h3>Write a Review</h3>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Your Rating</label>

        <div className="review-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={
                star <= rating ? "star active" : "star"
              }
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          maxLength="500"
        />

        <button
          type="submit"
          className="submit-review-btn"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {/* CUSTOMER REVIEWS */}
      <div className="reviews-list">
        <h3>Customer Reviews</h3>

        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-user">
                <div className="review-avatar">
                  {(review.userName || review.name || "G")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h4>
                    {review.userName || review.name || "Guest"}
                  </h4>

                  <span>
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : "Customer"}
                  </span>
                </div>
              </div>

              <div className="review-rating">
                {"★".repeat(
                  Math.max(0, Math.min(5, Number(review.rating)))
                )}
              </div>

              <p>{review.comment}</p>
            </div>
          ))
        )}
      </div>

    </section>
  );
}

export default HotelReviews;
