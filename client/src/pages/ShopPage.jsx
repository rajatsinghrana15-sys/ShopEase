import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '../contexts/ProductsContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import OffersSlider from '../components/OffersSlider.jsx';
import { useRouter } from '../router/Router.jsx';
import './ShopPage.css';

export default function ShopPage({ query = '' }) {
  const { products, loading, offline } = useProducts();
  const { add } = useCart();
  const { pathname, navigate } = useRouter();
  const category = new URLSearchParams(pathname.split('?')[1] || '').get('category') || 'All';
  const categories = ['All', ...new Set(products.map(product => product.category).filter(Boolean))];
  const visible = useMemo(() => products.filter(product =>
    (category === 'All' || product.category === category) &&
    `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query.toLowerCase())
  ), [products, category, query]);

  return <main className="shop-page">
    <OffersSlider />
    <section className="shop-section" id="catalog">
      <div className="section-top"><div><div className="eyebrow">THE SHOP EASE COLLECTION</div><h2>Good things, <em>well found.</em></h2><p>Useful, beautiful, and just a little bit special.</p></div><span className="shop-count">{visible.length} products</span></div>
      {offline && <div className="offline-note">Demo catalog is showing. Start MongoDB and the API to enable orders.</div>}
      <div className="filters" aria-label="Filter products by category">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => navigate(item === 'All' ? '/products' : `/products?category=${encodeURIComponent(item)}`)}>{item}</button>)}</div>
      {query && <p className="search-summary">Search results for “{query}”</p>}
      <div className="product-grid">{loading ? Array.from({ length: 8 }, (_, index) => <div className="skeleton" key={index}/>) : visible.map(product => <ProductCard key={product._id} product={product} onAdd={add}/>)}</div>
      {!loading && !visible.length && <div className="empty">No products found. Try a different search or category.</div>}
      <a className="shop-back-top" href="#catalog">Back to the collection <ArrowRight size={15}/></a>
    </section>
  </main>;
}
