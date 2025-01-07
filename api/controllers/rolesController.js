const { asyncFunction } = require("../service/connection");

let roles = [
  { role_id: 1, institution_id: 1, role_name: "admin", status: "Active" },
  { role_id: 2, institution_id: 1, role_name: "super_admin", status: "Active" },
];

const getAllRoles = async (req, res) => {
  const data = await asyncFunction();
  const roledata = data ? data : roles;
  const bigIntReplacer = (key, value) => 
    typeof value === 'bigint' ? value.toString() : value;

  res.json({
    data: JSON.parse(JSON.stringify(roledata, bigIntReplacer))
  });
};

module.exports = { getAllRoles };
