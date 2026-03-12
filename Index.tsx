import { useState, useMemo, useRef } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import CartSidebar from '@/components/CartSidebar';
import LoginModal from '@/components/LoginModal';
import CheckoutPage from '@/components/CheckoutPage';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { products, categories } from '@/data/products';

const GroceryStore = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (showCheckout) {
    return <CheckoutPage onBack={() => setShowCheckout(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={() => setLoginOpen(true)} onSearchChange={setSearchQuery} />
      <HeroSection onShopNow={scrollToProducts} />

      {/* Products Section */}
      <section ref={productsRef} className="container mx-auto px-4 py-12" id="products">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">Shop Fresh Groceries</h2>
          <p className="text-muted-foreground">Handpicked quality products delivered fresh to your home</p>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No products found.</p>
            <p className="text-sm">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredProducts.map((product, i) => (
              <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features banner */}
      <section className="bg-muted">
        <div className="container mx-auto px-4 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'On orders over $50' },
              { icon: '🌿', title: 'Fresh & Organic', desc: 'Sourced from local farms' },
              { icon: '⚡', title: 'Express Delivery', desc: 'Within 2-4 hours' },
              { icon: '💳', title: 'Secure Payment', desc: 'Multiple payment options' },
            ].map(f => (
              <div key={f.title} className="flex items-center gap-3 bg-card rounded-lg p-4 shadow-card">
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <h4 className="font-semibold text-card-foreground text-sm">{f.title}</h4>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <CartSidebar onCheckout={() => setShowCheckout(true)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};

const Index = () => (
  <CartProvider>
    <GroceryStore />
  </CartProvider>
);

export default Index;
