import { Job } from "../models/job.model.js";
import mongoose from "mongoose";

export const postJob = async (req, res) => {
  try {
    console.log("Post job request body:", req.body);
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
    const userId = req.id;

    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return res.status(400).json({
        message: "Something is missing",
        success: false
      })
    };
    
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId
    });
    
    console.log("Job created successfully:", job);
    return res.status(201).json({
      message: "New job created successfully",
      job,
      success: true
    });
  } catch (error) {
    console.log("Error creating job:", error);
    return res.status(500).json({
      message: error.message || "Internal server error. Please try again.",
      success: false
    });
  }
}

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ]
    };
    const jobs = await Job.find(query).populate({
      path:"company"
    }).sort({createdAt:-1});
     if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "Jobs not found",
        success: false
      })
    };
    return res.status(200).json({
      jobs,
      success: true
    })
  } catch (error) {
    console.log(error);
  }
}

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path : "applications"
    });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found",
        success: false
      })
    };
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
  }
}

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    console.log("Fetching admin jobs for user ID:", adminId);
    
    const jobs = await Job.find({ created_by: adminId })
      .populate({
        path: 'company'
      })
      .sort({ createdAt: -1 });
    
    console.log("Found jobs:", jobs.length);
    
    if (!jobs || jobs.length === 0) {
      return res.status(200).json({
        jobs: [],
        message: "No jobs found",
        success: true
      })
    };
    
    return res.status(200).json({
      jobs,
      success: true
    })
  } catch (error) {
    console.log("Error fetching admin jobs:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false
    });
  }
}

export const updateJob = async (req, res) => {
  try {
    console.log("Update job request body:", req.body);
    console.log("Job ID:", req.params.id);
    
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
    const userId = req.id;
    const jobId = req.params.id;

    // Find the job first
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    // Check if user owns this job
    if (job.created_by.toString() !== userId) {
      return res.status(403).json({
        message: "You don't have permission to update this job",
        success: false
      });
    }

    // Validate required fields
    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return res.status(400).json({
        message: "Something is missing",
        success: false
      });
    }

    // Update job fields
    job.title = title;
    job.description = description;
    job.requirements = requirements.split(",");
    job.salary = Number(salary);
    job.location = location;
    job.jobType = jobType;
    job.experienceLevel = experience;
    job.position = Number(position);
    job.company = companyId;

    console.log("Saving job with data:", {
      title: job.title,
      description: job.description,
      salary: job.salary,
      location: job.location
    });

    // Save the job
    await job.save();
    
    console.log("Job updated successfully:", job);
    return res.status(200).json({
      message: "Job updated successfully",
      job,
      success: true
    });

  } catch (error) {
    console.log("Error updating job:", error);
    return res.status(500).json({
      message: error.message || "Internal server error. Please try again.",
      success: false
    });
  }
}


// export const getAdminJobs = async (req, res) => {
//   try {
//     const adminId = new mongoose.Types.ObjectId(req.id);
//     const jobs = await Job.find({ created_by: adminId }).populate("company");

//     if (!jobs || jobs.length === 0) {
//       return res.status(404).json({
//         message: "Jobs not found",
//         success: false
//       });
//     }

//     return res.status(200).json({
//       jobs,
//       success: true
//     });

//   } catch (error) {
//     console.log("Error in getAdminJobs:", error.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
