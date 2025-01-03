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

module.exports = {
    readJsonFile
}