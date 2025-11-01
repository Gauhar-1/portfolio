export const NAV_LINKS = [
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
];

export const PROJECTS = [
    {
        id: 'lan-communicator',
        title: 'LAN-based Communication & File Sharing System',
        description: 'A desktop application developed in Python that facilitates real-time communication and efficient file sharing among users connected to the same Local Area Network (LAN). The system uses socket programming for robust and low-latency data transfer.',
        technologies: ['Python', 'Socket Programming', 'Threading', 'Tkinter (for GUI version)'],
        links: {
            github: 'https://github.com/Gauhar-1/lan-based-communication-and-file-sharing-system',
            demo: '#'
        },
    },
    {
        id: 'booking-app',
        title: 'Travel Booking Website',
        description: 'Designed and developed a complete travel booking platform with features like user authentication, hotel listings, booking management, and payment integration.',
        technologies: ['Next.js', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Stripe'],
        links: {
            github: 'https://github.com/Gauhar-1/booking-app',
        },
        imageUrl: "https://picsum.photos/seed/booking/1280/720"
    }
];

export const PROJECT_SPOTLIGHT_DATA = {
    title: 'LAN-based Communication & File Sharing System',
    description: 'A desktop application developed in Python that facilitates real-time communication and efficient file sharing among users connected to the same Local Area Network (LAN). The system uses socket programming for robust and low-latency data transfer.',
    features: [
        'Real-time text-based chat between multiple clients.',
        'Secure and fast file transfer of any size.',
        'Dynamic discovery of users on the network.',
        'Simple and intuitive command-line interface.',
    ],
    technologies: ['Python', 'Socket Programming', 'Threading', 'Tkinter (for GUI version)'],
};
