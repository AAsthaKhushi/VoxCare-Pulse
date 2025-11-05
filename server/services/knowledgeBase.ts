// RAG-style knowledge base for common vehicle issues and FAQs

interface KnowledgeEntry {
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  source: string;
}

const knowledgeBase: KnowledgeEntry[] = [
  {
    category: "vehicle_issues",
    question: "Why won't my engine start?",
    answer: "Common causes include: dead battery, faulty starter motor, fuel system issues, or ignition problems. Try checking if your battery is charged. If the issue persists, we recommend scheduling a diagnostic check at your nearest service center.",
    keywords: ["engine", "start", "won't start", "doesn't start", "not starting", "battery", "dead"],
    source: "Owner's Manual p.145",
  },
  {
    category: "vehicle_issues",
    question: "Why is my car shaking while driving?",
    answer: "Shaking can be caused by: unbalanced or damaged tires, worn brake rotors, suspension issues, or engine misfires. We recommend a suspension and wheel alignment check. You can book this service through our chat.",
    keywords: ["shaking", "vibrating", "shaky", "vibration", "suspension", "alignment"],
    source: "Service Guide p.78",
  },
  {
    category: "vehicle_issues",
    question: "What does the brake warning light mean?",
    answer: "The brake warning light indicates low brake fluid level, worn brake pads, or a brake system malfunction. This requires immediate attention for your safety. Please book an urgent inspection.",
    keywords: ["brake", "warning light", "brake light", "red light", "brake warning"],
    source: "Dashboard Indicators Guide",
  },
  {
    category: "maintenance",
    question: "How often should I change my engine oil?",
    answer: "Volkswagen recommends oil changes every 10,000 km or 12 months, whichever comes first. Using genuine VW oil ensures optimal engine performance and longevity.",
    keywords: ["oil change", "oil", "engine oil", "service interval", "maintenance"],
    source: "Maintenance Schedule",
  },
  {
    category: "maintenance",
    question: "When should I replace my brake pads?",
    answer: "Brake pads typically last 40,000-70,000 km but should be inspected during each service. Replace them when thickness is below 3mm. Our predictive system will alert you in advance.",
    keywords: ["brake pads", "brakes", "brake replacement", "brake service"],
    source: "Brake System Guide",
  },
  {
    category: "maintenance",
    question: "How do I check tire pressure?",
    answer: "Recommended tire pressure for your Volkswagen is typically 30-35 PSI (check your door jamb sticker). Check monthly when tires are cold. Our system monitors this automatically and alerts you when pressure is low.",
    keywords: ["tire", "pressure", "psi", "tire pressure", "inflation"],
    source: "Tire Care Guide",
  },
  {
    category: "warranty",
    question: "What does my Volkswagen warranty cover?",
    answer: "Standard warranty includes 2 years unlimited km coverage, 3-year paint warranty, and 12-year anti-corrosion warranty. Extended warranties are available. Specific coverage depends on your model year.",
    keywords: ["warranty", "coverage", "covered", "guarantee"],
    source: "Warranty Booklet",
  },
  {
    category: "warranty",
    question: "How do I make a warranty claim?",
    answer: "Visit any authorized Volkswagen service center with your warranty card and vehicle documents. Our service advisors will inspect and process your claim according to warranty terms.",
    keywords: ["warranty claim", "claim", "warranty service"],
    source: "Warranty Procedures",
  },
  {
    category: "parts",
    question: "Where can I buy genuine Volkswagen parts?",
    answer: "Genuine VW parts are available at all authorized service centers. We recommend genuine parts for warranty compliance and optimal performance. You can also order online through our portal.",
    keywords: ["parts", "genuine parts", "spares", "accessories"],
    source: "Parts Catalog",
  },
  {
    category: "booking",
    question: "How do I book a service appointment?",
    answer: "You can book service through this chat by saying 'I want to book a service', calling your nearest service center, or using our mobile app. We offer convenient time slots including weekends.",
    keywords: ["book", "appointment", "schedule", "booking", "service booking"],
    source: "Service Booking Guide",
  },
];

export function searchKnowledgeBase(query: string): KnowledgeEntry[] {
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);

  // Score each entry based on keyword matches
  const scoredEntries = knowledgeBase.map(entry => {
    let score = 0;
    
    // Exact question match (highest score)
    if (entry.question.toLowerCase().includes(lowerQuery)) {
      score += 100;
    }

    // Keyword matches
    for (const keyword of entry.keywords) {
      if (lowerQuery.includes(keyword)) {
        score += 10;
      }
    }

    // Partial word matches
    for (const word of queryWords) {
      for (const keyword of entry.keywords) {
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 5;
        }
      }
    }

    return { entry, score };
  });

  // Return top 3 matches with score > 0
  return scoredEntries
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.entry);
}

export function getAnswerForQuery(query: string): string | null {
  const results = searchKnowledgeBase(query);
  
  if (results.length === 0) {
    return null;
  }

  if (results.length === 1) {
    return `${results[0].answer}\n\n(Source: ${results[0].source})`;
  }

  // Multiple results - provide concise answers
  let response = "I found a few relevant answers:\n\n";
  results.forEach((result, index) => {
    response += `${index + 1}. ${result.answer}\n\n`;
  });
  
  return response;
}

export function getAllCategories(): string[] {
  return Array.from(new Set(knowledgeBase.map(entry => entry.category)));
}

export function getEntriesByCategory(category: string): KnowledgeEntry[] {
  return knowledgeBase.filter(entry => entry.category === category);
}
