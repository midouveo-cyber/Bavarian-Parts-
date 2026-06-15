import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, MessageCircle, MapPin, Truck, AlertCircle } from 'lucide-react';
import { CartItem, CustomerDetails, AdminSettings } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  settings: AdminSettings;
}

const TUNISIAN_GOVERNORATES = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 
  'Kairouan', 'Kasserine', 'Kébili', 'Kef', 'Mahdia', 'Manouba', 'Médenine', 
  'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 
  'Tozeur', 'Tunis', 'Zaghouan'
];

export default function CartModal({
  isOpen,
  onClose,
  cart,
  setCart,
  settings
}: CartModalProps) {
  const [details, setDetails] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    city: 'Tunis',
    deliveryMethod: 'louage'
  });
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQuantity = item.quantity + delta;
            return { ...item, quantity: nextQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryCost = details.deliveryMethod === 'louage' ? 12 : 0; // 12 DT for Louage dispatch within Tunisia
  const total = subtotal + deliveryCost;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!details.fullName.trim()) {
      setValidationError('Veuillez saisir votre Nom complet.');
      return;
    }
    if (!details.phone.trim()) {
      setValidationError('Veuillez renseigner votre numéro de téléphone tunisien.');
      return;
    }

    // Build the beautiful WhatsApp message
    const cleanNumber = settings.whatsappNumber.replace(/[\s\+]/g, '');
    
    // Formatting content
    let messageText = `Bonjour *Bavarian Parts* 🛠️🚗\n`;
    messageText += `Je souhaite commander les pièces d'occasions suivantes depuis votre site Web :\n\n`;
    
    // List Items
    cart.forEach((item, index) => {
      const conditionTag = item.product.condition === 'Neuf' ? '(Neuf)' : '(Occasion)';
      messageText += `*${index + 1}.* ${item.product.title} ${conditionTag}\n`;
      messageText += `   • *Réf OEM :* ${item.product.oemRef}\n`;
      messageText += `   • *Marque :* ${item.product.brand || 'BMW'} / ${item.product.model || 'Série 3'} (${item.product.year || 2018})\n`;
      messageText += `   • *Quantité :* ${item.quantity}x\n`;
      messageText += `   • *Prix unitaire :* ${formatPrice(item.product.price)} TND\n`;
      messageText += `   • *Sous-total :* ${formatPrice(item.product.price * item.quantity)} TND\n\n`;
    });

    messageText += `-----------------------------------------\n`;
    messageText += `💰 *Sous-total :* ${formatPrice(subtotal)} TND\n`;
    if (details.deliveryMethod === 'louage') {
      messageText += `📦 *Livraison Louage Express :* +${formatPrice(deliveryCost)} TND (Livraison rapide)\n`;
    } else {
      messageText += `🏪 *Retrait Magasin (Comptoir Ben Arous) :* Gratuit (0 TND)\n`;
    }
    messageText += `🏁 *TOTAL COMMANDE :* *${formatPrice(total)} TND*\n`;
    messageText += `-----------------------------------------\n\n`;
    
    messageText += `👤 *Renseignements Client* :\n`;
    messageText += `• *Nom & Prénom :* ${details.fullName}\n`;
    messageText += `• *Téléphone :* ${details.phone}\n`;
    messageText += `• *Gouvernorat :* ${details.city}\n`;
    messageText += `• *Mode choisi :* ${
      details.deliveryMethod === 'louage' 
        ? '🚚 Envoi par Louage Intervilles' 
        : '🏪 Retrait physique au magasin Bavarian Parts'
    }\n\n`;
    
    messageText += `Merci de valider de suite ma réservation sur WhatsApp Business !`;

    // Final Link Generation
    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // Clear cart or redirect
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/90 backdrop-blur-sm">
      {/* Sidebar Box Backdrop alignment right */}
      <div 
        className="w-full max-w-lg bg-[#0a0a0a] border-l border-white/10 h-full flex flex-col p-6 shadow-2xl relative animate-slide-in overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header control */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#00a75d]" />
            <h2 className="font-display text-sm font-bold text-white uppercase tracking-widest font-heading">Mon Panier d&apos;Occasions</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded bg-white/5 border border-white/10 p-1.5 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          /* Empty State Displayed */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="h-16 w-16 bg-white/5 border border-white/10 rounded flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-white/20" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">Votre panier est vide</h3>
            <p className="text-xs text-white/40 mt-1 max-w-[250px] uppercase tracking-wide">
              Explorez nos pièces d&apos;auto testées et ajoutez-les pour commander.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#00a75d] hover:bg-white/10 cursor-pointer"
            >
              Retourner à la boutique
            </button>
          </div>
        ) : (
          /* Cart active elements list */
          <div className="flex-1 flex flex-col py-4 justify-between h-full">
            
            {/* Scrollable products list */}
            <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex items-center gap-3 bg-[#050505] border border-white/10 p-3 rounded relative group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="h-14 w-14 rounded object-cover bg-black border border-white/10 animate-fade-in"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-extrabold text-[#00a75d] uppercase block mb-0.5">{item.product.category}</span>
                    <h4 className="text-xs font-bold text-white truncate leading-snug">{item.product.title}</h4>
                    <span className="text-[10px] text-white/40 block font-mono">
                      {item.product.brand} {item.product.model} ({item.product.year})
                    </span>
                    <span className="font-mono text-xs text-[#00a75d] font-bold tracking-wide">
                      {formatPrice(item.product.price)} TND
                    </span>
                  </div>

                  {/* Quantity adjustments */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="h-6 w-6 rounded bg-white/5 text-slate-300 flex items-center justify-center font-bold text-xs hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-semibold text-white w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="h-6 w-6 rounded bg-white/5 text-slate-300 flex items-center justify-center font-bold text-xs hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Detach basket click */}
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-white/40 hover:text-red-400 p-1 transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Split row / Tunisian checkout form details */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-4 border-t border-white/10 mt-4">
              
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#00a75d] flex items-center gap-1.5 font-mono">
                <span>Détails & Mode de livraison (Louage / Retrait)</span>
              </h3>

              {validationError && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded p-2.5 text-xs text-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#e31837]" />
                  <p>{validationError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                
                {/* Full name input */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 font-mono">
                    Nom & Prénom du destinataire <span className="text-[#e31837]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={details.fullName}
                    onChange={(e) => setDetails({ ...details, fullName: e.target.value })}
                    placeholder="Ex: Bilel Trabelsi"
                    className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#00a75d]"
                  />
                </div>

                {/* Tunisian Phone number */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 font-mono">
                    N° Téléphone Tunisie <span className="text-[#e31837]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={details.phone}
                    onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                    placeholder="Ex: 98 765 432"
                    className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#00a75d] font-mono"
                  />
                </div>

                {/* Tunisian Governorates Dropdown */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 font-mono">
                    Gouvernorat de livraison <span className="text-[#e31837]">*</span>
                  </label>
                  <select
                    value={details.city}
                    onChange={(e) => setDetails({ ...details, city: e.target.value })}
                    className="w-full rounded border border-white/10 bg-[#050505] px-3 py-2 text-xs text-white outline-none focus:border-[#00a75d]"
                  >
                    {TUNISIAN_GOVERNORATES.map((g) => (
                      <option key={g} value={g} className="bg-[#0a0a0a] text-whiteValue">{g}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Delivery Select Method Option (Louage within Tunisia or direct store pick) */}
              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono">
                  Sélectionner l&apos;option de récupération
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  
                  {/* Option 1: Louage Express within Tunisia */}
                  <button
                    type="button"
                    onClick={() => setDetails({ ...details, deliveryMethod: 'louage' })}
                    className={`flex items-center gap-2 p-2 rounded border text-left transition-all cursor-pointer ${
                      details.deliveryMethod === 'louage'
                        ? 'bg-[#00a75d]/15 border-[#00a75d] text-white'
                        : 'border-white/10 bg-[#050505] text-white/45 hover:border-white/20'
                    }`}
                  >
                    <Truck className="h-4.5 w-4.5 shrink-0 text-[#00a75d]" />
                    <div>
                      <span className="text-[11px] font-bold block uppercase tracking-wide">Via Louage</span>
                      <span className="text-[8px] text-white/40 block mt-0.5 uppercase tracking-normal">Directement (+12 TND)</span>
                    </div>
                  </button>

                  {/* Option 2: Pickup in local tuning store */}
                  <button
                    type="button"
                    onClick={() => setDetails({ ...details, deliveryMethod: 'pickup' })}
                    className={`flex items-center gap-2 p-2 rounded border text-left transition-all cursor-pointer ${
                      details.deliveryMethod === 'pickup'
                        ? 'bg-[#00a75d]/15 border-[#00a75d] text-white'
                        : 'border-white/10 bg-[#050505] text-white/45 hover:border-white/20'
                    }`}
                  >
                    <MapPin className="h-4.5 w-4.5 shrink-0 text-[#00a75d]" />
                    <div>
                      <span className="text-[11px] font-bold block uppercase tracking-wide">Retrait Magasin</span>
                      <span className="text-[8px] text-white/40 block mt-0.5 uppercase tracking-normal">Ben Arous (Gratuit)</span>
                    </div>
                  </button>

                </div>
              </div>

              {/* Pricing Overview Invoice Details */}
              <div className="bg-[#050505] border border-white/10 rounded p-3 text-xs">
                
                <div className="flex justify-between uppercase tracking-widest text-[9px] font-bold text-white/40 font-mono">
                  <span>Sous-total articles :</span>
                  <span className="font-mono text-white/80">{formatPrice(subtotal)} TND</span>
                </div>
                
                <div className="flex justify-between uppercase tracking-widest text-[9px] font-bold text-white/40 font-mono mt-1">
                  <span>Envoi express Louage :</span>
                  <span className="font-mono text-white/80">
                    {details.deliveryMethod === 'louage' ? `+ ${formatPrice(deliveryCost)} TND` : 'En magasin (Gratuit)'}
                  </span>
                </div>

                <div className="h-[1px] bg-white/10 my-2" />

                <div className="flex justify-between items-baseline font-mono">
                  <span className="font-sans font-extrabold text-white text-xs uppercase tracking-widest">Total Net à payer :</span>
                  <div className="flex items-baseline gap-0.5 text-lg font-bold text-[#00a75d]">
                    <span>{formatPrice(total)}</span>
                    <span className="text-[10px] font-mono text-white/40 font-bold">TND</span>
                  </div>
                </div>

              </div>

              {/* Submit Final Checkout on WhatsApp */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded bg-[#00a75d] hover:bg-[#008f4c] text-white py-3.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#00a75d]/20 active:scale-95"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                <span>Finaliser sur WhatsApp Business (TND)</span>
              </button>

              <p className="text-[9px] text-white/20 text-center uppercase tracking-wider block leading-normal font-mono">
                Redirection sécurisée vers WhatsApp Business pour confirmer l&apos;affectation.
              </p>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}
