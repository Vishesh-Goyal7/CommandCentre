const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { name, problemStatement, team, nextDeadline, priority } = req.body;
    const project = new Project({ name, problemStatement, team, nextDeadline, priority });
    await project.save();
    res.status(201).json({ msg: 'Project created', project });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ nextDeadline: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusUpdate, priority, isCompleted } = req.body;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (statusUpdate) {
      const timestamp = new Date().toISOString();
      project.statusUpdate.unshift(`[${timestamp}] ${statusUpdate}`);
    }

    if (priority) project.priority = priority;
    if (typeof isCompleted === 'boolean') project.isCompleted = isCompleted;

    await project.save();
    res.json({ msg: 'Project updated', project });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) return res.status(404).json({ msg: 'Project not found' });

    await project.deleteOne();
    res.json({ msg: 'Note and image (if applicable) deleted' });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};