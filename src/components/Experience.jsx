import React, { useEffect } from 'react';
import node from '../assets/experience/node.png';
import CPlus from '../assets/experience/c++.png';
import Html from '../assets/experience/htmlcssjs.png';
import react from '../assets/experience/react.png';
import c from '../assets/experience/c.png';
import python from '../assets/experience/python.png';
import Bootstrap from '../assets/experience/bootstrap.png';
import Java from '../assets/experience/java.png';
import JavaScript from '../assets/experience/javascript.png';
import aws from '../assets/experience/aws.png';
import spring from '../assets/experience/spring.png';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../App.css';

const Experience = () => {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const techs = [
        { id: 1, scr: Java, title: 'Java', style: 'shadow-gray-600' },
        { id: 2, scr: react, title: 'ReactJS', style: 'shadow-blue-600' },
        { id: 3, scr: c, title: 'C Programming', style: 'shadow-sky-500' },
        { id: 4, scr: node, title: 'Node JS', style: 'shadow-green-500' },
        { id: 5, scr: CPlus, title: 'C++ Programming', style: 'shadow-cyan-800' },
        { id: 6, scr: Html, title: 'HTML & CSS', style: 'shadow-yellow-800' },
        { id: 7, scr: python, title: 'Python', style: 'shadow-blue-400' },
        { id: 8, scr: Bootstrap, title: 'Bootstrap', style: 'shadow-blue-400' },
        { id: 9, scr: JavaScript, title: 'JavaScript', style: 'shadow-blue-400' },
        { id: 10, scr: aws, title: 'AWS Cloud', style: 'shadow-yellow-800' },
        { id: 11, scr: spring, title: 'Spring Boot', style: 'shadow-green-800' }
    ];

    return (
        <div name="skills" className="bg-gradient-to-b from-gray-800 to-black text-white w-full h-full pt-20">
            <div className="max-w-screen-lg mx-auto flex flex-col justify-center items-center p-6">
                <h3 className="text-4xl pb-4 font-bold inline border-b-4 border-gray-400 mt-10">
                    Technical Skills
                </h3>

                <div className="mt-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-10 px-4 sm:px-6 justify-center items-center">
                    {techs.map(({ id, scr, title, style }) => (
                        <div
                            data-aos="zoom-in"
                            key={id}
                            className={`flex flex-col justify-center items-center shadow-md hover:scale-105 duration-500 py-6 px-6 rounded-lg w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 ${style}`}
                        >
                            <img src={scr} alt={title} className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2" />
                            <p className="mt-2 text-center">{title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Experience;