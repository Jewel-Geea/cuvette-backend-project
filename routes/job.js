const express = require("express");
const router = express.Router();
const Job = require("../schema/job.schema");
const dotenv = require("dotenv");
const authMiddleware = require("../middleware/auth");
dotenv.config();

router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving jobs" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving job" });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const job = await Job.findById(id);
        const userId = req.user.id;

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        if (userId !== job.user.toString()) {   // check if the user is the owner of the job
            return res.status(401).json({ message: "You are not authorized to delete this job" });
        }
        await Job.deleteOne({ _id: id });
        res.status(200).json({ message: "Job deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting job" });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    const { companyName, addLogoUrl, jobPosition, salary, jobType, jobLocation, jobDescription, aboutCompany, skillRequired } = req.body;

    // Check for missing required fields
    if (!companyName || !addLogoUrl || !jobPosition || !salary || !jobType || !jobLocation || !jobDescription || !aboutCompany || !skillRequired) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate skillRequired
    const validSkills = ["JavaScript", "React"];
    if (!validSkills.includes(skillRequired)) {
        return res.status(400).json({ message: `Invalid skillRequired value. Allowed values are ${validSkills.join(", ")}` });
    }

    // Validate jobLocation
    const validLocations = ["Remote", "office"];
    if (!validLocations.includes(jobLocation)) {
        return res.status(400).json({ message: `Invalid jobLocation value. Allowed values are ${validLocations.join(", ")}` });
    }

    try {
        const user = req.user;
        const job = await Job.create({
            companyName,
            addLogoUrl,
            jobPosition,
            salary,
            jobType,
            jobLocation,
            jobDescription,
            aboutCompany,
            skillRequired,
            user: user.id,
        });
        res.status(200).json(job);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error in creating job" });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { companyName, addLogoUrl, jobPosition, salary, jobType, jobLocation, jobDescription, aboutCompany, skillRequired } = req.body;

    // Validate job
    const job = await Job.findById(id);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    // Check if the user is the owner of the job
    if (job.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "You are not authorized to update this job" });
    }

    // Validate skillRequired
    // const validSkills = ["JavaScript", "React"];
    // if (!validSkills.includes(skillRequired)) {
    //     return res.status(400).json({ message: `Invalid skillRequired value. Allowed values are ${validSkills.join(", ")}` });
    // }

    // Validate jobLocation
    const validLocations = ["Remote", "office"];
    if (!validLocations.includes(jobLocation)) {
        return res.status(400).json({ message: `Invalid jobLocation value. Allowed values are ${validLocations.join(", ")}` });
    }

    try {
        await Job.findByIdAndUpdate(id, {
            companyName,
            addLogoUrl,
            jobPosition,
            salary,
            jobType,
            jobLocation,
            jobDescription,
            aboutCompany,
            skillRequired,
        });
        res.status(200).json({ message: "Job updated" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error in updating job" });
    }
});

module.exports = router;
