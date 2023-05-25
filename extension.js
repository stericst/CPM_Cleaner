// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("node:fs");
const CMakeToolsApi = require("vscode-cmake-tools");
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
   let nuke = vscode.commands.registerCommand("cpmcleaner.nuke", function () {
      // The code you place here will be executed every time this command is executed
      const config = vscode.workspace.getConfiguration("cpmcleaner");
      fs.rmSync(config.cpmCachepath, { recursive: true, force: true });
      vscode.window.setStatusBarMessage("CPM cache nuked...", 5000);
   });

   let nukeAndClean = vscode.commands.registerCommand(
      "cpmcleaner.nukeAndClean",
      async function () {

         // The code you place here will be executed every time this command is executed
         const config = vscode.workspace.getConfiguration("cpmcleaner");
         fs.rmSync(config.cpmCachepath, { recursive: true, force: true });
         vscode.window.setStatusBarMessage("CPM cache nuked...", 5000);

         let api = await CMakeToolsApi.getCMakeToolsApi(1);
         if (api) {
            let uri = vscode.workspace.workspaceFolders[0].uri;
            await (await api.getProject(uri)).clean();
            await (await api.getProject(uri)).reconfigure();
         }
      }
   );

   context.subscriptions.push(nuke);
   context.subscriptions.push(nukeAndClean);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
   activate,
   deactivate,
};
