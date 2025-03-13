'use client';

import Image from "next/image";
import { Lightbulb } from 'lucide-react';

export default function AboutSection() {
    return (
        <section
            className="relative py-16 flex flex-col items-center justify-center px-4 text-[#1a1a1a] sm:px-10 bg-white"
        >
            <h1 className="sm:px-8 md:px-0 text-4xl md:text-6xl font-semibold max-w-6xl w-full mb-4">What&apos;s CSConnect?</h1>
            <div className="flex flex-col md:flex-row mt-6 w-full max-w-6xl items-center justify-center">
                <div className="sm:px-8 md:px-0 md:pr-8 flex-1 flex justify-center items-center">
                    {/* Image Below Title */}
                    <div className="w-full md:h-full flex items-stretch">
                        <Image
                            src="/images/about-section.webp"
                            alt="About CSConnect"
                            width={400}
                            height={300}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="sm:px-8 md:px-0 flex-1 flex flex-col justify-center items-center h-full">
                    <div className="w-full flex flex-col justify-center h-full">
                        <h3 className="text-xl sm:text-2xl mt-4 sm:mt-0 font-bold text-[#1a1a1a]">Collaborate on real projects</h3>
                        <p className='text-gray-600 mt-2 font-inter text-sm lg:text-base'>
                            You need real projects with actual impact to get a job - not a notes apps or an Instagram clone copied off of YouTube. This platform connects you with driven students building meaningful solutions to real problems that people actually use.
                        </p>
                        <div className="flex items-center mt-4">
                            <span className="border border-black rounded-full p-[5px]">
                                <Lightbulb className="w-5 h-5 rounded-full" />
                            </span>
                            <p className="ml-3 font-inter text-sm md:text-base">Project-based learning</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row mt-20 w-full max-w-6xl items-center justify-center">
                <div className="sm:px-8 md:px-0 flex-1 flex flex-col justify-center items-center h-full">
                    <div className="w-full flex flex-col justify-center h-full">
                        <h3 className="text-2xl font-bold text-[#1a1a1a]">How it works</h3>
                        <ul className="mt-4">
                            <li className="mt-2">
                                <b>1. Sign up:</b>  Verify email and create your profile to demonstrate your skillset.
                            </li>
                            <li className="mt-2">
                                <b>2. Explore or list:</b>  Explore project ideas posted by other students, or list one of your own!
                            </li>
                            <li className="mt-2">
                                <b>3. Get noticed by recruiters:</b> Build products that people actually find useful and land your dream job.
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="sm:px-8 mt-5 sm:mt-0 md:px-0 md:pl-8 flex-1 flex justify-center items-center">
                    {/* Image Below Title */}
                    <div className="w-full md:h-full flex items-stretch">
                        <Image
                            src="/images/how-it-works.webp"
                            alt="How CSConnect Works"
                            width={400}
                            height={300}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
