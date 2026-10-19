import React from 'react';
import { Link } from '../router/Router.jsx';
import './SiteFooter.css';
export default function SiteFooter(){return <footer><Link className="brand" to="/">Shop<span>Ease</span><i>.</i></Link><p>Everyday things, chosen with care.</p><div className="footer-links"><Link to="/products">Shop</Link><Link to="/#story">Our story</Link><Link to="/account">My account</Link></div><small>© 2026 ShopEase Studio · Made for your everyday</small></footer>}
