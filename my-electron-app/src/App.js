import React, { useState, useEffect } from 'react';

function App() {
  const [greeting, setGreeting] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiAvailable, setApiAvailable] = useState(false);

  // 检查electronAPI是否可用
  useEffect(() => {
    if (window.electronAPI) {
      console.log('Electron API 可用');
      setApiAvailable(true);
    } else {
      console.error('Electron API 不可用');
      setError('Electron API 不可用，请确保在Electron环境中运行');
      setApiAvailable(false);
    }
  }, []);

  // 从Java后端获取问候信息
  const handleGetHello = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('调用getHello API...');
      if (!window.electronAPI) {
        throw new Error('Electron API 不可用');
      }
      
      const result = await window.electronAPI.getHello();
      console.log('收到问候结果:', result);
      setGreeting(result);
    } catch (error) {
      console.error('获取问候失败:', error);
      setGreeting('');
      setError(`获取问候失败: ${error.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  // 发送消息到Java后端
  const handleSendMessage = async () => {
    if (!message) {
      setResponse('请输入消息');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('调用sendMessage API, 消息内容:', message);
      if (!window.electronAPI) {
        throw new Error('Electron API 不可用');
      }
      
      const result = await window.electronAPI.sendMessage(message);
      console.log('收到消息响应:', result);
      setResponse(result.response);
    } catch (error) {
      console.error('发送消息失败:', error);
      setResponse('');
      setError(`发送消息失败: ${error.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Electron与Java Spring Boot通信示例</h1>
        {!apiAvailable && <p style={{ color: 'red' }}>警告: Electron API 不可用</p>}
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          <p><strong>错误:</strong> {error}</p>
        </div>
      )}
      
      <div>
        <h2>获取后端问候</h2>
        <button onClick={handleGetHello} disabled={loading || !apiAvailable}>
          {loading ? '加载中...' : '获取问候'}
        </button>
        {greeting && (
          <div className="message-container">
            <p>{greeting}</p>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h2>发送消息到后端</h2>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入要发送的消息"
          disabled={loading || !apiAvailable}
        />
        <button onClick={handleSendMessage} disabled={loading || !apiAvailable || !message}>
          {loading ? '发送中...' : '发送消息'}
        </button>
        {response && (
          <div className="message-container">
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;