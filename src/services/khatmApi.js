import { apiRequest } from "./apiClient";

// Create a new Khatm
export function createKhatm(data, token) {
  return apiRequest("/khatms", {
    method: "POST",
    body: data,
    token,
  });
}

// Get all Khatms for the logged-in user
export function getMyKhatms(token) {
  return apiRequest("/khatms", {
    token,
  });
}

// Get one Khatm by ID
export function getKhatmById(id, token) {
  return apiRequest(`/khatms/${id}`, {
    token,
  });
}

// Get Khatm details using invite code
export function getKhatmByInviteCode(inviteCode, token) {
  return apiRequest(`/khatms/invite/${inviteCode}`, {
    token,
  });
}

// Join a Khatm using its Khatm ID
export function joinKhatmApi(khatmId, token) {
  return apiRequest(`/khatms/${khatmId}/join`, {
    method: "POST",
    token,
  });
}

// Update a Khatm
export function updateKhatm(id, data, token) {
  return apiRequest(`/khatms/${id}`, {
    method: "PUT",
    body: data,
    token,
  });
}

// Get all Paras of a Khatm
export function getParas(khatmId, token) {
  return apiRequest(`/khatms/${khatmId}/paras`, {
    token,
  });
}

// Claim a Para
export function claimParaApi(khatmId, paraNumber, token) {
  return apiRequest(`/khatms/${khatmId}/paras/${paraNumber}/claim`, {
    method: "POST",
    token,
  });
}

// Complete a Para
export function completeParaApi(khatmId, paraNumber, token) {
  return apiRequest(`/khatms/${khatmId}/paras/${paraNumber}/complete`, {
    method: "POST",
    token,
  });
}

// Get Khatm members
export function getMembers(khatmId, token) {
  return apiRequest(`/khatms/${khatmId}/members`, {
    token,
  });
}

// Get activity log
export function getActivity(khatmId, token) {
  return apiRequest(`/khatms/${khatmId}/activity`, {
    token,
  });
}