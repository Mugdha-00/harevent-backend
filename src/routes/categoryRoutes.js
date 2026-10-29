const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');
const c = require('../controllers/categoryController');

const idParam = param('id').isMongoId().withMessage('Invalid category id');

router.get('/', c.list);
router.get('/:id', [idParam], validate, c.get);

router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),
    body('description').optional().trim().isLength({ max: 300 }).withMessage('Description max 300 characters'),
  ],
  validate,
  c.create
);

router.put(
  '/:id',
  protect,
  adminOnly,
  [
    idParam,
    body('name').optional().trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),
    body('description').optional().trim().isLength({ max: 300 }).withMessage('Description max 300 characters'),
  ],
  validate,
  c.update
);

router.delete('/:id', protect, adminOnly, [idParam], validate, c.remove);

module.exports = router;
