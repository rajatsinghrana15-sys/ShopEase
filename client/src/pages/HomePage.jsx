import React from 'react';
import { ArrowRight, ArrowUpRight, Leaf, LockKeyhole, RotateCcw, Truck } from 'lucide-react';
import { Link } from '../router/Router.jsx';
import './HomePage.css';

export default function HomePage() {
  return <main className="landing-page">
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span className="dot"/> THE EVERYDAY, CONSIDERED</div><h1>Find your<br/><em>good things.</em></h1><p>Thoughtful pieces for slower mornings, softer spaces, and all the little moments in between.</p><Link className="button dark" to="/products">Explore the collection <ArrowRight size={16}/></Link><div className="hero-note"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span></div><span><strong>Good things, chosen with care</strong><br/>For homes & humans</span></div></div>
      <div className="hero-image"><div className="image-badge"><span>THE SUNDAY EDIT</span><strong>Made for<br/>the moments<br/>that matter.</strong><Link to="/products">Shop the edit <ArrowUpRight size={14}/></Link></div><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=90" alt="Warm, thoughtfully styled living space"/><div className="image-caption">A softer kind of everyday <span>01 / 04</span></div></div><div className="hero-stamp">GOOD<br/>THINGS<br/><span>inside</span></div>
    </section>
    <section className="value-strip"><div><Truck/><span><b>A little treat on us</b><small>Free shipping over ₹75</small></span></div><div><Leaf/><span><b>Thoughtfully picked</b><small>Small details, big feeling</small></span></div><div><RotateCcw/><span><b>Take your time</b><small>Easy 30-day returns</small></span></div><div><LockKeyhole/><span><b>Checkout with care</b><small>Cash on delivery</small></span></div></section>
    <section className="story"><div className="story-image"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85" alt="Sunlit cozy home corner"/><span>FEEL GOOD, LIVE WELL</span></div><div className="story-copy"><div className="eyebrow">A SMALL NOTE FROM US</div><h2>Less, but<br/><em>more lovely.</em></h2><p>We think the things you live with should earn their place. So we look for the useful, the well made, and the quietly wonderful — things that make an ordinary Tuesday feel a little more like yours.</p><Link to="/products" className="text-link">Explore the collection <ArrowRight size={15}/></Link><div className="signature">With care, <span>the ShopEase team</span></div></div><div className="story-scribble">♡</div></section>
    <section className="newsletter"><div className="eyebrow">A GOOD NOTE, NOW AND THEN</div><h2>Make room for <em>lovely.</em></h2><p>Create an account to see the collection, save your cart, and keep track of your orders.</p><Link className="button dark" to="/register">Create your account <ArrowRight size={15}/></Link></section>
  </main>;
}
