import React, { useEffect, useState } from "react";
import { Link } from "../router/Router.jsx";
import { Boxes, PackageCheck, Star, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useProducts } from "../contexts/ProductsContext.jsx";
import { api, money } from "../lib/api.js";
import "./AdminDashboard.css";

const emptyProduct = {
  name: "",
  category: "Home",
  price: "",
  image: "",
  stock: "10",
  description: "",
  featured: false,
};

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { refresh } = useProducts();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const [p, u, o, r] = await Promise.all([
      api("/admin/products"),
      api("/users"),
      api("/admin/orders"),
      api("/admin/reviews"),
    ]);
    setProducts(p.products);
    setUsers(u.users);
    setOrders(o.orders);
    setReviews(r.reviews);
  }
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function saveProduct(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const { editId, ...values } = form;
      const data = {
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
      };
      await api(editId ? `/admin/products/${editId}` : "/admin/products", {
        method: editId ? "PATCH" : "POST",
        body: JSON.stringify(data),
      });
      setForm(emptyProduct);
      await Promise.all([load(), refresh()]);
      setMessage(editId ? "Product updated." : "Product added.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function hideProduct(product) {
    setError("");
    try {
      if (product.isActive)
        await api(`/admin/products/${product._id}`, { method: "DELETE" });
      else
        await api(`/admin/products/${product._id}/visibility`, {
          method: "PATCH",
          body: JSON.stringify({ isActive: true }),
        });
      await Promise.all([load(), refresh()]);
    } catch (e) {
      setError(e.message);
    }
  }
  async function updateOrder(order, status) {
    setError("");
    try {
      await api(`/admin/orders/${order._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (e) {
      setError(e.message);
    }
  }
  async function updateUser(account) {
    setError("");
    try {
      await api(`/users/${account._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !account.isActive }),
      });
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="dashboard-page admin-page">
      <div className="dashboard-heading">
        <div>
          <Link to="/" className="dashboard-home-link">
            ← Home page
          </Link>
          <div className="eyebrow">SHOP EASE CONTROL ROOM</div>
          <h1>
            Welcome back, <em>{user?.name?.split(" ")[0]}.</em>
          </h1>
          <p>Manage the catalog, orders, accounts, and customer reviews.</p>
        </div>
        <button className="button outline" onClick={signOut}>
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
      <div className="admin-metrics">
        <div>
          <Boxes />
          <b>{products.filter((p) => p.isActive).length}</b>
          <span>Live products</span>
        </div>
        <div>
          <PackageCheck />
          <b>{orders.length}</b>
          <span>Total orders</span>
        </div>
        <div>
          <Users />
          <b>{users.length}</b>
          <span>Customer accounts</span>
        </div>
        <div>
          <Star />
          <b>{reviews.length}</b>
          <span>Customer reviews</span>
        </div>
      </div>
      <section className="dashboard-panel admin-editor">
        <div className="panel-heading">
          <div>
            <h2>{form.editId ? "Edit product" : "Add a product"}</h2>
            <span>Keep product information clear and up to date.</span>
          </div>
          {form.editId && (
            <button
              className="text-button"
              onClick={() => setForm(emptyProduct)}
            >
              Cancel edit
            </button>
          )}
        </div>
        <form className="admin-product-form" onSubmit={saveProduct}>
          <label>
            Product name
            <input
              required
              minLength="2"
              maxLength="120"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <div className="form-row">
            <label>
              Category
              <input
                required
                maxLength="40"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </label>
            <label>
              Price
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </label>
            <label>
              Stock
              <input
                required
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </label>
          </div>
          <label>
            Product image URL
            <input
              required
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </label>
          <label>
            Description
            <textarea
              required
              minLength="10"
              maxLength="1500"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />{" "}
            Show in the featured edit
          </label>
          <button className="button dark" disabled={busy}>
            {busy ? "Saving…" : form.editId ? "Save product" : "Add product"}
          </button>
        </form>
      </section>
      <div className="admin-tables">
        <section className="dashboard-panel">
          <div className="panel-heading">
            <h2>Products</h2>
            <span>{products.length} total</span>
          </div>
          <div className="admin-table">
            {products.map((product) => (
              <div className="admin-table-row" key={product._id}>
                <img src={product.image} alt="" />
                <div className="table-primary">
                  <b>{product.name}</b>
                  <small>
                    {product.category} · {money(product.price)} ·{" "}
                    {product.stock} in stock
                  </small>
                </div>
                <span
                  className={`status-chip ${product.isActive ? "active" : "cancelled"}`}
                >
                  {product.isActive ? "Live" : "Hidden"}
                </span>
                <button
                  className="small-action"
                  onClick={() =>
                    setForm({
                      ...product,
                      price: String(product.price),
                      stock: String(product.stock),
                      editId: product._id,
                    })
                  }
                >
                  Edit
                </button>
                <button
                  className="small-action"
                  onClick={() => hideProduct(product)}
                >
                  {product.isActive ? "Hide" : "Restore"}
                </button>
              </div>
            ))}
          </div>
        </section>
        <section className="dashboard-panel">
          <div className="panel-heading">
            <h2>Orders</h2>
            <span>{orders.length} total</span>
          </div>
          <div className="admin-table">
            {orders.map((order) => (
              <div className="admin-table-row order-row" key={order._id}>
                <div className="table-primary">
                  <b>
                    #{order._id.slice(-7).toUpperCase()} ·{" "}
                    {order.user?.name || "Customer"}
                  </b>
                  <small>
                    {money(order.total)} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <select
                  aria-label={`Order ${order._id} status`}
                  value={order.status}
                  onChange={(e) => updateOrder(order, e.target.value)}
                >
                  {[
                    "placed",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="dashboard-panel admin-accounts">
        <div className="panel-heading">
          <h2>Customer accounts & reviews</h2>
          <span>{users.length} accounts</span>
        </div>
        <div className="admin-table">
          {users.map((account) => {
            const accountReviews = reviews.filter(
              (review) => review.user?._id === account._id,
            );
            return (
              <article className="admin-account" key={account._id}>
                <div className="admin-table-row">
                  <div className="table-primary">
                    <b>{account.name}</b>
                    <small>
                      {account.email} · {account.role} · Joined{" "}
                      {new Date(account.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <span
                    className={`status-chip ${account.isActive ? "active" : "cancelled"}`}
                  >
                    {account.isActive ? "Active" : "Disabled"}
                  </span>
                  {account.role !== "admin" && (
                    <button
                      className="small-action"
                      onClick={() => updateUser(account)}
                    >
                      {account.isActive ? "Disable" : "Enable"}
                    </button>
                  )}
                </div>
                <div className="account-reviews">
                  <b>Reviews by this account ({accountReviews.length})</b>
                  {accountReviews.length ? (
                    accountReviews.map((review) => (
                      <div className="admin-review" key={review._id}>
                        <span>
                          <Star size={13} fill="currentColor" /> {review.rating}
                          /5
                        </span>
                        <strong>{review.product?.name || "Product"}</strong>
                        <p>{review.comment}</p>
                        <small>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    ))
                  ) : (
                    <p className="muted">No product reviews yet.</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
