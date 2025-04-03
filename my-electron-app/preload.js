const { contextBridge, ipcRenderer } = require('electron');

// 检查环境
console.log('预加载脚本运行中...');
console.log('contextBridge可用:', !!contextBridge);
console.log('ipcRenderer可用:', !!ipcRenderer);

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取后端问候信息
  getHello: () => {
    console.log('预加载脚本: 调用getHello');
    return ipcRenderer.invoke('get-hello');
  },
  
  // 发送消息到后端
  sendMessage: (message) => {
    console.log('预加载脚本: 调用sendMessage, 消息:', message);
    return ipcRenderer.invoke('send-message', message);
  }
}); 