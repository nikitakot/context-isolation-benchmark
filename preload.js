// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

const { ipcRenderer } = require('electron')
const { contextBridge } = require('electron')

console.log('ctx isolation: ', process.contextIsolated);

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('ipcSend', (...args) => ipcRenderer.send('ipcEvent', ...args));
  contextBridge.exposeInMainWorld('ipcOn', (listener) => {
    ipcRenderer.once('ipcEvent', (event, ...args) => listener(...args))
  });
} else {
  window.ipcSend = (...args) => ipcRenderer.send('ipcEvent', ...args);
  window.ipcOn = (listener) => {
    ipcRenderer.once('ipcEvent', (event, ...args) => listener(...args))
  };
}

ipcRenderer.on('main-world-port', async (event) => {
  // We use regular window.postMessage to transfer the port from the isolated
  // world to the main world.
  window.postMessage('main-world-port', '*', event.ports)
})