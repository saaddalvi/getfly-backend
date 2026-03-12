const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

router.use(authenticate);

router.post(
  '/',
  roleCheck('admin', 'manager'),
  [
    body('name').notEmpty().withMessage('Project name is required.'),
  ],
  validate,
  createProject
);

router.get('/', listProjects);

router.get('/:id', getProject);

router.put(
  '/:id',
  roleCheck('admin', 'manager'),
  updateProject
);

router.delete(
  '/:id',
  roleCheck('admin'),
  deleteProject
);

module.exports = router;
