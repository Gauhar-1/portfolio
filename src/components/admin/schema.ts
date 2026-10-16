import * as z from 'zod';

// --- Category Enum ---
export const projectCategoryEnum = z.enum(['AI_RAG', 'SYSTEMS_ENGINES', 'FULLSTACK_SAAS']);
export type ProjectCategory = z.infer<typeof projectCategoryEnum>;

// --- Legacy Sub-schemas (kept for backward compatibility) ---
export const impactMetricSchema = z.object({
  label: z.string().min(1, 'Label is required.'),
  value: z.string().min(1, 'Value is required.'),
  context: z.string().min(1, 'Context is required.'),
});

export const systemFeatureSchema = z.object({
  featureTitle: z.string().min(2, 'Feature title must be at least 2 characters.'),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
});

export const architecturalChallengeSchema = z.object({
  theme: z.string().min(2, 'Theme must be at least 2 characters.'),
  bottleneck: z.string().min(5, 'Bottleneck must be at least 5 characters.'),
  solution: z.string().min(5, 'Solution must be at least 5 characters.'),
  tradeoff: z.string().min(5, 'Trade-off must be at least 5 characters.'),
});

// --- Lean Project Schema ---

export const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9]+$/, 'Slug must only contain lowercase alphanumeric characters with no spaces.'),
  category: projectCategoryEnum.default('AI_RAG'),
  featuredOrder: z.coerce.number().default(99),
  tagline: z.string().min(5, 'Tagline is required (5-8 word hook).'),
  overview: z.string().min(10, 'Overview is required (2-sentence business problem + architecture hook).'),
  technologies: z.string().min(1, 'Please add at least one technology.'),
  imageUrl: z.string().url('A valid cover image URL is required.'),
  videoUrl: z.string().url().optional().or(z.literal('')),
  links: z
    .object({
      website: z.string().url().optional().or(z.literal('')),
      github: z.string().url().optional().or(z.literal('')),
      demo: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

// --- Cloudinary helper ---

/**
 * Extracts the Cloudinary public_id from a secure_url.
 * e.g. "https://res.cloudinary.com/deoly6ahb/image/upload/v1234/devfolio/abc123.jpg"
 *    → "devfolio/abc123"
 */
export function extractCloudinaryPublicId(url: string): string | null {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    // Remove the version prefix (v1234567890/) if present
    const afterUpload = parts[1].replace(/^v\d+\//, '');
    // Remove the file extension
    const publicId = afterUpload.replace(/\.[^/.]+$/, '');
    return publicId || null;
  } catch {
    return null;
  }
}
