// Public ENV variables
export const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "0.0.0.0:8000";
export const WEBSOCKET_URL =
    process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://0.0.0.0:8000";

// UI behaviour
export const DEFAULT_ACTIVE_DASHBOARD_TAB = "overview";
