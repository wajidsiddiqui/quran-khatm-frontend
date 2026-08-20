import { apiRequest } from "./apiClient";

// Get the logged-in user's reading progress
// for a specific Khatm + Para.
export function getReadingProgress(khatmId, paraNumber, token) {
  return apiRequest(`/reading-progress/${khatmId}/${paraNumber}`, {
    token,
  });
}

// Save/update the logged-in user's
// confirmed reading position.
export function saveReadingProgress(khatmId, paraNumber, data, token) {
  return apiRequest(`/reading-progress/${khatmId}/${paraNumber}`, {
    method: "POST",
    body: data,
    token,
  });
}
