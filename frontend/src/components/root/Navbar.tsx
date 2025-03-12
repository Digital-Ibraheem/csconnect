'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import HamburgerMenu from "@/components/ui/HamburgerMenu";
import Button from "@/components/ui/Button";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const { activeModal, openModal, closeModal } = useModal();
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleScroll = () => setHasScrolled(window.scrollY > 50);
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);

    return (
        <>
            <nav tabIndex={0} className={clsx(
                "fixed top-0 left-0 w-full flex justify-center px-4 sm:px-8 md:px-16 z-50 transition-all duration-500",
                hasScrolled || !isHomePage ? "bg-[#1a1a1a]/90 backdrop-blur-md" : "bg-transparent"
            )}>
                {/* Border extending full width */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent pointer-events-none"></div>

                <div className="flex justify-between items-center w-full max-w-[1296px] py-6 relative">
                    {/* Logo */}
                    <Link href="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded-full"></div> {/* Placeholder for logo */}
                        <span className="text-white text-lg font-medium">CSConnect</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-full px-4 py-2">
                        <Link href="/create" className="text-white text-sm font-normal transition hover:text-gray-400">Create</Link>
                        <Link href="/explore" className="text-white text-sm font-normal transition hover:text-gray-400">Explore</Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 text-white hidden sm:flex"
                                >
                                    <Image
                                        src={user.profilePictureUrl || "https://randomuser.me/api/portraits/men/1.jpg"}
                                        width={32}
                                        height={32}
                                        alt={user.username || "Profile picture"}
                                        className="rounded-full border border-gray-400"
                                    />
                                    <span className="hidden sm:inline text-sm">{user.username}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden z-50">
                                        <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                            View Profile
                                        </Link>
                                        <button
                                            onClick={() => { logout(); setDropdownOpen(false); }}
                                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button
                                    className="text-white text-sm font-medium transition hover:text-gray-400"
                                    onClick={() => openModal("login")}
                                >
                                    Log in
                                </button>
                                <Button onClick={() => openModal("signup")}>Sign up</Button>
                            </>
                        )}
                        <HamburgerMenu isSidebarOpen={isSidebarOpen} onClick={() => setSidebarOpen(!isSidebarOpen)} />
                    </div>
                </div>
            </nav>

            {/* Sidebar Navigation for Mobile */}
            <div
                className={clsx(
                    "fixed top-0 right-0 h-full bg-[#1a1a1a] shadow-lg z-40 transition-transform duration-300 pt-24 flex flex-col justify-between",
                    "w-full sm:w-[375px]", // Full width on mobile, 375px on larger screens
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div>
                    {user && <div>

                        <div className="py-2 px-10">
                            <Link href="/profile" onClick={() => setSidebarOpen(false)} className="text-white text-xl font-normal transition hover:text-gray-400 flex">
                                <Image
                                    src={user.avatar || "https://randomuser.me/api/portraits/men/1.jpg"}
                                    width={32}
                                    height={32}
                                    alt={user.fullName || "Profile picture"}
                                    className="rounded-full w-[50px] h-[50px] border border-gray-400"
                                />
                                <div className="flex flex-col justify-between h-full align-center">
                                    <p className="text-base font-bold ml-4">{user.username}</p>
                                    <p className="text-sm ml-4">{user.email}</p>
                                </div>
                            </Link>
                        </div>
                        <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent pointer-events-none"></div>

                    </div>}
                    <div className="py-5 px-10">
                        <Link href="/create" onClick={() => setSidebarOpen(false)} className="text-white text-xl font-normal transition hover:text-gray-400">
                            Create
                        </Link>
                    </div>
                    <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent pointer-events-none"></div>

                    <div className="py-5 px-10">
                        <Link href="/explore" onClick={() => setSidebarOpen(false)} className="text-white text-xl font-normal transition hover:text-gray-400">
                            Explore
                        </Link>
                    </div>
                </div>

                {/* Logout Button at Bottom */}
                <div>
                    {user && (
                        <div className="py-6 px-10">
                            <Button onClick={() => { logout(); setSidebarOpen(false); }} className="w-full bg-red-600 hover:bg-red-700 text-white">
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {activeModal === "login" && <LoginModal onClose={closeModal} />}
            {activeModal === "signup" && <SignUpModal onClose={closeModal} />}
        </>
    );
}
