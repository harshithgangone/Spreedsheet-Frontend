export interface JobRequest {
  id: number
  jobRequest: string
  submitted: string
  status: string
  submitter: string
  url: string
  assigned: string
  priority: string
  dueDate: string
  estValue: string
}

export const mockData: JobRequest[] = [
  {
    id: 1,
    jobRequest: "Launch social media campaign for product launch",
    submitted: "15-11-2024",
    status: "In-process",
    submitter: "Aisha Patel",
    url: "https://www.aishapatel.com",
    assigned: "Sophie Choudhury",
    priority: "Medium",
    dueDate: "20-11-2024",
    estValue: "6,200,000 ₹",
  },
  {
    id: 2,
    jobRequest: "Update press kit for company redesign",
    submitted: "28-10-2024",
    status: "Need to start",
    submitter: "Irfan Khan",
    url: "https://www.irfankhan.com",
    assigned: "Tejas Pandey",
    priority: "High",
    dueDate: "30-10-2024",
    estValue: "3,500,000 ₹",
  },
  {
    id: 3,
    jobRequest: "Finalize user testing feedback for app redesign",
    submitted: "05-12-2024",
    status: "In-process",
    submitter: "Mark Johnson",
    url: "https://www.markjohnson.com",
    assigned: "Rachel Lee",
    priority: "Medium",
    dueDate: "10-12-2024",
    estValue: "4,750,000 ₹",
  },
  {
    id: 4,
    jobRequest: "Design new features for the website",
    submitted: "10-01-2025",
    status: "Complete",
    submitter: "Emily Green",
    url: "https://www.emilygreen.com",
    assigned: "Tom Wright",
    priority: "Low",
    dueDate: "15-01-2025",
    estValue: "5,900,000 ₹",
  },
  {
    id: 5,
    jobRequest: "Prepare financial report for Q4",
    submitted: "25-01-2025",
    status: "Blocked",
    submitter: "Jessica Brown",
    url: "https://www.jessicabrown.com",
    assigned: "Kevin Smith",
    priority: "Low",
    dueDate: "30-01-2025",
    estValue: "2,800,000 ₹",
  },
]
