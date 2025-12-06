import {Company} from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req , res ) => {
  console.log("Request body:", req.body);
  try {
    const {companyName} = req.body;
    if(!companyName || !companyName.trim()){
      return res.status(400).json({
        message : "Company name is required.",
        success : false
      });
    }

    let company = await Company.findOne({name: companyName});
    if(company){
      return res.status(400).json({
        message : "You can't register same company",
        success : false
      })
    };

    company = await Company.create({
      name : companyName.trim(),
      userId : req.id
    });

    return res.status(201).json({
      message : "Company registered successfully",
      company,
      success : true
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message : "Internal server error. Please try again.",
      success : false
    });
  }
}

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;     //Logged in user id
    const companies = await Company.find({userId});
    if(!companies){
      return res.status(404).json({
        message : "Companies not found.",
        success : false
      })
    }
    return res.status(200).json({
      companies,
      success: true
    })
  } catch (error) {
    console.log(error);
  }
}

//Get company by ID
export const getCompanyById = async(req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if(!company){
      return res.status(404).json({
        message : "Company not found",
        success : false
      })
    }
    return res.status(200).json({
      company,
      success : true
    })
  } catch (error) {
    console.log(error);
  }
}

export const updateCompany  = async(req, res) =>{

  try {
    console.log("Update request body:", req.body);
    console.log("Update request file:", req.file ? "File provided" : "No file");
    console.log("Company ID:", req.params.id);
    
    const {name, description, website, location} = req.body;
    const file = req.file;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false
      });
    }

    // Find the company first
    const company = await Company.findById(req.params.id);
    
    if(!company){
      console.log("Company not found with ID:", req.params.id);
      return res.status(404).json({
         message : "Company not found.",
         success : false
      })
    }

    // Check if name is being changed and if new name already exists
    if (name.trim() !== company.name) {
      const existingCompany = await Company.findOne({ name: name.trim() });
      if (existingCompany && existingCompany._id.toString() !== req.params.id) {
        return res.status(400).json({
          message: "A company with this name already exists.",
          success: false
        });
      }
    }

    // Update company fields
    company.name = name.trim();
    if (description !== undefined) company.description = description || "";
    if (website !== undefined) company.website = website || "";
    if (location !== undefined) company.location = location || "";

    // Only update logo if file is provided
    if (file) {
      try {
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        company.logo = cloudResponse.secure_url;
        console.log("Logo uploaded successfully:", cloudResponse.secure_url);
      } catch (uploadError) {
        console.log("Error uploading logo:", uploadError);
        return res.status(500).json({
          message: "Error uploading logo. Please try again.",
          success: false
        });
      }
    }

    console.log("Saving company with data:", {
      name: company.name,
      description: company.description,
      website: company.website,
      location: company.location,
      logo: company.logo ? "Logo set" : "No logo"
    });

    // Save the company
    await company.save();
    
    console.log("Company updated successfully:", company);
    return res.status(200).json({
      message : "Company information updated successfully.",
      company,
      success : true
    })

  } catch (error) {
    console.log("Update company error:", error);
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: Object.values(error.errors).map(e => e.message).join(', '),
        success: false
      });
    }
    // Handle duplicate key error (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "A company with this name already exists.",
        success: false
      });
    }
    return res.status(500).json({
      message : error.message || "Internal server error. Please try again.",
      success : false
    });
  }
}