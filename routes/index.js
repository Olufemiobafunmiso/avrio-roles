const express = require("express");
const router = express.Router();
const models = require ('../db/models');
//=============Middlewares==============================//
const userAuth = require('../middlewares/user.auth');
const permAuth = require('../middlewares/permission');





//============Services file=================================//
const users = require('../controller/users');
const workspaces = require('../controller/create.workspaces');
const allPermissions = require('../controller/all.permissions');
const createRole = require('../controller/create.role');
const viewRoles = require('../controller/roles.view');
const editRoles = require('../controller/roles.edit');



//===================================================//
router.post('/createuser',users);
router.post('/createworkspaces',userAuth,workspaces);
router.get('/all/permissions',allPermissions);
router.post('/v1/manage/roles/create',userAuth,permAuth,createRole);
router.get('/v1/manage/roles/view/:workspace_id',userAuth,permAuth,viewRoles);
router.put('/v1/manage/roles/edit/:workspace_id',userAuth,permAuth,editRoles);





















//======================================================//
module.exports = router;
