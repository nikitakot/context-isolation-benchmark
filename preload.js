const { ipcRenderer } = require('electron')
const { contextBridge } = require('electron')

console.log('ctx isolation: ', process.contextIsolated);

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('ipcInvoke', ipcRenderer.invoke)
  contextBridge.exposeInMainWorld('ipcSync', ipcRenderer.sendSync)
} else {
  window.ipcInvoke = ipcRenderer.invoke
  window.ipcSync = ipcRenderer.sendSync
}
