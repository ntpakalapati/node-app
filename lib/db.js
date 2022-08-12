const Pool = require('pg').Pool;
const connection = new Pool({
  user: 'admin',
  host: 'postgresql-85006-0.cloudclusters.net',
  database: 'sample',
  password: 'admin1234',
  port: 19555,
})
module.exports = connection;