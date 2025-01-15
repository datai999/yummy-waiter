var fs = require('fs');

const readJsonFile = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error({ "error": err });
            return;
        }
    });
    return JSON.parse(data);
}

const writeJsonFile = (fileName, data) => {
    fs.writeFile(`./public/data/${fileName}.json`, JSON.stringify(data), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = {
    readJsonFile,
    writeFile
}