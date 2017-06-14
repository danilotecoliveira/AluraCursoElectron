const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const data = require("./data");
const templateGenerator = require("./template");

let tray = null;
let mainWindow = null;

app.on("ready", () => {
    let mainWindow = new BrowserWindow({
        width: 600,
        height: 400
    });

    tray = new Tray(__dirname + "/app/img/icon-tray.png");
    let template = templateGenerator.geraTrayTemplate(mainWindow);
    let trayMenu = Menu.buildFromTemplate(template);
    tray.setContextMenu(trayMenu);

    let templateMenu = templateGenerator.geraMenuPrincipalTemplate(app);
    let menuPrincipal = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(menuPrincipal);

    mainWindow.openDevTools();
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
});


app.on("window-all-closed", () => {
    app.quit();
});


let sobreWindow = null;
ipcMain.on("abrir-janela-sobre", () => {
    if (sobreWindow == null) {
        sobreWindow = new BrowserWindow({
            width: 300,
            height: 250,
            alwaysOnTop: true,
            frame: false
        });

        sobreWindow.on("closed", () => { sobreWindow = null; });
    }

    sobreWindow.loadURL(`file://${__dirname}/app/sobre.html`);
});


ipcMain.on("fechar-janela-sobre", () => {
    sobreWindow.close();
});


ipcMain.on("curso-parado", (event, curso, tempoEstudado) => {
    data.salvaDados(curso, tempoEstudado);
});

ipcMain.on("curso-adicionado", (event, nomeCurso) => {
    let novoTemplate = templateGenerator.adicionaCursoNoTray(nomeCurso, mainWindow);
    let novoTrayMenu = Menu.buildFromTemplate(novoTemplate);
    tray.setContextMenu(novoTrayMenu);
});