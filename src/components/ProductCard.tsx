import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Eye, AlertCircle, PlayCircle, Layers } from 'lucide-react';

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div 
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl ${
        !product.inStock ? 'opacity-60' : ''
      }`}
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-950">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600'}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Condition Badge (Neuf / Occasion) */}
        <div className="absolute left-3 top-3 z-10 flex gap-2">
          <span 
            className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
              product.condition === 'Neuf'
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            }`}
          >
            {product.condition}
          </span>

          {/* Video indicator badge */}
          {product.video && (
            <span className="flex items-center gap-1 mt-0.5 rounded bg-[#00a75d]/15 text-[#00a75d] border border-[#00a75d]/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
              <PlayCircle className="h-3 w-3 shrink-0" />
              Vidéo
            </span>
          )}
        </div>

        {/* Stock status overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-[1px]">
            <span className="flex items-center gap-1.5 rounded bg-red-500/20 text-red-100 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-widest border border-red-500/30">
              <AlertCircle className="h-3.5 w-3.5 text-red-400" />
              Rupture de Stock
            </span>
          </div>
        )}

        {/* Technical compatibility code strip */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-6 flex flex-wrap gap-1">
          {product.compatibility && product.compatibility.slice(0, 3).map((chassis) => (
            <span 
              key={chassis} 
              className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-bold text-white/80 uppercase tracking-widest border border-white/15 font-mono"
            >
              Autre ref: {chassis}
            </span>
          ))}
        </div>
      </div>

      {/* Product Information Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        
        {/* Category Header */}
        <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-white/40 mb-1 leading-none">
          <Layers className="h-3 w-3 text-[#00a75d]" />
          <span>{product.category}</span>
        </div>

        {/* Brand & Model specification heading (Opisto layout) */}
        <p className="text-[11px] font-mono font-black text-[#00a75d] uppercase tracking-wider mb-1 leading-none mt-1">
          {product.brand || 'BMW'} {product.model || 'Série 3'} ({product.year || 2018})
        </p>

        {/* Title */}
        <h3 className="line-clamp-2 font-display text-sm font-bold text-white group-hover:text-[#00a75d] transition-colors min-h-[40px] mt-1.5 leading-snug">
          {product.title}
        </h3>

        {/* Technical reference OEM */}
        <p className="mt-2 font-mono text-[10px] text-white/40 uppercase tracking-wider">
          Réf constructeur: <span className="text-white/70 font-medium font-mono">{product.oemRef}</span>
        </p>

        {/* Spacer */}
        <div className="mt-auto pt-5 flex items-end justify-between">
          
          {/* Price block */}
          <div className="flex flex-col">
            <span className="text-[9px] font-bold tracking-widest text-white/30 uppercase">Tarif Tunisie</span>
            <div className="flex items-baseline gap-1 font-mono text-base font-extrabold text-white">
              <span className="text-[#00a75d] font-bold">{formatPrice(product.price)}</span>
              <span className="text-[10px] text-white/40 font-mono font-bold">TND</span>
            </div>
          </div>

          {/* Quick action triggers */}
          <div className="flex items-center gap-1.5 pb-0.5">
            
            {/* View Details Icon trigger */}
            <button
              onClick={() => onViewDetails(product)}
              className="flex h-9 w-9 items-center justify-center rounded border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-[#00a75d]/30 hover:text-white transition-all cursor-pointer"
              title="Prévisualiser fiche produit"
            >
              <Eye className="h-4 w-4" />
            </button>

            {/* Direct Add to Cart trigger */}
            <button
              disabled={!product.inStock}
              onClick={() => onAddToCart(product)}
              className={`flex h-9 items-center justify-center gap-1.5 rounded px-3.5 text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                product.inStock
                  ? 'bg-[#00a75d] hover:bg-[#008f4c] text-white active:scale-95'
                  : 'bg-zinc-900 border border-white/5 text-zinc-650 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-3 w-3" />
              <span>Acheter</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
