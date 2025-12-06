import React, { useEffect, useMemo } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllJobs } from '@/redux/jobSlice';

const Jobs = () => {
  const dispatch = useDispatch();
  const { allJobs, filters } = useSelector(store => store.job);
  
  useEffect(() =>{
    dispatch(fetchAllJobs());
  },[dispatch]);

  // Filter jobs based on selected filters
  const filteredJobs = useMemo(() => {
    if (!allJobs || allJobs.length === 0) return [];

    return allJobs.filter((job) => {
      // Filter by location
      if (filters.location && job.location !== filters.location) {
        return false;
      }

      // Filter by industry (match against job title or jobType)
      if (filters.industry) {
        const jobTitle = job.title?.toLowerCase() || '';
        const jobType = job.jobType?.toLowerCase() || '';
        const filterIndustry = filters.industry.toLowerCase();
        
        // Extract key words from filter (e.g., "Frontend Developer" -> "frontend")
        const industryKeywords = filterIndustry.split(' ')[0]; // Get first word
        
        if (!jobTitle.includes(industryKeywords) && 
            !jobTitle.includes(filterIndustry) &&
            !jobType.includes(industryKeywords) && 
            !jobType.includes(filterIndustry)) {
          return false;
        }
      }

      // Filter by salary range
      if (filters.salary) {
        const jobSalary = job.salary || 0;
        let minSalary = 0;
        let maxSalary = Infinity;

        if (filters.salary === '0-40k') {
          maxSalary = 40000;
        } else if (filters.salary === '42-1lakh') {
          minSalary = 42000;
          maxSalary = 100000;
        } else if (filters.salary === '1lakh to 5lakh') {
          minSalary = 100000;
          maxSalary = 500000;
        }

        if (jobSalary < minSalary || jobSalary > maxSalary) {
          return false;
        }
      }

      return true;
    });
  }, [allJobs, filters]);

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto mt-5'>
        <div className="flex gap-5">
          <div className='w-1/5'>
            <FilterCard />
          </div>
          {
            filteredJobs.length <= 0 ? (
              <div className='flex-1 flex items-center justify-center h-[88vh]'>
                <span className='text-gray-500'>No jobs found matching your filters</span>
              </div>
            ) : (
              <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                <div className='mb-4 text-sm text-gray-600'>
                  Showing {filteredJobs.length} of {allJobs.length} jobs
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
                  {
                    filteredJobs.map((job) => (
                      <div key={job._id} className='max-h-screen overflow-hidden'>
                        <Job job={job} />
                      </div>
                    ))

                  }
                </div>
              </div>
            )
          }

        </div>
      </div>
    </div>
  )
}

export default Jobs