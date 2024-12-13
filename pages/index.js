import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { AlertCircle, Send } from 'lucide-react';

const AISurvey = () => {
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
    useCases: ['', '', '', '', ''],
    submitted: false
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e, index, field) => {
    if (Array.isArray(formData[field])) {
      const newArray = [...formData[field]];
      newArray[index] = e.target.value;
      setFormData({ ...formData, [field]: newArray });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    
    const validateArray = (array, fieldName, required) => {
      if (required && !array.some(item => item.trim())) {
        newErrors[fieldName] = `At least one ${fieldName} is required`;
      }
    };

    validateArray(formData.concerns, 'concerns', true);
    validateArray(formData.learningGoals, 'learningGoals', true);
    validateArray(formData.useCases, 'useCases', true);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Here you would typically send the data to your backend
    console.log('Survey Response:', formData);
    
    // Simulate successful submission
    setFormData(prev => ({ ...prev, submitted: true }));
  };

  if (formData.submitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Thank you for your response!</h2>
            <p className="text-gray-600">Your feedback will help shape our AI education session.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>AI Understanding Survey</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Prior Experience */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                What is your experience level with AI/LLMs?
              </label>
              <select
                name="priorExperience"
                value={formData.priorExperience}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="none">No experience</option>
                <option value="basic">Basic understanding</option>
                <option value="some">Some experience</option>
                <option value="regular">Regular user</option>
                <option value="advanced">Advanced user</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Which LLMs have you used? (Select all that apply)
              </label>
              <div className="space-y-2">
                {['chatGPT', 'claudeAI', 'bard', 'copilot'].map((llm) => (
                  <div key={llm} className="flex items-center">
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
                    <label htmlFor={llm} className="text-sm">
                      {llm === 'chatGPT' ? 'ChatGPT' :
                       llm === 'claudeAI' ? 'Claude AI' :
                       llm === 'bard' ? 'Google Bard' :
                       'GitHub Copilot'}
                    </label>
                  </div>
                ))}
                <div className="mt-2">
                  <label className="block text-sm mb-1">Other LLMs used:</label>
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
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter other LLMs you've used"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Concerns */}
          <div>
            <label className="block text-sm font-medium mb-2">
              What are your top 3 concerns about AI/LLMs?
            </label>
            {formData.concerns.map((concern, index) => (
              <div key={`concern-${index}`} className="mb-2">
                <input
                  type="text"
                  value={concern}
                  onChange={(e) => handleInputChange(e, index, 'concerns')}
                  className="w-full p-2 border rounded-md"
                  placeholder={`Concern ${index + 1}`}
                />
              </div>
            ))}
            {errors.concerns && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.concerns}
              </p>
            )}
          </div>

          {/* Learning Goals */}
          <div>
            <label className="block text-sm font-medium mb-2">
              What are your top 3 learning goals regarding AI/LLMs?
            </label>
            {formData.learningGoals.map((goal, index) => (
              <div key={`goal-${index}`} className="mb-2">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => handleInputChange(e, index, 'learningGoals')}
                  className="w-full p-2 border rounded-md"
                  placeholder={`Learning goal ${index + 1}`}
                />
              </div>
            ))}
            {errors.learningGoals && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.learningGoals}
              </p>
            )}
          </div>

          {/* Use Cases */}
          <div>
            <label className="block text-sm font-medium mb-2">
              List 3-5 potential use cases where LLMs could help in your work
            </label>
            {formData.useCases.map((useCase, index) => (
              <div key={`useCase-${index}`} className="mb-2">
                <input
                  type="text"
                  value={useCase}
                  onChange={(e) => handleInputChange(e, index, 'useCases')}
                  className="w-full p-2 border rounded-md"
                  placeholder={`Use case ${index + 1}`}
                />
              </div>
            ))}
            {errors.useCases && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.useCases}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Survey
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AISurvey;
