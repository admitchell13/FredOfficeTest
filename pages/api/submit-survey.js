// pages/api/submit-survey.js
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// Create Schema
const SurveySchema = new mongoose.Schema({
  name: String,
  email: String,
  priorExperience: String,
  llmExperience: {
    chatGPT: Boolean,
    claudeAI: Boolean,
    bard: Boolean,
    copilot: Boolean,
    other: String
  },
  concerns: [String],
  learningGoals: [String],
  useCases: [String],
  submittedAt: { type: Date, default: Date.now }
});

// Create or get the model
const Survey = mongoose.models.Survey || mongoose.model('Survey', SurveySchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to database
    await connectDB();

    // Save to database
    const survey = new Survey(req.body.formData);
    await survey.save();

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const emailContent = `
      New Survey Response
      
      Name: ${req.body.formData.name}
      Email: ${req.body.formData.email}
      Experience Level: ${req.body.formData.priorExperience}
      
      LLMs Used: ${Object.entries(req.body.formData.llmExperience)
        .filter(([key, value]) => value && key !== 'other')
        .map(([key]) => key)
        .concat(req.body.formData.llmExperience.other ? [req.body.formData.llmExperience.other] : [])
        .join(', ')}
      
      Top 3 Concerns:
      ${req.body.formData.concerns.map((concern, i) => `${i + 1}. ${concern}`).join('\n')}
      
      Learning Goals:
      ${req.body.formData.learningGoals.map((goal, i) => `${i + 1}. ${goal}`).join('\n')}
      
      Potential Use Cases:
      ${req.body.formData.useCases.filter(uc => uc).map((useCase, i) => `${i + 1}. ${useCase}`).join('\n')}
    `.trim();

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'alexmitchell@translatehealth.ca',
      subject: 'New AI Survey Response',
      text: emailContent,
    });

    res.status(200).json({ message: 'Survey submitted successfully' });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: 'Error submitting survey', error: error.message });
  }
}
