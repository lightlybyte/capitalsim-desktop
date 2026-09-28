const { app, BrowserWindow, shell, session, nativeTheme } = require('electron');
const path = require('path');

// >>> CHANGE THIS to your HTTPS server URL <<<
const SERVER_URL = 'https://capitalsim.yourdomain.com';

// Unique partition name — this is what makes the session persist to disk
const PARTITION = 'persist:capitalsim';

let mainWindow = null;

// Match the app's dark theme to CapitalSim's UI
nativeTheme.themeSource = 'dark';

function createWindow() {
  // Configure the persistent session BEFORE creating the window
  const ses = session.fromPartition(PARTITION);

  // Optional: spoof a desktop user-agent so your Flask app can detect
  // the desktop client if it ever needs to (e.g., to hide the mobile nav)
  const userAgent = app.userAgentFallback
    .replace(/Electron\/\S+/, '')
    .replace(/capitalsim-desktop\/\S+/, '')
    .trim();
  ses.setUserAgent(userAgent);

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 360,
    minHeight: 480,
    backgroundColor: '#0d1218',
    title: 'CapitalSim',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      partition: PARTITION,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  // Show window only after first paint to avoid a white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the live site
  mainWindow.loadURL(SERVER_URL);

  // Open any target="_blank" links in the OS browser, not a new Electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Any navigation away from your domain → external browser
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(SERVER_URL)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// macOS "window-all-closed" convention
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(createWindow);