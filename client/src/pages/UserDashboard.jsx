import React, { useEffect, useState } from "react";
import { Link } from "../router/Router.jsx";
import {
  ArrowRight,
  MapPin,
  PackageCheck,
  Star,
  UserRound,
  XCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useRouter } from "../router/Router.jsx";
import { api, money } from "../lib/api.js";
import "./UserDashboard.css";

function OrderReviewForm({ productId, productName }) {
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitReview(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setBusy(true);

    try {
      await api(`/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          rating: Number(rating),
          comment: comment.trim(),
        }),
      });

      setMessage(`Your review for ${productName} has been saved.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="order-review-form" onSubmit={submitReview}>
       <Link to="/" className="dashboard-home-link">
            ← Home page
          </Link>
      <div className="order-review-title">
        <Star size={16} />
        <b>Review {productName}</b>
      </div>

      <label>
        Your rating
        <select
          value={rating}
          onChange={(event) => setRating(event.target.value)}
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} star{value > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </label>

      <label>
        Your review
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          required
          minLength={5}
          maxLength={1000}
          placeholder="Share your experience with this product"
        />
      </label>

      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}

      <button className="button dark" type="submit" disabled={busy}>
        {busy ? "Saving review…" : "Submit / update review"}
      </button>
    </form>
  );
}

export default function UserDashboard() {
  const { user, updateName, signOut } = useAuth();
  const { navigate } = useRouter();

  const [orders, setOrders] = useState([]);
  const [name, setName] = useState(user?.name || "");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadOrders() {
    const data = await api("/orders/mine");
    setOrders(data.orders || []);
  }

  useEffect(() => {
    loadOrders().catch((err) => setError(err.message));
  }, []);

  async function save(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);

    try {
      await updateName(name);
      setMessage("Your profile has been updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function cancelOrder(order) {
    const orderNumber = order._id.slice(-7).toUpperCase();

    if (!window.confirm(`Cancel order #${orderNumber}?`)) return;

    setError("");
    setMessage("");
    setBusy(true);

    try {
      const result = await api(`/orders/${order._id}/cancel`, {
        method: "PATCH",
      });
      setMessage(result.message);
      await loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    signOut();
    navigate("/");
  }

  function formatDate(date) {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <main className="dashboard-page user-dashboard-page">
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">YOUR SHOP EASE</div>
          <h1>
            Hello, <em>{user?.name?.split(" ")[0]}.</em>
          </h1>
          <p>Your account, order details, and delivery updates.</p>
        </div>

        <button className="button outline" onClick={logout}>
          Sign out
        </button>
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="form-success" role="status">
          {message}
        </div>
      )}

      <div className="dashboard-stats">
        <div>
          <PackageCheck />
          <b>{orders.length}</b>
          <small>Orders placed</small>
        </div>
        <div>
          <UserRound />
          <b>Customer</b>
          <small>Account type</small>
        </div>
      </div>

      <div className="dashboard-columns">
        <section className="dashboard-panel">
          <div className="panel-heading">
            <h2>Order history</h2>
            <span>{orders.length} orders</span>
          </div>

          {orders.length === 0 ? (
            <div className="dashboard-empty">
              <PackageCheck />
              <h3>Your first order is waiting.</h3>
              <p>Your order details will appear here after checkout.</p>
              <button
                className="text-button"
                onClick={() => navigate("/products")}
              >
                Explore the shop <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="dashboard-orders">
              {orders.map((order) => {
                const itemSubtotal = (order.items || []).reduce(
                  (sum, item) =>
                    sum + Number(item.price || 0) * Number(item.quantity || 0),
                  0,
                );
                const shipping = Math.max(
                  0,
                  Number(order.total || 0) - itemSubtotal,
                );
                const address = order.shippingAddress || {};

                return (
                  <article className="dashboard-order" key={order._id}>
                    <div className="order-heading">
                      <div>
                        <span className="order-label">Order number</span>
                        <b>#{order._id.slice(-7).toUpperCase()}</b>
                      </div>
                      <span className={`status-chip ${order.status}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="order-meta">
                      <span>Placed: {formatDate(order.createdAt)}</span>
                      <span>
                        Payment:{" "}
                        {order.paymentMethod === "cash_on_delivery"
                          ? "Cash on delivery"
                          : order.paymentMethod}
                      </span>
                    </div>

                    <h3 className="order-section-title">Items ordered</h3>

                    <div className="order-item-list">
                      {(order.items || []).map((item, index) => (
                        <div
                          className="order-item-detail"
                          key={`${item.product}-${index}`}
                        >
                          {item.image ? (
                            <img
                              className="order-item-image"
                              src={item.image}
                              alt={item.name}
                            />
                          ) : (
                            <div className="order-item-image order-image-empty">
                              Product
                            </div>
                          )}

                          <div className="order-item-info">
                            <b>{item.name}</b>
                            <span>Unit price: {money(item.price)}</span>
                            <span>Quantity: {item.quantity}</span>
                          </div>

                          <strong className="order-item-total">
                            {money(Number(item.price) * Number(item.quantity))}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <div className="order-bottom-grid">
                      <div className="shipping-address">
                        <h3 className="order-section-title">
                          <MapPin size={16} /> Delivery address
                        </h3>
                        <p>
                          <b>{address.fullName || user?.name}</b>
                          <br />
                          {address.line1}
                          <br />
                          {address.city}
                          {address.postalCode ? `, ${address.postalCode}` : ""}
                          <br />
                          {address.country}
                        </p>
                      </div>

                      <div className="order-cost-summary">
                        <h3 className="order-section-title">Price details</h3>
                        <div>
                          <span>Items subtotal</span>
                          <span>{money(itemSubtotal)}</span>
                        </div>
                        <div>
                          <span>Shipping</span>
                          <span>
                            {shipping === 0 ? "Free" : money(shipping)}
                          </span>
                        </div>
                        <div className="order-grand-total">
                          <b>Order total</b>
                          <b>{money(order.total)}</b>
                        </div>
                      </div>
                    </div>

                    {order.status === "delivered" && (
                      <div className="delivered-review-section">
                        <h3 className="order-section-title">
                          Share your experience
                        </h3>
                        {(order.items || []).map((item, index) => (
                          <OrderReviewForm
                            key={`${item.product}-review-${index}`}
                            productId={item.product}
                            productName={item.name}
                          />
                        ))}
                      </div>
                    )}

                    <div className="user-order-footer">
                      <span>
                        Status: <b>{order.status}</b>
                      </span>

                      {["placed", "processing"].includes(order.status) && (
                        <button
                          className="cancel-order-button"
                          disabled={busy}
                          onClick={() => cancelOrder(order)}
                        >
                          <XCircle size={15} /> Cancel order
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="dashboard-panel profile-panel">
          <div className="panel-heading">
            <h2>Profile details</h2>
          </div>

          <p className="muted">
            Your sign-in email: <b>{user?.email}</b>
          </p>

          <form className="form" onSubmit={save}>
            <label>
              Display name
              <input
                value={name}
                required
                minLength="2"
                maxLength="80"
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <button className="button dark" disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
