'use client';

import React, { useState } from 'react';
import { X, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import Image from 'next/image';

interface LoginModalProps {
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
    const { login } = useAuth();
    const { closeModal, openModal } = useModal(); // Use the modal context
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showEmailForm, setShowEmailForm] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        console.log(formData)

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Invalid email or password");
            }

            const data = await response.json();
            login(data.token);
            closeModal();
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        }
    };

    const handleGoogleLogin = () => {
        // // This would typically integrate with Google OAuth
        // console.log('Login with Google');
        // // For now, we'll just simulate a login
        // const mockUser = { id: 2, name: "Google User", email: "google@example.com", avatar: "https://randomuser.me/api/portraits/men/2.jpg", username: "googleuser" };
        // login(mockUser);
        // closeModal();
    };

    const handleEmailLogin = () => {
        setShowEmailForm(true);
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
                    {/* Darkened Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-right rounded-l-lg"
                        style={{ backgroundImage: "url('/images/modal-bg.webp')" }}
                    />
                    <div className="absolute inset-0 bg-black opacity-50 rounded-l-lg" />

                    {/* Content */}
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

                {/* Right Section - Login Form (Full Width on Mobile) */}
                <div className="sm:w-1/2 w-full p-8 sm:p-12 relative flex flex-col h-full sm:h-auto justify-between">
                    <div>
                        {showEmailForm && <button
                            onClick={() => setShowEmailForm(false)}
                            className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 flex items-center"
                        >
                            <div className="flex items-center">
                                <ArrowLeft className="w-5 h-5" />
                                <span className="ml-2">Back</span>
                            </div>
                        </button>}
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h4 className="text-xl font-semibold text-gray-900">Log in to your account</h4>
                        <p className='text-sm mt-4'>Don't have an account? <u className='cursor-pointer' onClick={() => openModal('signup')}>Join here</u></p>


                        {/* Error Message */}
                        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

                        {!showEmailForm ? (
                            <div className="mt-8 flex flex-col gap-4">
                                <button
                                    onClick={handleGoogleLogin}
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
                                    <span className="text-gray-700">Sign in with Google</span>
                                </button>

                                <div className="flex items-center my-2">
                                    <div className="flex-grow h-px bg-gray-300"></div>
                                    <span className="px-3 text-gray-500 text-sm">or</span>
                                    <div className="flex-grow h-px bg-gray-300"></div>
                                </div>

                                <button
                                    onClick={handleEmailLogin}
                                    className="w-full border border-gray-300 rounded-md p-3 hover:bg-gray-50 transition text-gray-700"
                                >
                                    Sign in with Email/Username
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
                                {/* Email Input */}
                                <div className="mt-4">
                                    <label htmlFor="email" className="text-gray-700 text-sm font-medium">
                                        Email or Username
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

                                {/* Password Input */}
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

                                {/* Forgot Password */}
                                <div className="mt-3 text-right">
                                    <button type="button" className="text-sm text-gray-500 hover:text-gray-700">Forgot password?</button>
                                </div>
                                {/* Login Button */}
                                <Button submit inverted className="w-full mt-6">
                                    Continue
                                </Button>
                            </form>
                        )}
                    </div>

                    <div>
                        {/* Terms and Privacy */}
                        <p className="text-xs text-gray-500 mt-4 text-center">
                            By joining, you agree to our{' '}
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

export default LoginModal;
