import React, { useEffect } from 'react';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import '../App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <div name="about" className='w-full h-auto bg-gradient-to-b from-gray-800 to-black text-white'>
            <div className='max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-auto'>
                <div className='pb-8 w-full flex flex-col justify-center items-center mx-auto'>
                    <h3 data-aos="fade-up" data-aos-delay="2000" data-aos-duration="2000" className='text-4xl pb-2 mb-10 font-bold inline border-b-4 border-gray-500'>Work Experience</h3>
                    <ol data-aos="fade-up" data-aos-delay="2000" data-aos-duration="2000" className="relative border-s border-blue-700 dark:border-blue-700 w-full mx-auto flex flex-col justify-center items-center">
                        <li className="mb-6 ms-6 px-5 lg:w-3/5 ">
                            <h3 className="flex pl-10 items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                Software Engineer - New York State Department &nbsp;&nbsp;&nbsp;
                                <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Latest</span>
                            </h3>
                            <time className="block pl-10 mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">May 2025 – Present</time>
                            <p className="mb-4 pl-10 text-base font-normal text-gray-500 dark:text-gray-400">Implemented RESTful APIs and integrated front-end components using Angular, creating dynamic and user-friendly interfaces.
Migrated on-premises applications to AWS, reducing operational costs by 18%.
</p>
                        </li>
                        <li className="mb-6 ms-6 px-5 lg:w-3/5 ">
                            <h3 className="flex pl-10 items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                Software Engineer - Azilen Technologies &nbsp;&nbsp;&nbsp;
                            </h3>
                            <time className="block pl-10 mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Aug 2024 – Apr 2025</time>
                            <p className="mb-4 pl-10 text-base font-normal text-gray-500 dark:text-gray-400">Implemented RESTful APIs, migrated applications to AWS, designed microservices, optimized database performance, and automated CI/CD pipelines.</p>
                        </li>
                        <li className="mb-6 ms-6 px-5 lg:w-3/5">
                            <h3 className="mb-1 pl-10 text-lg font-semibold text-gray-900 dark:text-white">Software Engineer - Planck Technologies</h3>
                            <time className="block pl-10 mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Jun 2023 – Dec 2023</time>
                            <p className="text-base pl-10 font-normal text-gray-500 dark:text-gray-400">Developed RESTful APIs, built microservices architecture, optimized SQL queries, and created responsive front-end interfaces.</p>
                        </li>
                        <li className="mb-6 ms-6 px-5 lg:w-3/5">
                            <h3 className="mb-1 pl-10 text-lg font-semibold text-gray-900 dark:text-white">Java Developer - Cognizant Technology Solutions</h3>
                            <time className="block pl-10 mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Jan 2020 – Jun 2022</time>
                            <p className="text-base pl-10 font-normal text-gray-500 dark:text-gray-400">Developed and deployed Java applications, built REST APIs, and worked with Spring Boot and front-end technologies.</p>
                        </li>
                        <li className="mb-6 ms-6 px-5 lg:w-3/5">
                            <h3 className="mb-1 pl-10 text-lg font-semibold text-gray-900 dark:text-white">Programmer Analyst - Intern - Cognizant Technology Solutions</h3>
                            <time className="block pl-10 mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Jan 2019 – Jan 2020</time>
                            <p className="text-base pl-10 font-normal text-gray-500 dark:text-gray-400">Worked on IBM Mainframes, managing incidents and problem tickets, ensuring high-performance transaction processing.</p>
                        </li>
                    </ol>
                </div>
                <div data-aos="zoom-in" data-aos-duration="500" className='mb-32 fade-in flex mx-auto items-center justify-center hover:scale-105 duration-300 rounded bg-gradient-to-b from-cyan-500 to-blue-500 lg:w-1/5 md:w-1/5 w-2/4 h-10 text-center cursor-pointer mt-10 gap-2'>
                    <AiOutlineCloudDownload />
                    <a href="./JAGADEESH PALLI-SE1.pdf" download>Download CV</a>
                </div>
            </div>
        </div>
    );
};

export default About;