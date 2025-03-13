'use client';

import CreateFooter from '@/components/create/CreateFooter';
import Step1 from '@/components/create/steps/Step1';
import Step2 from '@/components/create/steps/Step2';
import Step3 from '@/components/create/steps/Step3';
import Step4 from '@/components/create/steps/Step4';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { useRouter } from 'next/navigation';

const steps = [
  { 
    title: "Draft your title", 
    description: "A well-written title is important. Keep it brief and descriptive to help others understand your project at a glance." 
  },
  { 
    title: "What is this project going to use?", 
    description: "Specify the technologies and roles required for this project, or indicate if it is still an idea in progress." 
  },
  { 
    title: "Describe your project", 
    description: "A clear and detailed project description will help attract the right collaborators. Explain your goals, expectations, and how you envision the collaboration." 
  },
  { 
    title: "Review & Submit", 
    description: "Ensure all details are accurate before submitting your project. Review the information carefully and make any necessary adjustments." 
  },
];

const MIN_DESCRIPTION_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 5000;

const CreatePage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    projectStatus: "",
    technologies: [],
    roles: [],
    description: "",
    images: [],
  });
  const [canProceed, setCanProceed] = useState(false);
  const { user, isLoggedIn, openLoginModal } = useAuth();
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to explore page and open login modal with error message
      router.push('/explore');
      openLoginModal("You need to log in to create a project.");
    }
  }, [isLoggedIn, router, openLoginModal]);

  // Function to update form data
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to check if the current step is valid
  useEffect(() => {
    switch (currentStep) {
      case 0:
        setCanProceed(formData.title.trim().length >= 8 && formData.projectStatus !== "");
        break;
      case 1:
        setCanProceed(true);
        break;
      case 2:
        setCanProceed(formData.description.trim().length >= MIN_DESCRIPTION_LENGTH && formData.description.trim().length < MAX_DESCRIPTION_LENGTH);
        break;
      case 3:
        setCanProceed(true);
        break;
      default:
        setCanProceed(false);
    }
  }, [formData, currentStep]);

  const getNextPageTitle = () => {
    switch (currentStep) {
      case 0:
        return "Next: Technologies";
      case 1:
        return "Next: Description";
      case 2:
        return "Next: Review";
      case 3:
        return "Post";
      default:
        return "Post";
    }
  };

  const stepComponents = [
    <Step1 key="step1" formData={formData} updateFormData={updateFormData} />,
    <Step2 key="step2" formData={formData} updateFormData={updateFormData} />,
    <Step3 key="step3" formData={formData} updateFormData={updateFormData} />,
    <Step4 key="step4" formData={formData} />,
  ];

  // Only render the content if the user is logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="bg-gray-100 flex flex-col items-center px-4 py-6 sm:px-8 sm:py-10">
      <div className="w-full max-w-6xl flex flex-col sm:flex-row sm:justify-between sm:gap-8 mb-[100px]">
        {/* Left Side - Step Counter & Title */}
        <div className="w-full sm:w-1/2 pr-0 sm:pr-12 mb-6 sm:mb-0">
          <div className="mb-4 text-sm text-gray-500 flex items-center">
            <span className="font-medium text-gray-700">{currentStep + 1}/4</span>
            <span className="ml-4 text-gray-400">Project Creation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold leading-relaxed">{steps[currentStep].title}</h1>
          <p className="text-gray-500 text-sm mt-2">{steps[currentStep].description}</p>
        </div>

        {/* Right Side - Step Content */}
        <div className="w-full sm:w-1/2">{stepComponents[currentStep]}</div>
      </div>

      {/* Footer Navigation with validation */}
      <CreateFooter
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
        nextPageTitle={getNextPageTitle()}
        canProceed={canProceed}
      />
    </div>
  );
};

export default CreatePage;
