// ─────────────────────────────────────────────────────────────────────────────
// Cross-Route State & Scroll Persistence (sessionStorage)
// ─────────────────────────────────────────────────────────────────────────────

export const PORTFOLIO_DATA_CACHE_KEY = 'PORTFOLIO_DATA_CACHE_V1';
export const PORTFOLIO_VIEW_STATE_KEY = 'PORTFOLIO_VIEW_STATE_V1';

export interface SavedViewState {
  sectionIndex: 0 | 1 | 2 | 3; // 0 = Hero, 1 = Experience, 2 = Projects, 3 = Contact
  heroSlotIndex: number | null;
  experienceIndex: number;     // 0 to experiences.length - 1
  projectCategory: string;
  projectSlug: string;
  updatedAt: number;
  scrollY?: number;
}

export interface PortfolioDataCache {
  heroData: any;
  experiencesData: any;
  projectsData: any;
  cachedAt: number;
}

/**
 * Retrieve saved user view state (scroll position, active cards/categories)
 */
export function getSavedViewState(): SavedViewState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(PORTFOLIO_VIEW_STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedViewState;
  } catch (err) {
    console.warn('[viewStatePersistence] Failed to read view state:', err);
    return null;
  }
}

/**
 * Save or update user view state in sessionStorage
 */
export function setSavedViewState(patch: Partial<SavedViewState>): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedViewState() || {
      sectionIndex: 0,
      heroSlotIndex: null,
      experienceIndex: 0,
      projectCategory: 'ALL',
      projectSlug: '',
      updatedAt: Date.now(),
    };

    const nextState: SavedViewState = {
      ...existing,
      ...patch,
      updatedAt: Date.now(),
    };

    sessionStorage.setItem(PORTFOLIO_VIEW_STATE_KEY, JSON.stringify(nextState));
  } catch (err) {
    console.warn('[viewStatePersistence] Failed to save view state:', err);
  }
}

/**
 * Retrieve cached API payloads (Hero, Experiences, Projects)
 */
export function getPortfolioDataCache(): PortfolioDataCache | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(PORTFOLIO_DATA_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PortfolioDataCache;
  } catch (err) {
    console.warn('[viewStatePersistence] Failed to read data cache:', err);
    return null;
  }
}

/**
 * Cache API payloads in sessionStorage to allow instantaneous return-trips
 */
export function setPortfolioDataCache(payloads: {
  heroData: any;
  experiencesData: any;
  projectsData: any;
}): void {
  if (typeof window === 'undefined') return;
  try {
    const data: PortfolioDataCache = {
      ...payloads,
      cachedAt: Date.now(),
    };
    sessionStorage.setItem(PORTFOLIO_DATA_CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('[viewStatePersistence] Failed to save data cache:', err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Semantic Landing Page State Map
// ─────────────────────────────────────────────────────────────────────────────

export const PORTFOLIO_LANDING_MAP_KEY = 'PORTFOLIO_LANDING_MAP_V1';

export interface LandingPageMap {
  section: 'hero' | 'experience' | 'projects' | 'contact';
  sectionIndex?: 0 | 1 | 2 | 3;
  heroSlotIndex?: number | null;
  experienceIndex?: number;
  projectSlug?: string;
  projectIndex?: number;
  projectCategory?: string;
  timestamp: number;
}

/**
 * Retrieve semantic landing page destination map
 */
export function getLandingMap(): LandingPageMap | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(PORTFOLIO_LANDING_MAP_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LandingPageMap;
  } catch {
    return null;
  }
}

/**
 * Set semantic landing page map when navigating to an Architecture case study
 */
export function setLandingMap(map: Omit<LandingPageMap, 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  try {
    const data: LandingPageMap = {
      ...map,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(PORTFOLIO_LANDING_MAP_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('[viewStatePersistence] Failed to save landing map:', err);
  }
}

/**
 * Clear the landing map after successful restoration
 */
export function clearLandingMap(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(PORTFOLIO_LANDING_MAP_KEY);
  } catch {}
}
