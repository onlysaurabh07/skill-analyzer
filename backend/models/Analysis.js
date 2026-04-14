const mongoose = require('mongoose');

const roadmapWeekSchema = new mongoose.Schema({
  week: Number,
  focus: String,
  topics: [String],
  resources: [{
    _id: false,
    title: { type: String, default: "" },
    url: { type: String, default: "" },
    type: { type: String, default: "" }
  }],
});

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobTarget: { type: String, required: true },
  jobDescription: { type: String },
  matchScore: { type: Number, default: 0 },
  matchingSkills: [String],
  missingSkills: [String],
  resumeSkills: [String],
  roadmap: [roadmapWeekSchema],
  isSampleData: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);
