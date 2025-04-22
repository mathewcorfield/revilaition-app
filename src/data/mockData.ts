import { User } from "@/types";

export const mockUser: User = {
  id: "user1",
  name: "Alex",
  email: "alex@example.com",
  level: "A-Level",
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
      id: "s1",
      name: "Chemistry",
      examBoard: "AQA",
      iconColor: "#e74c3c",
      subtopics: [
        {
          id: "st1",
          name: "Atomic Structure",
          description: "Electron configurations and orbital diagrams",
          learnt: 1,
          revised: 1
        },
        {
          id: "st2",
          name: "Bonding",
          description: "Ionic, covalent and metallic bonding",
          learnt: 1,
          revised: 0
        },
        {
          id: "st3",
          name: "Periodicity",
          description: "Trends in the periodic table",
          learnt: 0,
          revised: 0
        },
        {
          id: "st4",
          name: "Reaction Kinetics",
          description: "Rates of reaction and factors affecting rates",
          learnt: 0,
          revised: 0
        }
      ]
    }
  ],
  availableSubjects: [
    {
      id: "as1",
      name: "Biology",
      iconColor: "#2ecc71",
      subtopics: [
        {
          id: "ast1",
          name: "Cell Biology",
          description: "Cell structure, organelles and their functions"
        },
        {
          id: "ast2",
          name: "Photosynthesis",
          description: "Light-dependent and light-independent reactions"
        },
        {
          id: "ast3",
          name: "Cellular Respiration",
          description: "Aerobic and anaerobic respiration"
        },
        {
          id: "ast4",
          name: "Genetics",
          description: "DNA structure, replication and protein synthesis"
        },
        {
          id: "ast5",
          name: "Evolution",
          description: "Natural selection and speciation"
        }
      ]
    },
    {
      id: "as2",
      name: "Chemistry",
      iconColor: "#e74c3c",
      subtopics: [
        {
          id: "ast6",
          name: "Atomic Structure",
          description: "Electron configurations and orbital diagrams"
        },
        {
          id: "ast7",
          name: "Bonding",
          description: "Ionic, covalent and metallic bonding"
        },
        {
          id: "ast8",
          name: "Periodicity",
          description: "Trends in the periodic table"
        },
        {
          id: "ast9",
          name: "Reaction Kinetics",
          description: "Rates of reaction and factors affecting rates"
        },
        {
          id: "ast10",
          name: "Organic Chemistry",
          description: "Hydrocarbons, alcohols, carboxylic acids"
        }
      ]
    },
    {
      id: "as3",
      name: "Physics",
      iconColor: "#3498db",
      subtopics: [
        {
          id: "ast11",
          name: "Mechanics",
          description: "Forces, motion and energy"
        },
        {
          id: "ast12",
          name: "Electricity",
          description: "Circuits and electrical fields"
        },
        {
          id: "ast13",
          name: "Waves",
          description: "Properties of waves, sound and light"
        },
        {
          id: "ast14",
          name: "Nuclear Physics",
          description: "Radioactivity and nuclear energy"
        },
        {
          id: "ast15",
          name: "Quantum Physics",
          description: "Wave-particle duality and quantum phenomena"
        }
      ]
    },
    {
      id: "as4",
      name: "Mathematics",
      iconColor: "#9b59b6",
      subtopics: [
        {
          id: "ast16",
          name: "Pure Mathematics",
          description: "Algebra, functions and calculus"
        },
        {
          id: "ast17",
          name: "Statistics",
          description: "Probability distributions and hypothesis testing"
        },
        {
          id: "ast18",
          name: "Mechanics",
          description: "Mathematical modeling of physical systems"
        }
      ]
    },
    {
      id: "as5",
      name: "English Literature",
      iconColor: "#f39c12",
      subtopics: [
        {
          id: "ast19",
          name: "Poetry Analysis",
          description: "Techniques for analyzing and comparing poems"
        },
        {
          id: "ast20",
          name: "Shakespeare",
          description: "Analysis of Shakespeare's plays and sonnets"
        },
        {
          id: "ast21",
          name: "Modern Drama",
          description: "Analysis of 20th and 21st century plays"
        },
        {
          id: "ast22",
          name: "Prose Fiction",
          description: "Analysis of novels and short stories"
        }
      ]
    }
  ]
};
