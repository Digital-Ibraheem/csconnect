'use client';

import React, { useState } from 'react';
import { X, Eye, EyeOff, CheckCircle, ArrowLeft, ChevronLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useModal } from '@/context/ModalContext';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const existingUsernames = ['kareem', 'ibraheem'];

interface SignUpModalProps {
    onClose: () => void;
}

const avatarNames = [
    "Jessica", "Jude", "Kimberly", "Sara", "Liliana", "Mackenzie", "Vivian",
    "Christian", "Jade", "Aidan", "Eden", "Liam", "Avery", "Wyatt", "Sadie",
    "Brian", "George", "Adrian", "Andrea", "Ryker"
];

const SignUpModal: React.FC<SignUpModalProps> = ({ onClose }) => {
    const { login } = useAuth();
    const { openModal } = useModal();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        username: '',
        profilePictureUrl: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    // Robust email validation function
    const isValidEmail = (email: string) => {
        // Regular expression for email validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        // Additional checks
        return (
            email.length > 0 &&
            email.length <= 254 &&              // Maximum length for email addresses
            emailRegex.test(email) &&           // Matches basic email pattern
            email.indexOf('..') === -1 &&       // No consecutive dots
            email.indexOf('@') !== 0 &&         // Doesn't start with @
            email.indexOf('@') === email.lastIndexOf('@') &&  // Only one @ symbol
            email.split('@')[0].length <= 64 && // Local part max length
            email.split('@')[1]?.length >= 2 && // Domain part min length
            !email.endsWith('.')                // Doesn't end with a dot
        );
    };

    const isValidPassword = (pwd: string) => pwd.length >= 8 && /\d/.test(pwd);

    const generateRandomPfp = () => {
        const randomName = avatarNames[Math.floor(Math.random() * avatarNames.length)];
        return `https://api.dicebear.com/9.x/shapes/svg?seed=${randomName}`;
    };


    const handleCreateAccountSteps = () => {
        if (step === 2) {
            if (!isValidEmail(formData.email)) {
                setError('Please enter a valid email address.');
                return;
            }
            if (!isValidPassword(formData.password)) {
                setError('Password must be at least 8 characters and contain a number.');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
            setError(null);
            setStep(3);
        } else if (step === 3) {
            if (!formData.fullName.trim()) {
                setError('Please enter your full name.');
                return;
            } else if (existingUsernames.includes(formData.username)) {
                setError("This username already exists.")
                return;
            }

            const profilePicture = generateRandomPfp();
            
            // Create the updated data object
            const updatedData = { ...formData, profilePictureUrl: profilePicture };
            
            // Update the form data
            setFormData(updatedData);
            
            // Call the account creation with the updated data directly
            handleCreateLocalAccount(updatedData);
            
            onClose();
            router.push('/explore');
        }
    };

    const handleCreateLocalAccount = async (data = formData) => {
        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Registration failed");
            }

            // Log the user in after successful registration
            if (responseData.token) {
                login(responseData.token);
            }

        } catch (err: any) {
            setError(err.message || "Something went wrong")
        }
    }

    const handleGoogleSignUp = () => {
        console.log('Sign up with Google');
        router.push('/explore');
    };

    const handleEmailSignUp = () => {
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            username: '',
            profilePictureUrl: ''
        });
        setStep(2);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 sm:p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-3xl flex relative overflow-hidden sm:flex-row flex-col sm:h-auto h-full min-h-[550px]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Left Section - Hidden on Mobile */}
                <div className="hidden sm:flex sm:w-1/2 relative p-6 flex-col pt-12 text-white">
                    <div
                        className="absolute inset-0 bg-cover bg-right rounded-l-lg"
                        style={{ backgroundImage: "url('/images/modal-bg.webp')" }}
                    />
                    <div className="absolute inset-0 bg-black opacity-50 rounded-l-lg" />

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold">Collaborate on Projects</h2>
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-center">
                                <CheckCircle className="text-green-400 w-4 h-4 mr-2" />
                                Connect with talented developers
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="text-green-400 w-4 h-4 mr-2" />
                                Work on real-world projects
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="text-green-400 w-4 h-4 mr-2" />
                                Build a portfolio that stands out
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Section - Sign Up Form */}
                <div className="sm:w-1/2 w-full p-8 sm:p-12 relative flex flex-col h-full sm:h-auto justify-between">
                    <div>
                        {step >= 2 && <button
                            onClick={() => setStep(s => s - 1)}
                            className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 flex items-center"
                        >
                            <div className="flex items-center">
                                <ArrowLeft className="w-5 h-5" />
                                <span className="ml-2">Back</span>
                            </div>
                        </button>}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h4 className="text-xl font-semibold text-gray-900 flex align-center">
                            {step === 1
                                ? 'Create an account'
                                : step === 2
                                    ? 'Enter your credentials'
                                    : 'Enter more details'}
                        </h4>
                        <p className='text-sm mt-4'>Already have an account? <u className='cursor-pointer' onClick={() => openModal('login')}>Sign in</u></p>

                        {step === 1 && (
                            <div className="mt-8 flex flex-col gap-4">
                                <button
                                    onClick={handleGoogleSignUp}
                                    className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md p-3 hover:bg-gray-50 transition"
                                >
                                    <div className="w-5 h-5 relative">
                                        <Image
                                            src="/images/google-logo.svg"
                                            alt="Google"
                                            width={20}
                                            height={20}
                                        />
                                    </div>
                                    <span className="text-gray-700">Sign up with Google</span>
                                </button>

                                <div className="flex items-center my-2">
                                    <div className="flex-grow h-px bg-gray-300"></div>
                                    <span className="px-3 text-gray-500 text-sm">or</span>
                                    <div className="flex-grow h-px bg-gray-300"></div>
                                </div>

                                <button
                                    onClick={handleEmailSignUp}
                                    className="w-full border border-gray-300 rounded-md p-3 hover:bg-gray-50 transition text-gray-700"
                                >
                                    Sign up with Email
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <>
                                <div className="mt-4">
                                    <label htmlFor="email" className="text-gray-700 text-sm font-medium">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    />
                                </div>

                                <div className="mt-4 relative">
                                    <label htmlFor="password" className="text-gray-700 text-sm font-medium">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-gray-400 pr-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-4 text-gray-500"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 relative">
                                    <label htmlFor="confirm-password" className="text-gray-700 text-sm font-medium">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirm-password"
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-gray-400 pr-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-4 text-gray-500"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <div className="mt-4">
                                    <label htmlFor="full-name" className="text-gray-700 text-sm font-medium">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="full-name"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="username" className="text-gray-700 text-sm font-medium">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    />
                                </div>
                            </>
                        )}

                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                        {step > 1 && (
                            <Button inverted className="w-full mt-6" onClick={handleCreateAccountSteps}>
                                {step === 2 ? 'Continue' : 'Create Account'}
                            </Button>
                        )}
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mt-4 text-center">
                            By signing up, you agree to our{' '}
                            <a href="/terms_of_service" className="text-gray-600 underline">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy-policy" className="text-gray-600 underline">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpModal;