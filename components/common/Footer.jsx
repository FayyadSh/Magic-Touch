// ------------ Icons ----------------
import { ChevronLeft, ChevronRight, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
// ------------ Compoenents ----------------
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="w-full bg-background-color mt-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="py-16 flex justify-between items-center flex-col gap-8 lg:flex-row">
                    {/* Logo and brand name */}
                    <a href="https://pagedone.io/" className="flex items-center justify-center gap-4">
                        <Image src='/logo.svg' width={35} height={35} alt='logo' />
                        <h3 className='font-bold tracking-wider text-primary text-xl'>
                            Magic Touch
                        </h3>
                    </a>

                    {/* Navigation Links */}
                    <ul className="text-lg text-center sm:flex items-center justify-center gap-14 lg:gap-10 xl:gap-14 transition-all duration-500">
                        <li><a href="javascript:;" className="text-primary hover:text-light-blue-color font-semibold tracking-widest">Pagedone</a></li>
                        <li className="sm:my-0 my-2"><a href="javascript:;" className="text-primary hover:text-light-blue-color font-semibold tracking-widest">Products</a></li>
                        <li><a href="javascript:;" className="text-primary hover:text-light-blue-color font-semibold tracking-widest">Resources</a></li>
                        <li className="sm:my-0 my-2"><a href="javascript:;" className="text-primary hover:text-light-blue-color font-semibold tracking-widest">Blog</a></li>
                        <li><a href="javascript:;" className="text-primary hover:text-light-blue-color font-semibold tracking-widest">Support</a></li>
                    </ul>

                    {/* Social Media Icons */}
                    <div className="flex space-x-4 sm:justify-center">
                        <a href="javascript:;" className="w-9 h-9 rounded-full text-secondary bg-primary flex justify-center items-center hover:bg-background-color hover:text-primary transition-colors duration-300">
                            <Twitter />
                        </a>
                        <a href="javascript:;" className="w-9 h-9 rounded-full text-secondary bg-primary flex justify-center items-center hover:bg-background-color hover:text-primary transition-colors duration-300">
                            <Instagram />
                        </a>
                        <a href="javascript:;" className="w-9 h-9 rounded-full text-secondary bg-primary flex justify-center items-center hover:bg-background-color hover:text-primary transition-colors duration-300">
                            <Linkedin />
                        </a>
                        <a href="javascript:;" className="w-9 h-9 rounded-full text-secondary bg-primary flex justify-center items-center hover:bg-background-color hover:text-primary transition-colors duration-300">
                            <Youtube />
                        </a>
                    </div>
                </div>

                {/* Footer Bottom Section */}
                <div className="flex flex-col items-center justify-center py-7 border-t border-white font-semibold tracking-widest">
                    <h1 className="text-primary block">
                        ©
                        <a href="https://pagedone.io/">
                            Magic Touch
                        </a>
                        2024, All rights reserved.
                    </h1>

                    <div className='text-primary/70 text-sm mt-3 flex items-center'>
                       <ChevronLeft /> 
                       <h6> Developed By Fayyad Shhadeh</h6> 
                       <ChevronRight />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
