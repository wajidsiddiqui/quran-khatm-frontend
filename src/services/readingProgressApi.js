import { apiRequest } from "./apiClient";

/*
 * ========================================
 * GET ALL SAVED READING LOCATIONS
 * ========================================
 */
export function getAllReadingProgress(token) {
  return apiRequest(
    "/reading-progress",
    {
      token,
    },
  );
}

/*
 * ========================================
 * GET ALL QURAN BOOKMARKS
 * ========================================
 */
export function getQuranBookmarks(token) {
  return apiRequest(
    "/reading-progress/quran",
    {
      token,
    },
  );
}

/*
 * ========================================
 * SAVE / UPDATE QURAN BOOKMARK
 * ========================================
 */
export function saveQuranBookmark(
  data,
  token,
) {
  return apiRequest(
    "/reading-progress/quran",
    {
      method: "POST",
      body: data,
      token,
    },
  );
}

/*
 * ========================================
 * GET READING PROGRESS
 * FOR A SPECIFIC KHATM + PARA
 * ========================================
 */
export function getReadingProgress(
  khatmId,
  paraNumber,
  token,
) {
  return apiRequest(
    `/reading-progress/${khatmId}/${paraNumber}`,
    {
      token,
    },
  );
}

/*
 * ========================================
 * SAVE / UPDATE KHATM READING PROGRESS
 * ========================================
 */
export function saveReadingProgress(
  khatmId,
  paraNumber,
  data,
  token,
) {
  return apiRequest(
    `/reading-progress/${khatmId}/${paraNumber}`,
    {
      method: "POST",
      body: data,
      token,
    },
  );
}

/*
 * ========================================
 * DELETE SAVED READING PROGRESS
 * ========================================
 */
export function deleteReadingProgress(
  progressId,
  token,
) {
  return apiRequest(
    `/reading-progress/${progressId}`,
    {
      method: "DELETE",
      token,
    },
  );
}