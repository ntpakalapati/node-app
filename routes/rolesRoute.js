const { Router } = require('express');
const { getAllRoles } = require('../controllers/rolesController'); // Add .js extension

const rolesRoute = Router();

rolesRoute.get('/roles', getAllRoles);

export default rolesRoute;
