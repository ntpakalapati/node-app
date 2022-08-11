const { generateHasuraToken } = require('./jwt');
const fs = require('fs');
const Pool = require('pg').Pool;
const { decrypt, encrypt } = require('./password');

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
    // console.log(results.rows)
    return results.rows
  })
}

const getProducts = (request, response) => {
  pool.query('SELECT * FROM "product".products ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    // console.log(results)
    response.status(200).json(results)
  })
}

const getUserByEmail = async (request, response) => {
  const { query: { email, password } } = request;
  pool.query('SELECT * FROM "user".users WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error
    }
    const userData = results.rows[0];
    var decriptedPws = decrypt(userData?.password)
    if (password === decriptedPws) {
      const info = { userid: userData.id, email: userData.email }
      const token = generateHasuraToken(info)
      response.status(200).send({ 'token': token })
    } else {
      response.send({ 'message': "In valid password..., plase enter valid password" })
    }
  })
}

const createUser = (request, response) => {
  const { name, email, password } = request.body
  var encriptedPws = encrypt(password)
  pool.query('INSERT INTO "user".users (id,name, email, password) VALUES ($1, $2, $3) RETURNING *', [2, name, email, encriptedPws], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
}

const insertProduct = (request, response) => {
  console.log(request.body)
  const { id, name, description, price, status, image } = request.body
  // const bufferedFile = fs.readFileSync(image, { encoding: 'hex' });
  // const fileData = `\\x${bufferedFile}`;
  pool.query('INSERT INTO "product".products (id,name, description, price, status, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [id, name, description, price, status, image], (error, results) => {
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