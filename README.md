# RuralConnect — Open Rural Platform & Ecosystem

[![Build & Test](https://img.shields.io/badge/Milestones-1_through_23_Verified-00C853?style=for-the-badge&logo=checkmarx&logoColor=white)](./scripts/verify_modules.py)
[![API Version](https://img.shields.io/badge/REST_API-v1.0.0-blue?style=for-the-badge&logo=openapi-initiative&logoColor=white)](./packages/data-contracts/)
[![Database](https://img.shields.io/badge/Neon_PostgreSQL-50+_Entities-00E5FF?style=for-the-badge&logo=postgresql&logoColor=black)](./packages/database/prisma/schema.prisma)
[![Android APK](https://img.shields.io/badge/Download-Android_APK_(v1.0.0)-00C853?style=for-the-badge&logo=android&logoColor=white)](https://github.com/kuruvamunirangadu/Rural-connectivity/releases)

**RuralConnect** is an open rural platform and decentralized ecosystem designed to connect farmers, tractor owners, skilled workers, contractors, agri-input suppliers, local businesses, FPOs, buyers, logistics providers, financial institutions, and agricultural researchers into a unified, interoperable digital platform.

---

## 🏛️ Platform Architecture & Topology

RuralConnect is built on a clean **Modular Monolith** with clear internal boundaries, reliable transactional outbox event streams, double-entry ledger bookkeeping, and versioned public data contracts:

```
                                  RURALCONNECT OPEN PLATFORM
                                               │
             ┌─────────────────────────────────┼─────────────────────────────────┐
             ↓                                 ↓                                 ↓
     DEVELOPER PORTAL & APIs          ENTERPRISE INTEGRATIONS            OFFLINE FIELD SYNC
   • REST API v1 (/api/v1/...)       • Logistics (Delhivery/Shadowfax)  • Offline Queue & Sync
   • API Keys (rc_live_ / rc_test_)  • Payments (NPCI UPI / Razorpay)   • PlatformDevice Registry
   • Scoped RBAC & Rate Limiter      • FPO ERP (e-NAM / Agrim)          • 409 Version Conflict Guard
   • Webhooks (HMAC-SHA256)          • AgriTech (Satellite/IoT/Weather) • Background Data Exports
   • Data Classification & Policies  • Messaging (WhatsApp/Voice/SMS)   • Regional I18n & Voice NLU
             │                                 │                                 │
             └─────────────────────────────────┼─────────────────────────────────┘
                                               │
                                ┌──────────────┴──────────────┐
                                ↓                             ↓
                       DOMAIN EVENT BUS               TRANSACTIONAL OUTBOX
                     (Event Envelope v1)             (Atomic DB Persistence)
                                │                             │
                                └──────────────┬──────────────┘
                                               ↓
                                   IDEMPOTENT EVENT CONSUMERS
                                  (ProcessedEvents Deduplication)
                                               │
             ┌───────────────────┬─────────────┴─────┬───────────────────┐
             ↓                   ↓                   ↓                   ↓
       CORE BOOKING          WORKFORCE            COMMERCE            FINANCE
```

---

## 🌾 Complete 23-Milestone Capability Map

| Milestone | Domain / Module | Core Capabilities |
| :--- | :--- | :--- |
| **M1** | **Foundation & Architecture** | Core multi-profile user onboarding, role separation, security & modular monorepo. |
| **M2** | **Farmer & Tractor Network** | Tractor fleet profiling, implement compatibility, capacity & farm requirements. |
| **M3** | **Booking & Work Execution** | Real-time state machine lifecycle (`REQUESTED` → `CONFIRMED` → `IN_PROGRESS` → `COMPLETED`). |
| **M4** | **Skilled Workers & Equipment** | Rural labor taxonomy, implement combos, daily wage estimation, and team matching. |
| **M5** | **Contractor Network** | Bulk farm operations, multi-day turnkey projects, and aggregator dispatching. |
| **M6** | **Agri-Input Supply Network** | Fertilizers, seeds, pesticides inventory tracking, batch verification, and dealer quoting. |
| **M7** | **Unified Farm Planner** | Seasonal crop cycle planner, stage-by-stage activity tracking, and auto-work request generator. |
| **M8** | **Hyperlocal Maps & Geo Bands** | Expanding radius band matching (3km → 8km → 15km → 25km) & mandal boundary spatial queries. |
| **M9** | **Trust, Verification & Safety** | Multi-level KYC (Phone, Land Record, Govt ID, Bank), rating algorithms, and fraud anomaly detection. |
| **M10** | **Pricing & Marketplace Economics** | Dynamic tariff engine, terrain difficulty multiplier, surge control, and platform fee distribution. |
| **M11** | **Notifications & Real-Time Comms** | Multi-channel messaging (Push, masked phone calling, SMS alerts, and WebSocket event bus). |
| **M12** | **Marketplace Intelligence & Admin** | Supply-demand heatmaps, mandal fulfillment quotas, dynamic admin console, and market insights. |
| **M13** | **AI Farm Intelligence** | Multilingual crop disease diagnosis, yield forecasting, and automated weather advisory bot. |
| **M14** | **Govt, FPO & Cooperatives** | Institutional onboarding, collective farm input procurement, and government subsidy verification. |
| **M15** | **Logistics & Supply Chain** | Agri-freight vehicle matching (Auto, Mini-Truck, 10-Tonner), multi-stop routing, and waybill tracking. |
| **M16** | **Farm-to-Buyer Marketplace** | Direct crop listing, quality grading (Grade A/B/C), bulk lot bidding, and escrow deposit locks. |
| **M17** | **Digital Knowledge Extension** | KVK scientific crop guides, pest advisory library, voice questions, and agricultural expert consultation. |
| **M18** | **Rural Finance & Credit Scoring** | Alternative rural credit readiness scoring (0–100), digital crop ledger, and consented bank sharing. |
| **M19** | **Workforce Jobs & Skills Passport** | Verified rural worker passport, biometric/OTP/geo attendance, group recruitment, and ₹0 platform fee. |
| **M20** | **Machinery Rental & Custom Hiring** | FPO Custom Hiring Centers, equipment-with-operator bundles, hourly/daily rentals, inspection & deposit escrow. |
| **M21** | **Rural Commerce & Local Businesses** | Local merchants, repair shops, mechanics, spare parts compatibility checker, and hyperlocal delivery. |
| **M22** | **Unified Identity & Double-Entry Wallet** | Multi-role financial identity, mathematical double-entry ledger balance ($\sum\text{Debits} = \sum\text{Credits}$), 3-tier balances (Available, Pending, Held), instant UPI payouts, and gateway reconciliation. |
| **M23** | **Open Platform & Interoperability** | Versioned REST API v1 (Zero Prisma leaks), Transactional Outbox, Idempotent Event Bus, Scoped API Keys, HMAC-SHA256 Webhooks, 5 Enterprise Adapters, Offline Sync & 409 Conflict Guard, Regional I18n (Telugu/Hindi), Voice NLU, and Developer Portal. |

---

## 📱 Mobile App (Native Android APK)

Get the standalone native Android application for direct offline/field installation:

[![Download Android APK](https://img.shields.io/badge/Download-RuralConnect%20APK%20(v1.0.0)-00C853?style=for-the-badge&logo=android&logoColor=white)](https://github.com/kuruvamunirangadu/Rural-connectivity/releases)

- **Direct Download Link**: [Download RuralConnect.apk (GitHub Releases)](https://github.com/kuruvamunirangadu/Rural-connectivity/releases)
- **Local File Path**: [`./RuralConnect.apk`](./RuralConnect.apk) or [`./apps/web/public/RuralConnect.apk`](./apps/web/public/RuralConnect.apk)
- **File Size**: ~4.72 MB
- **Supported Android OS**: Android 7.0 (API 24) to Android 15+ (API 36)

---

## 🌐 Interactive Web Portals & Cockpits

When running the web application, access all 26 role cockpits and platforms directly:

| Route | Cockpit / Portal | Description |
| :--- | :--- | :--- |
| [`/`](http://localhost:3000/) | **Home Dashboard** | Ecosystem navigation, role switcher, and live operational stats. |
| [`/developers/`](http://localhost:3000/developers/) | **Developer Portal** | REST v1 API sandbox, API key manager, webhooks HMAC tester, outbox monitor, offline sync simulator, enterprise telemetry, and voice NLU tester. |
| [`/wallet/`](http://localhost:3000/wallet/) | **Unified Wallet** | 3-tier balance cards, unified multi-domain timeline, escrow holds, instant UPI withdrawals, and double-entry ledger explorer. |
| [`/farmer/`](http://localhost:3000/farmer/) | **Farmer Cockpit** | Tractor hiring, seasonal farm planner, soil telemetry, and crop disease diagnosis. |
| [`/tractor-owner/`](http://localhost:3000/tractor-owner/) | **Tractor Owner Cockpit** | Fleet telemetry, job request accept/reject, rate card manager, and route maps. |
| [`/worker/`](http://localhost:3000/worker/) | **Worker Digital Passport** | Verified skill badges, daily wage ledger, job calendar, and attendance punch. |
| [`/workforce/`](http://localhost:3000/workforce/) | **Workforce Hub** | Farm job board, contractor recruitment, team aggregation, and wage distribution. |
| [`/marketplace/`](http://localhost:3000/marketplace/) | **Produce Marketplace** | Farm-to-buyer crop listings, quality assay certificates, and mandi price feeds. |
| [`/commerce/`](http://localhost:3000/commerce/) | **Local Commerce & Repairs** | Spare parts compatibility catalog, mechanic booking, and local merchant orders. |
| [`/assets/`](http://localhost:3000/assets/) | **Machinery Rental Hub** | Custom Hiring Centers (CHC), implement attachments, and equipment rentals. |
| [`/logistics/`](http://localhost:3000/logistics/) | **Agri-Logistics Hub** | Freight vehicle matching, route optimization, waybills, and delivery tracking. |
| [`/knowledge/`](http://localhost:3000/knowledge/) | **KVK Digital Extension** | Pest disease encyclopedia, seasonal advisory guides, and scientific QA forum. |
| [`/financial/`](http://localhost:3000/financial/) | **Credit Readiness Hub** | Alternative rural credit readiness scoring (0–100) and banking consent bridge. |
| [`/organization/`](http://localhost:3000/organization/) | **FPO & Govt Console** | Collective procurement, mandi auction lots, member quotas, and subsidy audits. |
| [`/ai/`](http://localhost:3000/ai/) | **AI Assistant** | Conversational vernacular voice bot for agricultural advisory and planning. |

---

## 🔌 Open API v1 & Data Contracts

RuralConnect strictly isolates external API consumers from internal database models. All public REST endpoints return explicit DTO contracts located in [`packages/data-contracts`](./packages/data-contracts/):

### Authentication & Headers
```http
GET /api/v1/farms HTTP/1.1
Host: api.ruralconnect.org
x-api-key: rc_live_tandurfpo_sec99847192841
Accept: application/json
```

### Standard Event Envelope Schema
```json
{
  "eventId": "0e9e5338-9812-4211-8891-998241902812",
  "eventType": "booking.completed.v1",
  "eventVersion": "1.0.0",
  "occurredAt": "2026-09-08T18:30:00Z",
  "aggregateType": "BOOKING",
  "aggregateId": "bk-telangana-9901",
  "payload": {
    "bookingId": "bk-telangana-9901",
    "farmerId": "usr-farmer-chandraiah",
    "tractorOwnerId": "usr-owner-ramesh",
    "acres": 4.5,
    "totalAmount": 5400.0,
    "mandal": "Tandur"
  },
  "metadata": {
    "correlationId": "corr-99214-8812",
    "causationId": "0e9e5338-9812-4211-8891-998241902812",
    "sourceService": "ruralconnect-booking-service",
    "environment": "PRODUCTION",
    "dataClassification": "INTERNAL"
  }
}
```

### Enterprise Adapters Supported
1. **Logistics Adapter**: Delhivery & Local Rural Freight Dispatcher.
2. **Payments Adapter**: Razorpay & NPCI UPI Gateway with Escrow Split.
3. **FPO ERP Adapter**: e-NAM Mandi Gateway & Cooperative Accounting Sync.
4. **AgriTech Adapter**: IMD Weather Telemetry, ISRO Bhuvan NDVI & Soil IoT.
5. **Messaging Adapter**: Govt CDAC / Telecom SMS & WhatsApp Business API.

---

## 🏗️ Project Structure

```text
ruralconnect/
├── apps/
│   ├── api/                     # NestJS 10 backend with 32 domain modules & platform engine
│   │   └── src/
│   │       ├── platform/        # Milestone 23 Open Platform (Outbox, Webhooks, Adapters, Sync)
│   │       ├── finance/         # Milestone 22 Double-Entry Ledger & Unified Wallet
│   │       ├── commerce/        # Milestone 21 Rural Commerce & Local Businesses
│   │       ├── assets/          # Milestone 20 Machinery Rentals & Custom Hiring Centers
│   │       ├── workforce/       # Milestone 19 Jobs & Skills Passport
│   │       └── ...              # Milestones 1-18 Domain Modules
│   ├── web/                     # Next.js 14 web app & Capacitor native Android container
│   │   └── src/app/
│   │       ├── developers/      # Milestone 23 Interactive Developer Portal
│   │       ├── wallet/          # Milestone 22 Unified Financial Identity Dashboard
│   │       └── ...              # 26 Role Cockpits & Marketplaces
│   └── mobile/                  # Mobile workspace & native assets
├── packages/
│   ├── data-contracts/          # Explicit public DTOs & Event Envelopes (Zero DB Leaks)
│   ├── i18n/                    # Localization dictionaries (Telugu, Hindi, English)
│   ├── database/                # Prisma schema (50+ models) & Neon PostgreSQL migrations
│   ├── matching-engine/         # Deterministic 2-stage geospatial & ranking engine
│   └── shared-types/            # Shared cross-boundary TypeScript types
├── scripts/
│   ├── verify_modules.py        # Master verification test suite (Milestones 1 to 23)
│   └── repair_git.ps1           # Windows Git index self-healing utility
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js 20+** & **pnpm 8+**
- **Python 3.10+** (for verification test runner)
- **PostgreSQL 15+** (or Neon Cloud PostgreSQL connection)

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/kuruvamunirangadu/Rural-connectivity.git
cd Rural-connectivity

# 2. Install dependencies
pnpm install

# 3. Setup Database & Prisma Client
pnpm --filter @ruralconnect/database db:push

# 4. Start Backend API & Frontend Web Dev Servers
pnpm --filter @ruralconnect/api run dev    # Backend API on http://localhost:4000
pnpm --filter @ruralconnect/web run dev    # Frontend Web on http://localhost:3000
```

---

## 🧪 Master Test Suite (Milestones 1–23)

Run the full end-to-end algorithmic, architectural, and lifecycle verification suite:

```bash
python scripts/verify_modules.py
```

### Verification Output:
```text
=================================================================
   RURALCONNECT FULL ARCHITECTURAL & USER-ROLE VERIFICATION SUITE
=================================================================
[PASS] M1-M18 Domain & Operational Tests Passed
[PASS] M19: Rural Workforce, Jobs & Skill Marketplace
[PASS] M20: Rural Asset Rental, Equipment Sharing & Machinery Marketplace
[PASS] M21: Rural Commerce & Local Business Marketplace
[PASS] M22: Rural Identity, Wallet & Unified Transaction Layer
[PASS] M23: Rural Data Platform, Interoperability & Open Architecture
=================================================================
[SUCCESS] ALL MILESTONES 1 THROUGH 23 TESTS PASSED (0 ERRORS)!
=================================================================
```

---

## 🔧 Troubleshooting & Self-Healing Utilities

### Git Index Repair on Windows
If a background file watcher or build process locks `.git/index` producing `fatal: .git/index: index file smaller than expected`, run the included self-healing script:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/repair_git.ps1
```

Or execute directly:
```powershell
if (Test-Path .git/index) { Remove-Item .git/index -Force; git reset }
```

---

## 📄 License

MIT License. Developed with pride for rural agricultural empowerment and open digital public infrastructure.
