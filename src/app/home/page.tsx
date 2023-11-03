// import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  CreateOrganization,
  OrganizationSwitcher, UserButton, auth, useOrganization, useUser,
} from '@clerk/nextjs';
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/Input';
import Logo from '@/components/Logo';
import ServerTest from './serverText';
import ClientTest from './ClientTest';

const navigation = [
  {
    name: 'Dashboard', href: '#', icon: HomeIcon, current: true,
  },
  {
    name: 'Team', href: '#', icon: UsersIcon, current: false,
  },
  {
    name: 'Projects', href: '#', icon: FolderIcon, current: false,
  },
  {
    name: 'Calendar', href: '#', icon: CalendarIcon, current: false,
  },
  {
    name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false,
  },
  {
    name: 'Reports', href: '#', icon: ChartPieIcon, current: false,
  },
];
const teams = [
  {
    id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false,
  },
  {
    id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false,
  },
  {
    id: 3, name: 'Workcation', href: '#', initial: 'W', current: false,
  },
];

const Home = () => {
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // const user = useUser();
  // const org = useOrganization();

  // console.log('org', org);
  // console.log('user', user);
  const authRes = auth();
  console.log(authRes);

  return (
    <>
    <p>I was rendered by the server</p>
    <OrganizationSwitcher hidePersonal />
    <ClientTest />
    </>
    // <>
    //   {/*
    //     This example requires updating your template:

  //     ```
  //     <html class="h-full bg-white">
  //     <body class="h-full">
  //     ```
  //   */}
  //   <div>
  //     <Transition.Root show={sidebarOpen} as={Fragment}>
  //       <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
  //         <Transition.Child
  //           as={Fragment}
  //           enter="transition-opacity ease-linear duration-300"
  //           enterFrom="opacity-0"
  //           enterTo="opacity-100"
  //           leave="transition-opacity ease-linear duration-300"
  //           leaveFrom="opacity-100"
  //           leaveTo="opacity-0"
  //         >
  //           <div className="fixed inset-0 bg-stone-900/80" />
  //         </Transition.Child>

  //         <div className="fixed inset-0 flex">
  //           <Transition.Child
  //             as={Fragment}
  //             enter="transition ease-in-out duration-300 transform"
  //             enterFrom="-translate-x-full"
  //             enterTo="translate-x-0"
  //             leave="transition ease-in-out duration-300 transform"
  //             leaveFrom="translate-x-0"
  //             leaveTo="-translate-x-full"
  //           >
  //             <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
  //               <Transition.Child
  //                 as={Fragment}
  //                 enter="ease-in-out duration-300"
  //                 enterFrom="opacity-0"
  //                 enterTo="opacity-100"
  //                 leave="ease-in-out duration-300"
  //                 leaveFrom="opacity-100"
  //                 leaveTo="opacity-0"
  //               >
  //                 <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
  //                   <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
  //                     <span className="sr-only">Close sidebar</span>
  //                     <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
  //                   </button>
  //                 </div>
  //               </Transition.Child>
  //               {/* Sidebar component, swap this element with another sidebar if you like */}
  //               <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-950 px-6 pb-2 ring-1 ring-white/10">
  //                 <div className="flex h-16 shrink-0 items-center">
  //                   <Logo />
  //                 </div>
  //                 <nav className="flex flex-1 flex-col">
  //                   <ul role="list" className="flex flex-1 flex-col gap-y-7">
  //                     <li>
  //                       <ul role="list" className="-mx-2 space-y-1">
  //                         {navigation.map((item) => (
  //                           <li key={item.name}>
  //                             <Button
  //                               variant='ghost'
  //                               href={item.href}
  //                               className={classNames('group')}
  //                             >
  //                               <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
  //                             </Button>
  //                           </li>
  //                         ))}
  //                       </ul>
  //                     </li>
  //                     <li>
  //                       <div className="text-xs font-semibold leading-6 text-zinc-400">Your teams</div>
  //                       <ul role="list" className="-mx-2 mt-2 space-y-1">
  //                         {teams.map((team) => (
  //                           <li key={team.name}>
  //                             <Button
  //                               href={team.href}
  //                               variant="ghost"
  //                               className={classNames('group')}
  //                             >
  //                               <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-[0.625rem] font-medium text-zinc-400 group-hover:text-white">
  //                                 {team.initial}
  //                               </span>
  //                             </Button>
  //                           </li>
  //                         ))}
  //                       </ul>
  //                     </li>
  //                   </ul>
  //                 </nav>
  //               </div>
  //             </Dialog.Panel>
  //           </Transition.Child>
  //         </div>
  //       </Dialog>
  //     </Transition.Root>

  //     {/* Static sidebar for desktop */}
  //     <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-20 lg:flex-col">
  //       {/* Sidebar component, swap this element with another sidebar if you like */}
  //       <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-950 px-6">
  //         <div className="flex h-16 shrink-0 items-center">
  //           <Logo />
  //         </div>
  //         <nav className="flex flex-1 flex-col">
  //           <ul role="list" className="flex flex-1 flex-col gap-y-7">
  //             <li>
  //               <ul role="list" className="-mx-2 space-y-1">
  //                 {navigation.map((item) => (
  //                   <li key={item.name}>
  //                     <a
  //                       href={item.href}
  //                       className={classNames(
  //                         item.current
  //                           ? 'bg-zinc-800 text-white'
  //                           : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
  //                         'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
  //                         'flex justify-center',
  //                       )}
  //                     >
  //                       <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
  //                     </a>
  //                   </li>
  //                 ))}
  //               </ul>
  //             </li>
  //             <li>
  //               <ul role="list" className="-mx-2 mt-2 space-y-1">
  //                 {teams.map((team) => (
  //                   <li key={team.name}>
  //                     <a
  //                       href={team.href}
  //                       className={classNames(
  //                         team.current
  //                           ? 'bg-zinc-800 text-white'
  //                           : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
  //                         'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
  //                       )}
  //                     >
  //                       <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-[0.625rem] font-medium text-zinc-400 group-hover:text-white">
  //                         {team.initial}
  //                       </span>
  //                     </a>
  //                   </li>
  //                 ))}
  //               </ul>
  //             </li>
  //             <li className="-mx-6 mt-auto">
  //               <div className="flex items-center space-x-4 p-4">
  //                 <UserButton afterSignOutUrl="/"/>
  //                 <OrganizationSwitcher />
  //               </div>
  //             </li>
  //           </ul>
  //         </nav>
  //       </div>
  //     </div>

  //     <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-zinc-950 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
  //       <button type="button" className="-m-2.5 p-2.5 text-zinc-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
  //         <span className="sr-only">Open sidebar</span>
  //         <Bars3Icon className="h-6 w-6" aria-hidden="true" />
  //       </button>
  //       <div className="flex-1 text-sm font-semibold leading-6 text-white">Dashboard</div>
  //       <a href="#">
  //         <span className="sr-only">Your profile</span>
  //         <UserButton afterSignOutUrl="/"/>
  //         <OrganizationSwitcher />
  //       </a>
  //     </div>

  //     <main className="py-4 lg:pl-24">
  //       {/* todo move to own component */}
  //       <div className="px-4 sm:px-6 lg:px-8">
  //         <div className="border-b border-solid border-zinc-800 flex flex-col space-y-4 pb-2">
  //           <div className="flex items-center space-x-2">
  //             <Select options={[{ id: '1', name: 'Selected value' }]} selected={{ id: '1', name: 'Selected value' }} onChange={() => undefined} />
  //             <InputField value="" placeholder='Hello world' onChange={() => undefined} />
  //           </div>
  //           <div className="w-full flex flex-col space-y-2 items-start">
  //             <Button>Primary button</Button>
  //             {/* <ServerTest /> */}
  //             <CreateOrganization />
  //             <Button variant='outline'>Outline</Button>
  //             <Button variant='secondary'>Secondary</Button>
  //             <Button variant='ghost'>Ghost</Button>
  //             <Button variant='danger'>Danger</Button>
  //             <Button variant='link'>Link</Button>
  //             <Button variant='success'>Success</Button>
  //           </div>
  //         </div>
  //       </div>
  //     </main>
  //   </div>
  // </>
  );
};

export default Home;
