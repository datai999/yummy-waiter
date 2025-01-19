const { readJsonFile } = require('./commonService');

const loadUsers = () => readJsonFile('users.json');

module.exports = {
    loadUsers
}