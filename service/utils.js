const { generateHasuraToken } = require('./jwt');

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'postgresql-85006-0.cloudclusters.net',
  database: 'sample',
  password: 'admin1234',
  port: 19555,
})

const getUsers = (request, response) => {
  pool.query('SELECT * FROM "user".users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows)
    return results.rows
  })
}

const getProducts = (request, response) => {
  pool.query('SELECT * FROM "product".products ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    console.log(results)
    response.status(200).json(results)
  })
}

const getUserByEmail = async(request, response) => {
  const { query: { email } } = request;
  pool.query('SELECT * FROM "user".users WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error
    }
    const userData = results.rows[0];
    const info = { userid: userData.id, email: userData.email}
    const token = generateHasuraToken(info)
    response.status(200).send(token)
  })
}

const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO "user".users (id,name, email) VALUES ($1, $2, $3) RETURNING *', [1, name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
}

const insertProduct = (request, response) => {
  console.log(request.body)
  const { id, name, description, price, status}  = request.body

  pool.query('INSERT INTO "product".products (id,name, description, price, status) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, name, description, price, status], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
}

module.exports = {
  getUsers,
  createUser,
  getUserByEmail,
  getProducts,
  insertProduct
}