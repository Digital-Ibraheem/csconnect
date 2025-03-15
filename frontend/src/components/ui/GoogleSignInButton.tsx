'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

const GoogleSignInButton = () => {
    const googleButtonRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const loadGoogleScript = () => {
            if (document.getElementById('google-script')) return;
            const script = document.createElement("script");
            script.id = 'google-script';
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = () => {
                if (window.google?.accounts?.id) {
                    initializeGoogleButton();
                }
            };
            document.body.appendChild(script);
        };

        if (!window.google?.accounts?.id) {
            loadGoogleScript();
        } else {
            initializeGoogleButton();
        }
    }, []);

    const initializeGoogleButton = () => {
        if (!window.google?.accounts?.id || !googleButtonRef.current) return;

        window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: handleGoogleResponse,
            auto_select: false,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signup_with',
            width: '100%',
        });
    };

    const handleGoogleResponse = async (response: any) => {
        console.log("Google ID Token:", response.credential);
        // Handle authentication with backend here
    };

    return (
        <div className="relative w-full">
            {/* Invisible Google Button */}
            <div ref={googleButtonRef} className="absolute inset-0 opacity-0 pointer-events-auto" />
            
            {/* Custom Button Overlay */}
            <button
                className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md p-3 hover:bg-gray-50 transition relative z-10"
                onClick={() => googleButtonRef.current?.querySelector('div')?.click()}
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
        </div>
    );
};

export default GoogleSignInButton;
