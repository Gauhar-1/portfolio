import { z } from 'zod';

export const VISUAL_KEY_OPTIONS = [
  { value: 'chart', label: 'Chart Visual (Line / Spike / Analytics)' },
  { value: 'security', label: 'Security Visual (Zero-Trust / Cryptographic Lock)' },
  { value: 'server', label: 'Server Visual (Decoupled Mesh / Ingestion)' },
  { value: 'layout-orchestrator', label: 'Layout Orchestrator (Zero-Deploy Storefront Slots)' },
  { value: 'block-ast', label: 'Block AST (Polymorphic Editorial Studio)' },
  { value: 'schema-compiler', label: 'Schema Compiler (Form Engine / JSON-to-UI)' },
  { value: 'service-mesh', label: 'Service Mesh (Decoupled Microservices / Gateway)' },
  { value: 'pubsub-stream', label: 'PubSub Stream (Real-Time Redis / WebSockets)' },
  { value: 'rls-shield', label: 'RLS Shield (Granular RBAC / Jurisdiction Locked)' },
  { value: 'state-loop', label: 'State Loop (Deterministic Multiplayer Engine)' },
  { value: 'escrow-ledger', label: 'Escrow Ledger (Atomic Wagers / Zero Double-Spend)' },
  { value: 'webgl-pipeline', label: 'WebGL Pipeline (R3F 3D Shaders / 60 FPS)' },
  { value: 'two-tier-cache', label: 'Two-Tier Cache (L1 Redis + L2 Vector Cosine / Sub-35ms)' },
  { value: 'hybrid-rrf-fusion', label: 'Hybrid RRF Fusion (Lexical BM25 + Dense Vector)' },
  { value: 'inngest-event-bus', label: 'Inngest Event Bus (Async Fan-Out / 0ms Thread Block)' },
  { value: 'zod-ast-parser', label: 'Zod AST Parser (Prompt-to-Cinematic AST Compiler)' },
  { value: 'tanstack-optimistic-sync', label: 'TanStack Optimistic Sync (Sub-16ms UI / Async Reconcile)' },
  { value: 'context-window-compressor', label: 'Context Window Compressor (Invariant Extraction / -68% Tokens)' },
  { value: 'bullmq-async-workers', label: 'BullMQ Async Workers (Redis Job Queue / Non-Blocking Ingestion)' },
  { value: 'provider-factory-router', label: 'Provider Factory Router (Dependency-Inverted LLM Hot-Swap)' },
  { value: 'llm-judge-harness', label: 'LLM Judge Harness (150-Item Golden Dataset / CI Evaluation)' },
  { value: 'enclave-key-signer', label: 'Enclave Key Signer (Air-Gapped Vault / 0-Byte Key Leak)' },
  { value: 'rpc-failover-mesh', label: 'RPC Failover Mesh (Multi-RPC Circuit Breaker / <120ms)' },
  { value: 'mempool-state-machine', label: 'Mempool State Machine (Atomic Nonce Sequencer / 4-Stage)' },
  { value: 'cohere-rerank-funnel', label: 'Cohere Rerank Funnel (2-Stage Retrieval / +34.2% Precision)' },
  { value: 'async-intent-triage', label: 'Async Intent Triage (Sub-18ms Router / Priority Lanes)' },
  { value: 'golden-eval-matrix', label: 'Golden Eval Matrix (150-Case Benchmark / 0.00% Hallucinations)' },
  { value: 'ChartVisual', label: 'ChartVisual (Alternative Registry Key)' },
  { value: 'SecurityVisual', label: 'SecurityVisual (Alternative Registry Key)' },
  { value: 'ServerVisual', label: 'ServerVisual (Alternative Registry Key)' },
  { value: 'LayoutOrchestratorVisual', label: 'LayoutOrchestratorVisual (Alternative Registry Key)' },
  { value: 'BlockAstVisual', label: 'BlockAstVisual (Alternative Registry Key)' },
  { value: 'SchemaCompilerVisual', label: 'SchemaCompilerVisual (Alternative Registry Key)' },
  { value: 'ServiceMeshVisual', label: 'ServiceMeshVisual (Alternative Registry Key)' },
  { value: 'PubSubStreamVisual', label: 'PubSubStreamVisual (Alternative Registry Key)' },
  { value: 'RlsShieldVisual', label: 'RlsShieldVisual (Alternative Registry Key)' },
  { value: 'StateLoopVisual', label: 'StateLoopVisual (Alternative Registry Key)' },
  { value: 'EscrowLedgerVisual', label: 'EscrowLedgerVisual (Alternative Registry Key)' },
  { value: 'WebGlPipelineVisual', label: 'WebGlPipelineVisual (Alternative Registry Key)' },
  { value: 'TwoTierCacheVisual', label: 'TwoTierCacheVisual (Alternative Registry Key)' },
  { value: 'HybridRrfFusionVisual', label: 'HybridRrfFusionVisual (Alternative Registry Key)' },
  { value: 'InngestEventBusVisual', label: 'InngestEventBusVisual (Alternative Registry Key)' },
  { value: 'ZodAstParserVisual', label: 'ZodAstParserVisual (Alternative Registry Key)' },
  { value: 'TanstackOptimisticSyncVisual', label: 'TanstackOptimisticSyncVisual (Alternative Registry Key)' },
  { value: 'ContextWindowCompressorVisual', label: 'ContextWindowCompressorVisual (Alternative Registry Key)' },
  { value: 'BullMqAsyncWorkersVisual', label: 'BullMqAsyncWorkersVisual (Alternative Registry Key)' },
  { value: 'ProviderFactoryRouterVisual', label: 'ProviderFactoryRouterVisual (Alternative Registry Key)' },
  { value: 'LlmJudgeHarnessVisual', label: 'LlmJudgeHarnessVisual (Alternative Registry Key)' },
  { value: 'EnclaveKeySignerVisual', label: 'EnclaveKeySignerVisual (Alternative Registry Key)' },
  { value: 'RpcFailoverMeshVisual', label: 'RpcFailoverMeshVisual (Alternative Registry Key)' },
  { value: 'MempoolStateMachineVisual', label: 'MempoolStateMachineVisual (Alternative Registry Key)' },
  { value: 'CohereRerankFunnelVisual', label: 'CohereRerankFunnelVisual (Alternative Registry Key)' },
  { value: 'AsyncIntentTriageVisual', label: 'AsyncIntentTriageVisual (Alternative Registry Key)' },
  { value: 'GoldenEvalMatrixVisual', label: 'GoldenEvalMatrixVisual (Alternative Registry Key)' },
] as const;

