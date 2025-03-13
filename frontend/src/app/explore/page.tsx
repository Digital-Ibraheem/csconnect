'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { projectData } from "@/data/projects";
import { CardsSkeleton } from '@/components/ui/skeletons';
import { useAuth } from '@/context/AuthContext';
import Button from "@/components/ui/Button";

const DESCRIPTION_LIMIT = 150;

const ExplorePage = () => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<typeof projectData>([]);
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setTimeout(() => {
            setProjects(projectData);
            setLoading(false);
        }, 2000);
    }, []);

    // Remove error when user logs in
    useEffect(() => {
        if (user) {
            setError(null);
        }
    }, [user]);

    const handleViewDetailsClick = () => {
        setError("You need to log in to view project details.");
    };

    return (
        <section className="min-h-screen flex flex-col py-10 px-5 items-center">
            {/* Error Message */}
            {error && (
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
                                {error}
                            </p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-500 hover:text-red-700 focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            <div className="w-full max-w-6xl flex justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] w-full mb-4">
                        Explore Featured Ideas
                    </h1>
                    <p className="text-gray-600 px-0 font-inter w-full">
                        Connect, collaborate, and build your portfolio alongside like-minded individuals through real-world projects.
                    </p>
                </div>
                <div className="">
                    {/* button for new post */}
                    <Link href='/create'>
                        <button
                            onClick={!user ? () => setError("You need to log in to create a new project.") : undefined}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            New Project
                        </button>
                    </Link>
                </div>
            </div>


            {loading ? (
                <CardsSkeleton />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mt-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="border rounded-lg shadow-md bg-white p-6 hover:shadow-lg transition flex flex-col justify-between h-full"
                        >
                            {/* Upper Content */}
                            <div className="flex flex-col flex-grow">
                                {/* Title */}
                                <h2 className="text-lg font-semibold text-gray-900">{project.title}</h2>

                                {/* Project Status */}
                                <p className="text-sm text-gray-500 mt-1">
                                    <span className="font-semibold">Status:</span>
                                    {project.projectStatus === "work-in-progress" ? " Work in Progress" : " New Project"}
                                </p>

                                {/* Description */}
                                <p className="text-sm text-gray-700 mt-2">
                                    {project.description.length > DESCRIPTION_LIMIT
                                        ? `${project.description.substring(0, DESCRIPTION_LIMIT)}...`
                                        : project.description}
                                </p>

                                {/* Technologies & Roles */}
                                <div className="mt-3 flex flex-col gap-2">
                                    {/* Technologies */}
                                    <div>
                                        <h3 className="text-gray-800 font-semibold text-sm">Technologies {project.projectStatus == 'new-project' ? "To Be Used" : "Used"}</h3>
                                        {project.technologies.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {project.technologies.map((tech, index) => (
                                                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic text-sm">No technologies selected.</p>
                                        )}
                                    </div>

                                    {/* Roles */}
                                    <div>
                                        <h3 className="text-gray-800 font-semibold text-sm">Roles Needed</h3>
                                        {project.roles.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {project.roles.map((role, index) => (
                                                    <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic text-sm">No roles selected.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Content (keeps everything spaced evenly) */}
                            <div className="mt-auto">
                                {/* View More - Requires Login */}
                                {user ? (
                                    <Link
                                        href={`/project/${project.id}`}
                                        className="text-blue-600 text-sm font-medium mt-4 block hover:underline"
                                    >
                                        View details
                                    </Link>
                                ) : (
                                    <button
                                        onClick={handleViewDetailsClick}
                                        className="text-blue-600 text-sm font-medium mt-4 hover:underline"
                                    >
                                        View details
                                    </button>
                                )}

                                {/* User Info */}
                                <div className="flex items-center mt-4 pt-3 border-t border-gray-300">
                                    <Image
                                        src={project.user.avatar}
                                        width={40}
                                        height={40}
                                        alt={project.user.name}
                                        className="w-10 h-10 rounded-full border"
                                    />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-800">{project.user.name}</p>
                                        {project.user.country && (
                                            <p className="text-xs text-gray-500">{project.user.country}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ExplorePage;
