export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Check cookies first
  const match = document.cookie.match(new RegExp('(^| )sessionId=([^;]+)'));
  if (match && match[2]) {
    return match[2];
  }

  // 2. Fallback to localStorage
  return localStorage.getItem('sessionId');
}
