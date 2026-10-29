const Vendor = require('../models/Vendor');
const Category = require('../models/Category');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/vendors  — list + search/filter by category (id or name), location, keyword; paginated
exports.list = async (req, res, next) => {
  try {
    const { category, location, q } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

    const filter = {};

    if (category) {
      if (/^[0-9a-fA-F]{24}$/.test(category)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ name: new RegExp(`^${escapeRegex(category)}$`, 'i') });
        if (!cat) {
          return res.json({ success: true, count: 0, total: 0, page, pages: 0, data: [] });
        }
        filter.category = cat._id;
      }
    }
    if (location) filter.location = new RegExp(escapeRegex(location), 'i');
    if (q) filter.name = new RegExp(escapeRegex(q), 'i');

    const [total, vendors] = await Promise.all([
      Vendor.countDocuments(filter),
      Vendor.find(filter)
        .populate('category', 'name')
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.json({ success: true, count: vendors.length, total, page, pages: Math.ceil(total / limit), data: vendors });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('category', 'name');
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: vendor });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ success: false, message: 'Category does not exist' });

    const { name, description, location, contactEmail, contactPhone, priceRange } = req.body;
    const vendor = await Vendor.create({
      name, description, location, contactEmail, contactPhone, priceRange,
      category: category._id,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, message: 'Vendor created', data: vendor });
  } catch (err) {
    next(err);
  }
};

const canModify = (vendor, user) => user.role === 'admin' || vendor.createdBy.equals(user._id);

exports.update = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    if (!canModify(vendor, req.user)) {
      return res.status(403).json({ success: false, message: 'You can only modify vendors you created' });
    }

    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) return res.status(400).json({ success: false, message: 'Category does not exist' });
    }

    const fields = ['name', 'description', 'category', 'location', 'contactEmail', 'contactPhone', 'priceRange'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) vendor[f] = req.body[f];
    });
    await vendor.save();
    res.json({ success: true, message: 'Vendor updated', data: vendor });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    if (!canModify(vendor, req.user)) {
      return res.status(403).json({ success: false, message: 'You can only modify vendors you created' });
    }
    await vendor.deleteOne();
    res.json({ success: true, message: 'Vendor deleted' });
  } catch (err) {
    next(err);
  }
};
