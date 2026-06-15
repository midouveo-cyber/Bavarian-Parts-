import React from 'react';
import { BRANDS, MODELS_BY_BRAND, YEARS, CATEGORIES } from '../data';
import { PartCategory, AdminSettings } from '../types';
import { Search, Compass, ShieldCheck, Truck, MessageSquare, ArrowRight } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBrand: string | 'All';
  setSelectedBrand: (brand: string | 'All') => void;
  selectedModel: string | 'All';
  setSelectedModel: (model: string | 'All') => void;
  selectedYear: string | 'All';
  setSelectedYear: (year: string | 'All') => void;
  selectedCategory: PartCategory | 'All';
  setSelectedCategory: (category: PartCategory | 'All') => void;
  settings: AdminSettings;
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedBrand,
  setSelectedBrand,
  selectedModel,
  setSelectedModel,
  selectedYear,
  setSelectedYear,
  selectedCategory,
  setSelectedCategory,
  settings
}: HeroProps) {
  
  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickLocate = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToCatalog();
  };

  return (
    <div 
      className="relative overflow-hidden py-24 pb-28 border-b border-white/10 bg-cover bg-center transition-all duration-700"
      style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(5, 5, 5, 0.75), rgba(10, 10, 10, 0.96)), url('${settings.backgroundImageUrl || "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=1920"}')` 
      }}
    >
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-blue-600/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          
          {/* Opisto Partner-Style Badge */}
          <div className="inline-flex items-center gap-1.5 rounded bg-white/5 border border-white/10 px-3.5 py-1 text-xs font-semibold text-white/60 mb-6 antialiased">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded h-2 w-2 bg-[#0066b2]"></span>
            </span>
            <span className="uppercase tracking-wider font-mono text-[9px]">Opisto Recyclage Spécialiste</span>
            <span className="text-white/20">•</span>
            <span className="text-white/80 font-mono text-[9px] uppercase tracking-wider">
              Bavarian Sousse
            </span>
          </div>

          {/* Slogan */}
          <h1 className="font-display text-4xl sm:text-6.5xl font-black text-white tracking-tight uppercase leading-tight flex flex-wrap items-center justify-center gap-x-2">
            <span>PIÈCES AUTO</span>
            <span className="text-[#0066b2] italic tracking-wide flex items-center">
              BMW
              <span className="inline-flex items-center gap-[2px] ml-2 align-middle">
                <span className="w-1.5 h-6 sm:w-2 sm:h-8 bg-[#00a2e2] transform -skew-x-12"></span>
                <span className="w-1.5 h-6 sm:w-2 sm:h-8 bg-[#003399] transform -skew-x-12"></span>
                <span className="w-1.5 h-6 sm:w-2 sm:h-8 bg-[#e31837] transform -skew-x-12"></span>
                <span className="text-white font-black italic tracking-tighter text-3xl sm:text-5xl ml-1 font-mono leading-none">M</span>
              </span>
            </span>
            <span>OCCASION & NEUF</span>
          </h1>
          
          <p className="mx-auto mt-4 max-w-3xl text-xs sm:text-sm text-slate-300 uppercase tracking-widest leading-relaxed">
            Trouvez les meilleures pièces d&apos;auto testées d&apos;origine neuves et recyclées vendues en Dinars Tunisiens (TND). Carrosserie, Électricité, Selleries et Moteurs complets. 
          </p>

          {/* OPISTO MAIN SEARCH ENGINE WIDGET */}
          <div className="mx-auto mt-12 max-w-4xl bg-[#0a0a0a]/95 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#0066b2]" />
            
            <h3 className="text-xs uppercase font-extrabold text-white tracking-widest mb-4 flex items-center gap-2 font-mono">
              <Compass className="h-4.5 w-4.5 text-[#0066b2]" />
              <span className="text-white">Recherche par Désignation Chassis & Modèle (E46, E39, F30)</span>
            </h3>

            <form onSubmit={handleQuickLocate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Marque */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold uppercase text-white/40 tracking-wider">1. Marque (Brand)</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    const b = e.target.value;
                    setSelectedBrand(b);
                    setSelectedModel('All');
                  }}
                  className="w-full rounded border border-white/10 bg-[#121212] px-3 py-2 text-xs text-white uppercase tracking-wider focus:border-[#0066b2] focus:outline-none"
                >
                  {BRANDS.map((br) => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>
              </div>

              {/* Modèle */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold uppercase text-white/40 tracking-wider">2. Modèle (Sub-Model/Chassis)</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full rounded border border-white/10 bg-[#121212] px-3 py-2 text-xs text-[#0066b2] font-semibold uppercase tracking-wider focus:border-[#0066b2] focus:outline-none"
                >
                  <option value="All">Toutes les Séries</option>
                  {(MODELS_BY_BRAND['BMW'] || []).map((mo) => (
                    <option key={mo} value={mo}>{mo}</option>
                  ))}
                </select>
              </div>

              {/* Année */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold uppercase text-white/40 tracking-wider">3. Année de Production</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full rounded border border-white/10 bg-[#121212] px-3 py-2 text-xs text-white focus:border-[#0066b2] focus:outline-none font-mono"
                >
                  <option value="All">1980 - 2026</option>
                  {YEARS.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              {/* Catégorie */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold uppercase text-white/40 tracking-wider">4. Organe / Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="w-full rounded border border-white/10 bg-[#121212] px-3 py-2 text-xs text-white uppercase tracking-wider focus:border-[#0066b2] focus:outline-none"
                >
                  <option value="All">Toutes catégories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat.split(' / ')[0]}</option>
                  ))}
                </select>
              </div>

              {/* Keyword text search */}
              <div className="sm:col-span-2 md:col-span-3">
                <div className="relative rounded bg-[#121212] border border-white/10 px-3 py-1 text-xs focus-within:border-[#0066b2] transition-all flex items-center">
                  <span className="text-white/30 mr-2 shrink-0">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Saisissez un mot de clé ou une référence constructeur OEM..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-0 py-2.5 text-xs text-white placeholder-white/20 uppercase tracking-wider focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Find/Trigger Button */}
              <button
                type="submit"
                className="w-full rounded bg-[#0066b2] hover:bg-[#1c3f94] text-white py-3.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-1.5"
              >
                <span>Rechercher</span>
                <ArrowRight className="h-4 w-4" />
              </button>

            </form>
          </div>

          {/* Trust features grid */}
          <div className="mx-auto mt-16 max-w-4xl grid grid-cols-1 gap-6 sm:grid-cols-3">
            
            {/* Guarantee */}
            <div className="flex items-start gap-3 rounded border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-4 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-blue-600/10 text-blue-400 border border-blue-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">M-Performance Test</h4>
                <p className="mt-1 text-[11px] text-white/40 leading-normal">Pièces d&apos;auto testées, reconditionnées et vendues sous notre charte qualité.</p>
              </div>
            </div>

            {/* Delivering */}
            <div className="flex items-start gap-3 rounded border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-4 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-blue-600/10 border border-blue-500/20 text-blue-400">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">Louage Express & Sousse</h4>
                <p className="mt-1 text-[11px] text-white/40 leading-normal">Livraison directe vers Tunis, Sfax, Sousse, Bizerte ou retrait comptoir Ben Arous.</p>
              </div>
            </div>

            {/* Order Whatsapp */}
            <div className="flex items-start gap-3 rounded border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-4 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-blue-600/10 text-blue-400 border border-blue-500/20">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider font-sans">Achat direct WhatsApp</h4>
                <p className="mt-1 text-[11px] text-white/40 leading-normal">Un clic gratuit suffit pour réserver, envoyer des photos et finaliser la vente.</p>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
