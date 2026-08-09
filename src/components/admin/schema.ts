import * as z from 'zod';

// --- Sub-schemas ---

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

// --- Main project schema ---

export const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  tagline: z.string().min(10, 'Tagline must be at least 10 characters.'),
  overview: z.string().min(20, 'Overview must be at least 20 characters.'),
  technologies: z.string().min(2, 'Please add at least one technology.'),
  imageUrl: z.string().url('A valid cover image URL is required.'),
  diagramUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  links: z.object({
    website: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    demo: z.string().url().optional().or(z.literal('')),
  }).optional(),
  impactMetrics: z.array(impactMetricSchema).default([]),
  systemFeatures: z.array(systemFeatureSchema).default([]),
  architecturalChallenges: z.array(architecturalChallengeSchema).default([]),
  dxSnippet: z.string().optional(),
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
