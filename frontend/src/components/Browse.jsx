import React from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useSelector } from 'react-redux'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector(store => store.job);

  // Shuffle jobs to show random order
  const shuffledJobs = [...allJobs].sort(() => Math.random() - 0.5);

  return (
    <div>
      <Navbar/>
      <div className='max-w-7xl mx-auto my-10'>
        <h1 className='font-bold text-xl my-10'>Search Results ({shuffledJobs.length})</h1>
        {shuffledJobs.length === 0 ? (
          <p className='text-gray-500 text-center py-10'>No jobs found</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {shuffledJobs.map((job) => (
              <div key={job._id} className='max-h-screen overflow-hidden'>
                <Job job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Browse