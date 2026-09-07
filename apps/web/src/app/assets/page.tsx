'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AssetsMarketplacePage() {
  const [activeRole, setActiveRole] = useState<'FARMER' | 'ASSET_OWNER' | 'CONTRACTOR' | 'FPO_ADMIN'>('FARMER');
  const [activeTab, setActiveTab] = useState<
    'DISCOVERY' | 'FLEET' | 'LISTINGS' | 'REQUESTS' | 'BOOKINGS' | 'HANDOVER_INSPECTION' | 'MAINTENANCE' | 'FPO_POOL'
  >('DISCOVERY');

  // Search Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [rentalModeFilter, setRentalModeFilter] = useState<string>('ALL');
  const [operatorNeeded, setOperatorNeeded] = useState<boolean>(true);
  const [deliveryNeeded, setDeliveryNeeded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [durationUnit, setDurationUnit] = useState<'DAYS' | 'HOURS' | 'ACRES'>('DAYS');

  // Booking / Modal State
  const [bookingModalAsset, setBookingModalAsset] = useState<any | null>(null);
  const [bookingSuccessAlert, setBookingSuccessAlert] = useState<string | null>(null);

  // Sample Assets Inventory
  const [assets, setAssets] = useState([
    {
      id: 'ast-001',
      name: 'John Deere 5050D PowerPro',
      brand: 'John Deere',
      model: '5050D',
      assetType: 'TRACTOR',
      icon: '🚜',
      ownerName: 'Suresh Reddy',
      ownerPhone: '+91 98480 12345',
      ownerRating: 4.9,
      ownerVerificationTier: 3,
      village: 'Tangipalli',
      distanceKm: 2.1,
      capacity: 50,
      capacityUnit: 'HP',
      condition: 'EXCELLENT',
      status: 'ACTIVE',
      rentalMode: 'EQUIPMENT_WITH_OPERATOR',
      dailyRate: 4500,
      hourlyRate: 650,
      depositAmount: 0,
      totalRentals: 48,
      specifications: [
        { key: 'Horsepower', value: '50 HP' },
        { key: 'Fuel Type', value: 'Diesel' },
        { key: 'Plow Type', value: 'Heavy Duty 42-blade Rotavator' },
      ],
      attachments: ['ROTAVATOR', 'TRAILER', 'CULTIVATOR'],
      requiresOperator: true,
      deliveryAvailable: true,
    },
    {
      id: 'ast-002',
      name: 'Aspee 500L Tractor Boom Sprayer',
      brand: 'Aspee',
      model: 'HTP-500B',
      assetType: 'SPRAYER',
      icon: '🌱',
      ownerName: 'Ramesh Goud',
      ownerPhone: '+91 98765 43210',
      ownerRating: 4.7,
      ownerVerificationTier: 2,
      village: 'Malkapur',
      distanceKm: 4.8,
      capacity: 500,
      capacityUnit: 'LITRE',
      condition: 'GOOD',
      status: 'ACTIVE',
      rentalMode: 'EQUIPMENT_ONLY',
      dailyRate: 2200,
      hourlyRate: 350,
      depositAmount: 1500,
      totalRentals: 32,
      specifications: [
        { key: 'Tank Volume', value: '500 Litres' },
        { key: 'Boom Width', value: '12 Metres' },
        { key: 'Nozzle Count', value: '24 Ceramic Tips' },
      ],
      attachments: ['TRACTOR_MOUNT_KIT'],
      requiresOperator: false,
      deliveryAvailable: true,
    },
    {
      id: 'ast-003',
      name: 'Kirloskar 7.5 HP Diesel High-Discharge Pump',
      brand: 'Kirloskar',
      model: 'KDS-750',
      assetType: 'WATER_PUMP',
      icon: '💧',
      ownerName: 'Tangipalli FPO Custom Hiring Center',
      ownerPhone: '+91 94401 22334',
      ownerRating: 4.9,
      ownerVerificationTier: 4,
      village: 'Tangipalli',
      distanceKm: 1.2,
      capacity: 7.5,
      capacityUnit: 'HP',
      condition: 'EXCELLENT',
      status: 'ACTIVE',
      rentalMode: 'EQUIPMENT_WITH_DELIVERY',
      dailyRate: 1400,
      hourlyRate: 200,
      depositAmount: 1000,
      totalRentals: 65,
      specifications: [
        { key: 'Power', value: '7.5 HP Diesel' },
        { key: 'Delivery Pipe', value: '3-inch Heavy Flexible (100ft)' },
        { key: 'Discharge', value: '1200 Litres/min' },
      ],
      attachments: ['SUCTION_HOSE', 'DELIVERY_PIPES'],
      requiresOperator: false,
      deliveryAvailable: true,
    },
    {
      id: 'ast-004',
      name: 'Preet 987 Multi-Crop Combine Harvester',
      brand: 'Preet',
      model: '987 Deluxe',
      assetType: 'HARVESTER',
      icon: '🌾',
      ownerName: 'Tangipalli FPO Custom Hiring Center',
      ownerPhone: '+91 94401 22334',
      ownerRating: 5.0,
      ownerVerificationTier: 4,
      village: 'Tangipalli',
      distanceKm: 1.5,
      capacity: 101,
      capacityUnit: 'HP',
      condition: 'EXCELLENT',
      status: 'ACTIVE',
      rentalMode: 'EQUIPMENT_OPERATOR_DELIVERY',
      dailyRate: 16000,
      hourlyRate: 2200,
      depositAmount: 3000,
      totalRentals: 18,
      specifications: [
        { key: 'Cutter Bar', value: '14 Feet Width' },
        { key: 'Grain Tank', value: '1800 Litres' },
        { key: 'Operators Included', value: '2 Certified Master Drivers' },
      ],
      attachments: ['PADDY_DRUM', 'MAIZE_ATTACHMENT'],
      requiresOperator: true,
      deliveryAvailable: true,
    },
    {
      id: 'ast-005',
      name: 'Shaktiman Heavy Duty Hydraulic Tipping Trailer (5-Ton)',
      brand: 'Shaktiman',
      model: 'HT-5000',
      assetType: 'TRAILER',
      icon: '🚛',
      ownerName: 'Suresh Reddy (Sri Sai Fleet)',
      ownerPhone: '+91 98480 12345',
      ownerRating: 4.9,
      ownerVerificationTier: 3,
      village: 'Tangipalli',
      distanceKm: 2.1,
      capacity: 5,
      capacityUnit: 'TON',
      condition: 'GOOD',
      status: 'ACTIVE',
      rentalMode: 'EQUIPMENT_ONLY',
      dailyRate: 1200,
      hourlyRate: 180,
      depositAmount: 1000,
      totalRentals: 54,
      specifications: [
        { key: 'Payload Capacity', value: '5.0 Metric Tons' },
        { key: 'Tipping Mechanism', value: 'Single-acting Hydraulic Ram' },
      ],
      attachments: ['TRACTOR_PIN_HITCH'],
      requiresOperator: false,
      deliveryAvailable: true,
    },
  ]);

  // Sample Bookings State
  const [bookings, setBookings] = useState([
    {
      id: 'bkg-001',
      assetId: 'ast-001',
      assetName: 'John Deere 5050D PowerPro',
      assetType: 'TRACTOR',
      icon: '🚜',
      ownerName: 'Suresh Reddy',
      renterName: 'Ravi Kumar (Cotton Farmer)',
      startDate: '2026-09-10',
      endDate: '2026-09-11',
      duration: '2 Days',
      rentalMode: 'EQUIPMENT_WITH_OPERATOR',
      totalAmount: 9000,
      depositAmount: 0,
      status: 'CONFIRMED',
      fuelLevel: 100,
      meterReading: 1240,
    },
    {
      id: 'bkg-002',
      assetId: 'ast-002',
      assetName: 'Aspee 500L Tractor Boom Sprayer',
      assetType: 'SPRAYER',
      icon: '🌱',
      ownerName: 'Ramesh Goud',
      renterName: 'Anjaiah B',
      startDate: '2026-09-08',
      endDate: '2026-09-09',
      duration: '1 Day',
      rentalMode: 'EQUIPMENT_ONLY',
      totalAmount: 2200,
      depositAmount: 1500,
      status: 'IN_USE',
      fuelLevel: 85,
      meterReading: 320,
    },
  ]);

  // Sample Maintenance State
  const [maintenanceRecords, setMaintenanceRecords] = useState([
    {
      id: 'maint-001',
      assetId: 'ast-001',
      assetName: 'John Deere 5050D PowerPro',
      maintenanceType: 'OIL_CHANGE',
      description: 'Engine oil & filter replacement (15W-40 CI4)',
      cost: 3200,
      performedAt: '2026-08-15',
      nextDueAt: '2026-11-15',
      meterReading: 1150,
      status: 'COMPLETED',
    },
    {
      id: 'maint-002',
      assetId: 'ast-004',
      assetName: 'Preet 987 Multi-Crop Combine Harvester',
      maintenanceType: 'ROUTINE_SERVICE',
      description: 'Pre-season blade sharpening and hydraulic belt tension calibration',
      cost: 7500,
      performedAt: '2026-08-28',
      nextDueAt: '2026-10-15',
      meterReading: 480,
      status: 'COMPLETED',
    },
  ]);

  // Filtered Assets for Discovery
  const filteredAssets = assets.filter((asset) => {
    const matchesCat = selectedCategory === 'ALL' || asset.assetType === selectedCategory;
    const matchesMode = rentalModeFilter === 'ALL' || asset.rentalMode === rentalModeFilter;
    const matchesSearch =
      searchQuery === '' ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.village.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesMode && matchesSearch;
  });

  const handleBookAsset = (asset: any) => {
    const totalWages = durationUnit === 'DAYS' ? asset.dailyRate * selectedDuration : asset.hourlyRate * selectedDuration;
    const newBooking = {
      id: `bkg-${Date.now().toString().slice(-4)}`,
      assetId: asset.id,
      assetName: asset.name,
      assetType: asset.assetType,
      icon: asset.icon,
      ownerName: asset.ownerName,
      renterName: 'Ravi Kumar (Logged-in Farmer)',
      startDate: '2026-09-12',
      endDate: '2026-09-14',
      duration: `${selectedDuration} ${durationUnit.toLowerCase()}`,
      rentalMode: asset.rentalMode,
      totalAmount: totalWages,
      depositAmount: asset.depositAmount,
      status: 'CONFIRMED',
      fuelLevel: 100,
      meterReading: 1250,
    };

    setBookings([newBooking, ...bookings]);
    setBookingModalAsset(null);
    setBookingSuccessAlert(`Booking created successfully for '${asset.name}'! Ref ID: ${newBooking.id}`);
    setActiveTab('BOOKINGS');
  };

  const handleAdvanceBookingStatus = (bookingId: string, nextStatus: string) => {
    setBookings(
      bookings.map((b) => (b.id === bookingId ? { ...b, status: nextStatus } : b))
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
              <span className="text-2xl">🚜</span>
              <h1 className="text-xl font-black tracking-tight text-white">
                Rural Asset Rental & Machinery Marketplace
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                Milestone 20 Active
              </span>
            </div>
          </div>

          {/* Persona Role Switcher */}
          <div className="flex items-center space-x-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 text-xs font-semibold">
            <span className="text-slate-400 px-2">Role:</span>
            {[
              { role: 'FARMER', label: '👨‍🌾 Farmer (Ravi)' },
              { role: 'ASSET_OWNER', label: '🚜 Asset Owner (Suresh)' },
              { role: 'CONTRACTOR', label: '🏗️ Contractor' },
              { role: 'FPO_ADMIN', label: '🏢 FPO CHC Admin' },
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
        {/* Success Alert */}
        {bookingSuccessAlert && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">✅</span>
              <p className="font-semibold text-sm">{bookingSuccessAlert}</p>
            </div>
            <button
              onClick={() => setBookingSuccessAlert(null)}
              className="text-xs bg-emerald-800/50 hover:bg-emerald-800 text-emerald-200 px-2.5 py-1 rounded-md"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-3 border-b border-slate-800 text-sm font-semibold mb-8">
          {[
            { id: 'DISCOVERY', label: '🔍 Farmer Asset Discovery', icon: '🌾' },
            { id: 'FLEET', label: '🚜 Fleet & Asset Registry', icon: '📋' },
            { id: 'LISTINGS', label: '🏷️ Rental Listings & Pricing', icon: '💰' },
            { id: 'REQUESTS', label: '📡 Demand Radar & Offers', icon: '🎯' },
            { id: 'BOOKINGS', label: '📅 Active Bookings Pipeline', icon: '⚡' },
            { id: 'HANDOVER_INSPECTION', label: '🔍 Handover & Inspection', icon: '🛡️' },
            { id: 'MAINTENANCE', label: '🔧 Maintenance & Utilization', icon: '📊' },
            { id: 'FPO_POOL', label: '🏢 FPO Machinery Pool (CHC)', icon: '🤝' },
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

        {/* TAB 1: FARMER ASSET DISCOVERY */}
        {activeTab === 'DISCOVERY' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span>What agricultural machine do you need?</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Search nearby tractors, pumps, sprayers, trailers & combine harvesters in Tandur Mandal
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search brand, model, village..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 w-64 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Machinery Categories */}
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2.5">
                {[
                  { id: 'ALL', label: 'All Machines', icon: '🚜' },
                  { id: 'TRACTOR', label: 'Tractors', icon: '🚜' },
                  { id: 'SPRAYER', label: 'Sprayers', icon: '🌱' },
                  { id: 'WATER_PUMP', label: 'Pumps', icon: '💧' },
                  { id: 'HARVESTER', label: 'Harvesters', icon: '🌾' },
                  { id: 'TRAILER', label: 'Trailers', icon: '🚛' },
                  { id: 'ROTAVATOR', label: 'Implements', icon: '🔧' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">{cat.icon}</span>
                    <span className="text-xs">{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Requirement Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-800/80 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Rental Mode</label>
                  <select
                    value={rentalModeFilter}
                    onChange={(e) => setRentalModeFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ALL">All Rental Modes</option>
                    <option value="EQUIPMENT_ONLY">Equipment Only (Self-Operate)</option>
                    <option value="EQUIPMENT_WITH_OPERATOR">Equipment + Certified Driver</option>
                    <option value="EQUIPMENT_WITH_DELIVERY">Equipment + Delivery to Farm</option>
                    <option value="EQUIPMENT_OPERATOR_DELIVERY">All-Inclusive (Driver + Delivery)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Duration & Unit</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(parseInt(e.target.value) || 1)}
                      className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <select
                      value={durationUnit}
                      onChange={(e) => setDurationUnit(e.target.value as any)}
                      className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="DAYS">Days</option>
                      <option value="HOURS">Hours</option>
                      <option value="ACRES">Acres</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <input
                    type="checkbox"
                    id="reqOperator"
                    checked={operatorNeeded}
                    onChange={(e) => setOperatorNeeded(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-0 w-4 h-4 bg-slate-950"
                  />
                  <label htmlFor="reqOperator" className="text-slate-300 font-medium cursor-pointer">
                    Need Trained Driver / Operator
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <input
                    type="checkbox"
                    id="reqDelivery"
                    checked={deliveryNeeded}
                    onChange={(e) => setDeliveryNeeded(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-0 w-4 h-4 bg-slate-950"
                  />
                  <label htmlFor="reqDelivery" className="text-slate-300 font-medium cursor-pointer">
                    Need Trailer Delivery to Farm (M15)
                  </label>
                </div>
              </div>
            </div>

            {/* Asset Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-all shadow-xl flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {asset.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base leading-tight">{asset.name}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {asset.brand} • {asset.capacity} {asset.capacityUnit}
                          </p>
                        </div>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/20">
                        ⭐ {asset.ownerRating}
                      </span>
                    </div>

                    {/* Key Specs */}
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                      {asset.specifications.map((spec, i) => (
                        <div key={i} className="flex justify-between text-slate-300">
                          <span className="text-slate-500">{spec.key}:</span>
                          <span className="font-semibold text-slate-200">{spec.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Location & Tags */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <span>📍</span>
                        <span>
                          {asset.village} ({asset.distanceKm} km away)
                        </span>
                      </span>
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium">
                        {asset.condition} Condition
                      </span>
                    </div>

                    {/* Attachments Pills */}
                    {asset.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {asset.attachments.map((att, i) => (
                          <span
                            key={i}
                            className="bg-slate-800/80 text-emerald-400/90 text-[10px] px-2 py-0.5 rounded-md font-mono border border-slate-700"
                          >
                            + {att}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer & Pricing */}
                  <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">Rental Price</div>
                      <div className="text-lg font-black text-emerald-400">
                        ₹{asset.dailyRate.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-slate-400">/ day</span>
                      </div>
                      {asset.depositAmount > 0 && (
                        <div className="text-[10px] text-amber-400">
                          + ₹{asset.depositAmount} Deposit (Refundable)
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setBookingModalAsset(asset)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20"
                    >
                      Rent Now ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOOKING MODAL */}
        {bookingModalAsset && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{bookingModalAsset.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-base">Confirm Machinery Rental</h3>
                    <p className="text-xs text-slate-400">{bookingModalAsset.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setBookingModalAsset(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl space-y-2.5 text-xs border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Owner / Provider:</span>
                  <span className="font-bold text-slate-200">{bookingModalAsset.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Location:</span>
                  <span className="font-bold text-slate-200">
                    {bookingModalAsset.village} ({bookingModalAsset.distanceKm} km away)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rental Duration:</span>
                  <span className="font-bold text-emerald-400">
                    {selectedDuration} {durationUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Rental Rate:</span>
                  <span className="font-bold text-slate-200">
                    ₹{bookingModalAsset.dailyRate} / day
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security Deposit Escrow:</span>
                  <span className="font-bold text-amber-400">
                    ₹{bookingModalAsset.depositAmount} (100% Refundable)
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black">
                  <span className="text-white">Total Payable Amount:</span>
                  <span className="text-emerald-400">
                    ₹
                    {(
                      bookingModalAsset.dailyRate * selectedDuration +
                      bookingModalAsset.depositAmount
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl text-[11px] text-emerald-300">
                🛡️ <strong>RuralConnect Trust Shield</strong>: Payment is held in secure escrow. Released to provider only after asset handover and verified completion.
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setBookingModalAsset(null)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBookAsset(bookingModalAsset)}
                  className="w-1/2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20"
                >
                  Confirm & Lock Escrow ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLEET & ASSET REGISTRY */}
        {activeTab === 'FLEET' && (
          <div className="space-y-6">
            {/* Owner Fleet Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400">Total Machinery Assets</div>
                <div className="text-2xl font-black text-white mt-1">{assets.length} Units</div>
                <div className="text-[11px] text-emerald-400 mt-1">✓ Across 5 Equipment Types</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400">Active on Rental</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">4 Available</div>
                <div className="text-[11px] text-slate-400 mt-1">1 currently in use</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400">Fleet Utilization Rate</div>
                <div className="text-2xl font-black text-blue-400 mt-1">74.5%</div>
                <div className="text-[11px] text-blue-300 mt-1">180 hrs / 240 hrs capacity</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400">Monthly Fleet Earnings</div>
                <div className="text-2xl font-black text-amber-400 mt-1">₹1,42,800</div>
                <div className="text-[11px] text-amber-300 mt-1">100% direct bank payout</div>
              </div>
            </div>

            {/* Asset Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Registered Fleet Assets & Specifications</h3>
                <button
                  onClick={() => alert('New Asset Registration form opened')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  + Register New Asset
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Asset Name</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Capacity</th>
                      <th className="p-3.5">Condition</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Daily Rate</th>
                      <th className="p-3.5">Total Rentals</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {assets.map((ast) => (
                      <tr key={ast.id} className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold text-white flex items-center space-x-2">
                          <span>{ast.icon}</span>
                          <span>{ast.name}</span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-400">{ast.assetType}</td>
                        <td className="p-3.5 font-semibold text-slate-200">
                          {ast.capacity} {ast.capacityUnit}
                        </td>
                        <td className="p-3.5">
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                            {ast.condition}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                            {ast.status}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-emerald-400">₹{ast.dailyRate}/day</td>
                        <td className="p-3.5 font-semibold text-slate-300">{ast.totalRentals} jobs</td>
                        <td className="p-3.5 space-x-2">
                          <button
                            onClick={() => alert(`Editing specs for ${ast.name}`)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[11px]"
                          >
                            Edit EAV
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

        {/* TAB 3: RENTAL LISTINGS */}
        {activeTab === 'LISTINGS' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Active Rental Marketplace Listings</h3>
                  <p className="text-xs text-slate-400">Configure public pricing models, operator options, and deposit rules</p>
                </div>
                <button
                  onClick={() => alert('Publish new rental listing modal')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  + Create New Listing
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assets.map((ast) => (
                  <div key={ast.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{ast.icon}</span>
                        <div>
                          <h4 className="font-bold text-white text-sm">{ast.name}</h4>
                          <span className="text-[11px] text-emerald-400 font-mono">{ast.rentalMode}</span>
                        </div>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded font-bold">
                        ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div>
                        <span className="text-slate-500">Daily Price:</span> ₹{ast.dailyRate}
                      </div>
                      <div>
                        <span className="text-slate-500">Hourly Price:</span> ₹{ast.hourlyRate}
                      </div>
                      <div>
                        <span className="text-slate-500">Driver Required:</span> {ast.requiresOperator ? 'Yes' : 'No'}
                      </div>
                      <div>
                        <span className="text-slate-500">Deposit:</span> ₹{ast.depositAmount}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex justify-end space-x-2">
                      <button
                        onClick={() => alert(`Adjusted pricing for ${ast.name}`)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded text-xs"
                      >
                        Adjust Pricing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DEMAND RADAR & OFFERS */}
        {activeTab === 'REQUESTS' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Live Farmer Machinery Rental Demand Radar</h3>
              <p className="text-xs text-slate-400">Farmers in Tandur Mandal actively requesting machinery</p>

              <div className="space-y-3">
                {[
                  {
                    id: 'req-001',
                    farmer: 'Ravi Kumar (Cotton Farmer)',
                    village: 'Tangipalli',
                    machineNeeded: 'Tractor 50+ HP with Rotavator',
                    startDate: '2026-09-10 (Tomorrow)',
                    duration: '2 Days',
                    operatorNeeded: true,
                    matchScore: 97.6,
                    status: 'OPEN',
                  },
                  {
                    id: 'req-002',
                    farmer: 'B. Anjaiah (Redgram Farmer)',
                    village: 'Kotbaspalli',
                    machineNeeded: '500L Boom Sprayer',
                    startDate: '2026-09-12',
                    duration: '1 Day',
                    operatorNeeded: false,
                    matchScore: 92.4,
                    status: 'OPEN',
                  },
                ].map((req) => (
                  <div
                    key={req.id}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{req.machineNeeded}</span>
                        <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded font-mono font-bold">
                          {req.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Requested by <strong>{req.farmer}</strong> • {req.village} • {req.startDate} ({req.duration})
                      </p>
                    </div>

                    <button
                      onClick={() => alert(`Offer submitted to ${req.farmer}`)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs whitespace-nowrap"
                    >
                      Extend Rental Offer ➔
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ACTIVE BOOKINGS */}
        {activeTab === 'BOOKINGS' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Active Rental Bookings & State Lifecycle</h3>
              <p className="text-xs text-slate-400">
                Track live state progression: CONFIRMED ➔ HANDED_OVER ➔ IN_USE ➔ RETURNED ➔ INSPECTED ➔ COMPLETED
              </p>

              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{b.icon}</span>
                        <div>
                          <h4 className="font-bold text-white text-sm">{b.assetName}</h4>
                          <p className="text-xs text-slate-400">
                            Booking Ref: <span className="font-mono text-emerald-400">{b.id}</span> • {b.duration}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold border ${
                            b.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : b.status === 'IN_USE'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          }`}
                        >
                          ● {b.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">Owner:</span>
                        <span className="font-semibold text-slate-200">{b.ownerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Renter:</span>
                        <span className="font-semibold text-slate-200">{b.renterName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Rental Escrow:</span>
                        <span className="font-semibold text-emerald-400">₹{b.totalAmount}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Deposit Escrow:</span>
                        <span className="font-semibold text-amber-400">₹{b.depositAmount}</span>
                      </div>
                    </div>

                    {/* State Transition Action Buttons */}
                    <div className="pt-2 flex flex-wrap gap-2 justify-end">
                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleAdvanceBookingStatus(b.id, 'HANDED_OVER')}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                        >
                          Execute Handover (Meter/Fuel) ➔
                        </button>
                      )}
                      {b.status === 'HANDED_OVER' && (
                        <button
                          onClick={() => handleAdvanceBookingStatus(b.id, 'IN_USE')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                        >
                          Start Field Work (IN_USE) ➔
                        </button>
                      )}
                      {b.status === 'IN_USE' && (
                        <button
                          onClick={() => handleAdvanceBookingStatus(b.id, 'RETURNED')}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                        >
                          Return Asset to Owner ➔
                        </button>
                      )}
                      {b.status === 'RETURNED' && (
                        <button
                          onClick={() => handleAdvanceBookingStatus(b.id, 'INSPECTED')}
                          className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                        >
                          Perform Post-Rental Inspection ➔
                        </button>
                      )}
                      {b.status === 'INSPECTED' && (
                        <button
                          onClick={() => handleAdvanceBookingStatus(b.id, 'COMPLETED')}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs shadow-md"
                        >
                          Release Escrow & Complete ➔
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: HANDOVER & INSPECTION */}
        {activeTab === 'HANDOVER_INSPECTION' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Digital Handover & Pre/Post Rental Inspection</h3>
              <p className="text-xs text-slate-400">
                Log condition checkpoints, meter reading, fuel levels, and deposit escrow adjustments
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <h4 className="font-bold text-emerald-400 text-sm flex items-center space-x-2">
                    <span>📋</span>
                    <span>Pre-Rental Handover Checklist</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                      <span className="text-slate-400">Starting Meter Reading:</span>
                      <span className="font-bold text-white">1,240 Hours</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                      <span className="text-slate-400">Initial Fuel Tank Level:</span>
                      <span className="font-bold text-emerald-400">100% (Full Tank)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                      <span className="text-slate-400">Tyre & Blade Condition:</span>
                      <span className="font-bold text-white">No damage / sharp blades</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                      <span className="text-slate-400">Safety Guards & PTO Cover:</span>
                      <span className="font-bold text-emerald-400">Verified Secure</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <h4 className="font-bold text-blue-400 text-sm flex items-center space-x-2">
                    <span>🛡️</span>
                    <span>Post-Rental Return Inspection & Deposit</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                      <span className="text-slate-400">Final Meter Reading:</span>
                      <span className="font-bold text-white">1,256 Hours (+16 hrs)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                      <span className="text-slate-400">Physical Damage Detected:</span>
                      <span className="font-bold text-emerald-400">None (Clean Return)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                      <span className="text-slate-400">Deposit Status:</span>
                      <span className="font-bold text-emerald-400">100% Refund Released</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert('Inspection report generated and archived')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded-xl text-xs"
                  >
                    Generate Signed Handover PDF ➔
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: MAINTENANCE & UTILIZATION */}
        {activeTab === 'MAINTENANCE' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-white">Maintenance Log & Service History</h3>
                  <p className="text-xs text-slate-400">Track oil changes, repairs, costs, and upcoming service alerts</p>
                </div>
                <button
                  onClick={() => alert('Add maintenance service record')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  + Log Maintenance
                </button>
              </div>

              <div className="space-y-3">
                {maintenanceRecords.map((m) => (
                  <div
                    key={m.id}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{m.assetName}</span>
                        <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono text-[10px]">
                          {m.maintenanceType}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-1">{m.description}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Performed: {m.performedAt} • Next Service Due: {m.nextDueAt} ({m.meterReading} hrs)
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-amber-400 text-sm">₹{m.cost}</span>
                      <span className="block text-[10px] text-emerald-400">✓ {m.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: FPO MACHINERY POOL */}
        {activeTab === 'FPO_POOL' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white">FPO Custom Hiring Center (CHC) Asset Sharing Pool</h3>
              <p className="text-xs text-slate-400">
                Shared machinery pool owned by Tangipalli Rythu Seva Samithi (FPO) with preferential member rates
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">Combine Harvester CHC Policy</h4>
                      <span className="text-xs text-emerald-400 font-mono">MEMBERS_ONLY</span>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Subsidized rental rate of <strong>₹2,400/acre</strong> for all registered shareholder farmers. Operator included.
                  </p>
                  <div className="text-xs text-slate-500">Eligibility: All FPO shareholders in Tandur Mandal</div>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">7.5 HP Diesel Pump Pool</h4>
                      <span className="text-xs text-blue-400 font-mono">PUBLIC_RENTAL</span>
                    </div>
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Open for both FPO members (₹1,200/day) and non-members (₹1,400/day) with direct farm trailer delivery.
                  </p>
                  <div className="text-xs text-slate-500">Eligibility: Any verified farmer in Vikarabad district</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

