import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, User, Target, Heart, Send } from 'lucide-react';
import { assessmentAPI, apiUtils } from '../services/api';
import toast from 'react-hot-toast';

const AssessmentForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    diseases: []
  });

  const totalSteps = 4;

  const goals = [
    { id: 'hidup_sehat', label: 'Hidup Sehat', icon: Heart, color: 'bg-green-500' },
    { id: 'diet', label: 'Diet', icon: Target, color: 'bg-blue-500' },
    { id: 'massa_otot', label: 'Massa Otot', icon: User, color: 'bg-purple-500' }
  ];

  const diseases = [
    { id: 'diabetes', label: 'Diabetes' },
    { id: 'hipertensi', label: 'Hipertensi (Darah Tinggi)' },
    { id: 'kolesterol', label: 'Kolesterol Tinggi' },
    { id: 'asam_urat', label: 'Asam Urat' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDiseaseToggle = (diseaseId) => {
    setFormData(prev => ({
      ...prev,
      diseases: prev.diseases.includes(diseaseId)
        ? prev.diseases.filter(d => d !== diseaseId)
        : [...prev.diseases, diseaseId]
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age && formData.weight && formData.height;
      case 2:
        return formData.goal;
      case 3:
        return true; // Diseases are optional
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100; // Convert cm to m
    return (weight / (height * height)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const assessmentData = {
        name: formData.name,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        goal: formData.goal,
        diseases: formData.diseases,
        bmi: parseFloat(calculateBMI()),
        timestamp: new Date().toISOString()
      };

      const response = await assessmentAPI.submitAssessment(assessmentData);
      
      if (response.error) {
        toast.error(response.message || 'Assessment submission failed');
        return;
      }

      toast.success('Assessment submitted successfully!');
      
      // Navigate to results page with assessment data
      navigate('/results', { 
        state: { 
          assessmentData,
          recommendations: response.recommendations || [],
          userId: response.userId || 'guest'
        }
      });
      
    } catch (error) {
      console.error('Assessment submission error:', error);
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="mx-auto h-16 w-16 text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself to get personalized recommendations</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (years)
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 25"
                  min="1"
                  max="120"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 70"
                  min="1"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 170"
                  min="1"
                />
              </div>
            </div>

            {formData.weight && formData.height && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Your BMI</p>
                  <p className="text-2xl font-bold text-gray-900">{calculateBMI()}</p>
                  <p className={`text-sm font-medium ${getBMICategory(parseFloat(calculateBMI())).color}`}>
                    {getBMICategory(parseFloat(calculateBMI())).category}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="mx-auto h-16 w-16 text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's Your Goal?</h2>
              <p className="text-gray-600">Choose your primary health and fitness objective</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {goals.map((goal) => {
                const IconComponent = goal.icon;
                return (
                  <button
                    key={goal.id}
                    onClick={() => handleInputChange('goal', goal.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      formData.goal === goal.id
                        ? 'border-blue-500 bg-blue-50 transform scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${goal.color} mb-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{goal.label}</h3>
                    <p className="text-sm text-gray-600">
                      {goal.id === 'hidup_sehat' && 'Maintain a balanced and healthy lifestyle'}
                      {goal.id === 'diet' && 'Lose weight and improve body composition'}
                      {goal.id === 'massa_otot' && 'Build muscle mass and strength'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Conditions</h2>
              <p className="text-gray-600">Select any health conditions you have (optional)</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diseases.map((disease) => (
                <label
                  key={disease.id}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    formData.diseases.includes(disease.id)
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.diseases.includes(disease.id)}
                    onChange={() => handleDiseaseToggle(disease.id)}
                    className="sr-only"
                  />
                  <div className={`flex-shrink-0 w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                    formData.diseases.includes(disease.id)
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-300'
                  }`}>
                    {formData.diseases.includes(disease.id) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900 font-medium">{disease.label}</span>
                </label>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Don't have any of these conditions? That's great! You can proceed to the next step.
              </p>
            </div>
          </div>
        );

      case 4:
        const bmi = calculateBMI();
        const bmiInfo = getBMICategory(parseFloat(bmi));
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Check className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h2>
              <p className="text-gray-600">Please confirm your details before submitting</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-lg font-semibold">{formData.name}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="text-lg font-semibold">{formData.age} years</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="text-lg font-semibold">{formData.weight} kg</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Height</p>
                  <p className="text-lg font-semibold">{formData.height} cm</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">BMI</p>
                  <p className="text-2xl font-bold">{bmi}</p>
                  <p className={`text-sm font-medium ${bmiInfo.color}`}>{bmiInfo.category}</p>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Goal</p>
                  <p className="text-lg font-semibold">
                    {goals.find(g => g.id === formData.goal)?.label || 'Not selected'}
                  </p>
                </div>
                
                {formData.diseases.length > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Health Conditions</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {formData.diseases.map(diseaseId => (
                        <span
                          key={diseaseId}
                          className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                        >
                          {diseases.find(d => d.id === diseaseId)?.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Diet Assessment</h1>
            <span className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!validateCurrentStep()}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  validateCurrentStep()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!validateCurrentStep() || isSubmitting}
                className={`flex items-center px-8 py-3 rounded-lg font-medium transition-colors ${
                  validateCurrentStep() && !isSubmitting
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Assessment
                    <Send className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;