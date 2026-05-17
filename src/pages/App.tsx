import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from './HomePage';
import ProductsPage from './Products';
import ProductDetailsPage from './ProductDetails';
import ContactPage from './Contact';
import { HowToPurchasePage, TransportDeliveryPage, ContactUsPage } from './InfoPages';
import CheckoutPage from './Checkout';
import AuthPage from './Auth';
import AdminPage from './Admin';

export default function App() {
  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/how-to-purchase" element={<HowToPurchasePage />} />
          <Route path="/transport-delivery" element={<TransportDeliveryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
  );
}