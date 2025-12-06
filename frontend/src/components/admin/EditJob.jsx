import React, { useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector, useDispatch } from 'react-redux'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'
import { setAllAdminJobs } from '@/redux/jobSlice'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'

const EditJob = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useGetAllCompanies();
  
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { companies } = useSelector(store => store.company);

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${params.id}`, {
          withCredentials: true
        });
        
        if (res.data.success && res.data.job) {
          const job = res.data.job;
          setInput({
            title: job.title || "",
            description: job.description || "",
            requirements: job.requirements?.join(",") || "",
            salary: job.salary?.toString() || "",
            location: job.location || "",
            jobType: job.jobType || "",
            experience: job.experienceLevel || "",
            position: job.position || 0,
            companyId: job.company?._id || job.company || ""
          });
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to load job data");
        navigate("/admin/jobs");
      } finally {
        setFetching(false);
      }
    };
    
    if (params.id) {
      fetchJob();
    }
  }, [params.id, navigate]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, companyId: value });
  };

  const experienceSelectHandler = (value) => {
    setInput({ ...input, experience: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!input.title.trim() || !input.description.trim() || !input.requirements.trim() || 
        !input.salary || !input.location.trim() || !input.jobType.trim() || 
        !input.experience || !input.position || !input.companyId) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`${JOB_API_END_POINT}/update/${params.id}`, input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (res.data.success) {
        // Fetch updated jobs list
        try {
          const jobsRes = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
            withCredentials: true
          });
          if(jobsRes.data.success) {
            dispatch(setAllAdminJobs(jobsRes.data.jobs));
          }
        } catch (fetchError) {
          console.log('Error fetching jobs:', fetchError);
        }
        
        toast.success(res.data.message || 'Job updated successfully!');
        
        setTimeout(() => {
          navigate("/admin/jobs");
        }, 500);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div>
        <Navbar />
        <div className='flex items-center justify-center h-screen'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center w-screen my-5'>
        <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
          <div className='flex items-center gap-5 mb-5'>
            <Button
              onClick={() => navigate("/admin/jobs")}
              variant='outline'
              className='flex items-center gap-2 text-gray-500 font-semibold'>
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className='font-bold text-xl'>Edit Job</h1>
          </div>
          
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                placeholder="Separate with commas"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Select value={input.experience} onValueChange={experienceSelectHandler}>
                <SelectTrigger className="w-full my-1">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>No of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div className="col-span-2">
              <Label>Select Company</Label>
              {
                companies.length > 0 ? (
                  <Select value={input.companyId} onValueChange={selectChangeHandler}>
                    <SelectTrigger className="w-full my-1">
                      <SelectValue placeholder="Select a Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {
                          companies.map((company) => (
                            <SelectItem key={company._id} value={company._id}>
                              {company.name}
                            </SelectItem>
                          ))
                        }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className='text-sm text-red-500 mt-1'>
                    No companies found. Please register one first.
                  </p>
                )
              }
            </div>
          </div>

          {
            loading
              ? <Button disabled className="w-full my-4">
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                </Button>
              : <Button type="submit" className="w-full my-4">Update Job</Button>
          }
        </form>
      </div>
    </div>
  )
}

export default EditJob

