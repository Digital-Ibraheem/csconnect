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

const API_URL = "http://localhost:8080/api/posts"; // Change if needed

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
  const { user, isLoggedIn, openLoginModal, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/explore');
      openLoginModal("You need to log in to create a project.");
    }
  }, [isLoggedIn, router, openLoginModal]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  const createPost = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("User is not authenticated. Please log in.");

        // First, let's set isPublished to true in the form data
        const postData = {
            ...formData,
            isPublished: true
        };

        const response = await fetch("http://localhost:8080/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorText;
            
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorText = errorData.message || "Failed to create post";
            } else {
                errorText = await response.text();
            }
            
            console.error("Server error:", errorText);
            throw new Error(errorText || "Failed to create post");
        }

        const data = await response.json();
        console.log("Post created:", data);
        router.push('/explore');
    } catch (error: any) {
        console.error("Error creating post:", error.message);
        alert("Error creating post: " + error.message);
    }
};

  const handleNextStep = () => {
    if (currentStep === 3) {
      createPost();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const stepComponents = [
    <Step1 key="step1" formData={formData} updateFormData={updateFormData} />, 
    <Step2 key="step2" formData={formData} updateFormData={updateFormData} />, 
    <Step3 key="step3" formData={formData} updateFormData={updateFormData} />, 
    <Step4 key="step4" formData={formData} />
  ];

  if (!isLoggedIn) return null;

  return (
    <div className="bg-gray-100 flex flex-col items-center px-4 py-6 sm:px-8 sm:py-10">
      <div className="w-full max-w-6xl flex flex-col sm:flex-row sm:justify-between sm:gap-8 mb-[100px]">
        <div className="w-full sm:w-1/2 pr-0 sm:pr-12 mb-6 sm:mb-0">
          <div className="mb-4 text-sm text-gray-500 flex items-center">
            <span className="font-medium text-gray-700">{currentStep + 1}/4</span>
            <span className="ml-4 text-gray-400">Project Creation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold leading-relaxed">{steps[currentStep].title}</h1>
          <p className="text-gray-500 text-sm mt-2">{steps[currentStep].description}</p>
        </div>
        <div className="w-full sm:w-1/2">{stepComponents[currentStep]}</div>
      </div>
      <CreateFooter
        currentStep={currentStep}
        nextPageTitle={currentStep === 3 ? "Post" : "Next"}
        canProceed={canProceed}
        handleNextStep={handleNextStep}
      />
    </div>
  );
};

export default CreatePage;
