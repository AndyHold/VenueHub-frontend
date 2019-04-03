import config from "../config";

/**
 * Adds the given path to the root URL and returns the full address of the endpoint
 * @param {string} path - The path of the required endpoint
 * @returns {string} The full address of the endpoint
 */
export function endpoint(path) {
  return config.backendUrl + "/api/v1" + path;
}
