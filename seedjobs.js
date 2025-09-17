const mongoose = require("mongoose");
const Job = require("./models/jobs");
require("dotenv").config();

const jobs = [
  {
    title: "Frontend Developer",
    company: "Google",
    description: "Build responsive UI using React and Next.js.",
    requirements: ["React", "JavaScript", "CSS", "Next.js"],
    location: "Bangalore",
    salary: "₹12,00,000",
    jobtype: "full-time",
    employer: "68ca541d4d035f6e45628971"
  },
  {
    title: "Backend Developer",
    company: "Microsoft",
    description: "Develop scalable APIs using Node.js and Express.",
    requirements: ["Node.js", "Express", "MongoDB", "REST API"],
    location: "Hyderabad",
    salary: "₹15,00,000",
    jobtype: "full-time",
    employer: "68ca541d4d035f6e45628971"
  },
  {
    title: "Data Scientist",
    company: "Amazon",
    description: "Analyze large datasets and build ML models.",
    requirements: ["Python", "Pandas", "Machine Learning", "SQL"],
    location: "Bangalore",
    salary: "₹18,00,000",
    jobtype: "full-time",
    employer: "68ca541d4d035f6e45628971"
  },
  {
    title: "UI/UX Designer",
    company: "Adobe",
    description: "Design user-friendly interfaces for web and mobile apps.",
    requirements: ["Figma", "Sketch", "UI Design", "Prototyping"],
    location: "Delhi",
    salary: "₹9,00,000",
    jobtype: "contract",
    employer: "68ca541d4d035f6e45628971"
  },
  {
    title: "DevOps Engineer",
    company: "Netflix",
    description: "Manage CI/CD pipelines and cloud infrastructure.",
    requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    location: "Remote",
    salary: "₹20,00,000",
    jobtype: "full-time",
    employer: "68ca541d4d035f6e45628971"
  },
  {
    title: "Mobile App Developer",
    company: "Flipkart",
    description: "Develop Android/iOS apps using React Native.",
    requirements: ["React Native", "JavaScript", "Mobile Development"],
    location: "Mumbai",
    salary: "₹10,00,000",
    jobtype: "full-time",
    employer: "68ca541d4d035f6e45628971"
  },
  {
    title: "Software Intern",
    company: "Zoho",
    description: "Assist in developing web applications.",
    requirements: ["JavaScript", "HTML", "CSS"],
    location: "Chennai",
    salary: "₹20,000/month",
    jobtype: "internship",
    employer: "68ca541d4d035f6e45628971"
  },
  {
    title: "Cloud Engineer",
    company: "IBM",
    description: "Work on cloud deployments and infrastructure automation.",
    requirements: ["Azure", "Terraform", "Linux"],
    location: "Pune",
    salary: "₹14,00,000",
    jobtype: "full-time",
    employer: "68ca541d4d035f6e45628971"
  },
  {
    title: "AI Research Engineer",
    company: "OpenAI",
    description: "Research and implement state-of-the-art AI models.",
    requirements: ["Deep Learning", "Python", "PyTorch", "NLP"],
    location: "Remote",
    salary: "₹25,00,000",
    jobtype: "full-time",
    employer: "68ca541d4d035f6e45628971"
  },
  {
    title: "QA Engineer",
    company: "Infosys",
    description: "Test and maintain web applications for quality assurance.",
    requirements: ["Selenium", "Automation Testing", "Jest"],
    location: "Ahmedabad",
    salary: "₹7,00,000",
    jobtype: "full-time",
    employer: "68ca541d4d035f6e45628971"
  },
  
];

async function seedJobs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Always insert (append new jobs)
    const result = await Job.insertMany(jobs);
    console.log(` ${result.length} jobs added successfully!`);

  } catch (err) {
    console.error("Error seeding jobs:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedJobs();

