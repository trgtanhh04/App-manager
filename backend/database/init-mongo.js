// Initialize MongoDB with sample data
db = db.getSiblingDB('app_manager');

// Create users collection with sample users
db.users.insertMany([
  {
    email: "admin@example.com",
    password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", // secret123
    name: "Admin User"
  },
  {
    email: "user@example.com", 
    password: "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5", // hello123
    name: "Test User"
  }
]);

// Create apps collection with sample apps
db.apps.insertMany([
  {
    name: "Sale Agent",
    description: "Nền tảng quản lý bán hàng cho đại lý và nhà phân phối",
    owner: "admin",
    category: "Bán hàng",
    website: "https://saleagent.example.com"
  },
  {
    name: "HCMUS Portal",
    description: "Hệ thống quản lý sinh viên và mentor",
    owner: "admin", 
    category: "Khác",
    website: "https://hcmusportal.example.com"
  },
  {
    name: "CV Analyst",
    description: "Phục vụ trong quy trình tuyển dụng",
    owner: "admin", 
    category: "Nhân sự",
    website: "https://cvanalyst.example.com"
  }
]);

print("Database initialized with sample data");