const Program = require('../models/Program');
const Applicant = require('../models/Applicant');

exports.getDashboard = async (req, res) => {
  try {
    const programs = await Program.find();

    let totalIntake = 0;
    let filledSeats = 0;

    programs.forEach(p => {
      totalIntake += p.intake;
      filledSeats +=
        p.quotas.kcet.filled +
        p.quotas.comedk.filled +
        p.quotas.management.filled;
    });

    const pendingDocs = await Applicant.countDocuments({
      'documents.status': { $ne: 'Verified' }
    });

    const feePending = await Applicant.countDocuments({
      feeStatus: 'Pending'
    });

    res.json({
      totalIntake,
      filledSeats,
      remainingSeats: totalIntake - filledSeats,
      pendingDocs,
      feePending
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};