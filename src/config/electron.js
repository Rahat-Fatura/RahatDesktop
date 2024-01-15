const electronApp = require('electron').app;
const { BrowserWindow, nativeImage, Tray, Menu, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const consumers = require('./rmq.consumers');

// config.clear();

const initialize = (app, port) => {
  // config.clear();
  app.set('config', config);
  let mainWindow = null;
  let tray = null;

  const createWindow = () => {
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 800,
      center: true,
      frame: false,
      // show: false,
      // resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.on('close', (e) => {
      e.preventDefault();
      mainWindow.hide();
    });
  };

  electronApp.whenReady().then(async () => {
    createWindow();
    tray = new Tray(
      nativeImage
        .createFromBuffer(fs.readFileSync(path.resolve(__dirname, '../public/img/logo/rd-logo/1x/rahatdesktop-mini.png')))
        .resize({ width: 16, height: 16 }),
    );
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Uygulamayı göster',
        click: () => {
          mainWindow.show();
        },
      },

      {
        label: 'Çıkış',
        click: () => {
          electronApp.quit();
        },
      },
    ]);
    tray.setToolTip('RahatDesktop');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => {
      mainWindow.show();
    });
    tray.on('right-click', () => {
      tray.popUpContextMenu();
    });
    tray.on('click', () => {});
    const menu = Menu.buildFromTemplate([
      {
        label: 'Dosya',
        submenu: [
          {
            label: 'Küçült',
            accelerator: 'CmdOrCtrl+Q',
            click: () => {
              mainWindow.hide();
            },
          },
          {
            label: 'Tamamen Kapat',
            click: () => {
              electronApp.quit();
            },
          },
        ],
      },
      {
        label: 'Düzenle',
        submenu: [
          {
            label: 'Geri Al',
            accelerator: 'CmdOrCtrl+Z',
            selector: 'undo:',
          },
          {
            label: 'İleri Al',
            accelerator: 'Shift+CmdOrCtrl+Z',
            selector: 'redo:',
          },
          { type: 'separator' },
          {
            label: 'Kes',
            accelerator: 'CmdOrCtrl+X',
            selector: 'cut:',
          },
          {
            label: 'Kopyala',
            accelerator: 'CmdOrCtrl+C',
            selector: 'copy:',
          },
          {
            label: 'Yapıştır',
            accelerator: 'CmdOrCtrl+V',
            selector: 'paste:',
          },
          {
            label: 'Tümünü Seç',
            accelerator: 'CmdOrCtrl+A',
            selector: 'selectAll:',
          },
          { type: 'separator' },
          {
            label: 'Developer Console',
            accelerator: 'CmdOrCtrl+Shift+D',
            click: () => {
              mainWindow.webContents.toggleDevTools();
            },
          },
        ],
      },
      {
        label: 'Görünüm',
        submenu: [
          {
            label: 'Yenile',
            accelerator: 'CmdOrCtrl+R',
            click: () => {
              mainWindow.reload();
            },
          },
        ],
      },
      {
        label: 'Git',
        submenu: [
          {
            label: 'Ana Sayfa',
            accelerator: 'CmdOrCtrl+H',
            click: () => {
              mainWindow.loadURL(`http://localhost:${port}/`);
            },
          },
          {
            label: 'Geri',
            accelerator: 'CmdOrCtrl+PageDown',
            click: () => {
              mainWindow.webContents.goBack();
            },
          },
          {
            label: 'İleri',
            accelerator: 'CmdOrCtrl+PageUp',
            click: () => {
              mainWindow.webContents.goForward();
            },
          },
        ],
      },
    ]);

    Menu.setApplicationMenu(menu);

    electronApp.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });

    await consumers.consumeTunnel(app);
  });

  ipcMain.on('close', () => {
    mainWindow.hide();
  });

  ipcMain.on('minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on('back', () => {
    mainWindow.webContents.goBack();
  });

  ipcMain.on('forward', () => {
    mainWindow.webContents.goForward();
  });

  ipcMain.on('refresh', () => {
    mainWindow.reload();
  });

  ipcMain.on('quit', () => {
    electronApp.quit();
  });

  electronApp.on('before-quit', () => {
    mainWindow.removeAllListeners('close');
  });
};

module.exports = {
  initialize,
};
