import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingCart, CheckCircle2, Truck, PlayCircle, Eye, AlertCircle, Layers } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailsModal({ product, onClose, onAddToCart }: ProductDetailsModalProps) {
  const [activeMedia, setActiveMedia] = useState<'photo' | 'video'>('photo');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl rounded-lg border border-white/10 bg-[#0a0a0a] p-5 sm:p-8 shadow-2xl my-8 text-left outline-none max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        id="product-details-modal-box"
      >
        
        {/* Top Right Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded bg-white/5 border border-white/15 p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          
          {/* Media Player Column */}
          <div className="space-y-4">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded bg-black border border-white/10 shadow-inner">
              
              {activeMedia === 'photo' ? (
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800'}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="relative h-full w-full flex items-center justify-center">
                  <video
                    src={product.video}
                    controls
                    autoPlay
                    loop
                    className="h-full w-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Decorative badges */}
              <div className="absolute left-3 top-3 z-10 flex gap-2">
                <span 
                  className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                    product.condition === 'Neuf'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {product.condition}
                </span>
                
                {product.inStock ? (
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                    Disponible
                  </span>
                ) : (
                  <span className="rounded bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-1 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    Rupture temporaire
                  </span>
                )}
              </div>

            </div>

            {/* Media Selector Hub (only visible if product has video preview) */}
            {product.video && (
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveMedia('photo')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded py-2.5 text-xs font-bold tracking-widest uppercase border transition-all cursor-pointer ${
                    activeMedia === 'photo'
                      ? 'bg-[#00a75d]/20 border-[#00a75d] text-white'
                      : 'border-white/15 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  <span>Afficher Photo</span>
                </button>
                <button
                  onClick={() => setActiveMedia('video')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded py-2.5 text-xs font-bold tracking-widest uppercase border transition-all cursor-pointer ${
                    activeMedia === 'video'
                      ? 'bg-[#00a75d]/20 border-[#00a75d] text-white'
                      : 'border-white/15 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Présentation Vidéo</span>
                </button>
              </div>
            )}
          </div>

          {/* Details & Specifications Column */}
          <div className="flex flex-col">
            
            {/* Category */}
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00a75d] flex items-center gap-1.5 font-mono">
              <Layers className="h-3 w-3" />
              <span>{product.category}</span>
            </span>

            {/* Brand, Model, Year Heading */}
            <p className="text-sm font-mono font-black text-[#00a75d] uppercase tracking-wider mt-2.5">
              Affectation : {product.brand || 'BMW'} {product.model || 'Série 3'} ({product.year || 2018})
            </p>

            {/* Product Title */}
            <h2 className="mt-1 font-display text-xl font-bold text-white leading-tight uppercase font-heading">
              {product.title}
            </h2>

            {/* OEM REF and Date */}
            <div className="flex items-center gap-4 mt-2 font-mono text-xs text-white/50">
              <span>Code Constructeur OEM: <strong className="text-white">{product.oemRef}</strong></span>
              <span className="text-white/10">|</span>
              <span className="text-[11px] font-mono">ID: #{product.id.slice(-6)}</span>
            </div>

            {/* Divider */}
            <div className="my-5 h-[1px] w-full bg-white/10" />

            {/* Description */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Fiche Technique d&apos;Occasion :</h4>
              <p className="text-xs sm:text-sm font-normal text-white/80 leading-relaxed max-h-[140px] overflow-y-auto pr-2">
                {product.description || "Aucune description supplémentaire définie par l'administrateur. Veuillez contacter Bavarian Parts pour obtenir un diagnostic complet de compatibilité ou d'autres prises de vue."}
              </p>
            </div>

            {/* Compatibilities */}
            {product.compatibility && product.compatibility.length > 0 && (
              <div className="mt-5 space-y-2">
                <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Compatibilité codes d&apos;origine additions :</h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.compatibility.map((chassis) => (
                    <div 
                      key={chassis} 
                      className="flex items-center gap-1 rounded bg-white/5 px-2.5 py-1 text-xs font-mono font-medium text-slate-200 border border-white/10"
                    >
                      <CheckCircle2 className="h-3 w-3 text-[#00a75d]" />
                      <span>{chassis}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="my-5 h-[1px] w-full bg-white/10" />

            {/* Bottom Row - Price & Delivery info followed by Add to Cart */}
            <div className="mt-auto pt-2 space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/40 block font-bold uppercase tracking-widest">Prix total de vente</span>
                  <div className="flex items-baseline gap-1 font-mono text-2xl font-bold text-white">
                    <span className="text-[#00a75d]">{formatPrice(product.price)}</span>
                    <span className="text-xs font-mono text-white/40 font-bold">TND</span>
                  </div>
                </div>

                {/* Louage Info status */}
                <div className="flex items-center gap-2 text-right bg-white/5 border border-white/10 px-3.5 py-2.5 rounded text-xs max-w-[180px]">
                  <Truck className="h-5 w-5 text-[#00a75d] shrink-0" />
                  <span className="text-[10px] text-white/60 font-medium">
                    Envoi express <strong>Louage</strong> ou Retrait direct
                  </span>
                </div>
              </div>

              {/* Add to Cart button */}
              <button
                disabled={!product.inStock}
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className={`w-full flex items-center justify-center gap-2 rounded py-3.5 text-xs font-black uppercase tracking-widest transition-all ${
                  product.inStock
                    ? 'bg-[#00a75d] hover:bg-[#008f4c] text-white hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md'
                    : 'bg-zinc-900 border border-white/5 text-zinc-650 cursor-not-allowed'
                }`}
              >
                {product.inStock ? (
                  <>
                    <ShoppingCart className="h-4.5 w-4.5" />
                    <span>Ajouter au panier</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4.5 w-4.5" />
                    <span>Rupture de Stock temporaire</span>
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
