import { User } from "@/types";

export const mockUser: User = {
  id: "user1",
  name: "TRIAL",
  email: "alex@example.com",
  level: "A-Level",
  isTrial: true,
  isVerified: true,
  milestones: [
    {
      id: "m1",
      title: "Turn 18",
      description: "Becoming an adult",
      date: "2025-06-15"
    },
    {
      id: "m2",
      title: "First A-Level Exam",
      description: "Biology A-Level",
      date: "2025-08-10"
    },
    {
      id: "m3",
      title: "University Applications",
      description: "Submit UCAS applications",
      date: "2025-10-15"
    },
    {
      id: "m4",
      title: "A-Level Results",
      description: "Get A-Level results",
      date: "2026-08-18"
    },
    {
      id: "m5",
      title: "Start University",
      description: "Begin university journey",
      date: "2026-09-20"
    }
  ],
  events: [
    {
      id: "e1",
      title: "Biology Revision Session",
      description: "Focus on photosynthesis and cellular respiration",
      date: "2025-05-10"
    },
    {
      id: "e2",
      title: "Mock Exam - Chemistry",
      description: "Full mock exam for A-Level Chemistry",
      date: "2025-05-20"
    },
    {
      id: "e3",
      title: "18th Birthday",
      description: "Celebration with friends and family",
      date: "2025-06-15"
    },
    {
      id: "e4",
      title: "Biology A-Level Exam",
      description: "First official A-Level exam",
      date: "2025-08-10"
    },
    {
      id: "e5",
      title: "Chemistry A-Level Exam",
      description: "Second A-Level exam",
      date: "2025-08-17"
    },
    {
      id: "e6",
      title: "Mathematics A-Level Exam",
      description: "Final A-Level exam",
      date: "2025-08-24"
    },
    {
      id: "e7",
      title: "UCAS Application Deadline",
      description: "Submit all university applications",
      date: "2025-10-15"
    }
  ],
  subjects: [
    {
      id: "8",
      name: "Chemistry",
      examBoard: "AQA",
      iconColor: "#e74c3c",
      subtopics: [
        {
          id: "51",
          name: "Atomic Structure",
          description: "Electron configurations and orbital diagrams",
          learnt: 1,
          revised: 1
        },
        {
          id: "52",
          name: "Bonding",
          description: "Ionic, covalent and metallic bonding",
          learnt: 1,
          revised: 0
        },
        {
          id: "59",
          name: "Periodicity",
          description: "Trends in the periodic table",
          learnt: 0,
          revised: 0
        },
        {
          id: "54",
          name: "Reaction Kinetics",
          description: "Rates of reaction and factors affecting rates",
          learnt: 0,
          revised: 0
        },
        {
          id: "63",
          name: "Alkanes",
          description: "",
          learnt: 0,
          revised: 0
        }
      ]
    }
  ],
  availableSubjects: [
    {
      id: "7",
      name: "Biology",
      iconColor: "#2ecc71",
      subtopics: [
        {
          id: "st6",
          name: "Cell Biology",
          description: "Cell structure, organelles and their functions"
        },
        {
          id: "st7",
          name: "Photosynthesis",
          description: "Light-dependent and light-independent reactions"
        },
        {
          id: "st8",
          name: "Cellular Respiration",
          description: "Aerobic and anaerobic respiration"
        },
        {
          id: "st9",
          name: "Genetics",
          description: "DNA structure, replication and protein synthesis"
        },
        {
          id: "st10",
          name: "Evolution",
          description: "Natural selection and speciation"
        }
      ]
    },
    {
      id: "s3",
      name: "Physics",
      iconColor: "#3498db",
      subtopics: [
        {
          id: "st11",
          name: "Mechanics",
          description: "Forces, motion and energy"
        },
        {
          id: "st12",
          name: "Electricity",
          description: "Circuits and electrical fields"
        },
        {
          id: "st13",
          name: "Waves",
          description: "Properties of waves, sound and light"
        },
        {
          id: "st14",
          name: "Nuclear Physics",
          description: "Radioactivity and nuclear energy"
        },
        {
          id: "st15",
          name: "Quantum Physics",
          description: "Wave-particle duality and quantum phenomena"
        }
      ]
    },
    {
      id: "s4",
      name: "Mathematics",
      iconColor: "#9b59b6",
      subtopics: [
        {
          id: "st16",
          name: "Pure Mathematics",
          description: "Algebra, functions and calculus"
        },
        {
          id: "st17",
          name: "Statistics",
          description: "Probability distributions and hypothesis testing"
        },
        {
          id: "st18",
          name: "Mechanics",
          description: "Mathematical modeling of physical systems"
        }
      ]
    },
    {
      id: "s5",
      name: "English Literature",
      iconColor: "#f39c12",
      subtopics: [
        {
          id: "st19",
          name: "Poetry Analysis",
          description: "Techniques for analyzing and comparing poems"
        },
        {
          id: "st20",
          name: "Shakespeare",
          description: "Analysis of Shakespeare's plays and sonnets"
        },
        {
          id: "st21",
          name: "Modern Drama",
          description: "Analysis of 20th and 21st century plays"
        },
        {
          id: "st22",
          name: "Prose Fiction",
          description: "Analysis of novels and short stories"
        }
      ]
    }
  ]
};
