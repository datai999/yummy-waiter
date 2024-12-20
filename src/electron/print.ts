
const remote = require('@electron/remote');

let options = {
  // deviceName: "Microsoft Print to PDF",
  // deviceName: "Microsoft XPS Document Writer",
  deviceName: "RP-630(P)",
  silent: true,
  printBackground: true,
  color: true,
  margin: {
    marginType: 'printableArea'
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: 'Header of the Page',
  footer: 'Footer of the Page'
}

const printByCommand = true;

document.getElementById('current')!.addEventListener('click', (event) => {
  console.log('Print click');

  if (printByCommand) {
    printByCommandService();
    console.log('Print done');
    return;
  }

  let win = remote.getCurrentWindow();
  win.webContents.print(options, function (success: boolean, failureReason: any) {
    if (!success)
      console.log(failureReason);
    console.log('Print Initiated');
  });

  console.log('Print done');
});

const printByCommandService = () => {
  var fs = require('fs');
  var printString = "whatever text you need to print with optional ascii commands";
  var printer = "FILE";

  const date = new Date();
  const fileName = date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "" + date.getSeconds();
  var tmpFileName = `.\\print\\${fileName}.prn`;
  fs.writeFileSync(tmpFileName, printString, "utf8");

  var child = require('child_process').exec;
  child(`print /d:${printer} ${tmpFileName} \\print ${fileName}`)
}
