const { app, BrowserWindow } = require('electron')
const remoteMain = require("@electron/remote/main");
remoteMain.initialize();

const { initWsServer } = require("./websocket")

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1366,
    height: 1024,
    icon: __dirname + './../public/yummy.ico',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  remoteMain.enable(win.webContents);

  // Load the index.html of the app.
  win.loadURL('http://localhost:3000')
  // win.loadFile('./src/index.html')

  // Open the DevTools.
  win.webContents.openDevTools()
  return win;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// This method is equivalent to 'app.on('ready', function())'
app.whenReady().then(() => {
  createWindow();
  initWsServer();
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the 
  // app when the dock icon is clicked and there are no 
  // other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file, you can include the rest of your
// app's specific main process code. You can also
// put them in separate files and require them here.