'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CommerceMarketplacePage() {
  const [activeRole, setActiveRole] = useState<'FARMER' | 'SHOP_OWNER' | 'MECHANIC' | 'FPO_ADMIN'>('FARMER');
  const [activeTab, setActiveTab] = useState<
    'PRODUCTS' | 'BUSINESSES' | 'SPARE_PARTS' | 'SERVICES' | 'ENQUIRIES_QUOTES' | 'ORDERS' | 'MERCHANT_HUB' | 'DEMAND_RADAR'
  >('PRODUCTS');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedMachineBrand, setSelectedMachineBrand] = useState('ALL');
  const [selectedMachineModel, setSelectedMachineModel] = useState('ALL');

  // Modal / Action state
  const [buyModalProduct, setBuyModalProduct] = useState<any | null>(null);
  const [orderSuccessAlert, setOrderSuccessAlert] = useState<string | null>(null);
  const [quoteSuccessAlert, setQuoteSuccessAlert] = useState<string | null>(null);

  // Sample Products state
  const [products] = useState([
    {
      id: 'bp-001',
      productId: 'prod-001',
      name: 'John Deere Spin-on Engine Oil Filter',
      category: 'SPARE_PARTS',
      icon: '⚙️',
      brand: 'John Deere',
      model: '5310 / 5050D',
      sku: 'JD-FLT-5310',
      unit: 'PIECE',
      price: 480,
      stockQuantity: 45,
      reservedQuantity: 2,
      businessName: 'Sri Sai Agro Machinery & Spare Parts',
      businessVillage: 'Tangipalli',
      distanceKm: 2.1,
      rating: 4.8,
      verified: true,
      description: 'OEM high-efficiency cellulose micro-glass spin-on filter (Part No: RE519643)',
      compatibleModels: ['John Deere 5310', 'John Deere 5050D', 'John Deere 5045D'],
    },
    {
      id: 'bp-002',
      productId: 'prod-002',
      name: 'Finolex 3-inch Flexible Delivery Pipe (100ft)',
      category: 'PLUMBING',
      icon: '💧',
      brand: 'Finolex',
      model: 'Kisan Flex 3-inch',
      sku: 'FIN-PIPE-3IN',
      unit: 'PIECE',
      price: 2400,
      stockQuantity: 28,
      reservedQuantity: 0,
      businessName: 'Sri Sai Agro Machinery & Spare Parts',
      businessVillage: 'Tangipalli',
      distanceKm: 2.1,
      rating: 4.8,
      verified: true,
      description: 'Heavy duty woven braided PVC discharge hose for submersible & diesel pumps',
      compatibleModels: ['Kirloskar KDS-750 (7.5 HP)', 'Crompton 5 HP Borewell', 'Universal 3-inch'],
    },
    {
      id: 'bp-003',
      productId: 'prod-003',
      name: 'Aspee 12-Nozzle Brass Spray Boom Kit',
      category: 'FARM_EQUIPMENT',
      icon: '🌱',
      brand: 'Aspee',
      model: 'HTP-12B',
      sku: 'ASP-BOM-12',
      unit: 'SET',
      price: 3200,
      stockQuantity: 14,
      reservedQuantity: 1,
      businessName: 'Sri Sai Agro Machinery & Spare Parts',
      businessVillage: 'Tangipalli',
      distanceKm: 2.1,
      rating: 4.8,
      verified: true,
      description: 'Ceramic cone nozzles with anti-drip check valves and 12-meter manifold',
      compatibleModels: ['Aspee HTP Tractor Mount', 'Shaktiman Boom Sprayer'],
    },
    {
      id: 'bp-004',
      productId: 'prod-004',
      name: 'Havells 7.5 HP Submersible Control Panel',
      category: 'ELECTRICAL',
      icon: '⚡',
      brand: 'Havells',
      model: 'DOL-750-AP',
      sku: 'HAV-CP-750',
      unit: 'PIECE',
      price: 5600,
      stockQuantity: 12,
      reservedQuantity: 0,
      businessName: 'Tangipalli Rythu Seva Samithi Agro Mart',
      businessVillage: 'Tangipalli',
      distanceKm: 1.2,
      rating: 5.0,
      verified: true,
      description: 'Direct-on-line starter with dry-run protection, phase preventer & digital meter',
      compatibleModels: ['7.5 HP Submersible Motor', '10 HP Borewell Pump'],
    },
  ]);

  // Sample Businesses
  const [businesses] = useState([
    {
      id: 'biz-001',
      businessName: 'Sri Sai Agro Machinery & Spare Parts',
      businessType: 'SPARE_PARTS_SHOP',
      icon: '🏪',
      ownerName: 'Suresh Reddy',
      phone: '+91 98480 12345',
      village: 'Tangipalli',
      distanceKm: 2.1,
      rating: 4.8,
      totalReviews: 24,
      serviceRadiusKm: 25.0,
      branches: ['Main Workshop & Spares Depot', 'Tandur Mandi Branch'],
      services: ['Tractor Spares', 'Hydraulic Hose Crimping', 'Sprayer Parts', 'Filter Kits'],
      verified: true,
      tier: 'VERIFIED',
    },
    {
      id: 'biz-002',
      businessName: 'Ramesh Agri Mechanics & Pump Rewinding',
      businessType: 'MECHANIC',
      icon: '🔧',
      ownerName: 'Ramesh Goud',
      phone: '+91 98765 43210',
      village: 'Malkapur',
      distanceKm: 3.8,
      rating: 4.9,
      totalReviews: 48,
      serviceRadiusKm: 20.0,
      branches: ['Malkapur Main Shed', 'Mobile Farm Service Van'],
      services: ['Tractor Engine Overhaul', 'Borewell Pump Rewinding', 'On-Farm Breakdown Service'],
      verified: true,
      tier: 'GOLD',
    },
    {
      id: 'biz-003',
      businessName: 'Tangipalli Rythu Seva Samithi Agro Mart',
      businessType: 'AGRI_INPUT_SHOP',
      icon: '🏢',
      ownerName: 'FPO Executive Committee',
      phone: '+91 94401 22334',
      village: 'Tangipalli',
      distanceKm: 1.2,
      rating: 5.0,
      totalReviews: 86,
      serviceRadiusKm: 30.0,
      branches: ['Tangipalli Central Store'],
      services: ['Certified Seeds', 'Electrical Starters', 'Sprinkler Fittings', 'Bio-fertilizers'],
      verified: true,
      tier: 'GOLD',
    },
  ]);

  // Sample Services
  const [services] = useState([
    {
      id: 'svc-001',
      title: 'Tractor Engine & Hydraulic Diagnostic & Repair',
      category: 'Machinery & Tractor Repair',
      icon: '🚜',
      businessName: 'Ramesh Agri Mechanics & Pump Rewinding',
      phone: '+91 98765 43210',
      village: 'Malkapur',
      distanceKm: 3.8,
      rating: 4.9,
      pricingModel: 'INSPECTION_FIRST',
      inspectionFee: 500,
      hourlyRate: 180,
      serviceRadiusKm: 25,
      description: 'On-farm or workshop inspection, fuel pump calibration & hydraulic lift pressure test',
    },
    {
      id: 'svc-002',
      title: 'Submersible Agricultural Borewell Pump Rewinding',
      category: 'Pump & Motor Rewinding',
      icon: '💧',
      businessName: 'Ramesh Agri Mechanics & Pump Rewinding',
      phone: '+91 98765 43210',
      village: 'Malkapur',
      distanceKm: 3.8,
      rating: 4.9,
      pricingModel: 'FIXED',
      inspectionFee: 300,
      basePrice: 2800,
      serviceRadiusKm: 20,
      description: 'Pure copper wire rewinding, thrust bearing replacement, and 6-month seasonal warranty',
    },
    {
      id: 'svc-003',
      title: 'Agricultural Implement Welding & Trailer Fabrication',
      category: 'Agricultural Welding & Fabrication',
      icon: '🔥',
      businessName: 'Sri Sai Agro Machinery & Spare Parts',
      phone: '+91 98480 12345',
      village: 'Tangipalli',
      distanceKm: 2.1,
      rating: 4.8,
      pricingModel: 'PER_HOUR',
      inspectionFee: 200,
      hourlyRate: 250,
      basePrice: 350,
      serviceRadiusKm: 15,
      description: 'Arc & MIG welding for cracked drawbars, rotavator flange welding, and trailer chassis repair',
    },
  ]);

  // Sample Orders
  const [orders, setOrders] = useState([
    {
      id: 'ord-001',
      orderNumber: 'ORD-2026-001',
      buyerName: 'Ravi Kumar (Cotton Farmer)',
      sellerBusinessName: 'Sri Sai Agro Machinery & Spare Parts',
      fulfillmentMethod: 'PICKUP',
      subtotal: 960,
      deliveryCost: 0,
      total: 960,
      status: 'CONFIRMED',
      items: [
        { name: 'John Deere Spin-on Engine Oil Filter', quantity: 2, price: 480 },
      ],
      orderedAt: '2026-09-08 09:30 AM',
    },
    {
      id: 'ord-002',
      orderNumber: 'ORD-2026-002',
      buyerName: 'Anjaiah B (Redgram Farmer)',
      sellerBusinessName: 'Tangipalli Rythu Seva Samithi Agro Mart',
      fulfillmentMethod: 'LOCAL_DELIVERY',
      subtotal: 5600,
      deliveryCost: 150,
      total: 5750,
      status: 'PROCESSING',
      items: [
        { name: 'Havells 7.5 HP Submersible Control Panel', quantity: 1, price: 5600 },
      ],
      orderedAt: '2026-09-08 11:15 AM',
    },
  ]);

  // Sample Quotes
  const [quotes, setQuotes] = useState([
    {
      id: 'qte-001',
      enquiryId: 'enq-001',
      businessName: 'Sri Sai Agro Machinery & Spare Parts',
      buyerName: 'Ravi Kumar',
      message: 'Need 200ft 3-inch delivery hose + 4 brass clamps + farm delivery',
      subtotal: 4800,
      deliveryCost: 200,
      discount: 200,
      total: 4800,
      validUntil: '2026-09-18',
      status: 'SUBMITTED',
      notes: 'Includes 4 MS brass hose clamps and farm trailer delivery to Tangipalli farm',
    },
  ]);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleBuyProduct = (product: any, method: 'PICKUP' | 'LOCAL_DELIVERY') => {
    const deliveryCost = method === 'LOCAL_DELIVERY' ? 150 : 0;
    const newOrder = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      orderNumber: `ORD-2026-${Date.now().toString().slice(-3)}`,
      buyerName: 'Ravi Kumar (Logged-in Farmer)',
      sellerBusinessName: product.businessName,
      fulfillmentMethod: method,
      subtotal: product.price,
      deliveryCost,
      total: product.price + deliveryCost,
      status: 'CONFIRMED',
      items: [{ name: product.name, quantity: 1, price: product.price }],
      orderedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setOrders([newOrder, ...orders]);
    setBuyModalProduct(null);
    setOrderSuccessAlert(`Order placed successfully! Ref: ${newOrder.orderNumber}`);
    setActiveTab('ORDERS');
  };

  const handleAcceptQuote = (quoteId: string) => {
    setQuotes(
      quotes.map((q) => (q.id === quoteId ? { ...q, status: 'ACCEPTED' } : q)),
    );
    setQuoteSuccessAlert('Quotation accepted! Converted directly into confirmed Commerce Order.');
  };

  const handleAdvanceOrderStatus = (orderId: string, nextStatus: string) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)),
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-emerald-400 hover:underline font-bold text-lg">
              ← RuralConnect
            </Link>
            <span className="text-slate-600">/</span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏪</span>
              <h1 className="text-xl font-black tracking-tight text-white">
                Rural Commerce & Local Business Marketplace
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                Milestone 21 Active
              </span>
            </div>
          </div>

          {/* Persona Role Switcher */}
          <div className="flex items-center space-x-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 text-xs font-semibold">
            <span className="text-slate-400 px-2">Role:</span>
            {[
              { role: 'FARMER', label: '👨‍🌾 Farmer (Ravi)' },
              { role: 'SHOP_OWNER', label: '🏪 Shop Owner (Suresh)' },
              { role: 'MECHANIC', label: '🔧 Mechanic (Ramesh)' },
              { role: 'FPO_ADMIN', label: '🏢 FPO Retail Manager' },
            ].map((r) => (
              <button
                key={r.role}
                onClick={() => setActiveRole(r.role as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeRole === r.role
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-6">
        {/* Alerts */}
        {orderSuccessAlert && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">✅</span>
              <p className="font-semibold text-sm">{orderSuccessAlert}</p>
            </div>
            <button
              onClick={() => setOrderSuccessAlert(null)}
              className="text-xs bg-emerald-800/50 hover:bg-emerald-800 text-emerald-200 px-2.5 py-1 rounded-md"
            >
              Dismiss
            </button>
          </div>
        )}

        {quoteSuccessAlert && (
          <div className="mb-6 p-4 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">💬</span>
              <p className="font-semibold text-sm">{quoteSuccessAlert}</p>
            </div>
            <button
              onClick={() => setQuoteSuccessAlert(null)}
              className="text-xs bg-blue-800/50 hover:bg-blue-800 text-blue-200 px-2.5 py-1 rounded-md"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-3 border-b border-slate-800 text-sm font-semibold mb-8">
          {[
            { id: 'PRODUCTS', label: '🛒 Products & Tools', icon: '📦' },
            { id: 'BUSINESSES', label: '🏪 Local Shops & Businesses', icon: '📍' },
            { id: 'SPARE_PARTS', label: '⚙️ Spare Parts & Compatibility', icon: '🚜' },
            { id: 'SERVICES', label: '🔧 Local Services & Mechanics', icon: '🛠️' },
            { id: 'ENQUIRIES_QUOTES', label: '💬 Enquiries & Quotes', icon: '📑' },
            { id: 'ORDERS', label: '📦 Orders & Fulfillment', icon: '🚚' },
            { id: 'MERCHANT_HUB', label: '📊 Merchant Business Hub', icon: '📈' },
            { id: 'DEMAND_RADAR', label: '🌐 Demand & Supply Radar', icon: '📡' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: PRODUCTS & TOOLS CATALOG */}
        {activeTab === 'PRODUCTS' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Find Products, Tools & Spare Parts Near You</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Search local hardware, pipes, electricals, sprayers & spares in Tandur Mandal
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search brand, part, item..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 w-64 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                {[
                  { id: 'ALL', label: 'All Categories' },
                  { id: 'SPARE_PARTS', label: '⚙️ Spare Parts' },
                  { id: 'PLUMBING', label: '💧 Plumbing & Pipes' },
                  { id: 'FARM_EQUIPMENT', label: '🌱 Farm Equipment' },
                  { id: 'ELECTRICAL', label: '⚡ Electrical Panels' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`py-2 px-3 rounded-lg border font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-all shadow-xl flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {p.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base leading-tight">{p.name}</h3>
                          <span className="text-[11px] font-mono text-emerald-400">{p.brand} • {p.model}</span>
                        </div>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/20">
                        ⭐ {p.rating}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{p.description}</p>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-500">Shop / Business:</span>
                        <span className="font-semibold text-slate-200">{p.businessName}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-500">Location:</span>
                        <span className="text-slate-200">{p.businessVillage} ({p.distanceKm} km away)</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-500">Available In Stock:</span>
                        <span className="font-bold text-emerald-400">{p.stockQuantity - p.reservedQuantity} {p.unit}s</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">Unit Price</div>
                      <div className="text-xl font-black text-emerald-400">
                        ₹{p.price.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-slate-400">/ {p.unit.toLowerCase()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setBuyModalProduct(p)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20"
                    >
                      Buy / Order Now ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUY MODAL */}
        {buyModalProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{buyModalProduct.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-base">Select Order & Fulfillment</h3>
                    <p className="text-xs text-slate-400">{buyModalProduct.name}</p>
                  </div>
                </div>
                <button onClick={() => setBuyModalProduct(null)} className="text-slate-400 hover:text-white text-lg font-bold">
                  ✕
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl space-y-2.5 text-xs border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Seller Shop:</span>
                  <span className="font-bold text-slate-200">{buyModalProduct.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shop Location:</span>
                  <span className="text-slate-200">{buyModalProduct.businessVillage} ({buyModalProduct.distanceKm} km)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Price:</span>
                  <span className="font-bold text-emerald-400">₹{buyModalProduct.price}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Choose Fulfillment Method:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleBuyProduct(buyModalProduct, 'PICKUP')}
                    className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 rounded-xl text-left space-y-1 transition-all"
                  >
                    <div className="font-bold text-white text-xs">🏪 Self-Pickup (Free)</div>
                    <div className="text-[11px] text-slate-400">Collect directly from shop</div>
                  </button>

                  <button
                    onClick={() => handleBuyProduct(buyModalProduct, 'LOCAL_DELIVERY')}
                    className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 rounded-xl text-left space-y-1 transition-all"
                  >
                    <div className="font-bold text-white text-xs">🚚 Farm Delivery (+₹150)</div>
                    <div className="text-[11px] text-slate-400">Delivered directly to farm</div>
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setBuyModalProduct(null)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOCAL BUSINESSES DIRECTORY */}
        {activeTab === 'BUSINESSES' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white">Verified Local Rural Businesses & Retailers</h3>
              <p className="text-xs text-slate-400">Local shops, mechanics, fabricators, and agri-service centers in Vikarabad district</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {businesses.map((biz) => (
                  <div key={biz.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{biz.icon}</span>
                          <div>
                            <h4 className="font-bold text-white text-sm leading-tight">{biz.businessName}</h4>
                            <span className="text-[11px] text-emerald-400 font-mono">{biz.businessType}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1">
                        <p className="text-slate-400">📍 {biz.village} ({biz.distanceKm} km away)</p>
                        <p className="text-slate-400">📞 {biz.phone}</p>
                        <p className="text-slate-400">⭐ {biz.rating} ({biz.totalReviews} reviews)</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {biz.services.map((s, i) => (
                          <span key={i} className="bg-slate-900 text-emerald-300 text-[10px] px-2 py-0.5 rounded border border-slate-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Calling ${biz.businessName} at ${biz.phone}`)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs transition-all"
                    >
                      📞 Call Business
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SPARE PARTS & COMPATIBILITY */}
        {activeTab === 'SPARE_PARTS' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">🚜 Spare Parts Compatibility Validator</h3>
                <p className="text-xs text-slate-400">Select your farm machine to guarantee exact fitting spare parts and reduce wrong-part returns</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Select Machine Brand:</label>
                  <select
                    value={selectedMachineBrand}
                    onChange={(e) => setSelectedMachineBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="ALL">All Brands</option>
                    <option value="John Deere">John Deere</option>
                    <option value="Kirloskar">Kirloskar</option>
                    <option value="Aspee">Aspee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Select Machine Model:</label>
                  <select
                    value={selectedMachineModel}
                    onChange={(e) => setSelectedMachineModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="ALL">All Models</option>
                    <option value="5310">5310 (55 HP Tractor)</option>
                    <option value="5050D">5050D PowerPro (50 HP)</option>
                    <option value="KDS-750">KDS-750 (7.5 HP Pump)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs w-full">
                    ✓ Compatibility Engine Active: Guaranteed 100% Fitment
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {products
                  .filter((p) => p.category === 'SPARE_PARTS' || p.category === 'PLUMBING')
                  .map((p) => (
                    <div key={p.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{p.name}</span>
                          <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded font-mono font-bold">
                            ✓ Verified Fit
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Fits: <strong>{p.compatibleModels.join(', ')}</strong> • SKU: {p.sku}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <span className="text-emerald-400 font-black text-base">₹{p.price}</span>
                          <span className="block text-[10px] text-slate-500">{p.stockQuantity} in stock</span>
                        </div>
                        <button
                          onClick={() => setBuyModalProduct(p)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                        >
                          Order Part
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LOCAL SERVICES & REPAIR */}
        {activeTab === 'SERVICES' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">🔧 Local Services, Technicians & Repair Marketplace</h3>
                <p className="text-xs text-slate-400">Book certified mechanics, motor rewinding technicians & welders with clear visit charges</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((svc) => (
                  <div key={svc.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="text-2xl">{svc.icon}</span>
                        <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded font-mono font-bold">
                          {svc.pricingModel}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{svc.title}</h4>
                      <p className="text-xs text-slate-400">{svc.description}</p>
                      <div className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                        <div>👨‍🔧 Provider: <strong>{svc.businessName}</strong></div>
                        <div>📍 {svc.village} ({svc.distanceKm} km away)</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-500">Inspection / Visit Fee</div>
                        <div className="text-sm font-bold text-emerald-400">₹{svc.inspectionFee}</div>
                      </div>
                      <button
                        onClick={() => alert(`Service '${svc.title}' requested! Bridging to WorkRequest.`)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                      >
                        Book Service ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ENQUIRIES & QUOTES */}
        {activeTab === 'ENQUIRIES_QUOTES' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">💬 Quotation Negotiation & Enquiries Desk</h3>
                <p className="text-xs text-slate-400">Negotiate bulk supplies, custom pipes, and non-standard parts before creating orders</p>
              </div>

              <div className="space-y-4">
                {quotes.map((q) => (
                  <div key={q.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">Quote from {q.businessName}</h4>
                        <p className="text-xs text-slate-400">Buyer: {q.buyerName} • Valid Until: {q.validUntil}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        q.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      }`}>
                        ● {q.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">{q.notes}</p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm font-black text-emerald-400">
                        Total Amount: ₹{q.total.toLocaleString('en-IN')}
                      </div>

                      {q.status === 'SUBMITTED' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => alert('Counter offer of ₹4,500 submitted to merchant')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            Counter Offer
                          </button>
                          <button
                            onClick={() => handleAcceptQuote(q.id)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs"
                          >
                            Accept & Convert to Order ➔
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ORDERS & FULFILLMENT */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">📦 Active Commerce Orders Pipeline</h3>
                <p className="text-xs text-slate-400">Track order fulfillment lifecycle: CONFIRMED ➔ PROCESSING ➔ READY_FOR_PICKUP / OUT_FOR_DELIVERY ➔ COMPLETED</p>
              </div>

              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">{o.orderNumber}</h4>
                        <p className="text-xs text-slate-400">Seller: {o.sellerBusinessName} • Ordered: {o.orderedAt}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                        o.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}>
                        ● {o.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {o.items.map((it: any, i: number) => (
                        <div key={i} className="flex justify-between text-slate-300">
                          <span>{it.quantity}x {it.name}</span>
                          <span className="font-bold text-emerald-400">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                        <span>Fulfillment Method:</span>
                        <span className="font-semibold text-slate-200">{o.fulfillmentMethod}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-white pt-1">
                        <span>Total Paid:</span>
                        <span className="text-emerald-400">₹{o.total}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex justify-end space-x-2">
                      {o.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleAdvanceOrderStatus(o.id, 'PROCESSING')}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                        >
                          Start Processing ➔
                        </button>
                      )}
                      {o.status === 'PROCESSING' && (
                        <button
                          onClick={() => handleAdvanceOrderStatus(o.id, 'READY_FOR_PICKUP')}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                        >
                          Mark Ready for Pickup ➔
                        </button>
                      )}
                      {o.status === 'READY_FOR_PICKUP' && (
                        <button
                          onClick={() => handleAdvanceOrderStatus(o.id, 'COMPLETED')}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs"
                        >
                          Confirm Handover & Complete ➔
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: MERCHANT BUSINESS HUB */}
        {activeTab === 'MERCHANT_HUB' && (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400">Total Revenue</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">₹84,200</div>
                <div className="text-[11px] text-emerald-300 mt-1">✓ 100% Direct Payout</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400">Active Orders</div>
                <div className="text-2xl font-black text-white mt-1">12 Orders</div>
                <div className="text-[11px] text-slate-400 mt-1">2 ready for pickup</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400">Cataloged Products</div>
                <div className="text-2xl font-black text-blue-400 mt-1">45 Items</div>
                <div className="text-[11px] text-blue-300 mt-1">3 Low Stock alerts</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400">Merchant Rating</div>
                <div className="text-2xl font-black text-amber-400 mt-1">⭐ 4.8 / 5.0</div>
                <div className="text-[11px] text-amber-300 mt-1">Verified Tier 3</div>
              </div>
            </div>

            {/* Inventory table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Active Merchant Inventory & Stock Control</h3>
                <button
                  onClick={() => alert('New Product Catalogue registration modal')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  + Add New Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Product Name</th>
                      <th className="p-3.5">SKU</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">In Stock</th>
                      <th className="p-3.5">Reserved</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold text-white flex items-center space-x-2">
                          <span>{p.icon}</span>
                          <span>{p.name}</span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-400">{p.sku}</td>
                        <td className="p-3.5">{p.category}</td>
                        <td className="p-3.5 font-bold text-emerald-400">₹{p.price}</td>
                        <td className="p-3.5 font-bold text-white">{p.stockQuantity}</td>
                        <td className="p-3.5 text-amber-400">{p.reservedQuantity}</td>
                        <td className="p-3.5">
                          <button
                            onClick={() => alert(`Stock adjusted for ${p.name}`)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[11px]"
                          >
                            + Add Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: DEMAND & SUPPLY RADAR */}
        {activeTab === 'DEMAND_RADAR' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">🌐 Hyperlocal Demand & Supply Intelligence Radar</h3>
                <p className="text-xs text-slate-400">Real-time supply deficits and business opportunities across Tandur Mandal</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    category: 'Borewell Submersible Pump & Motor Repair',
                    demand: 182,
                    providers: 4,
                    status: 'HIGH_OPPORTUNITY',
                    insight: 'Severe supply deficit: 45:1 request-to-technician ratio during peak irrigation cycle.',
                  },
                  {
                    category: 'Tractor Engine Overhaul & Hydraulic Breakdown',
                    demand: 94,
                    providers: 8,
                    status: 'MODERATE',
                    insight: 'Healthy mechanic supply with steady 24-hour turnaround time.',
                  },
                  {
                    category: 'Hydraulic Hoses & High-Pressure Crimping Spares',
                    demand: 145,
                    providers: 3,
                    status: 'HIGH_OPPORTUNITY',
                    insight: 'High demand for high-pressure crimped hoses and quick-disconnect couplers.',
                  },
                ].map((rad, i) => (
                  <div key={i} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-sm">{rad.category}</h4>
                      <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/40">
                        {rad.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{rad.insight}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
                      <span>Demand Requests: <strong className="text-white">{rad.demand}</strong></span>
                      <span>•</span>
                      <span>Available Providers: <strong className="text-emerald-400">{rad.providers}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

