import React, { useState, useEffect } from 'react';
import { 
  getSavedProducts, 
  saveProducts, 
  getSavedSettings, 
  saveSettings 
} from './data';
import { Product, CartItem, AdminSettings, PartCategory, ProductCondition } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartModal from './components/CartModal';
import AdminPanel from './components/AdminPanel';
import { Grid, ShoppingBag, Eye, SlidersHorizontal, AlertCircle, Sparkles, LayoutDashboard, Compass, PhoneCall, Facebook, MessageCircle } from 'lucide-react';

export default function App() {
  // Synchronized storage states
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AdminSettings>({ whatsappNumber: '', storeLocation: '', adminPassword: 'admin' });
  const [cart, setCart] = useState<CartItem[]>([]);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PartCategory | 'All'>('All');
  const [selectedChassis, setSelectedChassis] = useState<string | 'All'>('All');
  const [selectedCondition, setSelectedCondition] = useState<ProductCondition | 'All'>('All');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // New specific searching states
  const [selectedBrand, setSelectedBrand] = useState<string | 'All'>('All');
  const [selectedModel, setSelectedModel] = useState<string | 'All'>('All');
  const [selectedYear, setSelectedYear] = useState<string | 'All'>('All');

  // Interaction modulators
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // State to track if loaded from localStorage
  const [isInitialized, setIsInitialized] = useState(false);

  // Initial Seed loaders
  useEffect(() => {
    setProducts(getSavedProducts());
    setSettings(getSavedSettings());
    
    // Load existing cart session if saved
    const savedCart = localStorage.getItem('opisto_parts_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        // No-op
      }
    }
    setIsInitialized(true);
  }, []);

  // Back office updates sync
  useEffect(() => {
    if (isInitialized) {
      saveProducts(products);
    }
  }, [products, isInitialized]);

  // Settings sync
  useEffect(() => {
    if (isInitialized && settings.whatsappNumber) {
      saveSettings(settings);
    }
  }, [settings, isInitialized]);

  // Cart sync
  useEffect(() => {
    localStorage.setItem('opisto_parts_cart', JSON.stringify(cart));
  }, [cart]);

  // Toast confirmation trigger
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      showToast('⚠️ Cet article est temporairement en rupture de stock.');
      return;
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        showToast(`🛒 Quantité augmentée pour "${product.title}" !`);
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showToast(`✨ "${product.title}" ajouté au panier !`);
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedChassis('All');
    setSelectedCondition('All');
    setSelectedBrand('All');
    setSelectedModel('All');
    setSelectedYear('All');
    setOnlyInStock(false);
    showToast('🔄 Filtres de recherche réinitialisés');
  };

  // Live query-matching engine
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.oemRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.model && p.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.compatibility.some((model) => model.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesChassis = selectedChassis === 'All' || p.compatibility.includes(selectedChassis);
    const matchesCondition = selectedCondition === 'All' || p.condition === selectedCondition;
    const matchesStock = !onlyInStock || p.inStock;
    const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
    const matchesModel = selectedModel === 'All' || p.model === selectedModel;
    const matchesYear = selectedYear === 'All' || String(p.year) === String(selectedYear);

    return matchesSearch && matchesCategory && matchesChassis && matchesCondition && matchesStock && matchesBrand && matchesModel && matchesYear;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#05070c] selection:bg-[#0066b2] selection:text-white pb-16 antialiased" id="app-root-shell">
      
      {/* Dynamic Toast Popups */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg border border-white/10 bg-[#0a0a0a] px-5 py-3 text-xs font-bold text-white shadow-2xl shadow-black/80 animate-bounce">
          <div className="h-2 w-2 rounded-full bg-[#0066b2] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header System */}
      <Header 
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        settings={settings}
      />

      {/* Content Layout Stage */}
      <div className="flex-1">
        
        {/* Toggleable Admin Mode Alert Strip */}
        {isAdminMode && (
          <div className="bg-[#0066b2]/10 border-b border-[#0066b2]/25 px-4 py-2.5 text-center text-xs text-blue-250 font-mono font-bold tracking-wider flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0066b2] animate-ping" />
            <span>MODE ADMNINISTRATION ACTIF : Vous modifiez l&apos;inventaire en direct (Opisto-Style).</span>
            <button 
              onClick={() => setIsAdminMode(false)}
              className="px-2 py-0.5 rounded bg-[#0066b2]/20 text-[10px] text-white uppercase tracking-widest border border-[#0066b2]/35 hover:bg-[#0066b2]/40"
            >
              Quitter
            </button>
          </div>
        )}

        {/* Dynamic View Swapping */}
        {isAdminMode ? (
          
          /* Admin Backoffice Workspace */
          <div className="py-8 animate-fade-in" id="admin-view-chamber">
            <AdminPanel 
              products={products}
              setProducts={setProducts}
              settings={settings}
              setSettings={setSettings}
            />
          </div>

        ) : (

          /* Client Catalog Hub */
          <div className="animate-fade-in" id="customer-view-chamber">
            
            {/* Sporty Search Hero banner with Opisto-style 4-column search fields */}
            <Hero 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              settings={settings}
            />

            {/* Catalog Grid Section container */}
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="catalog">
              
              {/* Filter hub controls */}
              <Filters 
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedCondition={selectedCondition}
                setSelectedCondition={setSelectedCondition}
                onlyInStock={onlyInStock}
                setOnlyInStock={setOnlyInStock}
                resetFilters={handleResetFilters}
              />

              {/* Grid header details */}
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Grid className="h-4.5 w-4.5 text-[#0066b2]" />
                  <h3 className="font-display font-medium text-white tracking-wide uppercase text-sm">
                    {searchQuery || selectedCategory !== 'All' || selectedBrand !== 'All' || selectedModel !== 'All' || selectedYear !== 'All' || selectedCondition !== 'All' ? (
                      <>Résultats de recherche : <span className="text-[#0066b2] font-bold font-mono">{filteredProducts.length}</span> pièce(s)</>
                    ) : (
                      <>Catalogue de pièces d&apos;occasion (<span className="text-[#0066b2] font-bold font-mono">{filteredProducts.length}</span>)</>
                    )}
                  </h3>
                </div>
                
                {/* Store layout locator brief */}
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-white/30 font-medium font-mono uppercase tracking-wider">
                  <span>Dépôt Magasin: {settings.storeLocation || 'Tunis, Tunisie'}</span>
                </div>
              </div>

              {/* Products Cards Showcase Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onViewDetails={(prod) => setSelectedProduct(prod)}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
                /* Empty query results container */
                <div className="flex flex-col items-center justify-center text-center py-20 bg-white/5 border border-white/5 rounded-2xl p-8">
                  <AlertCircle className="h-12 w-12 text-white/20 mb-4" />
                  <h4 className="text-base font-bold text-white">Aucun produit ne correspond à ces critères de recherche</h4>
                  <p className="text-xs text-white/40 mt-1 max-w-[320px]">
                    Essayez de modifier votre marque ou catégorie, ou cliquez ci-dessous pour réinitialiser les filtres.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-6 rounded bg-[#0066b2] hover:bg-[#1c3f94] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Réinitialiser tout
                  </button>
                </div>
              )}

              {/* Bottom Quick Contact Section */}
              <div className="mt-20 rounded-2xl border border-white/5 bg-gradient-to-br from-[#0a0f18] to-black p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                
                {/* Visual sport accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066b2]/10 rounded-full filter blur-3xl" />
                
                <div className="relative space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#0066b2] font-mono leading-none block">ASSISTANCE CONSEIL EXPERT</span>
                  <h2 className="font-display text-lg sm:text-2xl font-black text-white uppercase">BESOIN DE TROUVER EN CASSE AUTO ?</h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-[500px]">
                    Si vous ne trouvez pas la référence exacte de votre phare, radiateur, kit carrosserie ou moteur dans nos listes, nos conseillers récupèrent les disponibilités en temps réel via notre réseau en Tunisie.
                  </p>
                </div>

                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\+/g, '')}?text=${encodeURIComponent("Bonjour, j'aimerais commander ou rechercher une pièce d'occasion spécifique : ")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="relative flex items-center justify-center gap-2.5 rounded bg-[#25D366] hover:bg-[#20ba56] text-white px-6 py-3.5 text-xs font-extrabold uppercase tracking-widest shadow-lg transition-all hover:scale-[1.03] text-center shrink-0 cursor-pointer"
                >
                  <PhoneCall className="h-4.5 w-4.5 fill-current shrink-0" />
                  <span>Demander par WhatsApp</span>
                </a>

              </div>

            </main>
          </div>

        )}

      </div>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-white/5 bg-[#060606] pt-8 pb-12 text-white/30 text-xs text-center border-faded">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          
          <div className="flex flex-col items-center justify-center gap-2 mb-2">
            <div className="flex justify-center items-center gap-1.5 text-white/50 uppercase tracking-widest font-display font-semibold">
              <span className="bg-[#0066b2] h-1.5 w-1.5 rounded-full animate-pulse" />
              <span>Bavarian Parts.TN</span>
              <span className="text-zinc-750">-</span>
              <span>Réseau Recyclage d&apos;Occasion</span>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-1 text-[10px] uppercase font-bold tracking-widest text-white/50">
              <a 
                href={`https://wa.me/${settings.whatsappNumber.replace(/[\s\+]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 py-1 px-2.5 bg-white/5 rounded border border-white/5"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>WhatsApp : {settings.whatsappNumber}</span>
              </a>
              <a 
                href="https://www.facebook.com/share/1GEuuQEthP/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400 transition-colors flex items-center gap-1.5 py-1 px-2.5 bg-white/5 rounded border border-white/5"
              >
                <Facebook className="h-3.5 w-3.5 text-blue-400" />
                <span>Page Facebook</span>
              </a>
            </div>
          </div>

          <p className="max-w-lg mx-auto text-[10px] text-white/20 uppercase tracking-wider leading-relaxed pt-2">
            Trouvez rapidement vos pièces vérifiées grâce à nos filtres de recherche internes intelligents de qualité supérieure. Finalisation gratuite et instantanée par discussion WhatsApp ou retrait boutique à Sousse.
          </p>

          <p className="text-[9px] font-mono">
            © {new Date().getFullYear()} Bavarian Parts.TN & Réseau d&apos;Occasion. Tous droits réservés.
          </p>

        </div>
      </footer>

      {/* Cart side cabinet slider */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
        settings={settings}
      />

      {/* Product quick detailed overlay panel */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

    </div>
  );
}
