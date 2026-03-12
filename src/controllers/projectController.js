const { Project, User, DailyReport } = require('../models');

const createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, budget, location } = req.body;

    const project = await Project.create({
      name,
      description: description || null,
      start_date: startDate || null,
      end_date: endDate || null,
      budget: budget || null,
      location: location || null,
      created_by: req.user.id,
    });

    return res.status(201).json({
      projectId: project.id,
      message: 'Project created successfully.',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const listProjects = async (req, res) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    const projects = await Project.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      total: projects.count,
      projects: projects.rows,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        {
          model: DailyReport,
          as: 'dailyReports',
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
          order: [['date', 'DESC']],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    return res.status(200).json({ project });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const { name, description, startDate, endDate, budget, location, status } = req.body;

    await project.update({
      name: name ?? project.name,
      description: description ?? project.description,
      start_date: startDate ?? project.start_date,
      end_date: endDate ?? project.end_date,
      budget: budget ?? project.budget,
      location: location ?? project.location,
      status: status ?? project.status,
    });

    return res.status(200).json({
      message: 'Project updated successfully.',
      project,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    await project.destroy();

    return res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { createProject, listProjects, getProject, updateProject, deleteProject };
