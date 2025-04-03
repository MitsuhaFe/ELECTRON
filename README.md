文档参考（Electron）：https://www.electronjs.org/zh/docs/latest/tutorial/tutorial-first-app
文档参考（nodejs和npm）：https://nodejs.org/en/download/

1.nodejs环境安装/官网直接下载exe
  winget install Schniz.fnm
  fnm install 22
  node -v # Should print "v22.14.0".
  npm -v # Should print "10.9.2".
  （cmd终端运行命令）

2.安装依赖
  cd my-electron-app
  npm install
  （打开项目所在编译器终端运行）

3.启动Spring Boot后端/编译器运行main文件（目录：electron\src\main\java\org\example\Main.java）
  ./gradlew bootRun
  （打开项目所在编译器终端运行）
  
4.启动Electron + React应用
     cd my-electron-app
     npm run start
