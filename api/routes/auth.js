var express = require('express');
var router = express();
var multer = require('multer');
var upload = multer();
var bodyParser = require('body-parser');
router.use(express.json({ limit: '25mb' }));
router.use(express.urlencoded({ limit: '25mb', extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(upload.array());
router.use(express.static('public'));
const jwtKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCnj0zcyrqnXUJnbSBdIKSp6pNgExx6AxaPS123n72LrctolLpgvUkxGho+6jv9r4QlP2dHL1Ur8UIQraeB0wNIr+G2Ehcn4c2hct96z4ROZZ3djODHX7Wxl0vSLhnp9TBM8v5BVFAnaztmSZcEvv+Hh36RC+L1OyYFdX8w981JKYU1zz8gMqjjlzNs2D5kyQNV2nprErYZL5EcimESrP/mdGcmtU/GFYt8L1jihEohPK+bO1mXLFD87WPSvDbNNKkMzZ5eXsdd0BRQmlGCT6Rwzlniv1pBdNoidsvAOeDrZY6x2LbpjU1o5Z1tRciUJH7r4hrcFL2R1z40IZNUs+xLAgMBAAECggEBAJGr85bAaSW33lMsfEZ6aq2OUjHka41nweUyEHfjWFZm8cAqDR6tcURO/SJVYXJbdPcs+AzbCaD6TgVR857aZLB8uC4h7B+wH6WMyN1sLAo8LdK+92xduQh8EF7Z1Y2grC050/HX6xdaEnoK4FAv/NdG5LIVM2sf0R5N2BYqWT6QgGlG4WlVzOoyJhE2BE9lmumIwyKyHTEum5OQWu/msWQ4QsNu+JE+vwTBadXLQhbde8yI1rcZe2yEzoD3IVqqS11NjQZH+8oq6DCCw89A41f2QVzXY0dQIWr/j/N1YjMX9nYG7URi0Z8iSbZVx8EZ/q9UV789ttlyJEi0scAJFwECgYEA5L2ckw78/hsOZBGRubzWzm/TyxVqj+14MYYCGRYzIulBW49uZjNRqsJdHG8ANzi7AJ98afhpTGgU+e0qaYmTD8vbMrmljYhuUHy4Oei1EQjcTi4hHI7NZQQAWsBFRtF1+XY6BeRX3I4l2gqoivHT57BaG3OpdPulV3pp1JV4e3kCgYEAu4cwrt615AH6ieVSWu+BAW3hrTLEQjFqGzYAobQlvwiojc2LzQgzTleeH02tznWg3y0vbdvwcOR/lIBlJdMSORpNUJh60O+8Q4ZWLMxorCsVX6i3i7RK0vUMtsqW1QNRGDmwyv5g+qifzeoOnqeODr5bd03d/hOaOUc6iavF8OMCgYEA3S5H1593nRJ2gObIPYzPPQC/EDHeP9wFDAYjwzRHMCvSigGQY/ydrHuS42qmD7+oe3q8KBAPadV+6wicqT5hWLXreAoxfkD9QpDG5yAQ7a7esC5E0EN5coNDAH3IvyjNZfIfOxFIsDk3erYxsWETYYaSKtdVdYvbnlH9QZVi0ikCgYA+7lJHDNQLbSKPrhZiD+fB/Ab04Yl9ESojcY7qtRLJtfUiiSz2JF9bVgnpRV8jXtQasQYuntVkfTnXMvM+q0N9SDdT6aelgB40pts6c2pZBKhKjsrxphJKExQuL3RIjbFkKNAMfys6UuY16ur3ERGaHwWA1u+9eQSTXjTlyHBHswKBgH6Fdxu4A4RAn4jJDthuYXdA6Ek95R6AbWDJAo+2wf2rmDzqs3J2Kz2NSYBoGsOOsHPoxanpLJXWU1syp2Bn82I2aXcLCZF52RGnncVBeylgctQUsEQtm+CJ8+yjNvzLpfcYrgLNFYef2x5Lp3ZXtzRE8JIE4iQnJS6ncGCiPQi/\n-----END PRIVATE KEY-----"
const jwt = require('jsonwebtoken');
const Pool = require('pg').Pool;
const connection = new Pool({
  user: 'admin',
  host: 'postgresql-85006-0.cloudclusters.net',
  database: 'sample',
  password: 'admin1234',
  port: 19555,
})
const { decrypt, encrypt } = require('../service/password');
var expressValidator = require('express-validator');
const { generateJwtToken } = require('../service/jwt');
router.use(expressValidator());

router.post('/register', function (req, res, next) {
  req.checkBody('name', 'Name is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('email', 'A valid email is required').isEmail()
  var errors = req.validationErrors()
  if (!errors) {
    const encryptedPassword = encrypt(req.sanitize('password').escape().trim())
    var user = {
      name: req.sanitize('name').escape().trim(),
      email: req.sanitize('email').escape().trim(),
      password: encryptedPassword
    }
    connection.query('INSERT INTO "user".users (id,name, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [11, user.name, user.email, user.password], (err, results) => {
      if (err) {
        res.status(500).send(err)
      } else {
        const userData = results.rows[0];
        const info = { userid: userData.id, email: userData.email }
        const token = generateJwtToken(info)
        res.cookie("token", token)
        res.status(200).send({ 'message': 'You have successfully signup!, go to Login Page', 'token': token })
      }
    })
  }
  else {
    var error_msg = ''
    errors.forEach(function (error) {
      error_msg += error.msg + '\n'
    })
    console.log(error_msg)
    res.status(500).send(error_msg)
  }
})

router.post('/login', function (req, res, next) {
  const token = req.cookies.token
  console.log(token)
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('email', 'A valid email is required').isEmail();
  var errors = req.validationErrors();
  if (!errors) {
    var email = req.body.email;
    var password = req.body.password;
    connection.query('SELECT * FROM "user".users WHERE email = $1 ', [email], (err, results) => {
      if (err) {
        res.status(500).send(err)
      } else {
        console.log(results.rows[0])
        if (results.rows.length <= 0) {
          req.flash('error', 'Please correct enter email and Password!')
          res.status(500).send('Please correct enter email and Password!')
        }
        else {
          const decriptedPws = decrypt(results.rows[0].password)
          if (decriptedPws === password) {
            req.session.loggedin = true;
            req.session.name = results.rows[0].name;
            res.status(200).send({ 'message': 'You have successfully logined!, go to Home Page', 'token': token })
          } else {
            res.status(500).send('Invalid password')
          }
        }
      }
    })
  }
})

router.post('/addproduct', upload.array(), function (req, res, next) {
  if (req.session.loggedin) {
    var name = req.body.productname;
    var description = req.body.description;
    var price = req.body.price;
    var status = req.body.status;
    var image = req.body.image
    pool.query('INSERT INTO "product".products (id,name, description, price, status, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [id, name, description, price, status, image], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
  } else {
    res.status(500).send('Please login first!');
  }
});

router.get('/productlist', function (req, res, next) {
  if (req.session.loggedin) {
    return getProducts(req, res)
  } else {
    res.status(500).send('Please login first!');
  }
})

module.exports = router;
