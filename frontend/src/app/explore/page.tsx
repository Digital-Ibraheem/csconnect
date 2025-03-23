'use client';

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { CardsSkeleton } from '@/components/ui/skeletons';
import { useAuth } from '@/context/AuthContext';
import SearchBar from "@/components/explore/SearchBar";
import Post from "@/components/explore/Post";
import debounce from 'lodash/debounce';

const API_URL = "http://localhost:8080/api/posts";

interface PostType {
  id: number;
  title: string;
  projectStatus: string;
  description: string;
  technologies: string[];
  roles: string[];
  isPublished: boolean;
  owner: {
    id: number;
    username: string;
    fullName: string;
    profilePictureUrl: string;
    location?: string;
  };
}

const ExplorePage = () => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<PostType[]>([]);
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [filteredProjects, setFilteredProjects] = useState<PostType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (term: string) => {
            if (!term.trim()) {
                setFilteredProjects(projects);
                return;
            }
            
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/search?keyword=${encodeURIComponent(term)}`);
                
                if (!response.ok) {
                    throw new Error("Search failed");
                }
                
                const data = await response.json();
                setFilteredProjects(data);
            } catch (err) {
                console.error("Error searching:", err);
                setError("Search failed. Please try again.");
            } finally {
                setLoading(false);
            }
        }, 500), // 500ms delay
        [projects]
    );

    // Effect to trigger search when searchTerm changes
    useEffect(() => {
        debouncedSearch(searchTerm);
        
        // Cleanup on unmount
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, debouncedSearch]);

    // Search input handler
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Fetch posts from backend
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }
            
            const data = await response.json();
            setProjects(data);
            setFilteredProjects(data);
        } catch (err: any) {
            console.error("Error fetching posts:", err);
            setError("Failed to load projects. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Remove error when user logs in
    useEffect(() => {
        if (user) {
            setError(null);
        }
    }, [user]);

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
                    {user ? (
                        <Link href='/create'>
                            <button
                                onClick={() => setError(null)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                New Project
                            </button>
                        </Link>
                    ) : (
                        <button
                            onClick={() => setError("You need to log in to create a new project.")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            New Project
                        </button>
                    )}
                </div>
            </div>
            <SearchBar onSearch={handleSearch} />

            {loading ? (
                <CardsSkeleton />
            ) : filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full mt-16">
                    <p className="text-lg text-gray-500">No projects found</p>
                    <p className="text-sm text-gray-400 mt-2">Try a different search term or check back later</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mt-6">
                    {filteredProjects.map((project) => {
                        // Add safety checks for missing data
                        const owner = project.owner || {};
                        
                        return (
                            <Post 
                                key={project.id}
                                post={{
                                    id: project.id,
                                    title: project.title,
                                    projectStatus: project.projectStatus,
                                    description: project.description,
                                    technologies: project.technologies || [],
                                    roles: project.roles || [],
                                    user: {
                                        name: owner.fullName || "Unknown User",
                                        avatar: owner.profilePictureUrl || "",
                                        country: owner.location
                                    }
                                }}
                                user={user ? {
                                    id: user.id,
                                    name: user.fullName || "User",
                                    avatar: user.profilePictureUrl || "",
                                    country: user.location
                                } : { 
                                    id: 0, 
                                    name: "Guest", 
                                    avatar: "", 
                                    country: undefined 
                                }} 
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default ExplorePage;
