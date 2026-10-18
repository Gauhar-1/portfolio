// ─────────────────────────────────────────────────────────────────────────────
// Centralized Data Dictionary: Architecture Case Studies
// ─────────────────────────────────────────────────────────────────────────────
// Adding a new architecture case study is completely Open/Closed:
// Simply append a new entry to `architecturesData` below.
// The dynamic route (`app/architecture/[slug]/page.tsx`), theming engine,
// and visual registry will automatically adapt without touching any TSX files.
// ─────────────────────────────────────────────────────────────────────────────

export interface HeroMetric {
  title: string;
  value: string;
  ariaLabel: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  metrics: HeroMetric[];
}

export interface ChallengeItem {
  id: string;
  title: string;
  teaser: string;
  problem: string;
  solution: string;
  impact: string;
  visualKey: "chart" | "security" | "server" | string;
}

export interface TimelineEvent {
  id: string;
  label: string;
  title: string;
  description: string;
}

export interface ArchitectureTheme {
  primaryHex: string;
  backgroundHex: string;
  textHex: string;
}

export interface ArchitectureCaseStudy {
  slug: string;
  name: string;
  theme: ArchitectureTheme;
  hero: HeroData;
  challenges: ChallengeItem[];
  roadmap: TimelineEvent[];
}

export const architecturesData: Record<string, ArchitectureCaseStudy> = {
  // ── 01. CartContext (Cyber Cyan / AI Conversational Commerce Theme) ────────
  cartcontext: {
    slug: "cartcontext",
    name: "CartContext",
    theme: {
      primaryHex: "#06b6d4", // Cyber Cyan / Electric Teal
      backgroundHex: "#0a0a0c", // Deep Obsidian / Titanium
      textHex: "#f8fafc", // Clean Slate Light
    },
    hero: {
      title: "Building CartContext: Sub-35ms Conversational Commerce with Two-Tier Semantic RAG",
      subtitle:
        "How I engineered a two-tier semantic cache, hybrid RRF search, and non-blocking event fan-out to slash LLM costs by 74.2% while achieving 35ms response times.",
      metrics: [
        {
          title: "P95 Latency",
          value: "35ms",
          ariaLabel: "P95 query latency: 35 milliseconds",
        },
        {
          title: "LLM Eliminated",
          value: "74.2%",
          ariaLabel: "LLM API calls eliminated: 74.2 percent",
        },
        {
          title: "Top-3 Recall",
          value: "96.4%",
          ariaLabel: "Hybrid search Top-3 recall: 96.4 percent",
        },
        {
          title: "Cart Mutation",
          value: "45ms",
          ariaLabel: "Checkout mutation response: 45 milliseconds",
        },
      ],
    },
    challenges: [
      {
        id: "caching",
        title: "Two-Tier Cache Waterfall",
        teaser: "Slashing LLM API spend by 74.2% with SHA-256 + Cosine pgvector caching.",
        problem:
          "Repetitive shopper queries ('does this fit M3 MacBook?', 'is size L in stock?') triggered costly OpenAI API calls with 1,400ms cold latency. At 10,000 cart sessions/hour, OpenAI rate limits and billing spikes threatened unit economics.",
        solution:
          "Engineered a hierarchical dual-tier cache waterfall. Tier 1 computes a canonical SHA-256 hash of normalized tokens in Upstash Redis (~8ms hit). Tier 2 uses a pgvector cosine similarity index (threshold >= 0.92) to match paraphrased intent in <35ms without invoking an LLM. Only novel queries fall through to the LLM stream, asynchronously backfilling L1 and L2.",
        impact:
          "Eliminated 74.2% of external LLM invocations, collapsed P95 query latency from 1,400ms to 35ms, and dropped LLM token costs to ₹0.00 for recurring catalog questions.",
        visualKey: "two-tier-cache",
      },
      {
        id: "retrieval",
        title: "Hybrid RRF Search Fusion",
        teaser: "Preventing SKU hallucinations and out-of-stock misfires across 100k+ dynamic items.",
        problem:
          "Pure dense vector embeddings frequently hallucinated semantically similar items when users specified exact model numbers (e.g. searching 'Model-X 65W GaN' returned 30W chargers). Conversely, pure BM25 keyword search missed conversational nuances like 'waterproof running jacket for windy winter'.",
        solution:
          "Implemented Reciprocal Rank Fusion (RRF) using Score = Σ 1 / (60 + rank). Ran parallel dual-pipeline retrieval: BM25 over SKU, serials, and exact product specs; dense OpenAI text-embedding-3-small vectors over user intent and product descriptions. Converged rankings in real-time in memory.",
        impact:
          "Jumped Top-3 retrieval recall from 68.2% to 96.4%, with zero hallucinated inventory recommendations across 125,000 production SKUs.",
        visualKey: "hybrid-rrf-fusion",
      },
      {
        id: "event-bus",
        title: "Async Inngest Event Bus",
        teaser: "Decoupling transactional cart commits from heavy vector re-indexing and telemetry fan-outs.",
        problem:
          "When shoppers modified carts or completed checkout, updating inventory ledgers, invalidating stale semantic caches, and re-embedding price/stock changes synchronously choked the main request thread, causing 800ms+ cart lags and drop-offs.",
        solution:
          "Architected an event-driven worker pipeline powered by Inngest. Cart checkout and inventory mutations immediately return HTTP 200 OK in under 45ms with 0ms thread block. An async durable event bus fans out into three isolated, retriable step functions: (1) evicting stale L2 semantic cache keys, (2) triggering background SKU re-embeddings, and (3) atomic inventory reconciliation.",
        impact:
          "Cart checkout mutation response dropped to 45ms flat. Worker failures automatically retry with exponential backoff with zero dropped state or cart lockouts.",
        visualKey: "inngest-event-bus",
      },
    ],
    roadmap: [
      {
        id: "phase1",
        label: "Phase 1",
        title: "Two-Tier Semantic Caching & RRF Search MVP",
        description:
          "Deploying Upstash Redis L1 hash cache, pgvector L2 similarity thresholding, and in-memory Reciprocal Rank Fusion convergence.",
      },
      {
        id: "phase2",
        label: "Phase 2",
        title: "Inngest Durable Event Bus & Zero-Block Checkout",
        description:
          "Decoupling inventory mutation commits, automated cache invalidation, and background SKU vector re-indexing via step functions.",
      },
      {
        id: "phase3",
        label: "Phase 3",
        title: "Edge Model Speculative Streaming & Multi-Vendor Mesh",
        description:
          "Running quantized 1.5B edge SLMs directly on Cloudflare Workers for sub-10ms token streaming with multi-tenant inventory sharding.",
      },
    ],
  },

  // ── 1. QuickbiteQR (Dark / Neon-Green & Cyber-Teal Theme) ─────────────────
  quickbiteqr: {
    slug: "quickbiteqr",
    name: "QuickbiteQR",
    theme: {
      primaryHex: "#10b981", // Neon Green / Emerald
      backgroundHex: "#0a0a0c", // Deep Obsidian / Titanium
      textHex: "#f8fafc", // Clean Slate Light
    },
    hero: {
      title: "Building QuickbiteQR: Architecting a Zero-Commission POS from 0 to 1.",
      subtitle:
        "How I built a serverless architecture to handle Friday night restaurant rushes with 98% compute margins.",
      metrics: [
        {
          title: "Compute Margin",
          value: "98.9%",
          ariaLabel: "Compute margin: 98.9 percent",
        },
        {
          title: "Infra COGS",
          value: "₹15 / mo",
          ariaLabel: "Infrastructure cost: 15 rupees per month",
        },
        {
          title: "Peak Scale",
          value: "250+ RPS",
          ariaLabel: "Peak scale: over 250 requests per second",
        },
        {
          title: "Gateway Fees",
          value: "0%",
          ariaLabel: "Payment gateway fees: zero percent",
        },
      ],
    },
    challenges: [
      {
        id: "scale",
        title: "Menu Read Scaling",
        teaser: "How caching defeated the Friday night rush.",
        problem:
          "Restaurant traffic isn't steady; it is aggressively clustered. On Friday at 8:30 PM, hundreds of diners scan QR codes simultaneously. Querying our relational database to build complex menus for every scan was exhausting connection limits.",
        solution:
          "I decoupled the read and write paths. I orchestrated an Edge Caching layer using Upstash Redis. When a menu is updated, it is instantly packaged and pushed to the edge.",
        impact:
          "Diners load menus in <250ms globally. Our primary database saw a 92% drop in read traffic, reserving 100% of compute for processing payments.",
        visualKey: "chart",
      },
      {
        id: "security",
        title: "Zero-Trust Checkout",
        teaser: "Securing direct UPI without gateway fees.",
        problem:
          "To bypass 2-3% payment gateway fees, we utilized direct UPI deep links. But moving checkout to the client opens a fraud vector: a malicious diner could change their bill from ₹1,000 to ₹1 on their device.",
        solution:
          "I designed a strict 'Zero-Trust' server-authoritative checkout. The phone only sends item IDs. The backend recalculates the exact financial total securely and generates an encrypted UPI intent string directly to the banking app.",
        impact:
          "Eliminated the 2% gateway tax with 100% fraud prevention. Implemented idempotency locks so network-lag double clicks never send duplicate tickets to the kitchen.",
        visualKey: "security",
      },
      {
        id: "analytics",
        title: "Analytics Decoupling",
        teaser: "Running heavy data without crashing checkouts.",
        problem:
          "Owners need real-time data to know if an item is sold out or if Tuesday is unprofitable. Running heavy analytical math on the live database during a dinner rush spikes CPU usage and slows down diner checkouts.",
        solution:
          "I engineered automated background cron jobs that run at 3:00 AM. These jobs crunch the heavy data and save it to a lightweight, pre-calculated analytics table.",
        impact:
          "When an owner opens their dashboard, complex analytics load in 12 milliseconds with absolutely zero impact on the live ordering system.",
        visualKey: "server",
      },
    ],
    roadmap: [
      {
        id: "current",
        label: "Phase 1",
        title: "0 to 500 Outlets — Validation & MVP",
        description:
          "Establishing a profitable ₹15/mo COGS baseline using Next.js App Router, Supabase Postgres, and Edge Redis caching.",
      },
      {
        id: "next",
        label: "Phase 2",
        title: "1,000 to 5,000 Outlets — Event Streaming",
        description:
          "Migrating Kitchen Display WebSockets from Database-level Realtime to a dedicated Apache Kafka/Redpanda event bus to isolate the core database.",
      },
      {
        id: "future",
        label: "Phase 3",
        title: "10,000+ Outlets — Global Distribution",
        description:
          "Transitioning to ClickHouse read-models for instant operational intelligence and deploying multi-region active-active database replicas.",
      },
    ],
  },

  // Alias for backward-compatibility with previous /architecture/quickbite URL
  quickbite: {
    slug: "quickbite",
    name: "QuickbiteQR",
    theme: {
      primaryHex: "#10b981",
      backgroundHex: "#0a0a0c",
      textHex: "#f8fafc",
    },
    hero: {
      title: "Building QuickbiteQR: Architecting a Zero-Commission POS from 0 to 1.",
      subtitle:
        "How I built a serverless architecture to handle Friday night restaurant rushes with 98% compute margins.",
      metrics: [
        {
          title: "Compute Margin",
          value: "98.9%",
          ariaLabel: "Compute margin: 98.9 percent",
        },
        {
          title: "Infra COGS",
          value: "₹15 / mo",
          ariaLabel: "Infrastructure cost: 15 rupees per month",
        },
        {
          title: "Peak Scale",
          value: "250+ RPS",
          ariaLabel: "Peak scale: over 250 requests per second",
        },
        {
          title: "Gateway Fees",
          value: "0%",
          ariaLabel: "Payment gateway fees: zero percent",
        },
      ],
    },
    challenges: [
      {
        id: "scale",
        title: "Menu Read Scaling",
        teaser: "How caching defeated the Friday night rush.",
        problem:
          "Restaurant traffic isn't steady; it is aggressively clustered. On Friday at 8:30 PM, hundreds of diners scan QR codes simultaneously. Querying our relational database to build complex menus for every scan was exhausting connection limits.",
        solution:
          "I decoupled the read and write paths. I orchestrated an Edge Caching layer using Upstash Redis. When a menu is updated, it is instantly packaged and pushed to the edge.",
        impact:
          "Diners load menus in <250ms globally. Our primary database saw a 92% drop in read traffic, reserving 100% of compute for processing payments.",
        visualKey: "chart",
      },
      {
        id: "security",
        title: "Zero-Trust Checkout",
        teaser: "Securing direct UPI without gateway fees.",
        problem:
          "To bypass 2-3% payment gateway fees, we utilized direct UPI deep links. But moving checkout to the client opens a fraud vector: a malicious diner could change their bill from ₹1,000 to ₹1 on their device.",
        solution:
          "I designed a strict 'Zero-Trust' server-authoritative checkout. The phone only sends item IDs. The backend recalculates the exact financial total securely and generates an encrypted UPI intent string directly to the banking app.",
        impact:
          "Eliminated the 2% gateway tax with 100% fraud prevention. Implemented idempotency locks so network-lag double clicks never send duplicate tickets to the kitchen.",
        visualKey: "security",
      },
      {
        id: "analytics",
        title: "Analytics Decoupling",
        teaser: "Running heavy data without crashing checkouts.",
        problem:
          "Owners need real-time data to know if an item is sold out or if Tuesday is unprofitable. Running heavy analytical math on the live database during a dinner rush spikes CPU usage and slows down diner checkouts.",
        solution:
          "I engineered automated background cron jobs that run at 3:00 AM. These jobs crunch the heavy data and save it to a lightweight, pre-calculated analytics table.",
        impact:
          "When an owner opens their dashboard, complex analytics load in 12 milliseconds with absolutely zero impact on the live ordering system.",
        visualKey: "server",
      },
    ],
    roadmap: [
      {
        id: "current",
        label: "Phase 1",
        title: "0 to 500 Outlets — Validation & MVP",
        description:
          "Establishing a profitable ₹15/mo COGS baseline using Next.js App Router, Supabase Postgres, and Edge Redis caching.",
      },
      {
        id: "next",
        label: "Phase 2",
        title: "1,000 to 5,000 Outlets — Event Streaming",
        description:
          "Migrating Kitchen Display WebSockets from Database-level Realtime to a dedicated Apache Kafka/Redpanda event bus to isolate the core database.",
      },
      {
        id: "future",
        label: "Phase 3",
        title: "10,000+ Outlets — Global Distribution",
        description:
          "Transitioning to ClickHouse read-models for instant operational intelligence and deploying multi-region active-active database replicas.",
      },
    ],
  },

  // ── 2. Mock Company (Light / Blue Theme) ──────────────────────────────────
  "mock-company": {
    slug: "mock-company",
    name: "CloudScale IO",
    theme: {
      primaryHex: "#9b0b21ff", // Vibrant Royal Blue
      backgroundHex: "#8a9babff", // Clean Slate Light
      textHex: "#0f172a", // Deep Slate / Charcoal
    },
    hero: {
      title: "Architecting CloudScale IO: Multi-Region Event Mesh at 10M RPS.",
      subtitle:
        "How we engineered a geo-distributed event mesh maintaining sub-10ms p99 latency under global cloud failover.",
      metrics: [
        {
          title: "Global p99",
          value: "8.4ms",
          ariaLabel: "Global p99 latency: 8.4 milliseconds",
        },
        {
          title: "Availability",
          value: "99.999%",
          ariaLabel: "Availability: five nines",
        },
        {
          title: "Event Throughput",
          value: "10M RPS",
          ariaLabel: "Event throughput: 10 million requests per second",
        },
        {
          title: "Data Loss",
          value: "0%",
          ariaLabel: "Data loss rate: zero percent",
        },
      ],
    },
    challenges: [
      {
        id: "mesh",
        title: "Multi-Region Replication",
        teaser: "Solving split-brain across continents with Raft consensus.",
        problem:
          "Network partitions between US-East and EU-West triggered conflicting ledger states and write collisions across our distributed cluster nodes.",
        solution:
          "Implemented an optimized Raft consensus ring with leaseholders and active-active read replicas, pruning cross-Atlantic round trips by 80%.",
        impact:
          "Zero split-brain occurrences across 18 months of production chaos engineering with deterministic 3-node quorums.",
        visualKey: "server",
      },
      {
        id: "throughput",
        title: "High-Throughput Backpressure",
        teaser: "Preventing cascading crashes during upstream traffic floods.",
        problem:
          "Sudden 5x traffic surges from downstream webhooks saturated memory buffers, inducing out-of-memory container crashes.",
        solution:
          "Engineered an adaptive token-bucket rate limiter coupled with kernel-bypass epoll rings and disk-spill queues.",
        impact:
          "Gracefully absorbs 10M RPS bursts while sustaining a steady 12,000 events/sec downstream delivery rate.",
        visualKey: "chart",
      },
      {
        id: "zero-trust",
        title: "mTLS Mesh Security",
        teaser: "Zero-trust service identity across hybrid multi-cloud.",
        problem:
          "Perimeter-only security models exposed internal inter-service traffic to lateral movement risks and unencrypted wire eavesdropping.",
        solution:
          "Rolled out SPIFFE/SPIRE automated cryptographic mTLS identities with 1-hour ephemeral certificate rotations.",
        impact:
          "Achieved SOC2 Type II compliance with cryptographically verified identity on 100% of inter-pod RPC calls.",
        visualKey: "security",
      },
    ],
    roadmap: [
      {
        id: "phase1",
        label: "Phase 1",
        title: "Single-Region Ingestion MVP",
        description:
          "Deploying high-throughput Go microservices on Kubernetes with NVMe-backed Kafka clusters.",
      },
      {
        id: "phase2",
        label: "Phase 2",
        title: "Active-Active Global Mesh",
        description:
          "Deploying multi-region Anycast BGP routing with geo-distributed Raft consensus groups.",
      },
      {
        id: "phase3",
        label: "Phase 3",
        title: "Autonomous Edge Healing",
        description:
          "Machine-learning driven traffic shaping that preemptively reroutes traffic around degraded transit backbones.",
      },
    ],
  },
};
