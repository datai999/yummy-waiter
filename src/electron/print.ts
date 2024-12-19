
const remote = require('@electron/remote');


let options = {
  silent: false,
  printBackground: true,
  color: false,
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

document.getElementById('current')!.addEventListener('click', (event) => {
  console.log('Print click');

  let win = remote.getCurrentWindow();

  win.webContents.print(options, (success: boolean, failureReason: any) => {
    if (!success) console.log(failureReason);

    console.log('Print Initiated');
  });

  console.log('Print done');
});
