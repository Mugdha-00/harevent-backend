const router = require('express').Router();
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const v = require('../controllers/vendorController');

const idParam = param('id').isMongoId().withMessage('Invalid vendor id');

const fields = (required) => {
  const opt = (chain) => (required ? chain : chain.optional());
  return [
    opt(body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name max 100 characters')),
    opt(body('category').isMongoId().withMessage('Valid category id is required')),
    opt(body('location').trim().notEmpty().withMessage('Location is required')),
    body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description max 1000 characters'),
    body('contactEmail').optional().trim().isEmail().withMessage('Invalid contact email'),
    body('contactPhone').optional().trim().matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Invalid contact phone'),
    body('priceRange').optional().isIn(['budget', 'standard', 'premium']).withMessage('priceRange must be budget, standard or premium'),
  ];
};

// Public: view + search/filter
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit must be 1-50'),
  ],
  validate,
  v.list
);
router.get('/:id', [idParam], validate, v.get);

// Protected: create / update / delete
router.post('/', protect, fields(true), validate, v.create);
router.put('/:id', protect, [idParam, ...fields(false)], validate, v.update);
router.delete('/:id', protect, [idParam], validate, v.remove);

module.exports = router;
