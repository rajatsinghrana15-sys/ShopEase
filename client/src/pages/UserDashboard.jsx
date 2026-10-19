import React, { useEffect, useState } from "react";
import { Link } from "../router/Router.jsx";
import { ArrowRight, PackageCheck, UserRound, XCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useRouter } from "../router/Router.jsx";
import { api, money } from "../lib/api.js";
import "./UserDashboard.css";

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
    setOrders(data.orders);
  }
  useEffect(() => {
    loadOrders().catch((e) => setError(e.message));
  }, []);

  async function save(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      await updateName(name);
      setMessage("Your profile has been updated.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function cancelOrder(order) {
    if (!window.confirm(`Cancel order #${order._id.slice(-7).toUpperCase()}?`))
      return;
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const result = await api(`/orders/${order._id}/cancel`, {
        method: "PATCH",
      });
      setMessage(result.message);
      await loadOrders();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  function logout() {
    signOut();
    navigate("/");
  }

  return (
    <main className="dashboard-page user-dashboard-page">
      <div className="dashboard-heading">
        <div>
          <Link to="/" className="dashboard-home-link">
            ← Home page
          </Link>
          <div className="eyebrow">YOUR SHOP EASE</div>
          <h1>
            Hello, <em>{user?.name?.split(" ")[0]}.</em>
          </h1>
          <p>
            Everything for your account, order history, and delivery updates.
          </p>
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
              <p>When you place an order, its progress will show up here.</p>
              <button
                className="text-button"
                onClick={() => navigate("/products")}
              >
                Explore the shop <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="dashboard-orders">
              {orders.map((order) => (
                <article className="dashboard-order" key={order._id}>
                  <div className="order-heading">
                    <b>Order #{order._id.slice(-7).toUpperCase()}</b>
                    <span className={`status-chip ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <small>
                    {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                    {order.items.reduce((n, item) => n + item.quantity, 0)}{" "}
                    items · Cash on delivery
                  </small>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <span key={`${item.product}-${index}`}>
                        {item.quantity} × {item.name}
                      </span>
                    ))}
                  </div>
                  <div className="user-order-footer">
                    <strong>{money(order.total)}</strong>
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
              ))}
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
                onChange={(e) => setName(e.target.value)}
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
