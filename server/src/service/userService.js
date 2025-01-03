const { readJsonFile } = require('./commonService');

const loadUsers = () => readJsonFile('./public/data/users.json');

module.exports = {
    loadUsers
}