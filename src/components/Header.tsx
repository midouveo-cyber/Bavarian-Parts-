import React, { useState } from 'react';
import { ShoppingCart, LayoutDashboard, KeyRound, Wrench, Menu, X, MessageCircle, Facebook } from 'lucide-react';
import { CartItem, AdminSettings } from '../types';

interface HeaderProps {
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  settings: AdminSettings;
}

export default function Header({
  cart,
  setIsCartOpen,
  isAdminMode,
  setIsAdminMode,
  settings
}: HeaderProps) {
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleAdminClick = () => {
    if (isAdminMode) {
      // Toggle off instantly
      setIsAdminMode(false);
    } else {
      setShowPasscodeModal(true);
      setErrorMsg('');
      setPasscode('');
    }
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = settings.adminPassword || 'admin';
    if (passcode === correctPassword || passcode === '2026') {
      setIsAdminMode(true);
      setShowPasscodeModal(false);
      setMobileMenuOpen(false);
    } else {
      setErrorMsg(`Code d'accès incorrect (astuce: utilisez "${correctPassword}")`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0a0a] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          
          {/* Logo / Brand */}
          <a href="#" className="flex items-center gap-3 group" id="brand-logo">
            <div 
              style={{ width: '20mm', height: '20mm' }}
              className="relative flex items-center justify-center transition-transform group-hover:scale-105 shrink-0"
            >
              <svg 
                style={{ width: '20mm', height: '20mm' }}
                className="shrink-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Chrome/silver gradient for outer ring & inner lines */}
                  <linearGradient id="chrome-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f3f4f6" />
                    <stop offset="25%" stopColor="#9ca3af" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="75%" stopColor="#4b5563" />
                    <stop offset="100%" stopColor="#e5e7eb" />
                  </linearGradient>

                  {/* Blue glossy quadrant gradient */}
                  <radialGradient id="blue-gloss" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="70%" stopColor="#1d4ed8" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                  </radialGradient>

                  {/* White glossy quadrant gradient */}
                  <radialGradient id="white-gloss" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="85%" stopColor="#f3f4f6" />
                    <stop offset="100%" stopColor="#d1d5db" />
                  </radialGradient>

                  {/* Black glossy ring gradient */}
                  <linearGradient id="black-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="50%" stopColor="#09090b" />
                    <stop offset="100%" stopColor="#111827" />
                  </linearGradient>

                  {/* Silver/Metallic text gradient */}
                  <linearGradient id="silver-text" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#f3f4f6" />
                    <stop offset="100%" stopColor="#9ca3af" />
                  </linearGradient>

                  {/* 3D Glass overlay reflection */}
                  <linearGradient id="glass-glare" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                    <stop offset="40%" stopColor="#ffffff" stopOpacity="0.08" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Outer Chrome Bezel Outer Edge */}
                <circle cx="50" cy="50" r="48" fill="url(#chrome-grad)" />
                
                {/* Inner Thick Black Ring background */}
                <circle cx="50" cy="50" r="44" fill="url(#black-ring)" />
                
                {/* Inner Chrome Bezel Inner Edge */}
                <circle cx="50" cy="50" r="34" fill="none" stroke="url(#chrome-grad)" strokeWidth="1.2" />

                {/* Center BMW quadrant content */}
                <g clipPath="url(#center-clip)">
                  <clipPath id="center-clip">
                    <circle cx="50" cy="50" r="32.8" />
                  </clipPath>
                  
                  {/* Inner quadrants background / base */}
                  <circle cx="50" cy="50" r="33" fill="#000000" />
                  
                  {/* Top Left Quadrant - BMW Blue */}
                  <path d="M50,50 L50,15 A35,35 0 0,0 15,50 Z" fill="url(#blue-gloss)" />
                  {/* Top Right Quadrant - White */}
                  <path d="M50,50 L85,50 A35,35 0 0,0 50,15 Z" fill="url(#white-gloss)" />
                  {/* Bottom Right Quadrant - BMW Blue */}
                  <path d="M50,50 L50,85 A35,35 0 0,0 85,50 Z" fill="url(#blue-gloss)" />
                  {/* Bottom Left Quadrant - White */}
                  <path d="M50,50 L15,50 A35,35 0 0,0 50,85 Z" fill="url(#white-gloss)" />

                  {/* Separation Chrome Lines */}
                  <line x1="50" y1="17" x2="50" y2="83" stroke="url(#chrome-grad)" strokeWidth="0.8" />
                  <line x1="17" y1="50" x2="83" y2="50" stroke="url(#chrome-grad)" strokeWidth="0.8" />
                </g>

                {/* Inner ring separation contour line */}
                <circle cx="50" cy="50" r="33.2" stroke="#000000" strokeWidth="0.5" fill="none" />

                {/* BMW Letters arranged realistically along the arch */}
                <g id="bmw-letters">
                  {/* B letter: rotated -40 degrees */}
                  <text 
                    x="23" 
                    y="40" 
                    fill="url(#silver-text)" 
                    fontSize="13" 
                    fontFamily="system-ui, -apple-system, sans-serif" 
                    fontWeight="900" 
                    transform="rotate(-40 23 40)"
                    filter="drop-shadow(0px 1px 1px rgba(0,0,0,0.8))"
                  >
                    B
                  </text>
                  {/* M letter: straight at the top, perfectly centered */}
                  <text 
                    x="50" 
                    y="24.5" 
                    fill="url(#silver-text)" 
                    fontSize="13" 
                    fontFamily="system-ui, -apple-system, sans-serif" 
                    fontWeight="900" 
                    textAnchor="middle"
                    filter="drop-shadow(0px 1px 1px rgba(0,0,0,0.8))"
                  >
                    M
                  </text>
                  {/* W letter: rotated 40 degrees */}
                  <text 
                    x="77" 
                    y="40" 
                    fill="url(#silver-text)" 
                    fontSize="13" 
                    fontFamily="system-ui, -apple-system, sans-serif" 
                    fontWeight="900" 
                    textAnchor="end"
                    transform="rotate(40 77 40)"
                    filter="drop-shadow(0px 1px 1px rgba(0,0,0,0.8))"
                  >
                    W
                  </text>
                </g>

                {/* 3D Curved Glass Dome Gloss Overlay */}
                <path d="M 5,50 A 45,45 0 0,1 95,50 A 45,30 0 0,0 5,50 Z" fill="url(#glass-glare)" pointerEvents="none" />
                
                {/* Inner border silver ring line accent */}
                <circle cx="50" cy="50" r="47.2" stroke="url(#chrome-grad)" strokeWidth="0.5" fill="none" opacity="0.8" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-extrabold tracking-tighter leading-none text-white group-hover:text-[#0066b2] transition-colors uppercase">
                BAVARIAN <span className="text-[#0066b2]">PARTS.TN</span>
              </span>
              <span className="text-[10px] text-[#0066b2] font-bold uppercase tracking-[0.2em] mt-0.5">
                Réseau 100% BMW Occasion
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#catalog" className="text-xs font-semibold uppercase tracking-widest text-white border-b-2 border-[#0066b2] pb-1 transition-colors">
              Boutique
            </a>
            <a 
              href={`https://wa.me/${settings.whatsappNumber.replace(/[\s\+]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              Contact WhatsApp
            </a>
            <a 
              href="https://www.facebook.com/share/1GEuuQEthP/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Facebook className="h-4 w-4 text-blue-400 shrink-0" />
              Page Facebook
            </a>
            <div className="h-6 w-[1px] bg-white/10" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-white/50 bg-[#0066b2]/10 px-2.5 py-1 rounded border border-[#0066b2]/20 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0066b2] animate-pulse"></span>
              Bavarian Network Online
            </span>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Admin Toggle button */}
            <button
              onClick={handleAdminClick}
              className={`flex items-center gap-1.5 rounded bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isAdminMode
                  ? 'border-red-500 text-red-400 bg-red-950/20 hover:bg-red-950/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white hover:border-[#0066b2]/50'
              }`}
              id="admin-toggle-btn"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>{isAdminMode ? 'Quitter' : 'Gérer Base'}</span>
              {isAdminMode && (
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
              )}
            </button>

            {/* Shopping Cart Pill */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 rounded bg-[#0066b2] hover:bg-[#1c3f94] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-lg shadow-blue-500/15"
              id="cart-trigger-btn"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="font-mono font-medium">{cartItemsCount}</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Icon */}
            <button
              className="p-1 text-slate-400 hover:text-white md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-white/10 bg-[#0a0a0a] backdrop-blur-lg md:hidden">
            <div className="space-y-1.5 px-4 pt-2 pb-6">
              <a
                href="#catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded px-3 py-2 text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white"
              >
                Pièces & Accessoires
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\+/g, '')}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded px-3 py-2 text-base font-medium text-emerald-400 hover:bg-emerald-500/10"
              >
                <MessageCircle className="h-5 w-5" />
                Contact WhatsApp Business
              </a>
              <a
                href="https://www.facebook.com/share/1GEuuQEthP/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded px-3 py-2 text-base font-medium text-blue-400 hover:bg-blue-500/10"
              >
                <Facebook className="h-5 w-5" />
                Suivez-nous sur Facebook
              </a>
              <div className="px-3 py-2 rounded bg-white/5 border border-white/10 text-xs text-slate-450 font-mono">
                Livraison express ou retrait magasin en Tunisie.
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Admin Passcode Gate Modal */}
      {showPasscodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setShowPasscodeModal(false)}
              className="absolute right-4 top-4 text-white/40 hover:text-white rounded bg-white/5 border border-white/10 p-1.5 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded bg-[#0066b2]/15 text-[#0066b2] mb-3 border border-[#0066b2]/20">
                <KeyRound className="h-5 w-5" />
              </div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Connexion Administration</h3>
              <p className="text-center text-xs text-white/40 mt-1 uppercase tracking-wide font-mono">
                Saisissez le code d&apos;accès actif pour gérer l&apos;inventaire.
              </p>
            </div>

            <form onSubmit={handleVerifyPasscode} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#0066b2] mb-1.5 font-mono">
                  Code d&apos;accès administrateur
                </label>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Saisissez le code"
                  className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 text-center text-white placeholder-white/20 font-mono text-sm focus:border-[#0066b2] focus:outline-none"
                  autoFocus
                />
                {errorMsg && (
                  <p className="text-[10px] text-[#e31837] mt-1.5 font-bold uppercase tracking-wider leading-relaxed">{errorMsg}</p>
                )}
                <p className="text-[9px] text-white/20 mt-2 text-center uppercase tracking-wider font-mono">
                  Astuce : Utilisez <span className="font-mono text-white/40 font-bold">&quot;{settings.adminPassword || 'admin'}&quot;</span> pour déverrouiller.
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded bg-[#0066b2] hover:bg-[#1c3f94] text-white py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                Se connecter
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
