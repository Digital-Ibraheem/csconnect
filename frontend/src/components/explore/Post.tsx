import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PostProps {
    post: {
        id: number;
        title: string;
        projectStatus: string;
        description: string;
        technologies: string[];
        roles: string[];
        user: {
            name: string;
            avatar: string;
            country?: string;
        };
    };
    user: {
        id: number;
        name: string;
        avatar: string;
        country?: string;
    } | null;
}

const Post: React.FC<PostProps> = ({ post, user }) => {
    const DESCRIPTION_LIMIT = 100;

    const handleViewDetailsClick = () => {
        // Handle view details click if user is not logged in
    };

    if (!user) {
        return <div>User not logged in</div>;
    }

    return (
        <div
            key={post.id}
            className="border rounded-lg shadow-md bg-white p-6 hover:shadow-lg transition flex flex-col justify-between h-full"
        >
            {/* Upper Content */}
            <div className="flex flex-col flex-grow">
                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>

                {/* Project Status */}
                <p className="text-sm mt-1">
                    <span className="font-semibold">Status:</span>
                    {post.projectStatus === "work-in-progress" ? (
                        <span className="text-yellow-600"> Work in Progress</span>
                    ) : (
                        <span className="text-green-600"> New Project</span>
                    )}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-700 mt-2">
                    {post.description.length > DESCRIPTION_LIMIT
                        ? `${post.description.substring(0, DESCRIPTION_LIMIT)}...`
                        : post.description}
                </p>

                {/* Technologies & Roles */}
                <div className="mt-3 flex flex-col gap-2">
                    {/* Technologies */}
                    <div>
                        <h3 className="text-gray-800 font-semibold text-sm">Technologies {post.projectStatus === 'new-project' ? "To Be Used" : "Used"}</h3>
                        {post.technologies.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {post.technologies.map((tech, index) => (
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
                        {post.roles.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {post.roles.map((role, index) => (
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
                <Link
                    href={`/project/${post.id}`}
                    className="text-blue-600 text-sm font-medium mt-4 block hover:underline"
                >
                    View details
                </Link>

                {/* User Info */}
                <div className="flex items-center mt-4 pt-3 border-t border-gray-300">
                    <Image
                        src={post.user.avatar}
                        width={40}
                        height={40}
                        alt={post.user.name}
                        className="w-10 h-10 rounded-full border"
                    />
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{post.user.name}</p>
                        {post.user.country && (
                            <p className="text-xs text-gray-500">{post.user.country}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
