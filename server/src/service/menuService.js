const { readJsonFile } = require('./commonService');

const loadMenu = () => readJsonFile('./public/data/menu.json');

module.exports = {
    loadMenu
}