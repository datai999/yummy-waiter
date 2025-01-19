var fs = require('fs');

const readJsonFile = (filePath) => {
    const data = fs.readFileSync('./public/data/' + filePath, 'utf8', (err, data) => {
        if (err) {
            console.error({ "error": err });
            return;
        }
    });
    return JSON.parse(data);
}

const readJsonDirectory = (directoryPath) => {
    const fileNames = fs.readdirSync('./public/data/' + directoryPath, (err) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
    });
    return fileNames.map(fileName => {
        console.log(fileName);
        return readJsonFile(directoryPath + '/' + fileName);
    });
}


const writeJsonFile = (data, fileName, path = '') => {
    const dir = './public/data' + path;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(`${dir}/${fileName}.json`, JSON.stringify(data), function (err) {
        if (err) {
            console.log(err);
            const errorDir = './public/data/errors';
            if (!fs.existsSync(errorDir)) {
                fs.mkdirSync(errorDir, { recursive: true });
            }
            fs.writeFile(`${errorDir}/${formatTime()}`, err);
        }
    });
}

const formatTime = (time) => {
    const date = time || new Date();
    return date.toLocaleString('en-CA', { hour12: false }) + ':' + date.getMilliseconds();
}

module.exports = {
    readJsonFile,
    readJsonDirectory,
    writeJsonFile
}