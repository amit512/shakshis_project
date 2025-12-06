import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSingleCompany, setCompanies } from '@/redux/companySlice'
import axios from 'axios'
import toast from 'react-hot-toast'
import { COMPANY_API_END_POINT } from '@/utils/constant';

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error('Please enter a company name');
      return;
    }

    setLoading(true);
    console.log("Register button clicked");
    try {
      const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName:companyName}, {
        headers :{
          'Content-Type': "application/json"
        },
        withCredentials:true
      } );
      
      if(res?.data?.success){
        dispatch(setSingleCompany(res.data.company));
        
        // Fetch updated companies list to show the new company
        try {
          const companiesRes = await axios.get(`${COMPANY_API_END_POINT}/get`, {
            withCredentials: true
          });
          if(companiesRes.data.success) {
            dispatch(setCompanies(companiesRes.data.companies));
          }
        } catch (fetchError) {
          console.log('Error fetching companies:', fetchError);
        }
        
        toast.success(res.data.message || 'Company created successfully!');
        
        // Navigate after a short delay to ensure toast is visible
        setTimeout(() => {
          const companyId = res?.data?.company?._id;
          navigate(`/admin/companies/${companyId}`);
        }, 500);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || 'Failed to create company. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div>
      <Navbar/>
      <div className="max-w-4xl mx-auto">
        <div className='my-10'>
        <h1 className='font-bold text-2xl'>Your Company Name</h1>
        <p className='text-gray-500'>What would you like to give your company name? You can change this later. </p> 
        </div>

        <Label>Company Name</Label>
        <Input
        type="text"
        className="my-2"
        placeholder="JobHunt, Microsoft, etc"
        onChange = {(e) => setCompanyName(e.target.value)}
        />
        <div className='flex items-center gap-2 my-10'>
          <Button variant='outline' onClick={ () => navigate('/admin/companies')} disabled={loading}>Cancel</Button>
          <Button onClick={()=> registerNewCompany()} disabled={loading || !companyName.trim()}>
            {loading ? 'Creating...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CompanyCreate