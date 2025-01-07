var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
const  rolesRoutes  = require("../routes/rolesRoute")
const { createUser, getUserByEmail, getProducts, insertProduct } = require('../service/utils');
app.use(bodyParser.json());
app.use(cors())
app.listen(8000);

app.get('/', function (req, res) {
  res.send('node js');
})

app.use("/api", rolesRoutes);

app.post('/register', function (req, res) {
  return createUser(req, res);
}) 

app.get('/login', function (req, res) {
  return getUserByEmail(req, res)
});

app.get('/products', function (req, res) {
  return getProducts(req, res)
});

app.post('/addproduct', function(req,res) {
  return insertProduct(req,res)
})