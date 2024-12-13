// pages/index.js
import React, { useState } from 'react';

export default function Survey() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    priorExperience: 'none',
    llmExperience: {
      chatGPT: false,
      claudeAI: false,
      bard: false,
      copilot: false,
      other: ''
    },
    concerns: ['', '', ''],
    learningGoals: ['', '', ''],
    useCases: ['', '', '', '', '']
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e, index, field) => {
    if (Array.isArray(formData[field])) {
      const newArray = [...formData[field]];
      newArray[index] = e.target.value;
      setFormData({ ...formData, [field]: newArray });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit survey. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Thank you for your response!</h2>
        <p>Your feedback has been sent.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">AI Understanding Survey</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange(e, null, null)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e, null, null)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium mb-2">
            What is your experience level with AI/LLMs?
          </label>
          <select
            name="priorExperience"
            value={formData.priorExperience}
            onChange={(e) => handleInputChange(e, null, null)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="none">No experience</option>
            <option value="basic">Basic understanding</option>
            <option value="some">Some experience</option>
            <option value="regular">Regular user</option>
            <option value="advanced">Advanced user</option>
          </select>
        </div>

        {/* LLMs Used */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Which LLMs have you used? (Select all that apply)
          </label>
          {['chatGPT', 'claudeAI', 'bard', 'copilot'].map((llm) => (
            <div key={llm} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={llm}
                checked={formData.llmExperience[llm]}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    llmExperience: {
                      ...formData.llmExperience,
                      [llm]: e.target.checked
                    }
                  });
                }}
                className="mr-2"
              />
              <label htmlFor={llm}>
                {llm === 'chatGPT' ? 'ChatGPT' :
                 llm === 'claudeAI' ? 'Claude AI' :
                 llm === 'bard' ? 'Google Bard' :
                 'GitHub Copilot'}
              </label>
            </div>
          ))}
          <input
            type="text"
            value={formData.llmExperience.other}
            onChange={(e) => {
              setFormData({
                ...formData,
                llmExperience: {
                  ...formData.llmExperience,
                  other: e.target.value
                }
              });
            }}
            className="w-full p-2 border rounded mt-2"
            placeholder="Other LLMs used..."
          />
        </div>

        {/* Concerns */}
        <div>
          <label className="block text-sm font-medium mb-2">
            What are your top 3 concerns about AI/LLMs?
          </label>
          {formData.concerns.map((concern, index) => (
            <input
              key={`concern-${index}`}
              type="text"
              value={concern}
              onChange={(e) => handleInputChange(e, index, 'concerns')}
              className="w-full p-2 border rounded mb-2"
              placeholder={`Concern ${index + 1}`}
              required
            />
          ))}
        </div>

        {/* Learning Goals */}
        <div>
          <label className="block text-sm font-medium mb-2">
            What are your top 3 learning goals regarding AI/LLMs?
          </label>
          {formData.learningGoals.map((goal, index) => (
            <input
              key={`goal-${index}`}
              type="text"
              value={goal}
              onChange={(e) => handleInputChange(e, index, 'learningGoals')}
              className="w-full p-2 border rounded mb-2"
              placeholder={`Learning goal ${index + 1}`}
              required
            />
          ))}
        </div>

        {/* Use Cases */}
        <div>
          <label className="block text-sm font-medium mb-2">
            List 3-5 potential use cases where LLMs could help in your work
          </label>
          {formData.useCases.map((useCase, index) => (
            <input
              key={`useCase-${index}`}
              type="text"
              value={useCase}
              onChange={(e) => handleInputChange(e, index, 'useCases')}
              className="w-full p-2 border rounded mb-2"
              placeholder={`Use case ${index + 1}`}
              required={index < 3}
            />
          ))}
        </div>

        {error && (
          <div className="text-red-500">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit Survey
        </button>
      </form>
    </div>
  );
}
