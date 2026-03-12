const router = require('express').Router({ mergeParams: true });
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/auth');
const { createDPR, listDPRs } = require('../controllers/dprController');

router.use(authenticate);

router.post(
  '/',
  [
    body('date').notEmpty().withMessage('Date is required.').isDate().withMessage('Valid date is required (YYYY-MM-DD).'),
    body('work_description').notEmpty().withMessage('Work description is required.'),
  ],
  validate,
  createDPR
);

router.get('/', listDPRs);

module.exports = router;
