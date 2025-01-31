import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { MdOutlineSpaceDashboard, MdOutlineMenu, MdOutlineCategory } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { Toaster } from 'sonner';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { url } = usePage(); 

    const isActive = (path) => url.startsWith(path) ? 'text-blue-700 font-semibold' : 'text-slate-700';
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarVisible((prevState) => !prevState);
      };


    return (
        <div className="min-h-screen">
            <Toaster position="top-right" richColors/>
            <div className="layout-topbar">
                <div className=" mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <h1 className='font-bold text-lg'>Laravel Inertia React</h1>
                                </Link>
                                <MdOutlineMenu className='lg:text-3xl lg:ml-16 hover:cursor-pointer' onClick={toggleSidebar}/>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        {/* <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link> */}
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`layout-sidebar text-base ${
                isSidebarVisible ? 'translate-x-0 left-8' : '-translate-x-full'
                }`}>
                <div className='font-bold'>HALAMAN</div>
                <div className='flex flex-col gap-2 mt-4'>
                    <Link href='/dashboard' className={`hover:bg-gray-100 px-3 py-2 duration-100 rounded-lg ${isActive('/dashboard')}`}>
                        <div className='flex items-center gap-2'><MdOutlineSpaceDashboard /> Dashboard</div>
                    </Link>
                    <Link href='/category' className={`hover:bg-gray-100 px-3 py-2 duration-100 rounded-lg ${isActive('/category')}`}>
                        <div className='flex items-center gap-2'><MdOutlineCategory /> Kategori</div>
                    </Link>
                    <Link href='/transaction' className={`hover:bg-gray-100 px-3 py-2 duration-100 rounded-lg ${isActive('/transaction')}`}>
                        <div className='flex items-center gap-2'><GrTransaction /> Transaksi</div>
                    </Link>
                </div>
            </div>
            <div className={`layout-main-container ${
                isSidebarVisible ? 'lg:ml-[250px] lg:pl-16' : 'lg:ml-0 lg:pl-8'
                }`}>{children}
            </div>

        </div>
    );
}
