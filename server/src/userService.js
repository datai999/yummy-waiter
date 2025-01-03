var fs = require('fs');

const readFile = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error({ "error": err });
            return;
        }
    });
    return JSON.parse(data);
}

const loadUsers = () => readFile('./public/data/users.json');

module.exports = {
    loadUsers
}