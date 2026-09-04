/**
 * mockIngestion.js
 * ----------------
 * Simulated ingestion and conflict-engine functions.
 * Swap these for real POST calls to the backend API later
 * by editing ONLY this file — no component changes needed.
 */

/**
 * Simulates file ingestion with a ~1.5s delay.
 * Returns a promise that resolves with a success summary
 * or rejects with an error message.
 *
 * @param {string} mode - 'Batch' or the layer type name
 * @param {File}   file - The uploaded file object
 */
export function simulateIngestion(mode, file) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a small chance of failure for demo (unsupported extension)
      const ext = file.name.split('.').pop().toLowerCase();
      const unsupported = ['exe', 'pdf', 'docx', 'pptx', 'jpg', 'png'];
      if (unsupported.includes(ext)) {
        reject(`Unsupported file format: .${ext}. Expected geospatial data files.`);
        return;
      }

      // Fabricate plausible counts
      if (mode === 'Batch') {
        resolve({
          summary: `Loaded: ${randomInt(30, 60)} Parcels, ${randomInt(25, 50)} Buildings, ${randomInt(5, 15)} Municipal Zones, ${randomInt(10, 20)} Utility Lines`,
          count: randomInt(70, 145),
        });
      } else {
        const countMap = {
          'Vector Parcel Map (.geojson / .shp)': { label: 'Cadastral Parcels', min: 30, max: 60 },
          'AI Building Footprints (.geojson)': { label: 'Building Footprints', min: 25, max: 55 },
          'Revenue Tax Records (.csv)': { label: 'Revenue Records', min: 40, max: 80 },
          'Municipal Zoning Layer (.geojson / .csv)': { label: 'Municipal Zones', min: 5, max: 15 },
          'Utility Network Layer (.geojson / .csv)': { label: 'Utility Lines', min: 10, max: 25 },
          'Ground Truthing Survey (.geojson / .csv)': { label: 'GT Points', min: 8, max: 20 },
          'GNSS / CORS Stations (.geojson / .csv)': { label: 'GNSS Stations', min: 3, max: 8 },
          'Drone Aerial Image (.tif)': { label: 'Aerial Tiles Processed', min: 1, max: 4 },
        };
        const cfg = countMap[mode] || { label: 'Features', min: 10, max: 30 };
        const count = randomInt(cfg.min, cfg.max);
        resolve({
          summary: `Ingested ${count} ${cfg.label}!`,
          count,
        });
      }
    }, 1500);
  });
}

/**
 * Simulates re-running the spatial conflict engine.
 * Returns a promise that resolves after ~2s.
 */
export function simulateConflictEngine() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Analysis executed successfully!' });
    }, 2000);
  });
}

/* ── Helpers ─────────────────────────────────────────────────────── */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
