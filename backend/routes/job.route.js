import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, postJob, getJobById, updateJob } from "../controllers/job.controller.js";

const router = express.Router();

router.get("/",(req,res)=>{
  res.send("API is working");
});

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs); // Public route - anyone can view jobs
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(getJobById); // Public route - anyone can view job details
router.route("/update/:id").put(isAuthenticated, updateJob);

export default router;
