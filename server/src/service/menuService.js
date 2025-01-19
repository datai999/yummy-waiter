const { readJsonFile } = require('./commonService');

const loadMenu = () => readJsonFile('menu.json');

module.exports = {
    loadMenu
}