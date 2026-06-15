import React, { useState, useRef } from 'react';
import { Product, AdminSettings, PartCategory, ProductCondition } from '../types';
import { CATEGORIES, CHASSIS_LIST, BRANDS, MODELS_BY_BRAND, YEARS } from '../data';
import { Plus, Edit2, Trash2, Settings, Smartphone, MapPin, Sparkles, CheckCircle, AlertOctagon, Image, Video, ShieldCheck, KeyRound } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  settings: AdminSettings;
  setSettings: (settings: AdminSettings) => void;
}

const PRESET_IMAGES = [
  { name: 'Volant Sport Carbone', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800' },
  { name: 'Phares LED Angel Eyes', url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Pare-choc Sport M-Tech', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Echappement double M-Perf', url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800' },
  { name: 'Moteur BMW 6-cylindre M54', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Jantes M-Tech Anthracite', url: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80&w=800' }
];

const BG_PRESET_IMAGES = [
  { name: 'M3 Face Bleue', url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=1920' },
  { name: 'Série 4 M-Perf', url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1920' },
  { name: 'BMW Phares Anguleux', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1920' },
  { name: 'M3 Vintage E30', url: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&q=80&w=1920' }
];

export default function AdminPanel({
  products,
  setProducts,
  settings,
  setSettings
}: AdminPanelProps) {
  // Form States for Product Add/Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [oemRef, setOemRef] = useState('');
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const [condition, setCondition] = useState<ProductCondition>('Neuf');
  const [category, setCategory] = useState<PartCategory>('Carrosserie / Body');
  const [compatibility, setCompatibility] = useState<string[]>([]);
  const [inStock, setInStock] = useState(true);
  const [brand, setBrand] = useState('BMW');
  const [model, setModel] = useState('Série 3');
  const [year, setYear] = useState('2018');

  // Camera integration states
  const [useCamera, setUseCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Settings form states
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [storeLocation, setStoreLocation] = useState(settings.storeLocation);
  const [adminPassword, setAdminPassword] = useState(settings.adminPassword || 'admin');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(settings.backgroundImageUrl || '');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Feedback flags
  const [productSuccess, setProductSuccess] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setUseCamera(true);
    } catch (err) {
      alert("Impossible d'accéder à l'appareil photo/caméra. Veuillez vérifier les permissions d'accès.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setUseCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setImage(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }
    }
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocalVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setVideo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChassisToggle = (m: string) => {
    setCompatibility((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const handleApplyPresetImage = (url: string) => {
    setImage(url);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setProductSuccess('');
    setErrorMsg('');

    if (!title.trim() || !price || !oemRef.trim()) {
      setErrorMsg('Veuillez remplir le titre, le prix, et la référence OEM.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Veuillez saisir un prix valide supérieur à 0.');
      return;
    }

    const yearNum = parseInt(year) || 2018;

    if (editingId) {
      // Modify existing product
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                title,
                description,
                price: priceNum,
                oemRef,
                image: image.trim() || PRESET_IMAGES[4].url,
                video: video.trim(),
                condition,
                category,
                compatibility: compatibility.length > 0 ? compatibility : [model],
                inStock,
                brand,
                model,
                year: yearNum
              }
            : p
        )
      );
      setProductSuccess('Pièce d\'auto modifiée avec succès !');
    } else {
      // Add a clean new product
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        title,
        description,
        price: priceNum,
        oemRef,
        image: image.trim() || PRESET_IMAGES[0].url,
        video: video.trim(),
        condition,
        category,
        compatibility: compatibility.length > 0 ? compatibility : [model],
        inStock,
        createdAt: new Date().toISOString(),
        brand,
        model,
        year: yearNum
      };
      setProducts((prev) => [newProduct, ...prev]);
      setProductSuccess('Nouvelle pièce auto ajoutée à l\'inventaire avec succès !');
    }

    // Reset Form
    clearProductForm();
    setTimeout(() => {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const clearProductForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setOemRef('');
    setImage('');
    setVideo('');
    setCondition('Neuf');
    setCategory('Carrosserie / Body');
    setCompatibility([]);
    setInStock(true);
    setBrand('BMW');
    setModel('Série 3');
    setYear('2018');
    setErrorMsg('');
    setDeleteConfirmId(null);
  };

  const handleEditProductClick = (p: Product) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setPrice(p.price.toString());
    setOemRef(p.oemRef);
    setImage(p.image);
    setVideo(p.video || '');
    setCondition(p.condition);
    setCategory(p.category);
    setCompatibility(p.compatibility || []);
    setInStock(p.inStock);
    setBrand(p.brand || 'BMW');
    setModel(p.model || 'Série 3');
    setYear((p.year || 2018).toString());
    setErrorMsg('');
    setProductSuccess('');
    setDeleteConfirmId(null);
    
    // Scroll form into focus view smoothly
    document.getElementById('product-form-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteProduct = (productId: string) => {
    const p = products.find((prod) => prod.id === productId);
    const label = p ? p.title : "cette pièce";
    if (window.confirm(`Voulez-vous vraiment supprimer définitivement "${label}" ?`)) {
      setProducts((prev) => prev.filter((prod) => prod.id !== productId));
      setProductSuccess(`La pièce "${label}" a été retirée de l'inventaire avec succès.`);
      setTimeout(() => setProductSuccess(''), 4000);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess('');
    if (!whatsappNumber.trim()) {
      alert('Veuillez insérer un numéro pour le renvoi WhatsApp.');
      return;
    }
    setSettings({
      whatsappNumber,
      storeLocation,
      adminPassword: adminPassword.trim() || 'admin',
      backgroundImageUrl: backgroundImageUrl.trim()
    });
    setSettingsSuccess('Paramètres de l\'administration sauvegardés avec succès !');
    setTimeout(() => setSettingsSuccess(''), 4000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#050505]" id="admin-workspace">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-8 border-b border-white/10 mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#0066b2] font-mono">Console de Gestion Opisto-Style</span>
          <h1 className="font-display text-2xl font-light text-white uppercase mt-1">Espace Recyclage & <span className="font-bold italic text-[#0066b2]">E-Commerce</span></h1>
          <p className="text-white/40 text-xs uppercase tracking-wider mt-1">Gérez vos stocks, mettez à jour la disponibilité en ligne et réglez vos codes d&apos;accès.</p>
        </div>
        <div className="mt-4 md:mt-0 font-mono text-xs text-white/50 bg-white/5 px-4.5 py-2.5 rounded border border-white/10 flex items-center gap-2">
          <CheckCircle className="h-4.5 w-4.5 text-[#0066b2]" />
          <span>Statut : Connecté en temps réel</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column (FORM) - Add & Edit products */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6 shadow-xl" id="product-form-card">
            <h3 className="font-display text-base font-bold text-white mb-6 uppercase flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#0066b2]" />
              <span>{editingId ? 'Modifier la fiche produit' : 'Publier une nouvelle pièce d\'auto'}</span>
            </h3>

            {productSuccess && (
              <div className="mb-6 rounded bg-[#0066b2]/10 border border-[#0066b2]/20 p-4 text-xs font-bold uppercase tracking-wider text-[#0066b2] flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#0066b2] shrink-0" />
                <span>{productSuccess}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 rounded bg-red-500/10 border border-red-500/20 p-4 text-xs font-bold uppercase tracking-wider text-red-100 flex items-center gap-2">
                <AlertOctagon className="h-5 w-5 text-[#e31837] shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product Title */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1.5 font-mono">
                    Titre descriptif de la pièce d&apos;auto <span className="text-[#e31837]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Phare Angel Eyes, Volant Sport, Pare-choc M-Tech d'E46, etc."
                    className="w-full rounded border border-white/10 bg-[#050505] px-4 py-2.5 text-sm text-slate-250 focus:border-[#0066b2] outline-none"
                  />
                </div>

                {/* Brand Selection */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1.5 font-mono flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0066b2] animate-pulse"></span>
                    <span>Marque Spécialité Constructeur <span className="text-[#e31837]">*</span></span>
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => {
                      setBrand(e.target.value);
                    }}
                    className="w-full rounded border border-white/10 bg-[#050505] px-4 py-2.5 text-sm text-[#0066b2] font-semibold focus:border-[#0066b2] outline-none"
                  >
                    <option value="BMW" className="bg-[#0a0a0a]">BMW (Constructeur Exclusif)</option>
                  </select>
                </div>

                {/* Model Selection */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1.5 font-mono">
                    Chassis BMW <span className="text-[#e31837]">*</span>
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full rounded border border-white/10 bg-[#050505] px-4 py-2.5 text-sm text-[#0066b2] font-mono font-bold focus:border-[#0066b2] outline-none"
                  >
                    {(MODELS_BY_BRAND['BMW'] || []).map((mo) => (
                      <option key={mo} value={mo} className="bg-[#0a0a0a]">{mo}</option>
                    ))}
                  </select>
                </div>

                {/* Manufactured Year Selection */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1.5 font-mono">
                    Année de fabrication <span className="text-[#e31837]">*</span>
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full rounded border border-white/10 bg-[#050505] px-4 py-2.5 text-sm text-slate-200 focus:border-[#0066b2] outline-none font-mono"
                  >
                    {YEARS.map((yr) => (
                      <option key={yr} value={yr} className="bg-[#0a0a0a]">{yr}</option>
                    ))}
                  </select>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1.5 font-mono">
                    Catégorie de Pièce (Piece Part)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PartCategory)}
                    className="w-full rounded border border-white/10 bg-[#050505] px-4 py-2.5 text-sm text-slate-200 focus:border-[#0066b2] outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0a0a0a]">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Pricing (Tunisian Dinars) */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1.5 font-mono">
                    Prix public de vente (TND) <span className="text-[#e31837]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      required
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Ex: 850"
                      className="w-full rounded border border-white/10 bg-[#050505] pl-4 pr-12 py-2.5 text-sm text-slate-100 placeholder-white/20 focus:border-[#0066b2] outline-none font-mono"
                    />
                    <span className="absolute right-4 font-bold text-xs text-white/40 font-mono">TND</span>
                  </div>
                </div>

                {/* OEM REF */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1.5 font-mono">
                    Référence d&apos;origine OEM Code <span className="text-[#e31837]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={oemRef}
                    onChange={(e) => setOemRef(e.target.value)}
                    placeholder="Ex: PG-208-AMP"
                    className="w-full rounded border border-white/10 bg-[#050505] px-4 py-2.5 text-sm text-slate-200 focus:border-[#0066b2] outline-none font-mono uppercase"
                  />
                </div>

                {/* Condition Toggle */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1.5 font-mono">
                    État Général de la pièce
                  </label>
                  <div className="flex rounded bg-[#050505] border border-white/10 p-1">
                    <button
                      type="button"
                      onClick={() => setCondition('Neuf')}
                      className={`flex-1 rounded py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        condition === 'Neuf'
                          ? 'bg-[#0066b2] text-white shadow font-bold'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Neuf (Emballage constructeur)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondition('Occasion')}
                      className={`flex-1 rounded py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        condition === 'Occasion'
                          ? 'bg-[#0066b2] text-white shadow font-bold'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Recyclé / Occasion (Garantie Bavarian)
                    </button>
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="md:col-span-2 space-y-3">
                  <label className="block text-[10px] uppercase font-bold text-white/40 tracking-widest font-mono">
                    Photo de la Pièce <span className="text-[#e31837]">*</span>
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0a0a0a] border border-white/10 rounded-lg p-4">
                    {/* Left: preview and source choice */}
                    <div className="space-y-3">
                      <div className="flex flex-col gap-2">
                        <label className="block text-[9px] uppercase font-semibold text-white/50 font-mono">Source de l&apos;image :</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button 
                            type="button" 
                            onClick={() => { stopCamera(); }}
                            className="bg-black border border-white/10 rounded py-1 px-2 text-[9px] text-white hover:border-[#0066b2]"
                          >
                            Lien URL
                          </button>
                          <label className="bg-black border border-white/10 rounded py-1 px-2 text-[9px] text-white hover:border-[#0066b2] cursor-pointer text-center block">
                            Fichier
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleLocalImageUpload} 
                              className="hidden" 
                            />
                          </label>
                          <button 
                            type="button" 
                            onClick={startCamera}
                            className="bg-black border border-white/10 rounded py-1 px-2 text-[9px] text-white hover:border-[#0066b2]"
                          >
                            Caméra
                          </button>
                        </div>
                      </div>

                      {/* Webcam Stream Camera panel if open */}
                      {useCamera && (
                        <div className="border border-[#0066b2]/30 rounded overflow-hidden bg-black p-2.5 space-y-2 relative">
                          <video ref={videoRef} className="w-full aspect-video pr-0 mr-0 bg-neutral-900 rounded" playsInline muted></video>
                          <div className="flex gap-2">
                            <button 
                              type="button" 
                              onClick={capturePhoto} 
                              className="flex-1 rounded bg-[#0066b2] text-white py-1.5 text-[10px] uppercase font-bold tracking-widest"
                            >
                              Prendre Photo
                            </button>
                            <button 
                              type="button" 
                              onClick={stopCamera} 
                              className="px-3 rounded bg-white/10 text-white py-1.5 text-[10px] uppercase font-bold tracking-widest"
                            >
                              Fermer
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Manual Image URL field */}
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => { stopCamera(); setImage(e.target.value); }}
                        placeholder="Insérez ou collez un lien d&apos;image (ex: https://...)"
                        className="w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-200 focus:border-[#0066b2] outline-none"
                      />
                    </div>
                    
                    {/* Live Frame Preview */}
                    <div className="flex flex-col items-center justify-center border border-dashed border-white/10 bg-black/40 rounded p-4 text-center">
                      {image ? (
                        <div className="relative group">
                          <img src={image} className="max-h-28 rounded object-cover border border-white/10" referrerPolicy="no-referrer" alt="Aperçu upload" />
                          <button 
                            type="button" 
                            onClick={() => setImage('')} 
                            className="absolute -top-1.5 -right-1.5 bg-red-650 rounded-full text-white text-[9px] h-4 w-4 flex items-center justify-center font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="text-white/25 select-none space-y-1">
                          <Image className="h-8 w-8 mx-auto" />
                          <span className="text-[10px] block font-mono">Aucun visuel chargé</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preset images panel */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block font-mono">Presets Rapides BMW :</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 col-gap">
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => { stopCamera(); handleApplyPresetImage(preset.url); }}
                          className={`flex items-center gap-1.5 p-1 px-2.5 text-[9px] text-slate-300 rounded border bg-white/5 truncate transition-all cursor-pointer ${
                            image === preset.url
                              ? 'border-[#0066b2] text-white bg-[#0066b2]/20 font-bold'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0066b2] shrink-0"></span>
                          <span className="truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Video Upload Section */}
                <div className="md:col-span-2 space-y-3">
                  <label className="block text-[10px] uppercase font-bold text-white/40 tracking-widest font-mono">
                    Vidéo de la Pièce / Showroom (Optionnel)
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0a0a0a] border border-white/10 rounded-lg p-4 font-mono">
                    <div className="space-y-3">
                      <div className="flex flex-col gap-2">
                        <label className="block text-[9px] uppercase font-semibold text-white/50">Mode d&apos;intégration :</label>
                        <div className="flex gap-2">
                          <label className="bg-black border border-white/10 rounded py-1 px-2 text-[9px] text-white hover:border-[#0066b2] cursor-pointer text-center inline-block">
                            Télécharger Fichier Vidéo Local
                            <input 
                              type="file" 
                              accept="video/*" 
                              onChange={handleLocalVideoUpload} 
                              className="hidden" 
                            />
                          </label>
                        </div>
                      </div>

                      <input
                        type="url"
                        value={video}
                        onChange={(e) => setVideo(e.target.value)}
                        placeholder="Ou collez un lien vidéo (mp4, youtube, etc.)"
                        className="w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-200 focus:border-[#0066b2] outline-none"
                      />
                    </div>

                    <div className="flex flex-col items-center justify-center border border-dashed border-white/10 bg-black/40 rounded p-4 text-center">
                      {video ? (
                        <div className="space-y-1.5">
                          <video src={video} className="max-h-20 aspect-video rounded bg-black" controls muted />
                          <button 
                            type="button" 
                            onClick={() => setVideo('')} 
                            className="text-red-500 font-mono text-[9px] uppercase font-bold hover:underline"
                          >
                            Retirer la vidéo
                          </button>
                        </div>
                      ) : (
                        <div className="text-white/20 select-none space-y-1">
                          <Video className="h-8 w-8 mx-auto" />
                          <span className="text-[10px] block font-mono">Aucun clip vidéo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Compatibility Chassis List */}
                <div className="md:col-span-2 border border-white/10 rounded bg-white/5 p-4 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block pb-1 border-b border-white/10 font-mono">
                    Spécifier les Codes Châssis de compatibilité additionnels (BMW/Autres)
                  </span>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {CHASSIS_LIST.map((cls) => {
                      const active = compatibility.includes(cls);
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => handleChassisToggle(cls)}
                          className={`flex items-center justify-center rounded border py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                            active
                              ? 'bg-[#0066b2] border-[#0066b2] text-white'
                              : 'border-white/10 bg-[#050505] text-white/40 hover:border-white/20'
                          }`}
                        >
                          {cls}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[9px] text-white/30 block tracking-wider uppercase">
                    Si aucun code n’est sélectionné, le modèle saisi ({model}) sera pris par défaut.
                  </span>
                </div>

                {/* Description Textarea */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1.5 font-mono">
                    Description & Spécifications de la pièce
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Saisissez l'état exact, les garanties de reprise, le type de moteur, la cylindrée, etc."
                    className="w-full rounded border border-white/10 bg-[#050505] px-4 py-2.5 text-xs text-slate-200 focus:border-[#0066b2] outline-none"
                  />
                </div>

                {/* In Stock toggle (AVAILABILITY CONTROL) */}
                <div className="md:col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="stock-toggle"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="h-4 w-4 rounded border-white/10 bg-[#050505] text-[#0066b2] focus:ring-[#0066b2] focus:ring-offset-black cursor-pointer"
                  />
                  <label htmlFor="stock-toggle" className="text-xs uppercase font-extrabold text-white/70 tracking-wider cursor-pointer font-mono">
                    Afficher en STOCK sur le site web 
                    <span className="ml-2 font-normal text-white/40 text-[10px] uppercase">(Décochez pour afficher&nbsp;&lsquo;Rupture de Stock&rsquo;)</span>
                  </label>
                </div>

              </div>

              {/* Actions row footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded bg-[#0066b2] hover:bg-[#1842a8] text-white py-3.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>{editingId ? 'Mettre à jour la pièce' : 'Publier sur la Boutique Auto'}</span>
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={clearProductForm}
                    className="rounded border border-white/10 bg-[#050505] text-slate-300 px-6 py-3.5 text-[10px] font-bold tracking-widest uppercase hover:bg-white/10 cursor-pointer"
                  >
                    Annuler
                  </button>
                )}
              </div>

            </form>
          </div>

        </div>

        {/* Right Column - Shop Settings & Stats */}
        <div className="space-y-8">
          
          {/* Settings Card WITH custom administrator login password configuration block */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6 shadow-xl">
            <h3 className="font-display text-xs font-bold text-white mb-5 uppercase flex items-center gap-2">
              <Settings className="h-4.5 w-4.5 text-[#0066b2]" />
              <span>Paramètres de l&apos;Administration</span>
            </h3>

            {settingsSuccess && (
              <div className="mb-4 rounded bg-emerald-500/10 border border-emerald-500/20 p-3 text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{settingsSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              
              {/* WhatsApp number setting */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#0066b2] mb-1 font-mono">
                  Numéro WhatsApp Tunisie <span className="text-[#e31837]">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-white/30">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Ex: +21699123456"
                    className="w-full rounded border border-white/10 bg-[#050505] pl-9 pr-3 py-2 text-xs text-white placeholder-white/10 font-mono outline-none focus:border-[#0066b2]"
                  />
                </div>
              </div>

              {/* Physical store location */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#0066b2] mb-1 font-mono">
                  Adresse de Retrait des Pièces
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-white/30">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={storeLocation}
                    onChange={(e) => setStoreLocation(e.target.value)}
                    placeholder="Ex: Sousse, Tunisie"
                    className="w-full rounded border border-white/10 bg-[#050505] pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#0066b2]"
                  />
                </div>
              </div>

              {/* SITE BACKGROUND IMAGE (REQUESTED FEATURE: OPTION TO EDIT FROM THE ADMIN ACCOUNT) */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#0066b2] mb-1 font-mono">
                  URL de l&apos;Arrière-plan (Fonds d&apos;Écran BMWs)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-white/30">
                    <Image className="h-4 w-4" />
                  </div>
                  <input
                    type="url"
                    value={backgroundImageUrl}
                    onChange={(e) => setBackgroundImageUrl(e.target.value)}
                    placeholder="Ex: https://images.unsplash.com/photo-..."
                    className="w-full rounded border border-white/10 bg-[#050505] pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#0066b2]"
                  />
                </div>
                <span className="text-[8px] text-white/30 block mt-1 uppercase tracking-wider mb-2">
                  Permet de changer l&apos;image du bandeau principal avec de belles voitures BMW.
                </span>

                {/* Quick background presets selector panel */}
                <div className="space-y-1 pt-1">
                  <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest block font-mono">Fonds d&apos;écran rapides BMW :</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {BG_PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setBackgroundImageUrl(preset.url)}
                        className={`text-[9px] font-semibold rounded py-1 px-1.5 border text-center transition-all truncate cursor-pointer ${
                          backgroundImageUrl === preset.url
                            ? 'bg-[#0066b2]/20 border-[#0066b2] text-white font-bold'
                            : 'bg-[#101010] border-white/10 text-white/50 hover:text-white hover:border-white/20'
                        }`}
                        title={preset.name}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* NEW ADMNIN PASSWORD SETTING (REQUESTED FLOW) */}
              <div className="pt-2 border-t border-white/10">
                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#0066b2] mb-1 font-mono flex items-center gap-1">
                  <KeyRound className="h-3 w-3 text-blue-400" />
                  <span>Changer le code d&apos;accès Admin</span>
                </label>
                <input
                  type="text"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="admin"
                  className="w-full rounded border border-white/10 bg-[#050505] px-3 py-2 text-xs text-white outline-none focus:border-[#0066b2] font-mono text-center tracking-widest font-bold"
                />
                <span className="text-[8px] text-white/30 block mt-1 uppercase tracking-wider">
                  Remplace le mot de passe &quot;admin&quot; par défaut pour votre prochaine reconnexion.
                </span>
              </div>

              <button
                type="submit"
                className="w-full rounded bg-[#0066b2] hover:bg-[#1842a8] text-white py-2.5 text-xs font-bold tracking-widest transition-all uppercase cursor-pointer"
              >
                Mettre à jour les accès & Paramètres
              </button>

            </form>
          </div>

          {/* Quick Stats overview */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6 text-xs space-y-3 shadow-md border-faded">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-widest pb-2 border-b border-white/10">
              Statistiques du Catalogue
            </h4>
            
            <div className="flex justify-between text-white/40 uppercase tracking-widest text-[9px] font-bold">
              <span>Pièces à l&apos;état Neuf :</span>
              <span className="font-mono text-emerald-400 font-bold">
                {products.filter((p) => p.condition === 'Neuf').length}
              </span>
            </div>

            <div className="flex justify-between text-white/40 uppercase tracking-widest text-[9px] font-bold">
              <span>Pièces à l&apos;état d&apos;Occasion :</span>
              <span className="font-mono text-amber-400 font-bold">
                {products.filter((p) => p.condition === 'Occasion').length}
              </span>
            </div>

            <div className="flex justify-between text-white/40 uppercase tracking-widest text-[9px] font-bold">
              <span>Articles en rupture :</span>
              <span className="font-mono text-[#e31837] font-bold">
                {products.filter((p) => !p.inStock).length} articles
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Catalogue listing with delete/modify tools */}
      <div className="mt-12 bg-[#0a0a0a] border border-white/10 rounded-lg p-6 shadow-xl" id="catalog-section">
        <h3 className="font-display text-base font-bold text-white mb-6 uppercase">Liste Actuelle des Pièces d&apos;Auto</h3>
        
        <div className="overflow-x-auto border border-white/10 rounded-lg w-full">
          <table className="w-full text-left text-xs text-white/60">
            <thead className="border-b border-white/10 bg-[#050505] uppercase tracking-widest text-white/40 text-[9px]">
              <tr>
                <th className="py-3 px-4 font-bold">Aperçu</th>
                <th className="py-3 px-4 font-bold">Titre / Réf OEM</th>
                <th className="py-3 px-4 font-bold">Catégorie</th>
                <th className="py-3 px-4 font-bold">État / Affectation</th>
                <th className="py-3 px-4 text-right font-bold">Prix (TND)</th>
                <th className="py-3 px-4 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors leading-normal group">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <img
                      src={p.image}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 object-cover rounded bg-black border border-white/10"
                    />
                  </td>
                  <td className="py-3 px-4 truncate max-w-[200px]">
                    <span className="font-bold text-white truncate block">{p.title}</span>
                    <span className="font-mono text-[9px] text-white/40 font-medium">OEM: {p.oemRef}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-white/60 text-[10px] uppercase tracking-wider font-semibold">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.5 inline-block text-center max-w-[70px] border ${
                            p.condition === 'Neuf' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {p.condition}
                        </span>
                        {!p.inStock && (
                          <span className="text-[9px] font-bold uppercase rounded px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/25">
                            Rupture
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[#0066b2] font-bold truncate max-w-[150px]">
                        {p.brand} {p.model} ({p.year})
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-bold text-white">
                    {p.price.toLocaleString('fr-TN')} TND
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap bg-transparent">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleEditProductClick(p)}
                        className="flex items-center justify-center h-8 w-8 rounded bg-white/5 border border-white/10 hover:border-[#0066b2]/35 hover:text-[#0066b2] text-white/60 transition-colors cursor-pointer"
                        title="Modifier"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="flex items-center justify-center h-8 w-8 rounded bg-white/5 border border-white/10 hover:border-[#e31837]/35 hover:text-[#e31837] text-white/40 transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-10 text-white/20 text-xs font-bold uppercase tracking-widest">
              Aucune pièce d&apos;auto n&apos;est publiée pour le moment.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
