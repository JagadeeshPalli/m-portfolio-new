import React,{useEffect} from 'react'
import jagadeesh from '../assets/projects/foodmunch.png'
// import Gist from '../assets/projects//gist.png'
import campus360 from '../assets/projects/campus360.webp'
import embedded from '../assets/projects/embedded.png'
import audit from '../assets/projects/audit.png'
// import Upscale from '../assets/projects/upscale.png'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Projects = () => {
  useEffect(()=> {
    AOS.init({duration: 1000})
})

  const Projects = () => [
    {
      id: 1,
      src: jagadeesh,
      desc: "Food Munch is a web-application which was designed using Basic HTML, CSS, JS",
      demo: "https://rohithtangudu.github.io/632_Team15_Hw7/",
      code: "https://github.com/Ajay-Addike/632_Team15_HW3"
    },
    {
      id: 2,
      src: audit,
      desc: "Assessing bias in machine learning models predicting recidivism",
      demo: "https://github.com/JagadeeshPalli/CS_584_Machine_Learning/blob/main/Final_Project.ipynb",
      code: "https://github.com/JagadeeshPalli/CS_584_Machine_Learning"
    },
    {
      id: 3,
      src: campus360,
      desc: "A Web application designed to streamline students' academic profiles and surveys.",
      demo: "https://jagadeesh-642.s3.us-east-2.amazonaws.com/SWE_642/index.html",
      code: "https://github.com/JagadeeshPalli/SWE-642"
    },
    {
      id: 4,
      src: embedded,
      desc: "An embedded system designed to enhance care for disabled patients by providing assistance without human ",
      demo: "https://opeditor.vercel.app/",
      code: "https://github.com/dipayansarkar47/online-code-editor"
    },
    // {
    //   id: 5,
    //   src: Upscale,
    //   // desc: "It is a Weather application which shows temperatures of various cities across the globe made using REST API...",
    //   demo: "https://upscaleai.vercel.app/",
    //   code: "https://github.com/dipayansarkar47/upscale-ai"
    // },
    // {
    //   id: 6,
    //   src: Gist,
    //   // desc: "It is a Face-Detection application made using Python and Computer Vision...",
    //   demo: "https://gist-ai.vercel.app/",
    //   code: "https://github.com/dipayansarkar47/Gist.AI-Summarizer"
    // },
  ]


  return (
    <div name="projects" className='h-auto max-h-screen-lg  bg-gradient-to-b from-black to-gray-800 w-full text-white
     md:h-screen'>
      <div className='max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full'>
        <div className='pb-8 mt-16 w-full flex flex-col justify-center items-center mx-auto'>
          <h3 className='text-4xl pb-2 font-bold inline border-b-4 border-gray-400'>Personal Projects</h3>
        </div>
        <div   className='grid sm:grid-cols-2 md:grid-cols-3 mb-20 gap-8 px-12 sm:px-0'>
          {
            Projects().map(({ id, src, desc, demo, code }) => (

              <div data-aos="fade-in" data-aos-duration="500" key={id} className='shadow-md shadow-gray-600 rounded-lg'>
                <img src={src} alt="Ai" className='rounded-md duration-200 hover:scale-105' />
                <p className='p-2 text-justify font-extralight'>{desc}</p>
                <div className='flex items-center justify-center'>
                  
                  <button className='w-1/2 px-6 py-3 m-4 duration-200 hover:scale-105 bg-gradient-to-l from-gray-700 to-blue-900 rounded-md'>
                    <a href={demo}>Demo</a>
                  </button>
                  <button  className='w-1/2 px-6 py-3 m-4 duration-200 hover:scale-105 bg-gradient-to-l from-purple-900 to-gray-700 rounded-md'>
                    <a href={code}>Code</a>
                  </button>
                </div>
              </div>

            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Projects