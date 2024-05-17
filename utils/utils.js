const dayjs = require('dayjs');

function formatBirthDate(birthDate) {
    return dayjs(birthDate).format('LL');
}

module.exports = {
    formatBirthDate
};
