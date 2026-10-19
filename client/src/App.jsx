import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { ProductsProvider } from './contexts/ProductsContext.jsx';
import { RouterProvider, useRouter } from './router/Router.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ShopPage from './pages/ShopPage.jsx';

function Application(){
  const {pathname,navigate}=useRouter();const {user}=useAuth();const [cartOpen,setCartOpen]=useState(false);const [search,setSearch]=useState('');
  const path=pathname.split(/[?#]/)[0];
  useEffect(()=>{if((path==='/login'||path==='/register')&&user)navigate(user.role==='admin'?'/admin':'/account')},[path,user]);
  let page;
  if(path==='/')page=<HomePage/>;
  else if(path==='/products')page=<ProtectedRoute><ShopPage query={search}/></ProtectedRoute>;
  else if(path==='/login')page=<AuthPage mode="login"/>;
  else if(path==='/register')page=<AuthPage mode="register"/>;
  else if(path==='/account')page=<ProtectedRoute role="customer"><UserDashboard/></ProtectedRoute>;
  else if(path==='/admin')page=<ProtectedRoute role="admin"><AdminDashboard/></ProtectedRoute>;
  else if(path==='/checkout')page=<ProtectedRoute><CheckoutPage/></ProtectedRoute>;
  else if(path.startsWith('/products/'))page=<ProtectedRoute><ProductPage/></ProtectedRoute>;
  else page=<NotFoundPage/>;
  return <div className="app-shell"><SiteHeader onOpenCart={()=>user?setCartOpen(true):navigate('/login')} onSearch={setSearch}/>{page}<SiteFooter/><CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)}/></div>;
}
export default function App(){return <RouterProvider><AuthProvider><ProductsProvider><CartProvider><Application/></CartProvider></ProductsProvider></AuthProvider></RouterProvider>}
