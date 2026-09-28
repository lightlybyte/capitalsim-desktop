// CapitalSim desktop preload
//
// Runs in an isolated context between the Electron renderer and the
// remote page. Keep this minimal — anything you expose via contextBridge
// becomes callable from the loaded webpage, so only expose what you need.
//
// Currently empty because the app talks entirely to the remote server
// over HTTP/WebSocket. If you later want desktop-only features (native
// notifications, file save dialogs, auto-updater events), expose them
// here like:
//
//   const { contextBridge, ipcRenderer } = require('electron');
//   contextBridge.exposeInMainWorld('capitalsimDesktop', {
//     isDesktop: true,
//     platform: process.platform,
//     notify: (title, body) => ipcRenderer.invoke('notify', { title, body }),
//   });

// Expose a tiny marker so the web app can detect it's running in the
// desktop client (useful for hiding mobile UI, showing native menus, etc.)
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('capitalsimDesktop', {
  isDesktop: true,
  platform: process.platform,
  version: process.versions.electron,
});