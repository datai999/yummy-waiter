const { readJsonDirectory } = require('./commonService.js');

//  2025-01-18, 22:22:25:38
const getHistoryOrder = (timeQuery) => {
    const timeQueries = timeQuery.replaceAll('-', '/').split(',');
    return readJsonDirectory(`orders/${timeQueries[0]}`);
}

module.exports = {
    getHistoryOrder
}