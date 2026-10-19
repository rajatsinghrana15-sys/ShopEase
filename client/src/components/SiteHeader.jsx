import React, { useState } from "react";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { Link } from "../router/Router.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import "./SiteHeader.css";

export default function SiteHeader({ onOpenCart, onSearch }) {
  const { user } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dashboard = user?.role === "admin" ? "/admin" : "/account";
  const search = (value) => {
    setQuery(value);
    onSearch?.(value);
  };
  return (
    <>
      <div className="announcement">
        Thoughtful finds for your everyday <span>·</span> Free shipping over $75
      </div>
      <header className="header">
        <button
          className="icon-button mobile-toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu />
        </button>
        <Link className="brand" to="/">
          shop<span>Ease</span>
          <i>.</i>
        </Link>
        <nav className={menuOpen ? "nav open" : "nav"}>
          {["Shop all", "Home", "Style", "Tech", "Audio"].map((label, i) => (
            <Link
              key={label}
              to={
                i === 0
                  ? "/products"
                  : `/products?category=${encodeURIComponent(label)}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="head-actions">
          {user && (
            <label className="search">
              <Search size={17} />
              <input
                aria-label="Search products"
                placeholder="Search the good stuff"
                value={query}
                onChange={(e) => search(e.target.value)}
              />
            </label>
          )}
          <Link
            className="profile-button"
            aria-label={user ? "My profile" : "Sign in"}
            to={user ? dashboard : "/login"}
          >
            <UserRound size={18} />
            <span>
              {user ? (user.role === "admin" ? "Admin" : "Profile") : "Sign in"}
            </span>
          </Link>
          {user && (
            <button
              className="bag-button"
              onClick={onOpenCart}
              aria-label={`Shopping bag with ${count} items`}
            >
              <ShoppingBag size={19} />
              <span>Bag</span>
              <b>{count}</b>
            </button>
          )}
        </div>
      </header>
    </>
  );
}
