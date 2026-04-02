const Program = require('../models/Program');

exports.createProgram = async (req, res) => {
  try {
    const program = new Program(req.body);
    await program.save();
    res.status(201).json(program);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPrograms = async (req, res) => {
  const programs = await Program.find();
  res.json(programs);
};

exports.getSeats = async (req, res) => {
  const program = await Program.findById(req.params.id);
  if (!program) return res.status(404).json({ error: 'Program not found' });
  
  res.json({
    totalIntake: program.intake,
    remaining: {
      kcet: program.quotas.kcet.seats - program.quotas.kcet.filled,
      comedk: program.quotas.comedk.seats - program.quotas.comedk.filled,
      management: program.quotas.management.seats - program.quotas.management.filled
    }
  });
};