const {app, BrowserWindow} = require('electron');
const path = require('path');

// Note: Must match `build.appId` in package.json.
app.setAppUserModelId('com.company.AppName');

// Electron Reloader
try {
  require('electron-reloader')(module);
} catch { }

let mainWindow;
// Create Window.
const createMainWindow = async () => {
  const win = new BrowserWindow({
    title: app.name,
    show: false,
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // Protect against prototype pollution.
      enableRemoteModule: false, // Turn off Remote
      preload: path.join(app.getAppPath(), './app/preload.js'),
    },
  });
  win.on('ready-to-show', () => {
    win.maximize();
    win.show();
  });
  win.on('closed', () => {
    // Dereference the window.
    // For multiple windows store them in an array.
    mainWindow = undefined;
  });

  // Optional:

  win.removeMenu(); // Remove menu.
  // win.webContents.openDevTools(); // Open DevTools.

  await win.loadURL('https://stackedit.io/app/#');
  return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
  }
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', async () => {
  if (!mainWindow) {
    mainWindow = await createMainWindow();
  }
});

(async () => {
  await app.whenReady();
  mainWindow = await createMainWindow();
})();
