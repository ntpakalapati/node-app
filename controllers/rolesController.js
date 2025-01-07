// const { queryDatabase } =require("../services/connection.js");

import { asyncFunction } from "../service/connection";

let roles = [
  { role_id: 1, institution_id: 1, role_name: "admin", status: "Active" },
  { role_id: 2, institution_id: 1, role_name: "super_admin", status: "Active" },
];

export const getAllRoles = async (req, res) => {
  const data = await asyncFunction()
  const roledata = data ? data : roles
  res.json(roledata);
};
