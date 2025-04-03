console.log('Hello from Electron 👋')

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 在开发模式下加载本地React服务器
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // 在生产模式下加载打包后的React应用
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 处理与Java后端的通信
ipcMain.handle('get-hello', async () => {
  console.log('尝试从Java后端获取问候...');
  try {
    const response = await axios.get('http://localhost:8080/api/hello', {
      timeout: 5000 // 设置5秒超时
    });
    console.log('成功获取问候:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取问候失败:', error.message);
    if (error.code === 'ECONNREFUSED') {
      return '无法连接到Java后端 (连接被拒绝)';
    }
    if (error.code === 'ETIMEDOUT') {
      return '无法连接到Java后端 (连接超时)';
    }
    return `无法连接到Java后端: ${error.message}`;
  }
});

ipcMain.handle('send-message', async (event, message) => {
  console.log('尝试向Java后端发送消息:', message);
  try {
    const response = await axios.post('http://localhost:8080/api/message', 
      { message }, 
      {
        timeout: 5000, // 设置5秒超时
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('成功发送消息，收到响应:', response.data);
    return response.data;
  } catch (error) {
    console.error('发送消息失败:', error.message);
    if (error.code === 'ECONNREFUSED') {
      return { response: '无法连接到Java后端 (连接被拒绝)' };
    }
    if (error.code === 'ETIMEDOUT') {
      return { response: '无法连接到Java后端 (连接超时)' };
    }
    return { response: `无法连接到Java后端: ${error.message}` };
  }
});