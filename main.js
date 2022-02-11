// Modules to control application life and create native browser window
const { app, BrowserWindow, MessageChannelMain, ipcMain } = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // We'll be sending one end of this channel to the main world of the
  // context-isolated page.
  const { port1, port2 } = new MessageChannelMain()

  // We can also receive messages from the main world of the renderer.
  port2.on('message', (event) => {
    // console.log('from renderer main world:', event.data)
    port2.postMessage(event.data);
  })
  port2.start()

  ipcMain.on('ipcEvent', (event, arg) => {
    event.sender.send('ipcEvent', arg)
  });

  // The preload script will receive this IPC message and transfer the port
  // over to the main world.
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.postMessage('main-world-port', null, [port1])
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
