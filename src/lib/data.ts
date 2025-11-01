export const NAV_LINKS = [
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
];

export const SKILLS = {
    'Languages & Frameworks': [
        { name: 'JavaScript', icon: 'javascript' },
        { name: 'TypeScript', icon: 'typescript' },
        { name: 'React', icon: 'react' },
        { name: 'Next.js', icon: 'nextjs' },
        { name: 'Node.js', icon: 'nodejs' },
        { name: 'Python', icon: 'python' },
    ],
    'Databases': [
        { name: 'PostgreSQL', icon: 'postgresql' },
        { name: 'MongoDB', icon: 'mongodb' },
        { name: 'MySQL', icon: 'mysql' },
        { name: 'Firebase', icon: 'firebase' },
    ],
    'Architecture & State': [
        { name: 'Redux', icon: 'redux' },
        { name: 'REST APIs', icon: 'api' },
        { name: 'Microservices', icon: 'microservices' },
        { name: 'GraphQL', icon: 'graphql' },
    ],
    'DevOps & Tools': [
        { name: 'Docker', icon: 'docker' },
        { name: 'Kubernetes', icon: 'kubernetes' },
        { name: 'GitHub Actions', icon: 'githubactions' },
        { name: 'Git', icon: 'git' },
        { name: 'Nginx', icon: 'nginx' },
    ],
    'Security & Auth': [
        { name: 'OAuth 2.0', icon: 'oauth' },
        { name: 'JWT', icon: 'jwt' },
        { name: 'NextAuth.js', icon: 'nextauth' },
    ],
};

export const EXPERIENCE = [
    {
        title: 'Full Stack Developer',
        company: 'CodeClause (Internship)',
        date: 'June 2024 - July 2024',
        description: 'Developed and maintained web applications using React, Node.js, and MongoDB. Contributed to the development of a RESTful API and implemented responsive UI designs.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
        links: {
            website: 'https://codeclause.com',
        },
    },
    {
        title: 'Full Stack Development Trainee',
        company: 'Newton School',
        date: 'Oct 2023 - Present',
        description: 'Completed a comprehensive full-stack development program, gaining expertise in MERN stack, data structures, and algorithms. Built several full-stack projects from scratch.',
        technologies: ['React', 'Redux', 'Node.js', 'MongoDB', 'Data Structures', 'Algorithms'],
        links: {
            website: 'https://www.newtonschool.co/',
        },
    },
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
