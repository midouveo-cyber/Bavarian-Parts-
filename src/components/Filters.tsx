import React from 'react';
import { CATEGORIES, BRANDS, MODELS_BY_BRAND, YEARS } from '../data';
import { PartCategory, ProductCondition } from '../types';
import { SlidersHorizontal, Car, Grid, CheckCircle2, RotateCcw, Calendar, Hammer } from 'lucide-react';

interface FiltersProps {
  selectedCategory: PartCategory | 'All';
  setSelectedCategory: (category: PartCategory | 'All') => void;
  selectedBrand: string | 'All';
  setSelectedBrand: (brand: string | 'All') => void;
  selectedModel: string | 'All';
  setSelectedModel: (model: string | 'All') => void;
  selectedYear: string | 'All';
  setSelectedYear: (year: string | 'All') => void;
  selectedCondition: ProductCondition | 'All';
  setSelectedCondition: (condition: ProductCondition | 'All') => void;
  onlyInStock: boolean;
  setOnlyInStock: (only: boolean) => void;
  resetFilters: () => void;
}

export default function Filters({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedModel,
  setSelectedModel,
  selectedYear,
  setSelectedYear,
  selectedCondition,
  setSelectedCondition,
  onlyInStock,
  setOnlyInStock,
  resetFilters
}: FiltersProps) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6 shadow-xl mb-8">
      
      {/* Filters Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4.5 w-4.5 text-[#0066b2]" />
          <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider">
            Recherche Avancée - Pièces Auto BMW Occasion
          </h2>
        </div>

        <button
          onClick={resetFilters}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-white/40 hover:text-[#0066b2] transition-colors border border-white/10 px-3 py-1.5 rounded bg-white/5 cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Réinitialiser</span>
        </button>
      </div>

      {/* Selectors Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        
        {/* Filter 1: Brand selector */}
        <div className="space-y-2">
          <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white/40 tracking-widest font-mono">
            <Car className="h-3.5 w-3.5 text-[#0066b2]" />
            Constructeur / Marque
          </span>
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
            }}
            className="w-full rounded border border-white/10 bg-[#050505] px-3 py-2.5 text-xs text-slate-200 focus:border-[#0066b2] focus:outline-none cursor-pointer"
          >
            <option value="BMW" className="bg-[#0a0a0a]">BMW (Constructeur Exclusif)</option>
          </select>
        </div>

        {/* Filter 2: Model selector */}
        <div className="space-y-2">
          <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white/40 tracking-widest font-mono">
            <Hammer className="h-3.5 w-3.5 text-[#0066b2]" />
            Gamme de Modèle / Chassis
          </span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full rounded border border-white/10 bg-[#050505] px-3 py-2.5 text-xs text-[#0066b2] font-semibold focus:border-[#0066b2] focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-[#0a0a0a]">Tous les modèles (E46, E39, F30...)</option>
            {(MODELS_BY_BRAND['BMW'] || []).map((mo) => (
              <option key={mo} value={mo} className="bg-[#0a0a0a]">{mo}</option>
            ))}
          </select>
        </div>

        {/* Filter 3: Year selector */}
        <div className="space-y-2">
          <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white/40 tracking-widest font-mono">
            <Calendar className="h-3.5 w-3.5 text-[#0066b2]" />
            Année de Sortie (Year)
          </span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full rounded border border-white/10 bg-[#050505] px-3 py-2.5 text-xs text-slate-200 focus:border-[#0066b2] focus:outline-none cursor-pointer font-mono"
          >
            <option value="All" className="bg-[#0a0a0a]">Toutes années</option>
            {YEARS.map((yr) => (
              <option key={yr} value={yr} className="bg-[#0a0a0a]">{yr}</option>
            ))}
          </select>
        </div>

        {/* Filter 4: Condition (Neuf / Occasion) */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block font-mono">État de la pièce</span>
          <div className="flex rounded bg-[#050505] border border-white/10 p-1">
            <button
              onClick={() => setSelectedCondition('All')}
              className={`flex-1 rounded py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCondition === 'All'
                  ? 'bg-[#0066b2] text-white shadow'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setSelectedCondition('Neuf')}
              className={`flex-1 rounded py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCondition === 'Neuf'
                  ? 'bg-[#0066b2] text-white shadow'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Neuf
            </button>
            <button
              onClick={() => setSelectedCondition('Occasion')}
              className={`flex-1 rounded py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCondition === 'Occasion'
                  ? 'bg-[#0066b2] text-white shadow'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Occas&apos;
            </button>
          </div>
        </div>

      </div>

      {/* Visual Piece Category Interactive Filter Cards (BODY, ENGINE, INTERNAL, DASHBOARD, SUSPENSION ETC) */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <span className="flex items-center gap-1.5 text-[10px] uppercase font-extrabold text-white/40 tracking-widest mb-3.5 font-mono">
          <Grid className="h-3.5 w-3.5 text-[#0066b2]" />
          Recherche par Type de Pièce (Piece Part Categories)
        </span>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {/* All Button */}
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-2.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all border cursor-pointer text-center truncate ${
              selectedCategory === 'All'
                ? 'bg-white/10 border-[#0066b2] text-white shadow-md'
                : 'bg-white/5 border-white/10 hover:border-white/20 text-white/40 hover:text-white'
            }`}
          >
            Tous types
          </button>

          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all border cursor-pointer text-center truncate ${
                  active
                    ? 'bg-[#0066b2]/25 border-[#0066b2] text-white shadow-md font-extrabold'
                    : 'bg-white/5 border-white/10 hover:border-white/20 text-white/40 hover:text-white'
                }`}
                title={cat}
              >
                {cat.split(' / ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Check */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-white/10">
        
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-white/30 font-mono text-[9px] uppercase tracking-wider">Populaire:</span>
          {['E46', 'E39', 'F30', 'E36', 'Carrosserie', 'Moteur', 'Tableau de bord'].map((term) => (
            <button
              key={term}
              onClick={() => {
                const matchedModel = MODELS_BY_BRAND['BMW'].find(m => m.toLowerCase() === term.toLowerCase());
                if (matchedModel) {
                  setSelectedModel(matchedModel);
                } else {
                  // Find if matched in category splits
                  const matchedCat = CATEGORIES.find(c => c.toLowerCase().includes(term.toLowerCase()));
                  if (matchedCat) {
                    setSelectedCategory(matchedCat);
                  } else {
                    const searchEl = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (searchEl) {
                      searchEl.value = term;
                      const event = new Event('input', { bubbles: true });
                      searchEl.dispatchEvent(event);
                    }
                  }
                }
              }}
              className="px-2.5 py-0.5 rounded bg-white/5 hover:bg-[#0066b2]/25 hover:text-white text-slate-400 border border-white/10 transition-colors cursor-pointer text-[9px] uppercase font-semibold tracking-wider font-mono"
            >
              {term}
            </button>
          ))}
        </div>

        <button
          onClick={() => setOnlyInStock(!onlyInStock)}
          className={`flex items-center justify-between rounded border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            onlyInStock
              ? 'border-[#0066b2]/30 bg-[#0066b2]/10 text-[#0066b2]'
              : 'border-white/10 bg-white/5 text-white/40 hover:text-white'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider mr-2 font-mono">Dispo immédiate en Stock</span>
          <CheckCircle2 className={`h-4 w-4 transition-opacity ${onlyInStock ? 'opacity-100' : 'opacity-30'}`} />
        </button>

      </div>

    </div>
  );
}
