import {
  app,
  BrowserWindow,
  session,
  ipcMain,
  Menu,
  dialog,
  protocol,
} from "electron";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
// import {
//   setBounds,
//   getBounds,
//   addFavorite,
//   removeFavorite,
//   getFavorites,
//   exportFavorites,
//   importFavorites,
// } from "./settings";
import LCU from "./lcu";
import "dotenv/config";

// Electron forge entry point declared in package.json
declare const MAIN_WEBPACK_ENTRY: string;

// const isDevelopment = process.env.NODE_ENV !== "production";
//@todo dev모드 false 까먹지않기
const isDevelopment = true;
// const isDevelopment = false;
let mouseDiffX = 0;
let mouseDiffY = 0;
let mainWindow: BrowserWindow;

if (require("electron-squirrel-startup")) app.quit();

const createWindow = (): BrowserWindow => {
  // const bounds = getBounds();
  mainWindow = new BrowserWindow({
    show: false,
    width: 1366,
    height: 768,
    resizable: false,
    icon: "assets/icon-blue.png",
    webPreferences: {
      devTools: isDevelopment,
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: false,
  });
  mainWindow.setMenu(null);

  // mainWindow.on("resize", () => {
  //   const size = mainWindow.getSize();
  //   setBounds({ width: size[0], height: size[1] });
  // });

  mainWindow.loadURL(MAIN_WEBPACK_ENTRY);

  if (isDevelopment) mainWindow.webContents.openDevTools();
  // else Menu.setApplicationMenu(null);

  return mainWindow;
};

app.on("ready", () => {
  const { updateElectronApp } = require("update-electron-app");
  updateElectronApp();

  if (isDevelopment) installExtension(REACT_DEVELOPER_TOOLS);

  const browserWindow = createWindow();
  const leagueClient = new LCU(browserWindow.id);

  ipcMain.on("lcu-connect", (event) => {
    leagueClient.connect().then(
      () => event.reply("lcu-connected"),
      (reason) => event.reply("lcu-connected", reason)
    );
  });

  ipcMain.on("lcu-request", (event, id, method, endpoint, body?) => {
    leagueClient
      .request(method, endpoint, body)
      .then((data) => event.reply(`lcu-response-${id}`, data))
      .catch(() => event.reply(`lcu-response-${id}`, {}));
  });

  ipcMain.on("minimize-window", () => {
    browserWindow.minimize();
  });

  ipcMain.on("close-window", () => {
    app.quit();
  });

  ipcMain.on("windowMouseMoving", (_event, { mouseX, mouseY }) => {
    const bounds = browserWindow.getBounds();
    const newX = mouseX - mouseDiffX;
    const newY = mouseY - mouseDiffY;
    browserWindow.setPosition(newX, newY);
  });

  ipcMain.on("windowMouseDown", (_event, { startMouseX, startMouseY }) => {
    const bounds = browserWindow.getBounds();
    mouseDiffX = startMouseX - bounds.x;
    mouseDiffY = startMouseY - bounds.y;
  });

  if (isDevelopment) installExtension(REACT_DEVELOPER_TOOLS);

  // ipcMain.on("store-get-favorites", (event) => {
  //   event.reply("store-favorites", getFavorites());
  // });

  // ipcMain.on("store-add-favorite", (_event, type, id) => {
  //   addFavorite(type, id);
  // });

  // ipcMain.on("store-remove-favorite", (_event, type, id) => {
  //   removeFavorite(type, id);
  // });

  // ipcMain.on("store-export", async (event) => {
  //   const response = await dialog.showSaveDialog(browserWindow, {
  //     filters: [{ extensions: ["json"], name: "JSON" }],
  //     defaultPath: "favorites.json",
  //   });

  //   if (response.canceled) {
  //     event.reply("store-export-response", false);
  //   } else {
  //     await exportFavorites(response.filePath);
  //     event.reply("store-export-response", true);
  //   }
  // });

  // ipcMain.on("store-import", async (event) => {
  //   const response = await dialog.showOpenDialog(browserWindow, {
  //     filters: [{ extensions: ["json"], name: "JSON" }],
  //   });

  //   if (response.canceled) {
  //     event.reply("store-import-response", false);
  //   } else {
  //     await importFavorites(response.filePaths[0]);
  //     event.reply("store-import-response", true);
  //   }
  // });

  session.defaultSession.clearCache().then(() => {
    console.log("Cache cleared");
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          // "default-src 'self'; script-src: 'self' 'unsafe-eval'; 'unsafe-inline'; connect-src 'self' http://kddnswlr.codns.com:3000",
          "*",
        ],
      },
    });
  });

  browserWindow.once("ready-to-show", browserWindow.show);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
