const { DailyReport, User, Project } = require('../models');

const createDPR = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const { date, work_description, weather, worker_count } = req.body;

    const dpr = await DailyReport.create({
      project_id: projectId,
      user_id: req.user.id,
      date,
      work_description,
      weather: weather || null,
      worker_count: worker_count || null,
    });

    return res.status(201).json({
      dprId: dpr.id,
      message: 'Daily progress report created successfully.',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const listDPRs = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const { date } = req.query;

    const where = { project_id: projectId };
    if (date) {
      where.date = date;
    }

    const reports = await DailyReport.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['date', 'DESC']],
    });

    return res.status(200).json({ reports });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { createDPR, listDPRs };
