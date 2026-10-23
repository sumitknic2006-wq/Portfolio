/**
 * API Service Client Placeholder
 * Prepares HTTP integration interfaces for Phase 3 Backend & MongoDB integration
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';

/**
 * Health check probe
 */
export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (error) {
    console.warn('[API Service] Backend health probe offline:', error.message);
    return { success: false, status: 'offline', error: error.message };
  }
}

/**
 * Submit contact inquiry (Prepared for Phase 3 integration)
 */
export async function submitContactMessage(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.warn('[API Service] Contact submission fallback:', error.message);
    return {
      success: false,
      message: 'Backend API service offline. Message logged on client in Phase 2.',
      error: error.message,
    };
  }
}
