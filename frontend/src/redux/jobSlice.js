import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ 1. Async thunk to fetch all jobs from backend
export const fetchAllJobs = createAsyncThunk(
  "job/fetchAllJobs",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {};
      
      // Only add Authorization header if token exists
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await axios.get("http://localhost:8000/api/jobs/get", {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Server Error");
    }
  }
);

// ✅ 2. Initial State
const initialState = {
  allJobs: [],
  allAdminJobs: [],
  singleJob: null,
  searchJobByText: "",
  searchedQuery: "",
  allAppliedJobs: [],
  filters: {
    location: "",
    industry: "",
    salary: ""
  },
  loading: false,
  error: null
};

// ✅ 3. Slice
const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        location: "",
        industry: "",
        salary: ""
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array and object response formats
        state.allJobs = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload?.jobs || []);
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// ✅ 4. Export Actions and Reducer
export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setFilters,
  clearFilters
} = jobSlice.actions;

export default jobSlice.reducer;
