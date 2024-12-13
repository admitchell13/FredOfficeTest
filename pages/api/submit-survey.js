// backend/models/Survey.js
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

export const Survey = mongoose.model('Survey', surveySchema);

// backend/routes/survey.js
import express from 'express';
import { Survey } from '../models/Survey.js';

const router = express.Router();

// Submit new survey response
router.post('/submit', async (req, res) => {
  try {
    const survey = new Survey(req.body);
    await survey.save();
    res.status(201).json({ message: 'Survey submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all survey responses (with optional filtering)
router.get('/responses', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    
    if (startDate || endDate) {
      query.submittedAt = {};
      if (startDate) query.submittedAt.$gte = new Date(startDate);
      if (endDate) query.submittedAt.$lte = new Date(endDate);
    }
    
    const surveys = await Survey.find(query).sort('-submittedAt');
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get aggregated statistics
router.get('/stats', async (req, res) => {
  try {
    const totalResponses = await Survey.countDocuments();
    
    const experienceLevels = await Survey.aggregate([
      { $group: { _id: '$priorExperience', count: { $sum: 1 } } }
    ]);
    
    const llmUsage = await Survey.aggregate([
      {
        $group: {
          _id: null,
          chatGPT: { $sum: { $cond: ['$llmExperience.chatGPT', 1, 0] } },
          claudeAI: { $sum: { $cond: ['$llmExperience.claudeAI', 1, 0] } },
          bard: { $sum: { $cond: ['$llmExperience.bard', 1, 0] } },
          copilot: { $sum: { $cond: ['$llmExperience.copilot', 1, 0] } }
        }
      }
    ]);
    
    res.json({
      totalResponses,
      experienceLevels,
      llmUsage: llmUsage[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import surveyRoutes from './routes/survey.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/survey', surveyRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ai-survey', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
