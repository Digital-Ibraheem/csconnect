'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface LoginModalProps {
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
    const { login, loginMessage } = useAuth();
    const { closeModal, openModal } = useModal();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const googleButtonRef = useRef<HTMLDivElement>(null);


    // Check if we're on the create page
    const isCreatePage = pathname.includes('/create');

    // Handle login message as an error to display
    useEffect(() => {
        if (loginMessage) {
            setAuthError(loginMessage);
            const timer = setTimeout(() => {
                setAuthError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [loginMessage]);

    useEffect(() => {
        let isMounted = true;

        const loadGoogleScript = () => {
            const existingScript = document.getElementById('google-script');
            if (existingScript) {
                existingScript.remove();
            }

            const script = document.createElement("script");
            script.id = 'google-script';
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = () => {
                if (isMounted && window.google?.accounts?.id) {
                    initializeAndRenderGoogleButton();
                }
            };
            document.body.appendChild(script);
        };

        if (!window.google?.accounts?.id) {
            loadGoogleScript();
        } else if (isMounted) {
            initializeAndRenderGoogleButton();
        }

        return () => {
            isMounted = false;
        };
    }, []);

    const initializeAndRenderGoogleButton = () => {
        if (!window.google?.accounts?.id || !googleButtonRef.current) {
            console.error("Google API not loaded or button element not found");
            return;
        }

        const googleId = window.google.accounts.id as any;

        googleId.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: handleGoogleResponse,
            auto_select: false,
        });

        googleId.renderButton(
            googleButtonRef.current,
            {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                width: '100%'
            }
        );
    };

    const handleGoogleResponse = async (response: any) => {
        try {
            const idToken = response.credential;
            console.log("Google ID Token:", idToken);

            const res = await fetch("http://localhost:8080/auth/google-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Google sign-in failed");

            if (data.token) {
                login(data.token);
                closeModal();
            }
        } catch (error: any) {
            setError(error.message || "Google authentication failed");
        }
    };




    const handleClose = () => {
        // If on create page and closing the modal, redirect to explore
        if (isCreatePage) {
            router.push('/explore');
        }
        onClose();
    };

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
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 sm:p-4 flex-col"
            onClick={handleClose}
        >
            {authError && (
                <div className="fixed top-[110px] w-full z-50 flex justify-center px-4">
                    <div className="
            bg-red-100 
            border-l-4 border-red-500 
            p-4 
            rounded-r-lg 
            shadow-lg 
            shadow-lg
            flex 
            items-center 
            space-x-4
            animate-slide-in-down
        ">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <div>
                            <p className="text-red-800 font-medium text-sm">
                                {authError}
                            </p>
                        </div>
                    </div>
                </div>
            )}
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
                            onClick={handleClose}
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
                                <div ref={googleButtonRef} id="googleLoginButton"></div>



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
