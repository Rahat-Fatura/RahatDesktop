const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, nativeImage, Tray, Menu, shell, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const logger = require('../config/logger');
const config = require('../config/config');

const isMac = process.platform === 'darwin';
autoUpdater.logger = logger;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    center: true,
    frame: false,
    hasShadow: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(`http://localhost:${config.get('port')}/`);
  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
  return mainWindow;
};

const createTray = (mainWindow) => {
  const tray = new Tray(
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
        app.quit();
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
  return tray;
};

const createMenu = (mainWindow) => {
  const menu = Menu.buildFromTemplate([
    ...(isMac
      ? [
          {
            label: 'RahatDesktop',
            submenu: [
              { role: 'about', label: 'RahatDesktop Hakkında' },
              { type: 'separator' },
              { role: 'services', label: 'Servisler' },
              { type: 'separator' },
              { role: 'hide', label: `RahatDesktop'ı Gizle` },
              { role: 'hideOthers', label: 'Diğerlerini Gizle' },
              { role: 'unhide', label: 'Göster' },
              { type: 'separator' },
              { role: 'quit', label: `RahatDesktop'ı Tamamen Kapat` },
            ],
          },
        ]
      : []),
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
            app.quit();
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
            mainWindow.loadURL(`http://localhost:${config.get('port')}/`);
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
  return menu;
};

const ipcListeners = (mainWindow) => {
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
    app.quit();
  });

  ipcMain.on('open-logfile', () => {
    shell.openPath(path.join(app.getPath('userData'), '/logs'));
  });
  ipcMain.on('get-version', (event) => {
    // eslint-disable-next-line no-param-reassign
    event.returnValue = app.getVersion();
  });
  ipcMain.on('check-for-updates', () => {
    mainWindow.webContents.send('updater-message', 'Hareket başladı...');
    autoUpdater.checkForUpdatesAndNotify();
  });

  const sendStatusToWindow = (text) => {
    mainWindow.webContents.send('updater-message', text);
  };

  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Güncellemeler kontrol ediliyor...');
  });
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow(`Güncelleme bulundu. ${JSON.stringify(info)}`);
  });
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow(`Güncelleme bulunamadı. ${JSON.stringify(info)}`);
  });
  autoUpdater.on('error', (err) => {
    sendStatusToWindow(`Güncelleme kontrol edilirken bir hata ile karşılaşıldı. ${err}`);
  });
  autoUpdater.on('download-progress', (progressObj) => {
    let message = `İndirme Hızı: ${progressObj.bytesPerSecond}`;
    message = `${message} - İndirilen ${progressObj.percent}%`;
    message = `${message} (${progressObj.transferred}/${progressObj.total})`;
    sendStatusToWindow(message);
  });
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow(`Güncelleme indirildi. ${JSON.stringify(info)}`);
  });
};

module.exports = {
  createWindow,
  createTray,
  createMenu,
  ipcListeners,
};
