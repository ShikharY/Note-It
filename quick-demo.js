// Rich Academic Demo Data - 40 Interconnected Notes
// Paste this in the extension's console to create a comprehensive knowledge graph

const quickDemo = [
  // Computer Science Cluster
  {
    id: "cs-1",
    text: "Algorithm analysis examines computational complexity in terms of time and space. Understanding worst-case, average-case, and best-case scenarios is crucial for efficient programming.",
    title: "Algorithmic Complexity Theory",
    url: "https://en.wikipedia.org/wiki/Computational_complexity",
    timestamp: Date.now() - 86400000 * 1,
    tags: ["computer-science", "algorithms", "complexity", "mathematics"]
  },
  {
    id: "cs-2",
    text: "Machine learning algorithms learn from data to make predictions. Supervised learning uses labeled data while unsupervised learning discovers hidden structures.",
    title: "Machine Learning Fundamentals",
    url: "https://en.wikipedia.org/wiki/Machine_learning",
    timestamp: Date.now() - 86400000 * 2,
    tags: ["computer-science", "ai", "data", "statistics"]
  },
  {
    id: "cs-3",
    text: "Distributed systems coordinate multiple computers to appear as a single system. They handle network partitions, consistency, and fault tolerance according to the CAP theorem.",
    title: "Distributed Systems Design",
    url: "https://en.wikipedia.org/wiki/Distributed_computing",
    timestamp: Date.now() - 86400000 * 3,
    tags: ["computer-science", "systems", "design"]
  },
  {
    id: "cs-4",
    text: "Public key cryptography enables secure communication without prior key exchange. RSA and elliptic curve cryptography enable secure exchange without shared secrets.",
    title: "Cryptographic Principles",
    url: "https://en.wikipedia.org/wiki/Public-key_cryptography",
    timestamp: Date.now() - 86400000 * 4,
    tags: ["computer-science", "security", "mathematics"]
  },

  // Ethics Cluster
  {
    id: "ethics-1",
    text: "Utilitarianism judges actions by their consequences, seeking the greatest good for the greatest number. John Stuart Mill developed this consequentialist framework.",
    title: "Utilitarian Ethics",
    url: "https://plato.stanford.edu/entries/utilitarianism-history/",
    timestamp: Date.now() - 86400000 * 5,
    tags: ["ethics", "philosophy", "consequentialism"]
  },
  {
    id: "ethics-2",
    text: "Kant's deontological ethics judges actions by their inherent nature, not consequences. The categorical imperative provides universal moral principles.",
    title: "Deontological Ethics",
    url: "https://plato.stanford.edu/entries/kant-moral/",
    timestamp: Date.now() - 86400000 * 6,
    tags: ["ethics", "philosophy", "kant"]
  },
  {
    id: "ethics-3",
    text: "Medical ethics examines moral issues in healthcare including autonomy, beneficence, and justice. Bioethics examines ethical issues in healthcare and life sciences.",
    title: "Bioethics Framework",
    url: "https://plato.stanford.edu/entries/bioethics/",
    timestamp: Date.now() - 86400000 * 7,
    tags: ["ethics", "medicine", "bioethics"]
  },
  {
    id: "ethics-4",
    text: "AI ethics addresses algorithmic bias, transparency, accountability, and impact on employment and privacy.",
    title: "Artificial Intelligence Ethics",
    url: "https://plato.stanford.edu/entries/ethics-ai/",
    timestamp: Date.now() - 86400000 * 8,
    tags: ["ethics", "ai", "technology"]
  },

  // Literature Cluster
  {
    id: "lit-1",
    text: "Post-colonial literature examines the cultural legacy of colonialism and imperialism. Authors like Chinua Achebe and Edward Said critique Western-centric narratives.",
    title: "Post-Colonial Literature",
    url: "https://en.wikipedia.org/wiki/Postcolonial_literature",
    timestamp: Date.now() - 86400000 * 9,
    tags: ["literature", "post-colonial", "criticism"]
  },
  {
    id: "lit-2",
    text: "Modernist literature broke from traditional narrative forms in the early 20th century. Writers like Joyce and Woolf experimented with stream of consciousness and fragmentation.",
    title: "Literary Modernism",
    url: "https://en.wikipedia.org/wiki/Modernist_literature",
    timestamp: Date.now() - 86400000 * 10,
    tags: ["literature", "modernism", "narrative"]
  },
  {
    id: "lit-3",
    text: "Feminist literary criticism examines how gender shapes literary creation and interpretation. It examines representation of women and challenges patriarchal literary traditions.",
    title: "Feminist Literary Theory",
    url: "https://en.wikipedia.org/wiki/Feminist_literary_criticism",
    timestamp: Date.now() - 86400000 * 11,
    tags: ["literature", "feminism", "gender", "criticism"]
  },
  {
    id: "lit-4",
    text: "Digital humanities applies computational methods to literary and cultural analysis. Text mining and data visualization reveal new patterns in literary and historical texts.",
    title: "Digital Humanities Methods",
    url: "https://en.wikipedia.org/wiki/Digital_humanities",
    timestamp: Date.now() - 86400000 * 12,
    tags: ["literature", "digital", "data", "humanities"]
  },

  // History Cluster
  {
    id: "hist-1",
    text: "The Enlightenment emphasized reason, individual liberty, and scientific method. Thinkers like Voltaire and Rousseau challenged traditional authority and promoted democratic ideals.",
    title: "Age of Enlightenment",
    url: "https://en.wikipedia.org/wiki/Age_of_Enlightenment",
    timestamp: Date.now() - 86400000 * 13,
    tags: ["history", "enlightenment", "philosophy"]
  },
  {
    id: "hist-2",
    text: "The Industrial Revolution transformed economic and social structures from the 18th century onward. It created new social classes and changed labor relations fundamentally.",
    title: "Industrial Revolution Impact",
    url: "https://en.wikipedia.org/wiki/Industrial_Revolution",
    timestamp: Date.now() - 86400000 * 14,
    tags: ["history", "industrial", "society"]
  },
  {
    id: "hist-3",
    text: "Social constructionism examines how societies create and maintain shared meanings through interaction. Berger and Luckmann explored how societies construct meaning.",
    title: "Social Construction of Reality",
    url: "https://en.wikipedia.org/wiki/Social_construction_of_reality",
    timestamp: Date.now() - 86400000 * 15,
    tags: ["history", "sociology", "society"]
  },
  {
    id: "hist-4",
    text: "Globalization creates interconnected economic, political, and cultural systems worldwide. It creates opportunities for development and challenges to local traditions and sovereignty.",
    title: "Globalization Dynamics",
    url: "https://en.wikipedia.org/wiki/Globalization",
    timestamp: Date.now() - 86400000 * 16,
    tags: ["history", "globalization", "society"]
  },

  // Psychology Cluster
  {
    id: "psych-1",
    text: "Cognitive psychology studies mental processes including perception, memory, and problem-solving. Information processing models compare the mind to a computer system.",
    title: "Cognitive Psychology Framework",
    url: "https://en.wikipedia.org/wiki/Cognitive_psychology",
    timestamp: Date.now() - 86400000 * 17,
    tags: ["psychology", "cognition", "mind"]
  },
  {
    id: "psych-2",
    text: "Social psychology examines how individuals are influenced by social contexts and group dynamics. Conformity studies reveal the power of group pressure on individual decisions.",
    title: "Social Psychology Dynamics",
    url: "https://en.wikipedia.org/wiki/Social_psychology",
    timestamp: Date.now() - 86400000 * 18,
    tags: ["psychology", "social", "behavior"]
  },
  {
    id: "psych-3",
    text: "Neuropsychology bridges psychology and neuroscience to understand brain-behavior relationships. Brain imaging techniques reveal neural correlates of consciousness and emotion.",
    title: "Neuropsychological Methods",
    url: "https://en.wikipedia.org/wiki/Neuropsychology",
    timestamp: Date.now() - 86400000 * 19,
    tags: ["psychology", "neuroscience", "brain"]
  },
  {
    id: "psych-4",
    text: "Developmental psychology examines psychological changes across the human lifespan. Piaget's stages describe cognitive development in children.",
    title: "Developmental Psychology Theory",
    url: "https://en.wikipedia.org/wiki/Developmental_psychology",
    timestamp: Date.now() - 86400000 * 20,
    tags: ["psychology", "development", "children"]
  },

  // Mathematics Cluster
  {
    id: "math-1",
    text: "Set theory provides the mathematical foundation for modern mathematics. Cantor's work on infinite sets revealed different sizes of infinity and paradoxes in naive set theory.",
    title: "Set Theory Foundations",
    url: "https://en.wikipedia.org/wiki/Set_theory",
    timestamp: Date.now() - 86400000 * 21,
    tags: ["mathematics", "set-theory", "logic"]
  },
  {
    id: "math-2",
    text: "Game theory analyzes strategic decision-making between rational agents. Nash equilibrium describes stable outcomes where no player benefits from changing strategy.",
    title: "Game Theory Applications",
    url: "https://en.wikipedia.org/wiki/Game_theory",
    timestamp: Date.now() - 86400000 * 22,
    tags: ["mathematics", "game-theory", "economics"]
  },
  {
    id: "math-3",
    text: "Mathematical logic studies formal systems of reasoning and proof. Propositional and predicate logic provide frameworks for mathematical proof and computer science.",
    title: "Mathematical Logic Systems",
    url: "https://en.wikipedia.org/wiki/Mathematical_logic",
    timestamp: Date.now() - 86400000 * 23,
    tags: ["mathematics", "logic", "proof"]
  },
  {
    id: "math-4",
    text: "Statistical inference draws conclusions from data using probability theory. Bayesian methods update beliefs based on evidence, while frequentist approaches focus on long-run frequencies.",
    title: "Statistical Inference Methods",
    url: "https://en.wikipedia.org/wiki/Statistical_inference",
    timestamp: Date.now() - 86400000 * 24,
    tags: ["mathematics", "statistics", "probability"]
  },

  // Science Cluster
  {
    id: "sci-1",
    text: "Evolution by natural selection explains the diversity of life through differential reproduction. Darwin's theory revolutionized our understanding of biological relationships.",
    title: "Evolutionary Biology Theory",
    url: "https://en.wikipedia.org/wiki/Evolution",
    timestamp: Date.now() - 86400000 * 25,
    tags: ["science", "biology", "evolution"]
  },
  {
    id: "sci-2",
    text: "Quantum mechanics describes the behavior of matter and energy at atomic scales. Wave-particle duality and uncertainty principle challenge classical intuitions about reality.",
    title: "Quantum Mechanics Principles",
    url: "https://en.wikipedia.org/wiki/Quantum_mechanics",
    timestamp: Date.now() - 86400000 * 26,
    tags: ["science", "physics", "quantum"]
  },
  {
    id: "sci-3",
    text: "Climate science studies Earth's climate system and human impacts on atmospheric composition. Greenhouse gases drive anthropogenic climate change.",
    title: "Climate Science Research",
    url: "https://en.wikipedia.org/wiki/Climate_science",
    timestamp: Date.now() - 86400000 * 27,
    tags: ["science", "climate", "environment"]
  },
  {
    id: "sci-4",
    text: "CRISPR-Cas9 technology allows precise editing of DNA sequences in living cells. This revolutionary tool enables precise modifications to genetic material with therapeutic potential.",
    title: "Molecular Genetics and CRISPR",
    url: "https://en.wikipedia.org/wiki/Genetics",
    timestamp: Date.now() - 86400000 * 28,
    tags: ["science", "genetics", "biotechnology"]
  },

  // Political Science Cluster
  {
    id: "pol-1",
    text: "Democratic theory examines systems of popular governance and representation. Tensions between participation, and accountability are key tensions in democratic design.",
    title: "Democratic Theory Framework",
    url: "https://en.wikipedia.org/wiki/Democracy",
    timestamp: Date.now() - 86400000 * 29,
    tags: ["political-science", "democracy", "governance"]
  },
  {
    id: "pol-2",
    text: "International relations theory explains interactions between nation-states. Realism emphasizes power and security while liberalism focuses on cooperation and institutions.",
    title: "International Relations Theory",
    url: "https://en.wikipedia.org/wiki/International_relations_theory",
    timestamp: Date.now() - 86400000 * 30,
    tags: ["political-science", "international", "theory"]
  },
  {
    id: "pol-3",
    text: "Constitutional law governs the fundamental structure of government and individual rights. Judicial review allows courts to interpret constitutional meaning and limit legislative power.",
    title: "Constitutional Law Principles",
    url: "https://en.wikipedia.org/wiki/Constitutional_law",
    timestamp: Date.now() - 86400000 * 31,
    tags: ["political-science", "law", "constitution"]
  },
  {
    id: "pol-4",
    text: "Human rights frameworks establish universal standards for human dignity and freedom. The tension between universalism and cultural relativism shapes international human rights law.",
    title: "Human Rights Framework",
    url: "https://en.wikipedia.org/wiki/Human_rights",
    timestamp: Date.now() - 86400000 * 32,
    tags: ["political-science", "law", "human-rights"]
  },

  // Art and Media Cluster
  {
    id: "art-1",
    text: "Aesthetic theory examines the nature of beauty, art, and artistic experience. Kant's aesthetic theory explores judgment of taste and the sublime in nature and art.",
    title: "Aesthetic Theory and Beauty",
    url: "https://plato.stanford.edu/entries/aesthetics-18th-german/",
    timestamp: Date.now() - 86400000 * 33,
    tags: ["art", "aesthetics", "philosophy"]
  },
  {
    id: "art-2",
    text: "Art history traces the development of visual culture across time and geography. Iconography analyzes symbolic meaning while formal analysis examines visual elements.",
    title: "Art Historical Methods",
    url: "https://en.wikipedia.org/wiki/Art_history",
    timestamp: Date.now() - 86400000 * 34,
    tags: ["art", "history", "culture"]
  },
  {
    id: "art-3",
    text: "Performance studies examines embodied practices across cultures and contexts. Theatre, ritual, and everyday performances create meaning through action and presence.",
    title: "Performance Studies Framework",
    url: "https://en.wikipedia.org/wiki/Performance_studies",
    timestamp: Date.now() - 86400000 * 35,
    tags: ["art", "performance", "culture"]
  },
  {
    id: "art-4",
    text: "Media theory analyzes how communication technologies shape culture and society. McLuhan's 'medium is the message' emphasizes technology's transformative effects.",
    title: "Media Theory and Communication",
    url: "https://en.wikipedia.org/wiki/Media_theory",
    timestamp: Date.now() - 86400000 * 36,
    tags: ["art", "media", "technology"]
  },

  // Interdisciplinary Connections
  {
    id: "inter-1",
    text: "Cultural studies examines how power relations shape meaning in everyday life including media, language, and social practices. It draws from anthropology, sociology, and literary theory.",
    title: "Cultural Studies Framework",
    url: "https://en.wikipedia.org/wiki/Cultural_studies",
    timestamp: Date.now() - 86400000 * 37,
    tags: ["culture", "media", "sociology", "literature"]
  },
  {
    id: "inter-2",
    text: "Environmental philosophy examines humans' relationship with the natural world. Deep ecology advocates for intrinsic value of all living beings beyond human utility.",
    title: "Environmental Philosophy",
    url: "https://plato.stanford.edu/entries/ethics-environmental/",
    timestamp: Date.now() - 86400000 * 38,
    tags: ["ethics", "environment", "philosophy", "science"]
  },
  {
    id: "inter-3",
    text: "Behavioral economics combines psychological insights with economic theory. Concepts like loss aversion and cognitive biases explain irrational decision-making.",
    title: "Behavioral Economics Theory",
    url: "https://en.wikipedia.org/wiki/Behavioral_economics",
    timestamp: Date.now() - 86400000 * 39,
    tags: ["economics", "psychology", "behavior", "mathematics"]
  },
  {
    id: "inter-4",
    text: "Artificial intelligence overview spans computer science, philosophy, and cognitive science. AI systems raise questions about consciousness, ethics, and the nature of intelligence.",
    title: "Artificial Intelligence Overview",
    url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
    timestamp: Date.now() - 86400000 * 40,
    tags: ["ai", "computer-science", "philosophy", "ethics"]
  }
];

if (typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.local.set({ notes: quickDemo }, () => {
    console.log("✅ Rich academic demo data loaded!");
    console.log("📚 40 interconnected notes across 10 academic disciplines");
    console.log("🔄 Refresh the extension to see the comprehensive knowledge graph");
  });
} else {
  console.log("Demo data ready for browser environment");
}
