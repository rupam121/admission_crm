const Applicant = require('../models/Applicant');
const Program = require('../models/Program');

exports.allocateSeat = async (req, res) => {
  try {
    const { applicantId, quota } = req.body;
    
    const applicant = await Applicant.findById(applicantId).populate('programId');
    if (!applicant) return res.status(404).json({ error: 'Applicant not found' });
    
    const program = await Program.findById(applicant.programId._id);
    const quotaInfo = program.quotas[quota];
    
    if (quotaInfo.filled >= quotaInfo.seats) {
      return res.status(400).json({ error: `${quota.toUpperCase()} quota is full` });
    }
    
    // Atomic seat increment
    await Program.findByIdAndUpdate(program._id, {
      $inc: { [`quotas.${quota}.filled`]: 1 }
    });
    
    applicant.status = 'allocated';
    applicant.quota = quota;
    await applicant.save();
    
    res.json({ message: 'Seat allocated successfully', applicant });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.confirmAdmission = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (applicant.status !== 'allocated') {
      return res.status(400).json({ error: 'Cannot confirm. Seat not allocated' });
    }
    
    applicant.status = 'confirmed';
    applicant.admissionNumber = `INST/2026/UG/CSE/${applicant.quota?.toUpperCase() || 'MGMT'}/${String(applicant._id).slice(-4).padStart(4, '0')}`;
    await applicant.save();
    
    res.json({ 
      message: 'Admission confirmed', 
      admissionNumber: applicant.admissionNumber 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};