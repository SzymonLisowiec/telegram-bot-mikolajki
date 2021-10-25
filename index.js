require('dotenv').config({ path: `${__dirname}/.env` });
const Main = require(`${__dirname}/src/index.js`);
module.exports = new Main();