export const architectureSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens (e.g., quickbiteqr)'),
  name: z.string().min(1, 'Name is required (e.g., QuickbiteQR)'),
  theme: z.object({
    primaryHex: z
      .string()
      .min(1, 'Primary hex color is required')
      .regex(/^#([0-9a-fA-F]{3,8})$/, 'Must be a valid hex color (e.g. #10b981)'),
    backgroundHex: z
      .string()
      .min(1, 'Background hex color is required')
      .regex(/^#([0-9a-fA-F]{3,8})$/, 'Must be a valid hex color (e.g. #0a0a0c)'),
    textHex: z
      .string()
      .min(1, 'Text hex color is required')
      .regex(/^#([0-9a-fA-F]{3,8})$/, 'Must be a valid hex color (e.g. #f8fafc)'),
  }),
  hero: z.object({
    title: z.string().min(1, 'Hero title is required'),
    subtitle: z.string().min(1, 'Hero subtitle is required'),
    metrics: z
      .array(
        z.object({
          title: z.string().min(1, 'Metric title is required'),
          value: z.string().min(1, 'Metric value is required (e.g. 98.9%)'),
          ariaLabel: z.string().optional().default(''),
        })
      )
      .min(1, 'At least 1 metric is required')
      .max(6, 'Maximum 6 metrics allowed'),
  }),
  challenges: z
    .array(
      z.object({
        id: z.string().min(1, 'Challenge ID is required (e.g. scale)'),
        title: z.string().min(1, 'Challenge title is required'),
        teaser: z.string().min(1, 'Teaser is required'),
        problem: z.string().min(1, 'Problem description is required'),
        solution: z.string().min(1, 'Solution description is required'),
        impact: z.string().min(1, 'Impact description is required'),
        visualKey: z.string().min(1, 'Visual Key is required'),
      })
    )
    .min(1, 'At least 1 challenge card is required'),
  roadmap: z
    .array(
      z.object({
        phase: z.string().min(1, 'Phase label is required (e.g. Phase 1)'),
        title: z.string().min(1, 'Roadmap title is required'),
        description: z.string().min(1, 'Roadmap description is required'),
      })
    )
    .min(1, 'At least 1 roadmap milestone is required'),
});

export type ArchitectureFormValues = z.infer<typeof architectureSchema>;
