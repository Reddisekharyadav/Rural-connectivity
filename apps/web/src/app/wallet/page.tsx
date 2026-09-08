'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface TransactionItem {
  id: string;
  type: 'PAYMENT' | 'EARNING' | 'REFUND' | 'SETTLEMENT' | 'WITHDRAWAL' | 'DEPOSIT';
  category: string;
  amount: number;
  isInflow: boolean;
  status: 'COMPLETED' | 'PENDING' | 'ON_HOLD';
  title: string;
  subtitle: string;
  referenceId: string;
  date: string;
}

interface WalletHoldItem {
  id: string;
  amount: number;
  reason: string;
  referenceType: string;
  referenceId: string;
  status: 'ACTIVE' | 'RELEASED' | 'CAPTURED';
  createdAt: string;
}

interface PayoutDest {
  id: string;
  type: 'UPI' | 'BANK_ACCOUNT';
  title: string;
  masked: string;
  holder: string;
  status: 'VERIFIED' | 'ACTIVE';
}

interface WithdrawalItem {
  id: string;
  amount: number;
  destination: string;
  status: 'REQUESTED' | 'PROCESSING' | 'COMPLETED';
  requestedAt: string;
  utr?: string;
}

export default function UnifiedWalletPortal() {
  const [activeTab, setActiveTab] = useState<
    'wallet' | 'perspectives' | 'transactions' | 'holds' | 'withdrawals' | 'ledger' | 'risk' | 'credit'
  >('wallet');

  // Role perspective selector
  const [selectedRole, setSelectedRole] = useState<'FARMER' | 'WORKER' | 'TRACTOR_OWNER' | 'MERCHANT' | 'CONTRACTOR'>('TRACTOR_OWNER');

  // Balance projection state
  const [balances, setBalances] = useState({
    available: 22500,
    pending: 4200,
    held: 2000,
    currency: 'INR',
  });

  const [walletStatus, setWalletStatus] = useState<'ACTIVE' | 'FROZEN'>('ACTIVE');
  const [freezeReason, setFreezeReason] = useState<string>('');

  // Transactions list
  const [transactions, setTransactions] = useState<TransactionItem[]>([
    {
      id: 'ftx-2026-001',
      type: 'EARNING',
      category: 'SERVICE_EARNING',
      amount: 3600,
      isInflow: true,
      status: 'COMPLETED',
      title: 'Tractor Rotavator Operation Service',
      subtitle: 'Customer: Ramesh Kumar (4 acres, Tangipalli)',
      referenceId: 'TRW-000124',
      date: 'Today, 2:30 PM',
    },
    {
      id: 'ftx-2026-002',
      type: 'EARNING',
      category: 'RENTAL_EARNING',
      amount: 1800,
      isInflow: true,
      status: 'COMPLETED',
      title: 'Aspee 500L Boom Sprayer Rental',
      subtitle: 'Renter: Venkat Reddy (1 day self-pickup)',
      referenceId: 'RB-2026-9901',
      date: 'Yesterday',
    },
    {
      id: 'ftx-2026-003',
      type: 'PAYMENT',
      category: 'INPUT_PURCHASE',
      amount: 900,
      isInflow: false,
      status: 'COMPLETED',
      title: 'John Deere Spin-On Engine Oil Filter',
      subtitle: 'Merchant: Sri Sai Agro Machinery',
      referenceId: 'ORD-COM-1049',
      date: 'Sep 06, 2026',
    },
    {
      id: 'ftx-2026-004',
      type: 'PAYMENT',
      category: 'TRANSPORT',
      amount: 450,
      isInflow: false,
      status: 'COMPLETED',
      title: 'Agri-Logistics Produce Delivery',
      subtitle: 'Carrier: Mahindra Bolero Maxi Truck',
      referenceId: 'TRQ-COM-00842',
      date: 'Sep 05, 2026',
    },
    {
      id: 'ftx-2026-005',
      type: 'EARNING',
      category: 'PRODUCE_SALE',
      amount: 18500,
      isInflow: true,
      status: 'COMPLETED',
      title: 'Cotton Lot (Long Staple Brahma) Bulk Sale',
      subtitle: 'Buyer: Tandur Cotton Mills FPO Hub',
      referenceId: 'PO-2026-009',
      date: 'Sep 03, 2026',
    },
    {
      id: 'ftx-2026-006',
      type: 'EARNING',
      category: 'JOB_EARNING',
      amount: 1706.25,
      isInflow: true,
      status: 'COMPLETED',
      title: 'Bulk Sowing & Intercultural Weeding Gig',
      subtitle: 'Employer: Mallikarjun Agri Farms (3 days logged)',
      referenceId: 'asgn-001',
      date: 'Sep 02, 2026',
    },
  ]);

  // Active holds
  const [holds, setHolds] = useState<WalletHoldItem[]>([
    {
      id: 'hld-001',
      amount: 2000,
      reason: 'RENTAL_DEPOSIT',
      referenceType: 'RENTAL_BOOKING',
      referenceId: 'RB-2026-9901 (Boom Sprayer)',
      status: 'ACTIVE',
      createdAt: 'Sep 07, 2026',
    },
  ]);

  // Payout destinations
  const [destinations] = useState<PayoutDest[]>([
    {
      id: 'dest-01',
      type: 'UPI',
      title: 'Primary UPI Handle',
      masked: 'sur•••@oksbi',
      holder: 'Suresh Rao',
      status: 'VERIFIED',
    },
    {
      id: 'dest-02',
      type: 'BANK_ACCOUNT',
      title: 'State Bank of India - Tandur Agri Branch',
      masked: '••••4829 (IFSC: SBIN0001284)',
      holder: 'Suresh Rao',
      status: 'VERIFIED',
    },
  ]);

  // Withdrawals history
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([
    {
      id: 'wth-2026-901',
      amount: 5000,
      destination: 'sur•••@oksbi (UPI)',
      status: 'COMPLETED',
      requestedAt: 'Sep 04, 2026',
      utr: 'UTR-NPCI-2026-489912',
    },
  ]);

  // Modals / forms state
  const [topUpAmount, setTopUpAmount] = useState('2000');
  const [withdrawAmount, setWithdrawAmount] = useState('5000');
  const [selectedDestId, setSelectedDestId] = useState('dest-01');
  const [txFilter, setTxFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [idempotencyTestKey, setIdempotencyTestKey] = useState('IDEM-KEY-99120');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4500);
  };

  // Top Up Action
  const handleTopUp = () => {
    const amt = parseFloat(topUpAmount);
    if (!amt || amt <= 0) return;
    setBalances((prev) => ({ ...prev, available: prev.available + amt }));
    const newTx: TransactionItem = {
      id: `ftx-${Date.now()}`,
      type: 'PAYMENT',
      category: 'WALLET_TOPUP',
      amount: amt,
      isInflow: true,
      status: 'COMPLETED',
      title: 'Instant Wallet Top-Up via UPI',
      subtitle: 'Gateway Ref: PAY_GATEWAY_SUCCESS_2026',
      referenceId: `TOPUP-${Date.now()}`,
      date: 'Just now',
    };
    setTransactions([newTx, ...transactions]);
    showNotification(`Successfully added ₹${amt.toLocaleString()} to your RuralConnect Wallet.`);
  };

  // Withdrawal Action
  const handleWithdrawal = () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) return;
    if (walletStatus === 'FROZEN') {
      alert('Wallet is currently FROZEN due to risk review. Withdrawals are disabled.');
      return;
    }
    if (amt > balances.available) {
      alert(`Insufficient available funds. Available: ₹${balances.available}`);
      return;
    }

    setBalances((prev) => ({ ...prev, available: prev.available - amt }));
    const dest = destinations.find((d) => d.id === selectedDestId);
    const newWth: WithdrawalItem = {
      id: `wth-${Date.now()}`,
      amount: amt,
      destination: dest ? `${dest.masked} (${dest.type})` : 'Registered Bank',
      status: 'COMPLETED',
      requestedAt: 'Just now',
      utr: `UTR-BANK-${Date.now().toString().slice(-6)}`,
    };
    setWithdrawals([newWth, ...withdrawals]);

    const newTx: TransactionItem = {
      id: `ftx-${Date.now()}`,
      type: 'WITHDRAWAL',
      category: 'WALLET_WITHDRAWAL',
      amount: amt,
      isInflow: false,
      status: 'COMPLETED',
      title: `Instant Payout to ${dest?.masked || 'Bank'}`,
      subtitle: `Disbursed with 0% platform fee (${newWth.utr})`,
      referenceId: newWth.id,
      date: 'Just now',
    };
    setTransactions([newTx, ...transactions]);
    showNotification(`Disbursed ₹${amt.toLocaleString()} instant payout to ${dest?.masked}!`);
  };

  // Release Security Hold
  const handleReleaseHold = (id: string, amt: number) => {
    setHolds(holds.map((h) => (h.id === id ? { ...h, status: 'RELEASED' } : h)));
    setBalances((prev) => ({
      ...prev,
      held: Math.max(0, prev.held - amt),
      available: prev.available + amt,
    }));
    showNotification(`Security deposit of ₹${amt.toLocaleString()} released back into Available Balance!`);
  };

  // Toggle Wallet Freeze
  const handleToggleFreeze = () => {
    if (walletStatus === 'ACTIVE') {
      setWalletStatus('FROZEN');
      setFreezeReason('Simulated Risk Anomaly Flag: High Velocity Check');
      showNotification('Wallet safety lock applied. All outgoing withdrawals are FROZEN.');
    } else {
      setWalletStatus('ACTIVE');
      setFreezeReason('');
      showNotification('Wallet safety lock lifted. Wallet status restored to ACTIVE.');
    }
  };

  // Filtered transactions
  const filteredTxs = transactions.filter((t) => {
    if (txFilter === 'INCOME') return t.isInflow;
    if (txFilter === 'EXPENSE') return !t.isInflow;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-emerald-400 font-bold text-xl tracking-wide flex items-center gap-2">
              <span>🌾</span> RuralConnect
            </Link>
            <span className="text-slate-600">/</span>
            <span className="font-semibold text-slate-200">Unified Financial Layer</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Milestone 22
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300">Identity:</span>
              <span className="font-semibold text-emerald-300">Suresh Rao (Tandur)</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
              KYC: <span className="text-emerald-400 font-medium">Aadhaar Verified</span>
            </div>
          </div>
        </div>
      </header>

      {/* Global Success Notification Banner */}
      {actionSuccessMsg && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-xl flex items-center justify-between shadow-lg shadow-emerald-950/40 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xl">✅</span>
              <p className="text-sm font-medium">{actionSuccessMsg}</p>
            </div>
            <button
              onClick={() => setActionSuccessMsg(null)}
              className="text-xs text-emerald-400 hover:text-emerald-200 font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Hero Financial Banner */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                <span>⚡</span> RuralConnect Account & Presentation Wallet
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Unified Financial Identity & Balance Projection
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                One consolidated rural account spanning Service Bookings, Machinery Rentals, Workforce Gigs, Local Commerce,
                Produce Sales, and Logistics—backed by an immutable double-entry ledger.
              </p>
            </div>

            {/* Wallet Status Badge */}
            <div className="flex items-center gap-3">
              {walletStatus === 'ACTIVE' ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-sm font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  Wallet Status: ACTIVE
                </div>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2 text-sm font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse"></span>
                  Wallet Status: FROZEN
                </div>
              )}
            </div>
          </div>

          {/* Three-Tier Balance Projection Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {/* Available */}
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-emerald-500/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
              <div className="flex justify-between items-center text-xs font-medium text-slate-400 mb-1">
                <span>AVAILABLE TO WITHDRAW</span>
                <span className="text-emerald-400">Ready</span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                ₹{balances.available.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <span className="text-emerald-400">✓</span> Instant payout eligible
              </p>
            </div>

            {/* Pending Escrow */}
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-amber-500/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
              <div className="flex justify-between items-center text-xs font-medium text-slate-400 mb-1">
                <span>PENDING SETTLEMENTS</span>
                <span className="text-amber-400">In Escrow</span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                ₹{balances.pending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <span className="text-amber-400">⏳</span> Releases upon job sign-off
              </p>
            </div>

            {/* Security Holds */}
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-sky-500/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500"></div>
              <div className="flex justify-between items-center text-xs font-medium text-slate-400 mb-1">
                <span>HELD SECURITY DEPOSITS</span>
                <span className="text-sky-400">Locked</span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                ₹{balances.held.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <span className="text-sky-400">🔒</span> Machinery rental guarantee
              </p>
            </div>

            {/* Total Account Net */}
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-purple-500/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
              <div className="flex justify-between items-center text-xs font-medium text-slate-400 mb-1">
                <span>TOTAL FINANCIAL VOLUME</span>
                <span className="text-purple-400">Net Ledger</span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                ₹{(balances.available + balances.pending + balances.held).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <span className="text-purple-400">⚖️</span> 100% double-entry balanced
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex overflow-x-auto gap-2 pb-2 border-b border-slate-800 scrollbar-thin">
          {[
            { id: 'wallet', label: '💰 My Wallet & Top-Up', icon: '💰' },
            { id: 'perspectives', label: '🌾 Multi-Role Perspectives', icon: '🌾' },
            { id: 'transactions', label: '📜 Unified Timeline', icon: '📜' },
            { id: 'holds', label: '🔒 Holds & Deposits', icon: '🔒' },
            { id: 'withdrawals', label: '🏧 Payouts & Destinations', icon: '🏧' },
            { id: 'ledger', label: '⚖️ Double-Entry Explorer', icon: '⚖️' },
            { id: 'risk', label: '🛡️ Safety & Wallet Freeze', icon: '🛡️' },
            { id: 'credit', label: '📊 Credit Readiness Bridge', icon: '📊' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Contents */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        {/* TAB 1: WALLET OVERVIEW & TOPUP/WITHDRAW */}
        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>⚡</span> Quick Financial Actions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Top-Up Box */}
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                        Add Money (Top-Up)
                      </div>
                      <p className="text-xs text-slate-400 mb-3">
                        Pre-fund your wallet for machinery hiring, input purchases, or freight.
                      </p>
                      <div className="relative mb-3">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 font-semibold"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleTopUp}
                      className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md shadow-emerald-950"
                    >
                      <span>💳</span> Top-Up via UPI / NetBanking
                    </button>
                  </div>

                  {/* Withdraw Box */}
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
                        Instant Payout (Withdraw)
                      </div>
                      <p className="text-xs text-slate-400 mb-3">
                        Direct 0% fee settlement to verified UPI or Bank account.
                      </p>
                      <div className="relative mb-2">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500 font-semibold"
                        />
                      </div>
                      <div className="mb-3">
                        <select
                          value={selectedDestId}
                          onChange={(e) => setSelectedDestId(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
                        >
                          {destinations.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.title} ({d.masked})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={handleWithdrawal}
                      className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md shadow-sky-950"
                    >
                      <span>🏧</span> Disburse to Bank / UPI
                    </button>
                  </div>
                </div>
              </div>

              {/* Month Activity Breakdown */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h3 className="text-md font-bold text-white mb-4">Monthly Financial Cashflow (Sep 2026)</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
                    <div className="text-xs text-slate-400">Total Inflow</div>
                    <div className="text-lg font-bold text-emerald-400 mt-1">+₹27,606.25</div>
                    <div className="text-[11px] text-slate-500 mt-1">4 transactions</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
                    <div className="text-xs text-slate-400">Total Outflow</div>
                    <div className="text-lg font-bold text-rose-400 mt-1">-₹1,350.00</div>
                    <div className="text-[11px] text-slate-500 mt-1">2 transactions</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
                    <div className="text-xs text-slate-400">Net Platform Surplus</div>
                    <div className="text-lg font-bold text-white mt-1">+₹26,256.25</div>
                    <div className="text-[11px] text-emerald-400 mt-1">95.1% margin</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Account Specs & Security */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
                  <span>🔒</span> Financial Guardrails
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Source of Truth:</strong> Balance is a deterministic read-model over immutable ledger entries.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Decimal Safety:</strong> Zero floating-point rounding leakage on currency arithmetic.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Zero Platform Deductions on Wages:</strong> Workers receive 100% of agreed earnings.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Idempotent Operations:</strong> Request deduplication safeguards against duplicate debits.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h3 className="text-md font-bold text-white mb-3">Linked Payout Accounts</h3>
                <div className="space-y-2">
                  {destinations.map((d) => (
                    <div key={d.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{d.title}</div>
                        <div className="text-slate-400 font-mono">{d.masked}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MULTI-ROLE FINANCIAL PERSPECTIVES */}
        {activeTab === 'perspectives' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Multi-Role Financial Views</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    One user identity with segregated, domain-specific financial perspectives.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'TRACTOR_OWNER', label: '🚜 Tractor Owner' },
                    { id: 'FARMER', label: '🌾 Farmer' },
                    { id: 'WORKER', label: '🔨 Skilled Worker' },
                    { id: 'MERCHANT', label: '🏪 Local Shop' },
                    { id: 'CONTRACTOR', label: '🏗️ Contractor' },
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id as any)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                        selectedRole === role.id
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Perspective Cards */}
              {selectedRole === 'TRACTOR_OWNER' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Total Machinery Revenue</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">₹18,500.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">11 completed jobs</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Maintenance & Diesel</div>
                      <div className="text-xl font-bold text-rose-400 mt-1">₹3,200.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">Oil change & filter</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Average Earning / Job</div>
                      <div className="text-xl font-bold text-white mt-1">₹1,682.00</div>
                      <div className="text-[11px] text-emerald-400 mt-1">★ 4.9 Owner Rating</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Next Payout Eligible</div>
                      <div className="text-xl font-bold text-amber-400 mt-1">₹3,600.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">Releases tomorrow</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                    <strong>AI Financial Note:</strong> &quot;Based on your RuralConnect transaction records, tractor operations in Tandur yielded an 82.7% net operating margin over the last 30 days.&quot;
                  </div>
                </div>
              )}

              {selectedRole === 'FARMER' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Produce Sales (FPO)</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">₹85,000.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">Cotton & Red Gram</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Fertilizer & Seed Costs</div>
                      <div className="text-xl font-bold text-rose-400 mt-1">₹14,500.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">3 input supplier orders</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Tractor & Labor Hired</div>
                      <div className="text-xl font-bold text-rose-400 mt-1">₹5,700.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">Ploughing + Sowing</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Net Farm Activity Margin</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">₹64,800.00</div>
                      <div className="text-[11px] text-emerald-400 mt-1">76.2% surplus</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'WORKER' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Total Wages Earned</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">₹14,600.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">12 completed gigs</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Platform Fee Deducted</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">₹0.00</div>
                      <div className="text-[11px] text-emerald-400 mt-1">100% direct wage policy</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Average Pay / Day</div>
                      <div className="text-xl font-bold text-white mt-1">₹650.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">Cotton sowing & weeding</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Available to Withdraw</div>
                      <div className="text-xl font-bold text-sky-400 mt-1">₹8,400.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">Instant UPI eligible</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'MERCHANT' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Gross Shop Sales</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">₹84,000.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">Spare parts & equipment</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Refunds & Returns</div>
                      <div className="text-xl font-bold text-slate-400 mt-1">₹2,000.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">1 customer return</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Platform Commission</div>
                      <div className="text-xl font-bold text-amber-400 mt-1">₹4,200.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">5% fee</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Net Merchant Payout</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">₹77,800.00</div>
                      <div className="text-[11px] text-emerald-400 mt-1">Settled to SBI current a/c</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'CONTRACTOR' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Total Project Budget</div>
                      <div className="text-xl font-bold text-white mt-1">₹2,40,000.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">3 farm clusters</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Disbursed Wages</div>
                      <div className="text-xl font-bold text-rose-400 mt-1">₹1,42,000.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">22 skilled workers</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Machinery Commitments</div>
                      <div className="text-xl font-bold text-rose-400 mt-1">₹43,000.00</div>
                      <div className="text-[11px] text-slate-500 mt-1">Tractors & harvesters</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400">Contractor Surplus</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">₹55,000.00</div>
                      <div className="text-[11px] text-emerald-400 mt-1">22.9% net margin</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: UNIFIED TRANSACTION TIMELINE */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Unified Financial Timeline</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Chronological stream of all payments, earnings, settlements, and refunds across RuralConnect.
                  </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  {(['ALL', 'INCOME', 'EXPENSE'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTxFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        txFilter === filter
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-3">
                {filteredTxs.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
                          tx.isInflow
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {tx.isInflow ? '+' : '-'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200 text-sm">{tx.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                            {tx.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{tx.subtitle}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span>Ref: {tx.referenceId}</span>
                          <span>•</span>
                          <span>{tx.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <div
                        className={`text-base font-bold font-mono ${
                          tx.isInflow ? 'text-emerald-400' : 'text-slate-300'
                        }`}
                      >
                        {tx.isInflow ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-1">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WALLET HOLDS & DEPOSITS */}
        {activeTab === 'holds' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Active Wallet Holds & Security Escrow</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Temporary holds for machinery rentals, active dispute arbitrations, and milestone releases.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Held</div>
                  <div className="text-lg font-bold text-sky-400">₹{balances.held.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-3">
                {holds.map((h) => (
                  <div
                    key={h.id}
                    className="p-4 rounded-xl bg-slate-800/40 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          {h.reason}
                        </span>
                        <span className="text-sm font-semibold text-slate-200">{h.referenceId}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Guarantee deposit for equipment return condition. Created on {h.createdAt}.
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-base font-bold text-white">₹{h.amount.toLocaleString()}</div>
                        <span className="text-[10px] text-sky-400 font-semibold">{h.status}</span>
                      </div>

                      {h.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleReleaseHold(h.id, h.amount)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                        >
                          Release Hold
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WITHDRAWALS & PAYOUT DESTINATIONS */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h2 className="text-lg font-bold text-white mb-4">Payout Destinations & Settlement Channels</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {destinations.map((d) => (
                  <div key={d.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex justify-between items-start">
                    <div>
                      <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{d.type}</div>
                      <div className="font-bold text-slate-200 mt-1">{d.title}</div>
                      <div className="text-sm font-mono text-slate-400 mt-0.5">{d.masked}</div>
                      <div className="text-xs text-slate-500 mt-1">Holder: {d.holder}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>

              <h3 className="text-md font-bold text-white mb-3">Recent Payout Disbursements</h3>
              <div className="space-y-2">
                {withdrawals.map((w) => (
                  <div key={w.id} className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">Disbursed ₹{w.amount.toLocaleString()} to {w.destination}</div>
                      <div className="text-slate-500 font-mono mt-0.5">Ref: {w.utr} • {w.requestedAt}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                      {w.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DOUBLE ENTRY EXPLORER */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Double-Entry Ledger Inspector</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Verifies that every financial movement has perfectly balanced debits and credits.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Ledger Integrity: 100% HEALTHY_BALANCED
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold">
                    <tr>
                      <th className="p-3">Entry ID</th>
                      <th className="p-3">Transaction</th>
                      <th className="p-3">Account Type</th>
                      <th className="p-3">Account ID</th>
                      <th className="p-3">Type</th>
                      <th className="p-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 text-slate-500">ledg-seed-01</td>
                      <td className="p-3 text-emerald-400">ftx-seed-001</td>
                      <td className="p-3 font-semibold text-slate-200">CUSTOMER_CLEARING</td>
                      <td className="p-3">user-kiran-001</td>
                      <td className="p-3 text-rose-400 font-bold">DEBIT</td>
                      <td className="p-3 text-right font-bold">₹4,000.00</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 text-slate-500">ledg-seed-02</td>
                      <td className="p-3 text-emerald-400">ftx-seed-001</td>
                      <td className="p-3 font-semibold text-slate-200">PLATFORM_REVENUE</td>
                      <td className="p-3">platform-treasury</td>
                      <td className="p-3 text-emerald-400 font-bold">CREDIT</td>
                      <td className="p-3 text-right font-bold">₹400.00</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 text-slate-500">ledg-seed-03</td>
                      <td className="p-3 text-emerald-400">ftx-seed-001</td>
                      <td className="p-3 font-semibold text-slate-200">WALLET_AVAILABLE</td>
                      <td className="p-3">to-suresh-002</td>
                      <td className="p-3 text-emerald-400 font-bold">CREDIT</td>
                      <td className="p-3 text-right font-bold">₹3,600.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: RISK & WALLET FREEZE GUARD */}
        {activeTab === 'risk' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h2 className="text-lg font-bold text-white mb-2">Safety, Idempotency & Admin Risk Controls</h2>
              <p className="text-xs text-slate-400 mb-6">
                Administrative security mechanisms for anomalous activity, velocity protection, and duplicate transaction prevention.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Freeze / Unfreeze Guard */}
                <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700">
                  <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
                    Emergency Account Freeze Guard
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    When frozen, all withdrawal disbursements and transfers are instantly halted, while immutable historical transactions remain preserved.
                  </p>

                  <div className="mb-4">
                    <div className="text-xs text-slate-300 font-medium">
                      Current Status:{' '}
                      <span className={walletStatus === 'ACTIVE' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {walletStatus}
                      </span>
                    </div>
                    {freezeReason && <p className="text-[11px] text-rose-300 mt-1">Reason: {freezeReason}</p>}
                  </div>

                  <button
                    onClick={handleToggleFreeze}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition ${
                      walletStatus === 'ACTIVE'
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {walletStatus === 'ACTIVE' ? 'Simulate Emergency Wallet Freeze' : 'Lift Freeze & Restore ACTIVE'}
                  </button>
                </div>

                {/* Idempotency Check Simulation */}
                <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700">
                  <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                    Server-Side Idempotency Key Guard
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Every financial mutation uses cryptographic idempotency keys to ensure network retries never double-charge.
                  </p>

                  <div className="mb-3">
                    <label className="text-[11px] text-slate-400 font-medium">Idempotency-Key Header</label>
                    <input
                      type="text"
                      value={idempotencyTestKey}
                      onChange={(e) => setIdempotencyTestKey(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-300 mt-1"
                    />
                  </div>

                  <button
                    onClick={() => showNotification(`Idempotency verification test: Key '${idempotencyTestKey}' successfully locked duplicate execution.`)}
                    className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition"
                  >
                    Test Idempotency Verification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: CREDIT READINESS BRIDGE */}
        {activeTab === 'credit' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Credit Readiness & Consented Financial Sharing</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Bridges Milestone 22 unified transaction ledger data into the Milestone 18 Credit Profile for RBI-regulated lenders.
                  </p>
                </div>
                <Link
                  href="/financial"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                >
                  Open Financial Passport ➔
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 text-center">
                  <div className="text-xs text-slate-400">Credit Readiness Score</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">93.8 / 100</div>
                  <div className="text-[11px] text-emerald-300 mt-1">HIGH_READINESS (SBI Accredited)</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 text-center">
                  <div className="text-xs text-slate-400">Verified Platform Transactions</div>
                  <div className="text-2xl font-bold text-white mt-1">26 Records</div>
                  <div className="text-[11px] text-slate-400 mt-1">100% on-time fulfillment</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 text-center">
                  <div className="text-xs text-slate-400">Active Financial Consent</div>
                  <div className="text-2xl font-bold text-sky-400 mt-1">State Bank of India</div>
                  <div className="text-[11px] text-slate-400 mt-1">90-day time-bound consent</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <strong>Safety Guardrail Compliance:</strong> RuralConnect does not act as a lender or provide credit risk guarantees. All financing schemes and sanctions are evaluated solely by regulated financial institutions with strict user-revocable consent.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
