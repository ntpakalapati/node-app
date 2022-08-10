const jwt = require('jsonwebtoken');
const JWT_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCnj0zcyrqnXUJnbSBdIKSp6pNgExx6AxaPS123n72LrctolLpgvUkxGho+6jv9r4QlP2dHL1Ur8UIQraeB0wNIr+G2Ehcn4c2hct96z4ROZZ3djODHX7Wxl0vSLhnp9TBM8v5BVFAnaztmSZcEvv+Hh36RC+L1OyYFdX8w981JKYU1zz8gMqjjlzNs2D5kyQNV2nprErYZL5EcimESrP/mdGcmtU/GFYt8L1jihEohPK+bO1mXLFD87WPSvDbNNKkMzZ5eXsdd0BRQmlGCT6Rwzlniv1pBdNoidsvAOeDrZY6x2LbpjU1o5Z1tRciUJH7r4hrcFL2R1z40IZNUs+xLAgMBAAECggEBAJGr85bAaSW33lMsfEZ6aq2OUjHka41nweUyEHfjWFZm8cAqDR6tcURO/SJVYXJbdPcs+AzbCaD6TgVR857aZLB8uC4h7B+wH6WMyN1sLAo8LdK+92xduQh8EF7Z1Y2grC050/HX6xdaEnoK4FAv/NdG5LIVM2sf0R5N2BYqWT6QgGlG4WlVzOoyJhE2BE9lmumIwyKyHTEum5OQWu/msWQ4QsNu+JE+vwTBadXLQhbde8yI1rcZe2yEzoD3IVqqS11NjQZH+8oq6DCCw89A41f2QVzXY0dQIWr/j/N1YjMX9nYG7URi0Z8iSbZVx8EZ/q9UV789ttlyJEi0scAJFwECgYEA5L2ckw78/hsOZBGRubzWzm/TyxVqj+14MYYCGRYzIulBW49uZjNRqsJdHG8ANzi7AJ98afhpTGgU+e0qaYmTD8vbMrmljYhuUHy4Oei1EQjcTi4hHI7NZQQAWsBFRtF1+XY6BeRX3I4l2gqoivHT57BaG3OpdPulV3pp1JV4e3kCgYEAu4cwrt615AH6ieVSWu+BAW3hrTLEQjFqGzYAobQlvwiojc2LzQgzTleeH02tznWg3y0vbdvwcOR/lIBlJdMSORpNUJh60O+8Q4ZWLMxorCsVX6i3i7RK0vUMtsqW1QNRGDmwyv5g+qifzeoOnqeODr5bd03d/hOaOUc6iavF8OMCgYEA3S5H1593nRJ2gObIPYzPPQC/EDHeP9wFDAYjwzRHMCvSigGQY/ydrHuS42qmD7+oe3q8KBAPadV+6wicqT5hWLXreAoxfkD9QpDG5yAQ7a7esC5E0EN5coNDAH3IvyjNZfIfOxFIsDk3erYxsWETYYaSKtdVdYvbnlH9QZVi0ikCgYA+7lJHDNQLbSKPrhZiD+fB/Ab04Yl9ESojcY7qtRLJtfUiiSz2JF9bVgnpRV8jXtQasQYuntVkfTnXMvM+q0N9SDdT6aelgB40pts6c2pZBKhKjsrxphJKExQuL3RIjbFkKNAMfys6UuY16ur3ERGaHwWA1u+9eQSTXjTlyHBHswKBgH6Fdxu4A4RAn4jJDthuYXdA6Ek95R6AbWDJAo+2wf2rmDzqs3J2Kz2NSYBoGsOOsHPoxanpLJXWU1syp2Bn82I2aXcLCZF52RGnncVBeylgctQUsEQtm+CJ8+yjNvzLpfcYrgLNFYef2x5Lp3ZXtzRE8JIE4iQnJS6ncGCiPQi/\n-----END PRIVATE KEY-----"

const generateHasuraToken = (info) => {
  try {
    const { userid, expire, email } = info;

    const hstoken = {
      'userrole': 'user',
      'userid': userid,
      'email': email
    }
    return jwt.sign(hstoken, JWT_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: expire || '720h' });
  } catch (e) {
    console.log(e)
  }
  return null;
}


module.exports = { generateHasuraToken };