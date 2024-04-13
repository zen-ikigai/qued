'use client'

import withoutAuth from '@/components/hoc/withoutAuth'

import { handleSignIn } from '@/components/auth/Login'
import {
  HiArrowRight,
  HiGlobeAlt,
  HiOutlineGlobeAlt,
  HiOutlinePencil,
  HiPencil,
  HiPencilAlt,
} from 'react-icons/hi'
import FeatureCard from '@/components/info/FeatureCard'

const Home = () => {
  const features = [
    {
      title: 'Easy Google Login',
      description:
        "No need to remember another password. Just login with your Google account and you're good to go.",
      status: 'existing',
    },
    {
      title: 'Inutive UI',
      description:
        'The UI is designed to be simple and intuitive. You can get started in a few clicks.',
      status: 'existing',
    },
    {
      title: 'Drag and Drop',
      description:
        'You can easily update the status of tasks by dragging nad dropping',
      status: 'existing',
    },
    {
      title: 'Custom Unique Avatars',
      description:
        'Every user gets an avatar from the HueMan API. No need to upload a profile picture.',
      status: 'existing',
    },
    {
      title: 'Profile Page',
      description:
        'A profile page for every user with analytics, 1-Click easy Deletion of Tasks and Profile.',
      status: 'existing',
    },
    {
      title: 'Search, Sort, Filter',
      description:
        'Search through all the tasks, Filter them based on status and date, sort them based on due date and creation date. ',
      status: 'existing',
    },
  ]
  return (
    <section className='w-full flex-center flex-col flex-grow'>
      <h1 className='head_text pastel_gradient text-center font-mono'>
        Effortless Organization
      </h1>
      <h2 className='font-semibold  text-xl md:text-2xl mt-5 text-center font-mono text-gray-600'>
        Master Your Tasks, Own Your Time
      </h2>

      <p className='desc text-justify font-mono text-gray-600'>
        Welcome to Qued, where simplicity meets productivity. Join the community
        of achievers, Embrace efficiency and Transform your productivity with
        Qued.
      </p>
      <div className='flex justify-between items-center gap-5 mt-10 '>
        <button onClick={handleSignIn} className='outline_btn_mono '>
          Start Exploring <HiArrowRight className='ml-2' />{' '}
        </button>
        <button onClick={handleSignIn} className='black_btn_mono '>
          Organize Now <HiArrowRight className='ml-2' />{' '}
        </button>
      </div>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-10'>
        {features.map((feature, index) => (
          <FeatureCard key={index} index={index} feature={feature} />
        ))}
      </div>
    </section>
  )
}

export default withoutAuth(Home)
