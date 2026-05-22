const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.json');

// Initial seed data
const initialData = {
  users: [
    {
      id: "1",
      email: "aarav@gmail.com",
      passwordHash: bcrypt.hashSync("password123", 10),
      firstName: "Aarav",
      lastName: "Reddy",
      gender: "Male",
      rank: 42,
      points: 2400,
      accuracy: 88,
      rankAllIndia: 4205,
      avgScore: 78,
      tier: "Gold Tier Scholar",
      targetExam: "JEE Aspirant • 12th Grade",
      subjectPerformance: {
        Physics: 85,
        Chemistry: 90,
        Mathematics: 65
      }
    }
  ],
  courses: [
    {
      id: "1",
      title: "Advanced Physics",
      lessons: 1248,
      progress: 30,
      category: "Physics"
    },
    {
      id: "2",
      title: "Organic Chemistry Deep-Dive",
      lessons: 850,
      progress: 15,
      category: "Chemistry"
    }
  ],
  teachers: [
    {
      id: "1",
      name: "Dr. Sharma",
      subject: "Mathematics",
      rating: 4.8,
      students: "8k+",
      courses: 12,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      about: "Ph.D. in Pure Mathematics with over 10 years of classroom teaching experience. Specializes in Calculus and Algebra."
    },
    {
      id: "2",
      name: "Prof. V. Kumar",
      subject: "Senior Mathematics Faculty",
      rating: 4.9,
      students: "15k+",
      courses: 24,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      about: "Former HOD at top coaching institutes. Over 15 years of experience in training students for JEE Advanced with a track record of producing top 100 ranks."
    },
    {
      id: "3",
      name: "Dr. Anjali Sen",
      subject: "Physics Faculty",
      rating: 4.7,
      students: "12k+",
      courses: 18,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      about: "Ex-Researcher at BARC. Passionate about teaching Electrostatics and Quantum Physics to IIT aspirants."
    }
  ],
  mockTests: [
    {
      id: "1",
      title: "JEE Full Mock 1",
      subjects: "Physics, Chemistry, Maths",
      duration: 180,
      questionsCount: 90,
      negativeMarking: "-2.5",
      isPremium: false
    },
    {
      id: "2",
      title: "NEET Biology 4",
      subjects: "Botany, Zoology",
      duration: 45,
      questionsCount: 50,
      negativeMarking: "-0.5",
      isPremium: false
    },
    {
      id: "3",
      title: "JEE Advanced Practice 2",
      subjects: "Physics, Chemistry, Maths",
      duration: 120,
      questionsCount: 60,
      negativeMarking: "-2.0",
      isPremium: true
    },
    {
      id: "4",
      title: "BITS AT Full Syllabus",
      subjects: "Physics, Chem, Math, Eng",
      duration: 180,
      questionsCount: 130,
      negativeMarking: "-1.0",
      isPremium: true
    }
  ],
  questions: {
    "1": [
      {
        id: "q1",
        questionText: "What is the SI unit of Electric Charge?",
        options: ["Coulomb", "Ampere", "Volt", "Ohm"],
        correctIndex: 0
      },
      {
        id: "q2",
        questionText: "Which of the following is a conservative force?",
        options: ["Friction", "Air resistance", "Gravitational force", "Viscosity"],
        correctIndex: 2
      },
      {
        id: "q3",
        questionText: "The oxidation state of Oxygen in OF2 is:",
        options: ["-2", "-1", "+1", "+2"],
        correctIndex: 3
      },
      {
        id: "q4",
        questionText: "If f(x) = x^2, then the derivative f'(3) is:",
        options: ["3", "6", "9", "2"],
        correctIndex: 1
      }
    ],
    "2": [
      {
        id: "q1",
        questionText: "Which organelle is known as the powerhouse of the cell?",
        options: ["Ribosome", "Lysosome", "Mitochondria", "Golgi apparatus"],
        correctIndex: 2
      },
      {
        id: "q2",
        questionText: "DNA replication occurs in which phase of the cell cycle?",
        options: ["G1 Phase", "S Phase", "G2 Phase", "M Phase"],
        correctIndex: 1
      }
    ]
  },
  testResults: []
};

// Database manager functions
function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      writeDb(initialData);
      return initialData;
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return initialData;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

module.exports = {
  readDb,
  writeDb
};
