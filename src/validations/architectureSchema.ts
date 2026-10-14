import { z } from 'zod';

export const VISUAL_KEY_OPTIONS = [
  { value: 'chart', label: 'Chart Visual (Line / Spike / Analytics)' },
  { value: 'security', label: 'Security Visual (Zero-Trust / Cryptographic Lock)' },
  { value: 'server', label: 'Server Visual (Decoupled Mesh / Ingestion)' },
  { value: 'layout-orchestrator', label: 'Layout Orchestrator (Zero-Deploy Storefront Slots)' },
  { value: 'block-ast', label: 'Block AST (Polymorphic Editorial Studio)' },
  { value: 'schema-compiler', label: 'Schema Compiler (Form Engine / JSON-to-UI)' },
  { value: 'ChartVisual', label: 'ChartVisual (Alternative Registry Key)' },
  { value: 'SecurityVisual', label: 'SecurityVisual (Alternative Registry Key)' },
  { value: 'ServerVisual', label: 'ServerVisual (Alternative Registry Key)' },
  { value: 'LayoutOrchestratorVisual', label: 'LayoutOrchestratorVisual (Alternative Registry Key)' },
  { value: 'BlockAstVisual', label: 'BlockAstVisual (Alternative Registry Key)' },
  { value: 'SchemaCompilerVisual', label: 'SchemaCompilerVisual (Alternative Registry Key)' },
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
