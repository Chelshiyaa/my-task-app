const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Task = require('../models/Task');
const router = express.Router();
const mongoose = require('mongoose');

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const search = req.query.search;
    if (search) filter.$text = { $search: search };

    const sortBy = req.query.sortBy || 'created_at';
    const sortDir = req.query.sortDir === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDir };

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter).sort(sort).skip(skip).limit(limit).lean();

    res.json({ page, limit, total, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tasks
router.post(
  '/',
  body('title').isString().trim().notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { title, description, status, priority, due_date } = req.body;
      const task = new Task({ title, description, status, priority, due_date });
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// GET /api/tasks/:id
router.get('/:id', param('id').custom(val => mongoose.isValidObjectId(val)).withMessage('Invalid id'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/tasks/:id
router.put(
  '/:id',
  param('id').custom(val => mongoose.isValidObjectId(val)).withMessage('Invalid id'),
  body('title').optional().isString().trim().notEmpty(),
  body('status').optional().isIn(['pending', 'in_progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const updates = { ...req.body, updated_at: Date.now() };
      const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// DELETE /api/tasks/:id
router.delete('/:id', param('id').custom(val => mongoose.isValidObjectId(val)).withMessage('Invalid id'), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
