// models/Survey.js
import mongoose from 'mongoose';

const surveySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  priorExperience: {
    type: String,
    enum: ['none', 'basic', 'some', 'regular', 'advanced'],
    required: true,
  },
  llmExperience: {
    chatGPT: Boolean,
    claudeAI: Boolean,
    bard: Boolean,
    copilot: Boolean,
    other: String,
  },
  concerns: [{
    type: String,
    required: true,
  }],
  learningGoals: [{
    type: String,
    required: true,
  }],
  useCases: [{
    type: String,
    required: true,
  }],
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

// Check if the model already exists before creating it
const Survey = mongoose.models.Survey || mongoose.model('Survey', surveySchema);

export default Survey;
