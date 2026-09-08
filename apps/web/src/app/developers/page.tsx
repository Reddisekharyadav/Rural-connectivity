'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState<
    'api' | 'keys' | 'webhooks' | 'events' | 'sync' | 'integrations' | 'exports' | 'voice'
  >('api');

  // Interactive Test Query State
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/v1/farms');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);

  // API Key Generator State
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedEnv, setSelectedEnv] = useState<'SANDBOX' | 'PRODUCTION'>('SANDBOX');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    'farms:read',
    'jobs:read',
    'assets:read',
  ]);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [apiKeysList, setApiKeysList] = useState([
    {
      id: 'key-tandur-001',
      name: 'Tandur FPO Core ERP',
      env: 'PRODUCTION',
      prefix: 'rc_live_tandurf',
      status: 'ACTIVE',
      created: '2026-09-08',
      scopes: ['farms:read', 'jobs:read', 'jobs:write', 'produce:read', 'analytics:read'],
    },
    {
      id: 'key-test-992',
      name: 'Sandbox Test Client',
      env: 'SANDBOX',
      prefix: 'rc_test_agri992',
      status: 'ACTIVE',
      created: '2026-09-09',
      scopes: ['farms:read', 'assets:read', 'orders:read'],
    },
  ]);

  // Webhook Tester State
  const [webhookUrl, setWebhookUrl] = useState('https://api.tandurfpo.org/webhooks/ruralconnect');
  const [webhookEvent, setWebhookEvent] = useState('booking.confirmed');
  const [webhookLog, setWebhookLog] = useState<{
    status: string;
    signature: string;
    timestamp: string;
    payload: any;
  } | null>(null);

  // Outbox & Event Stream State
  const [outboxEvents, setOutboxEvents] = useState([
    {
      eventId: 'evt-178892182-9921',
      eventType: 'booking.confirmed',
      aggregateType: 'Booking',
      aggregateId: 'bk-2026-0921',
      version: 1,
      status: 'PUBLISHED',
      time: 'Just now',
    },
    {
      eventId: 'evt-178892183-4812',
      eventType: 'job.created',
      aggregateType: 'JobPosting',
      aggregateId: 'job-bulk-cotton-04',
      version: 1,
      status: 'PUBLISHED',
      time: '2 mins ago',
    },
    {
      eventId: 'evt-178892184-7731',
      eventType: 'order.delivered',
      aggregateType: 'CommerceOrder',
      aggregateId: 'ord-filter-009',
      version: 1,
      status: 'PUBLISHED',
      time: '5 mins ago',
    },
    {
      eventId: 'evt-178892185-1104',
      eventType: 'settlement.completed',
      aggregateType: 'Settlement',
      aggregateId: 'stl-npci-8841',
      version: 1,
      status: 'PUBLISHED',
      time: '12 mins ago',
    },
  ]);

  // Offline Sync Simulator State
  const [syncStatus, setSyncStatus] = useState<string>('IDLE');
  const [syncLogs, setSyncLogs] = useState<string[]>([
    '[INIT] Device dev-android-998 registered with locale "te" (Telugu)',
    '[SYNC] Client version v1 synchronized with server version v1',
  ]);

  // Voice Intent Simulator State
  const [voiceInput, setVoiceInput] = useState('రేపు నా పొలానికి ట్రాక్టర్ కావాలి');
  const [voiceResult, setVoiceResult] = useState<{
    language: string;
    intent: string;
    confidence: number;
    slots: any;
    action: string;
  } | null>(null);

  // Data Export Jobs State
  const [exportJobs, setExportJobs] = useState([
    {
      id: 'exp-9941',
      type: 'FARMER_ACTIVITY',
      format: 'CSV',
      records: 142,
      status: 'COMPLETED',
      size: '28.4 KB',
      file: '/downloads/exports/exp-9941.csv',
    },
    {
      id: 'exp-9942',
      type: 'WORKER_ATTENDANCE',
      format: 'CSV',
      records: 86,
      status: 'COMPLETED',
      size: '14.2 KB',
      file: '/downloads/exports/exp-9942.csv',
    },
    {
      id: 'exp-9943',
      type: 'ORDERS_FINANCIAL',
      format: 'JSON',
      records: 54,
      status: 'COMPLETED',
      size: '42.8 KB',
      file: '/downloads/exports/exp-9943.json',
    },
  ]);

  // Handlers
  const handleTestApi = async (endpoint: string) => {
    setSelectedEndpoint(endpoint);
    setIsLoadingApi(true);

    setTimeout(() => {
      let mockData: any;
      if (endpoint === '/v1/farms') {
        mockData = {
          success: true,
          version: 'v1',
          data: [
            {
              id: 'farm-001',
              name: 'Mallesh Cotton Field - Tangipalli',
              totalAcres: 5.0,
              soilType: 'BLACK_COTTON',
              primaryCrop: 'Cotton',
              location: { village: 'Tangipalli', mandal: 'Tandur', district: 'Vikarabad' },
            },
            {
              id: 'farm-002',
              name: 'Suresh Rao Paddy Wetland',
              totalAcres: 8.5,
              soilType: 'ALLUVIAL_LOAM',
              primaryCrop: 'Paddy',
              location: { village: 'Basheerabad', mandal: 'Tandur', district: 'Vikarabad' },
            },
          ],
          meta: { totalCount: 2, page: 1, latencyMs: 28 },
        };
      } else if (endpoint === '/v1/jobs') {
        mockData = {
          success: true,
          version: 'v1',
          data: [
            {
              id: 'job-001',
              title: 'Bulk Cotton Sowing & Intercultural Weeding Operation',
              skillCategory: 'COTTON_SOWING',
              requiredWorkers: 6,
              dailyWage: 650.0,
              status: 'IN_PROGRESS',
              location: { village: 'Tangipalli', mandal: 'Tandur', district: 'Vikarabad' },
            },
          ],
        };
      } else if (endpoint === '/v1/assets') {
        mockData = {
          success: true,
          version: 'v1',
          data: [
            {
              id: 'ast-001',
              code: 'AST-JD-5050D-01',
              name: 'John Deere 5050D PowerPro (50 HP)',
              category: 'TRACTOR',
              condition: 'EXCELLENT',
              status: 'AVAILABLE',
              location: { village: 'Tangipalli', mandal: 'Tandur', district: 'Vikarabad' },
            },
          ],
        };
      } else if (endpoint === '/v1/analytics') {
        mockData = {
          success: true,
          version: 'v1',
          data: {
            mandal: 'Tandur',
            activeFarms: 1420,
            activeJobs: 84,
            activeMachinery: 112,
            totalTransactionVolumeInr: 4850000.0,
            generatedAt: new Date().toISOString(),
          },
        };
      } else {
        mockData = {
          success: true,
          version: 'v1',
          data: { status: 'HEALTHY', timestamp: new Date().toISOString() },
        };
      }

      setApiResponse(JSON.stringify(mockData, null, 2));
      setIsLoadingApi(false);
    }, 300);
  };

  const handleGenerateKey = () => {
    if (!newKeyName) return;
    const prefix = selectedEnv === 'PRODUCTION' ? 'rc_live_' : 'rc_test_';
    const randomHex = Math.random().toString(36).substring(2, 10);
    const key = `${prefix}${randomHex}_sec${Date.now().toString().slice(-8)}`;
    setGeneratedKey(key);

    setApiKeysList([
      {
        id: `key-${Date.now()}`,
        name: newKeyName,
        env: selectedEnv,
        prefix: key.slice(0, 15),
        status: 'ACTIVE',
        created: new Date().toISOString().split('T')[0],
        scopes: selectedScopes,
      },
      ...apiKeysList,
    ]);
    setNewKeyName('');
  };

  const handleSimulateWebhook = () => {
    const signature = `sha256=${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
    setWebhookLog({
      status: 'DELIVERED (HTTP 200 OK)',
      signature,
      timestamp: new Date().toLocaleTimeString(),
      payload: {
        eventId: `evt-${Date.now()}`,
        eventType: webhookEvent,
        eventVersion: 1,
        occurredAt: new Date().toISOString(),
        aggregateType: webhookEvent.split('.')[0].toUpperCase(),
        aggregateId: 'agg-demo-9921',
        payload: {
          referenceNumber: 'REF-2026-8812',
          amount: 4000.0,
          currency: 'INR',
          partnerStatus: 'CONFIRMED',
        },
      },
    });
  };

  const handleSimulateSync = (triggerConflict: boolean) => {
    setSyncStatus('SYNCING');
    setTimeout(() => {
      if (triggerConflict) {
        setSyncStatus('CONFLICT');
        setSyncLogs((prev) => [
          `[409 CONFLICT] Client version (v1) is behind server version (v2) on WorkRequest #wr-001.`,
          `[RESOLVE] Applied server-authoritative state resolution without overwriting remote data.`,
          ...prev,
        ]);
      } else {
        setSyncStatus('SYNCED');
        setSyncLogs((prev) => [
          `[SUCCESS] 3 queued offline actions (Attendance, Yield log, Fuel note) synced cleanly.`,
          ...prev,
        ]);
      }
    }, 600);
  };

  const handleParseVoice = () => {
    if (voiceInput.includes('ట్రాక్టర్') || voiceInput.toLowerCase().includes('tractor')) {
      setVoiceResult({
        language: 'Telugu (తెలుగు)',
        intent: 'TRACTOR_SERVICE',
        confidence: 0.96,
        slots: { service: 'PLOUGHING', targetDate: 'TOMORROW', acres: 4.0 },
        action: 'Route directly to Tractor Matching Engine for Tangipalli village',
      });
    } else if (voiceInput.includes('కూలీలు') || voiceInput.toLowerCase().includes('worker')) {
      setVoiceResult({
        language: 'Telugu (తెలుగు)',
        intent: 'WORKFORCE_GIG',
        confidence: 0.94,
        slots: { crop: 'Cotton', workersCount: 6, wagePerDay: '₹650' },
        action: 'Draft 6-worker gig posting for cotton sowing in Tandur',
      });
    } else {
      setVoiceResult({
        language: 'Telugu / English',
        intent: 'MARKET_PRICE',
        confidence: 0.92,
        slots: { crop: 'Cotton', mandi: 'Tandur APMC' },
        action: 'Display live commodity mandi rate: ₹7,200/Quintal',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent"
            >
              RuralConnect
            </Link>
            <span className="text-slate-500 font-mono text-sm">/</span>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
                Open Platform Architecture
              </span>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                API v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 px-3 py-1.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Platform Core Operational
            </div>
            <Link
              href="/wallet"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md transition"
            >
              Unified Wallet
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Rural Data Platform & Interoperability Hub
            </h1>
            <p className="mt-3 text-base text-slate-400 leading-relaxed">
              Connect external enterprise systems, FPO software, banks, agricultural advisors,
              and logistics providers directly to RuralConnect through versioned REST APIs, transactional
              outbox event streams, HMAC-signed webhooks, and offline synchronization protocols.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex space-x-2 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'api', label: '📖 REST APIs (v1)', icon: '⚡' },
            { id: 'keys', label: '🔑 API Keys & Auth', icon: '🔒' },
            { id: 'webhooks', label: '🪝 Webhooks & HMAC', icon: '📡' },
            { id: 'events', label: '📨 Outbox & Event Bus', icon: '📬' },
            { id: 'sync', label: '🔄 Offline Sync & 409 Guard', icon: '📶' },
            { id: 'integrations', label: '🔌 Enterprise Adapters', icon: '🏢' },
            { id: 'exports', label: '📊 Data Exports & Privacy', icon: '🛡️' },
            { id: 'voice', label: '🎙️ Telugu Voice & I18n', icon: '🗣️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: REST APIS */}
        {activeTab === 'api' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Versioned REST Endpoints</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  Zero Prisma Leak
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                All platform endpoints return versioned Data Transfer Objects (DTOs) with strict security boundaries.
              </p>

              <div className="space-y-2">
                {[
                  { path: '/v1/farms', method: 'GET', scope: 'farms:read', desc: 'Query registered farms with acreage, soil and crop types' },
                  { path: '/v1/jobs', method: 'GET', scope: 'jobs:read', desc: 'List active workforce job postings & daily wage specifications' },
                  { path: '/v1/assets', method: 'GET', scope: 'assets:read', desc: 'Discover tractors, harvesters & rental machinery inventory' },
                  { path: '/v1/orders', method: 'GET', scope: 'orders:read', desc: 'Track commercial spare part & agricultural supply orders' },
                  { path: '/v1/produce', method: 'GET', scope: 'produce:read', desc: 'Mandi spot commodity listings & harvest volumes' },
                  { path: '/v1/transport', method: 'GET', scope: 'transport:read', desc: 'Freight logistics & cargo dispatch telemetry' },
                  { path: '/v1/analytics', method: 'GET', scope: 'analytics:read', desc: 'Mandal-level economic velocity & supply-demand metrics' },
                  { path: '/v1/health', method: 'GET', scope: 'public', desc: 'Platform gateway liveness and version check' },
                ].map((ep) => (
                  <div
                    key={ep.path}
                    onClick={() => handleTestApi(ep.path)}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      selectedEndpoint === ep.path
                        ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                          {ep.method}
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-200">{ep.path}</span>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        {ep.scope}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{ep.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live API Tester / Response Viewer */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">Live API Query Console:</span>
                    <span className="font-mono text-xs text-emerald-400">{selectedEndpoint}</span>
                  </div>
                  <button
                    onClick={() => handleTestApi(selectedEndpoint)}
                    disabled={isLoadingApi}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded transition shadow"
                  >
                    {isLoadingApi ? 'Querying...' : '▶ Execute Request'}
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                  <div className="text-slate-500 mb-2">
                    // Headers: X-API-Key: rc_live_tandurfpo_sec99847192841
                  </div>
                  {apiResponse ? (
                    <pre className="text-emerald-400 whitespace-pre">{apiResponse}</pre>
                  ) : (
                    <div className="text-slate-500 italic py-8 text-center">
                      Click 'Execute Request' to query the versioned REST API.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: API KEYS & CREDENTIALS */}
        {activeTab === 'keys' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white">Generate Partner API Credentials</h3>
                <p className="text-xs text-slate-400">
                  API keys are hashed with SHA-256 before storage. Raw secrets are only displayed once upon generation.
                </p>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Client Name / Partner</label>
                  <input
                    type="text"
                    placeholder="e.g. Basheerabad FPO Aggregator"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Environment</label>
                  <div className="flex gap-2">
                    {['SANDBOX', 'PRODUCTION'].map((env) => (
                      <button
                        key={env}
                        onClick={() => setSelectedEnv(env as any)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold border transition ${
                          selectedEnv === env
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Granted Scopes</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['farms:read', 'jobs:read', 'jobs:write', 'assets:read', 'orders:read', 'produce:read', 'transport:read', 'analytics:read'].map((scope) => (
                      <label key={scope} className="flex items-center gap-1.5 text-slate-300">
                        <input
                          type="checkbox"
                          checked={selectedScopes.includes(scope)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedScopes([...selectedScopes, scope]);
                            } else {
                              setSelectedScopes(selectedScopes.filter((s) => s !== scope));
                            }
                          }}
                          className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                        />
                        <span className="font-mono text-[11px]">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateKey}
                  disabled={!newKeyName}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition shadow"
                >
                  Generate New API Key
                </button>

                {generatedKey && (
                  <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-3 mt-3">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      ⚠️ Copy Secret Key (Shown Once):
                    </span>
                    <code className="text-xs font-mono text-emerald-300 break-all">{generatedKey}</code>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-white">Active Registered API Clients</h3>
              <div className="space-y-3">
                {apiKeysList.map((client) => (
                  <div key={client.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{client.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-xs text-slate-400">{client.prefix}••••••••</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                            {client.env}
                          </span>
                        </div>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold">
                        {client.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                      {client.scopes.map((sc) => (
                        <span key={sc} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-800">
                          {sc}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WEBHOOKS */}
        {activeTab === 'webhooks' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white">Webhook Delivery Simulator</h3>
                <p className="text-xs text-slate-400">
                  Every outgoing webhook payload is signed with HMAC-SHA256 (`X-RuralConnect-Signature`).
                </p>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Target Endpoint URL</label>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Trigger Event</label>
                  <select
                    value={webhookEvent}
                    onChange={(e) => setWebhookEvent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                  >
                    <option value="booking.confirmed">booking.confirmed</option>
                    <option value="booking.completed">booking.completed</option>
                    <option value="job.created">job.created</option>
                    <option value="job.completed">job.completed</option>
                    <option value="order.delivered">order.delivered</option>
                    <option value="produce.sold">produce.sold</option>
                    <option value="payment.succeeded">payment.succeeded</option>
                  </select>
                </div>

                <button
                  onClick={handleSimulateWebhook}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition shadow"
                >
                  🚀 Dispatch Test Webhook
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-white">Webhook Delivery Inspector</h3>
              {webhookLog ? (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">{webhookLog.status}</span>
                    <span className="text-slate-500">{webhookLog.timestamp}</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">X-RuralConnect-Signature:</span>
                    <span className="text-teal-300 break-all">{webhookLog.signature}</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded border border-slate-800">
                    <span className="text-slate-400 text-[11px] block mb-1">Dispatched Payload:</span>
                    <pre className="text-slate-200 overflow-x-auto whitespace-pre">
                      {JSON.stringify(webhookLog.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-10 text-center text-slate-500 text-xs italic">
                  Click 'Dispatch Test Webhook' to test HMAC delivery.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: OUTBOX & EVENT BUS */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Transactional Outbox Event Stream</h3>
                <p className="text-xs text-slate-400">
                  Business state changes and OutboxEvents commit atomically in PostgreSQL before publishing to the Event Bus.
                </p>
              </div>
              <button
                onClick={() => {
                  setOutboxEvents([
                    {
                      eventId: `evt-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
                      eventType: 'booking.confirmed',
                      aggregateType: 'Booking',
                      aggregateId: `bk-auto-${Date.now().toString().slice(-4)}`,
                      version: 1,
                      status: 'PUBLISHED',
                      time: 'Just now',
                    },
                    ...outboxEvents,
                  ]);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-lg transition"
              >
                + Record & Publish Outbox Event
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
                    <th className="p-3">Event ID</th>
                    <th className="p-3">Event Type</th>
                    <th className="p-3">Aggregate</th>
                    <th className="p-3">Ver</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Recorded At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {outboxEvents.map((evt) => (
                    <tr key={evt.eventId} className="hover:bg-slate-900/40 transition">
                      <td className="p-3 text-slate-300 font-semibold">{evt.eventId}</td>
                      <td className="p-3 text-emerald-400">{evt.eventType}</td>
                      <td className="p-3 text-slate-400">{evt.aggregateType} (#{evt.aggregateId})</td>
                      <td className="p-3 text-slate-400">v{evt.version}</td>
                      <td className="p-3">
                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] border border-emerald-500/20 font-sans font-bold">
                          {evt.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-sans">{evt.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: OFFLINE SYNC */}
        {activeTab === 'sync' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Rural Offline Queue Simulator</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    syncStatus === 'SYNCED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : syncStatus === 'CONFLICT'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : syncStatus === 'SYNCING'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {syncStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Enables field workers and farmers to record attendance, machinery usage, and crop logs while offline in zero-connectivity bands.
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => handleSimulateSync(false)}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition"
                  >
                    📶 Network Restored: Sync Queue Cleanly
                  </button>
                  <button
                    onClick={() => handleSimulateSync(true)}
                    className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs py-2.5 rounded-lg transition"
                  >
                    ⚠️ Simulate 409 State Conflict
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-white">Device Synchronization Console</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 h-64 overflow-y-auto">
                {syncLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`${
                      log.includes('CONFLICT')
                        ? 'text-amber-400'
                        : log.includes('SUCCESS')
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: INTEGRATION ADAPTERS */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white">Registered Enterprise Partner Adapters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Tandur FPO Custom ERP', type: 'FPO_ERP', status: 'HEALTHY', latency: '48ms', err: '0.0%' },
                { name: 'Delhivery Rural Logistics', type: 'LOGISTICS', status: 'HEALTHY', latency: '35ms', err: '0.0%' },
                { name: 'Razorpay NPCI Settlement', type: 'PAYMENTS', status: 'HEALTHY', latency: '24ms', err: '0.0%' },
                { name: 'ICAR / IMD Weather Feed', type: 'AGRICULTURE', status: 'HEALTHY', latency: '62ms', err: '0.0%' },
                { name: 'CDAC DLT Telecom SMS', type: 'MESSAGING', status: 'HEALTHY', latency: '31ms', err: '0.0%' },
              ].map((adp) => (
                <div key={adp.name} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{adp.name}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                      🟢 {adp.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>Latency: {adp.latency}</span>
                    <span>Error Rate: {adp.err}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: DATA EXPORTS & PRIVACY */}
        {activeTab === 'exports' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white">Request Background Data Export</h3>
                <p className="text-xs text-slate-400">
                  Generates downloadable CSV/JSON report files asynchronously without blocking web requests.
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'Farmer Activity & Crop Report (CSV)', type: 'FARMER_ACTIVITY', format: 'CSV' },
                    { label: 'Workforce Attendance Logs (CSV)', type: 'WORKER_ATTENDANCE', format: 'CSV' },
                    { label: 'Financial Settlement Ledger (JSON)', type: 'ORDERS_FINANCIAL', format: 'JSON' },
                  ].map((job) => (
                    <button
                      key={job.label}
                      onClick={() => {
                        setExportJobs([
                          {
                            id: `exp-${Math.floor(1000 + Math.random() * 9000)}`,
                            type: job.type,
                            format: job.format,
                            records: Math.floor(50 + Math.random() * 100),
                            status: 'COMPLETED',
                            size: '32.1 KB',
                            file: `/downloads/exports/exp-${Date.now()}.${job.format.toLowerCase()}`,
                          },
                          ...exportJobs,
                        ]);
                      }}
                      className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 p-2.5 rounded-lg text-xs font-semibold text-slate-200 transition"
                    >
                      + Generate {job.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-white">Exported Files Queue</h3>
              <div className="space-y-3">
                {exportJobs.map((job) => (
                  <div key={job.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{job.type} ({job.format})</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {job.records} Records • {job.size} • Status: <span className="text-emerald-400 font-bold">{job.status}</span>
                      </p>
                    </div>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading ${job.file}`);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded transition"
                    >
                      ⬇ Download {job.format}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: VOICE & I18N */}
        {activeTab === 'voice' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white">Rural Speech-to-Intent Engine</h3>
                <p className="text-xs text-slate-400">
                  Translates natural Telugu or regional speech into structured API intents mapped to existing matching services.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300 block">Sample Voice Transcript</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      'రేపు నా పొలానికి ట్రాక్టర్ కావాలి',
                      'పత్తి తీతకు 6 మంది కూలీలు కావాలి',
                      'స్ప్రేయర్ అద్దెకు కావాలి',
                      'తాండూరు మార్కెట్ లో పత్తి ధర ఎంత',
                    ].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setVoiceInput(preset)}
                        className="text-[11px] bg-slate-900 border border-slate-800 hover:border-emerald-500/50 px-2.5 py-1 rounded text-slate-300"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={voiceInput}
                    onChange={(e) => setVoiceInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 mt-2"
                  />
                </div>

                <button
                  onClick={handleParseVoice}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition"
                >
                  🎙️ Parse Voice Intent
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Parsed Intent & Action Dispatch</h3>
              {voiceResult ? (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Detected Intent:</span>
                    <span className="text-emerald-400 font-bold">{voiceResult.intent} ({Math.round(voiceResult.confidence * 100)}%)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Language:</span>
                    <span className="text-teal-300">{voiceResult.language}</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded border border-slate-800">
                    <span className="text-slate-400 text-[11px] block mb-1">Extracted Slots:</span>
                    <pre className="text-slate-200">{JSON.stringify(voiceResult.slots, null, 2)}</pre>
                  </div>
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded text-emerald-300 font-sans text-xs font-semibold">
                    👉 Action: {voiceResult.action}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-10 text-center text-slate-500 text-xs italic">
                  Click 'Parse Voice Intent' to evaluate speech recognition.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
