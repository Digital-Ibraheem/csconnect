'use client';

import React from 'react';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';

interface CreateFooterProps {
  nextPageTitle: string;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  canProceed: boolean;
}

const CreateFooter: React.FC<CreateFooterProps> = ({ nextPageTitle, currentStep, setCurrentStep, canProceed }) => {
  const router = useRouter();

  return (
    <footer className="bg-gray-100 py-6 w-full fixed bottom-0 left-0 px-4">
      <div className="border-t border-gray-300 border-2 w-full absolute top-0 left-0" />
      <div className={`border-t border-blue-600 border-2`} style={{ width: `${((currentStep + 1) / 4) * 100}%`, position: 'absolute', top: 0, left: 0 }} />
      <div className="container mx-auto flex justify-between text-center">
        <button className="px-5 py-2 text-blue-600 border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition" onClick={() => currentStep === 0 ? router.push('/explore') : setCurrentStep(currentStep - 1)}>
          Back
        </button>
        <Button onClick={() => currentStep === 3 ? router.push('/explore') : setCurrentStep(currentStep + 1)} inverted disabled={!canProceed}>
          {nextPageTitle}
        </Button>
      </div>
    </footer>
  );
};

export default CreateFooter;
