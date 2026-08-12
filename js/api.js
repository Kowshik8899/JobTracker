/**
 * JobTracker API Module
 * Handles all communication between frontend and backend
 */

const API = (() => {
  // Base URL for API requests
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "";
const BASE_URL = isLocal ? "http://localhost:5000/api" : "https://jobtracker-6nsn.onrender.com/api";
  // --- Token Management ---

  function getToken() {
    return localStorage.getItem("jt-token");
  }

  function setToken(token) {
    localStorage.setItem("jt-token", token);
  }

  function removeToken() {
    localStorage.removeItem("jt-token");
  }

  function getUser() {
    const data = localStorage.getItem("jt-user");
    return data ? JSON.parse(data) : null;
  }

  function setUser(user) {
    localStorage.setItem("jt-user", JSON.stringify(user));
  }

  function removeUser() {
    localStorage.removeItem("jt-user");
  }

  function isLoggedIn() {
    return !!getToken();
  }

  // --- HTTP Helpers ---

  function authHeaders() {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async function request(endpoint, options = {}) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: authHeaders(),
        ...options,
      });

      const data = await res.json();

      if (!res.ok) {
        // If unauthorized, redirect to login
        if (res.status === 401) {
          removeToken();
          removeUser();
          if (!window.location.pathname.includes("login.html")) {
            window.location.href = "login.html";
          }
        }
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // --- Auth API ---

  async function register({ name, email, password, goal }) {
    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, goal }),
    });
    setToken(data.token);
    const { token, ...user } = data;
    setUser(user);
    return data;
  }

  async function login({ email, password }) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    const { token, ...user } = data;
    setUser(user);
    return data;
  }

  function logout() {
    removeToken();
    removeUser();
    window.location.href = "login.html";
  }

  async function getProfile() {
    const res = await request("/auth/profile");
    setUser(res);
    return res;
  }

  async function updateProfile(data) {
    const res = await request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    // Update local user storage
    const { token, ...user } = res;
    setUser(user);
    return res;
  }

  // --- Applications API ---

  async function getApplications(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.status && params.status !== "all") query.set("status", params.status);
    if (params.sort) query.set("sort", params.sort);
    const qs = query.toString();
    return await request(`/applications${qs ? "?" + qs : ""}`);
  }

  async function getApplicationById(id) {
    return await request(`/applications/${id}`);
  }

  async function createApplication(appData) {
    return await request("/applications", {
      method: "POST",
      body: JSON.stringify(appData),
    });
  }

  async function updateApplication(id, appData) {
    return await request(`/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify(appData),
    });
  }

  async function deleteApplication(id) {
    return await request(`/applications/${id}`, {
      method: "DELETE",
    });
  }

  // --- Analytics API ---

  async function getAnalytics() {
    return await request("/analytics");
  }

  // --- Notifications API ---

  async function getNotifications() {
    return await request("/notifications");
  }

  async function markNotificationRead(id) {
    return await request(`/notifications/${id}/read`, {
      method: "PUT",
    });
  }

  async function markAllNotificationsRead() {
    return await request(`/notifications/read-all`, {
      method: "PUT",
    });
  }

  // --- Auth Guard ---
  // Call on protected pages to redirect unauthenticated users
  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.href = "login.html";
      return false;
    }
    return true;
  }

  // --- Public API ---
  return {
    getToken,
    getUser,
    isLoggedIn,
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    getApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
    getAnalytics,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    requireAuth,
  };
})();

// Make globally available
window.API = API;
