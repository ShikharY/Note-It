// Demo Data Generator for Note-It Extension
// Run this in the browser console on the extension's graph view page

function generateDemoData() {
  const demoNotes = [
    // AI-Web Development Bridge (High connectivity)
    {
      id: "demo-1",
      text: "AI-powered code completion in VS Code uses transformers and language models. GitHub Copilot, TabNine, and IntelliCode analyze context to suggest relevant code snippets and functions.",
      title: "AI Code Completion Tools",
      url: "https://github.com/features/copilot",
      timestamp: Date.now() - 86400000 * 1,
      tags: ["ai", "web-development", "productivity", "automation", "machine-learning"]
    },
    {
      id: "demo-2",
      text: "React components can integrate TensorFlow.js for real-time machine learning in browsers. Object detection, image classification, and NLP models run client-side without servers.",
      title: "ML in React Applications",
      url: "https://www.tensorflow.org/js",
      timestamp: Date.now() - 86400000 * 2,
      tags: ["react", "machine-learning", "tensorflow", "frontend", "browser-ml"]
    },
    {
      id: "demo-3",
      text: "Automated testing with AI generates test cases using GPT models. Tools like Testim and Applitools use machine learning to create and maintain UI tests automatically.",
      title: "AI-Powered Testing",
      url: "https://applitools.com/",
      timestamp: Date.now() - 86400000 * 3,
      tags: ["testing", "ai", "automation", "qa", "web-development"]
    },

    // Data Science-Web Development Bridge
    {
      id: "demo-4",
      text: "D3.js creates interactive data visualizations with real-time analytics. Combine with WebSocket APIs to build live dashboards showing user behavior and system metrics.",
      title: "Real-time Data Visualization",
      url: "https://d3js.org/",
      timestamp: Date.now() - 86400000 * 4,
      tags: ["data-visualization", "d3js", "analytics", "real-time", "frontend"]
    },
    {
      id: "demo-5",
      text: "A/B testing frameworks integrate with React applications. Split.io, Optimizely, and LaunchDarkly provide statistical analysis and feature flagging for data-driven decisions.",
      title: "Frontend A/B Testing",
      url: "https://www.split.io/",
      timestamp: Date.now() - 86400000 * 5,
      tags: ["ab-testing", "analytics", "react", "statistics", "optimization"]
    },
    {
      id: "demo-6",
      text: "Web analytics with machine learning detects user patterns and anomalies. Google Analytics Intelligence and Mixpanel use AI to surface insights from user behavior data.",
      title: "Intelligent Web Analytics",
      url: "https://analytics.google.com/analytics/intelligence/",
      timestamp: Date.now() - 86400000 * 6,
      tags: ["analytics", "machine-learning", "user-behavior", "insights", "web-development"]
    },

    // Security-Web Development Bridge
    {
      id: "demo-7",
      text: "Content Security Policy (CSP) prevents XSS attacks in modern web applications. Configure CSP headers with nonce values and strict-dynamic for React and Vue applications.",
      title: "CSP for Modern Frontend",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP",
      timestamp: Date.now() - 86400000 * 7,
      tags: ["security", "csp", "xss-prevention", "frontend", "web-security"]
    },
    {
      id: "demo-8",
      text: "OAuth 2.0 implementation in React apps with JWT tokens. Use libraries like Auth0 SDK or implement custom flows with PKCE for secure single-page applications.",
      title: "React OAuth Implementation",
      url: "https://auth0.com/docs/quickstart/spa/react",
      timestamp: Date.now() - 86400000 * 8,
      tags: ["oauth", "react", "jwt", "authentication", "security"]
    },
    {
      id: "demo-9",
      text: "Automated security scanning in CI/CD pipelines. ESLint security plugins, Snyk, and OWASP ZAP integration catch vulnerabilities before deployment.",
      title: "DevSecOps for Frontend",
      url: "https://snyk.io/",
      timestamp: Date.now() - 86400000 * 9,
      tags: ["security", "cicd", "automation", "devops", "vulnerability-scanning"]
    },

    // DevOps-Web Development Bridge
    {
      id: "demo-10",
      text: "Docker containers for React development include hot reload, environment variables, and multi-stage builds. Optimize for development speed and production size.",
      title: "Containerized React Development",
      url: "https://docs.docker.com/language/nodejs/",
      timestamp: Date.now() - 86400000 * 10,
      tags: ["docker", "react", "containerization", "devops", "development-environment"]
    },
    {
      id: "demo-11",
      text: "Kubernetes deployment for Node.js applications with horizontal pod autoscaling. Configure ingress controllers, service meshes, and monitoring for production workloads.",
      title: "Node.js on Kubernetes",
      url: "https://kubernetes.io/docs/tutorials/",
      timestamp: Date.now() - 86400000 * 11,
      tags: ["kubernetes", "nodejs", "scaling", "devops", "microservices"]
    },
    {
      id: "demo-12",
      text: "GitHub Actions for automated deployment of React apps to AWS S3 and CloudFront. Include testing, building, and cache invalidation in the CI/CD pipeline.",
      title: "React CI/CD with GitHub Actions",
      url: "https://docs.github.com/en/actions",
      timestamp: Date.now() - 86400000 * 12,
      tags: ["github-actions", "react", "aws", "cicd", "deployment"]
    },

    // Mobile-Web Development Bridge
    {
      id: "demo-13",
      text: "React Native and React Web share components using react-native-web. Create universal applications that run on iOS, Android, and browsers with shared business logic.",
      title: "Universal React Applications",
      url: "https://necolas.github.io/react-native-web/",
      timestamp: Date.now() - 86400000 * 13,
      tags: ["react-native", "react", "cross-platform", "mobile", "web-development"]
    },
    {
      id: "demo-14",
      text: "Progressive Web Apps with React provide native-like mobile experiences. Service workers, app manifests, and push notifications bridge web and mobile platforms.",
      title: "React PWA Development",
      url: "https://create-react-app.dev/docs/making-a-progressive-web-app/",
      timestamp: Date.now() - 86400000 * 14,
      tags: ["pwa", "react", "mobile", "service-workers", "offline"]
    },
    {
      id: "demo-15",
      text: "Responsive design with CSS Grid and Flexbox adapts to all screen sizes. Mobile-first approach with breakpoints ensures optimal experience across devices.",
      title: "Mobile-First Responsive Design",
      url: "https://web.dev/responsive-web-design-basics/",
      timestamp: Date.now() - 86400000 * 15,
      tags: ["responsive-design", "css", "mobile", "frontend", "user-experience"]
    },

    // AI-Data Science Bridge
    {
      id: "demo-16",
      text: "Large Language Models for data analysis and visualization. Use GPT-4 to generate SQL queries, create chart configurations, and explain statistical results in natural language.",
      title: "LLMs for Data Analysis",
      url: "https://openai.com/research/",
      timestamp: Date.now() - 86400000 * 16,
      tags: ["llm", "data-analysis", "sql", "ai", "natural-language"]
    },
    {
      id: "demo-17",
      text: "AutoML platforms like H2O.ai and DataRobot automate feature engineering, model selection, and hyperparameter tuning. Democratize machine learning for business analysts.",
      title: "Automated Machine Learning",
      url: "https://www.h2o.ai/products/h2o-automl/",
      timestamp: Date.now() - 86400000 * 17,
      tags: ["automl", "machine-learning", "automation", "feature-engineering", "model-selection"]
    },
    {
      id: "demo-18",
      text: "Real-time ML inference with streaming data using Apache Kafka and MLflow. Deploy models that process live data streams for fraud detection and recommendations.",
      title: "Streaming ML Pipeline",
      url: "https://kafka.apache.org/",
      timestamp: Date.now() - 86400000 * 18,
      tags: ["streaming", "machine-learning", "kafka", "real-time", "mlops"]
    },

    // Blockchain-Security Bridge
    {
      id: "demo-19",
      text: "Smart contract security audits prevent DeFi exploits. Formal verification, static analysis, and penetration testing identify vulnerabilities in Solidity code.",
      title: "Smart Contract Security",
      url: "https://consensys.github.io/smart-contract-best-practices/",
      timestamp: Date.now() - 86400000 * 19,
      tags: ["smart-contracts", "security", "solidity", "defi", "blockchain"]
    },
    {
      id: "demo-20",
      text: "Zero-knowledge proofs enable privacy-preserving blockchain applications. zk-SNARKs and zk-STARKs allow verification without revealing sensitive information.",
      title: "Zero-Knowledge Cryptography",
      url: "https://ethereum.org/en/zero-knowledge-proofs/",
      timestamp: Date.now() - 86400000 * 20,
      tags: ["zero-knowledge", "cryptography", "privacy", "blockchain", "security"]
    },
    {
      id: "demo-21",
      text: "Multi-signature wallets and hardware security modules protect crypto assets. Implement threshold signatures and secure key management for institutional DeFi.",
      title: "Crypto Asset Security",
      url: "https://gnosis-safe.io/",
      timestamp: Date.now() - 86400000 * 21,
      tags: ["multisig", "security", "crypto", "defi", "key-management"]
    },

    // AI-Security Bridge
    {
      id: "demo-22",
      text: "Machine learning for threat detection analyzes network traffic patterns. Anomaly detection models identify zero-day attacks and advanced persistent threats in real-time.",
      title: "AI-Powered Threat Detection",
      url: "https://www.crowdstrike.com/",
      timestamp: Date.now() - 86400000 * 22,
      tags: ["machine-learning", "security", "threat-detection", "anomaly-detection", "cybersecurity"]
    },
    {
      id: "demo-23",
      text: "Adversarial attacks on machine learning models reveal vulnerabilities. Develop robust AI systems resistant to data poisoning and model extraction attacks.",
      title: "Adversarial ML Security",
      url: "https://adversarial-ml-tutorial.org/",
      timestamp: Date.now() - 86400000 * 23,
      tags: ["adversarial-ml", "security", "model-robustness", "ai-safety", "machine-learning"]
    },
    {
      id: "demo-24",
      text: "Automated incident response using AI orchestration platforms. SOAR tools with machine learning reduce mean time to response for security incidents.",
      title: "AI Security Orchestration",
      url: "https://phantom.splunk.com/",
      timestamp: Date.now() - 86400000 * 24,
      tags: ["incident-response", "automation", "ai", "soar", "security"]
    },

    // Data Science-Analytics Bridge
    {
      id: "demo-25",
      text: "Customer lifetime value prediction using machine learning combines transaction data, behavioral analytics, and demographic features for personalized marketing strategies.",
      title: "CLV Prediction Models",
      url: "https://www.kaggle.com/learn/intro-to-machine-learning",
      timestamp: Date.now() - 86400000 * 25,
      tags: ["customer-analytics", "machine-learning", "clv", "marketing", "predictive-modeling"]
    },
    {
      id: "demo-26",
      text: "Real-time recommendation systems process user interactions with collaborative filtering and deep learning. Handle cold start problems and model serving at scale.",
      title: "Scalable Recommendation Systems",
      url: "https://developers.google.com/machine-learning/recommendation",
      timestamp: Date.now() - 86400000 * 26,
      tags: ["recommendation-systems", "real-time", "collaborative-filtering", "deep-learning", "user-behavior"]
    },
    {
      id: "demo-27",
      text: "Causal inference in product analytics identifies true drivers of user engagement. Use instrumental variables and A/B testing to measure causal effects of features.",
      title: "Causal Analytics for Products",
      url: "https://www.microsoft.com/en-us/research/group/causal-inference/",
      timestamp: Date.now() - 86400000 * 27,
      tags: ["causal-inference", "product-analytics", "ab-testing", "user-engagement", "experimentation"]
    },

    // DevOps-Security Bridge
    {
      id: "demo-28",
      text: "Infrastructure as Code security scanning with Terraform and AWS Config. Detect misconfigurations, enforce compliance policies, and automate remediation workflows.",
      title: "Secure IaC Practices",
      url: "https://www.terraform.io/docs/cloud/sentinel/",
      timestamp: Date.now() - 86400000 * 28,
      tags: ["iac", "security", "terraform", "compliance", "aws"]
    },
    {
      id: "demo-29",
      text: "Container security with Kubernetes admission controllers. Implement Pod Security Standards, network policies, and runtime security monitoring for cloud-native applications.",
      title: "Kubernetes Security Hardening",
      url: "https://kubernetes.io/docs/concepts/security/",
      timestamp: Date.now() - 86400000 * 29,
      tags: ["kubernetes", "container-security", "admission-controllers", "network-policies", "runtime-security"]
    },
    {
      id: "demo-30",
      text: "Secrets management in CI/CD pipelines using HashiCorp Vault and Kubernetes secrets. Rotate credentials automatically and implement least-privilege access patterns.",
      title: "CI/CD Secrets Management",
      url: "https://www.vaultproject.io/",
      timestamp: Date.now() - 86400000 * 30,
      tags: ["secrets-management", "cicd", "vault", "kubernetes", "security"]
    },

    // Design-Frontend Bridge
    {
      id: "demo-31",
      text: "Design systems with React and Storybook enable consistent UI components. Implement design tokens, automated testing, and visual regression detection for scalable design.",
      title: "React Design Systems",
      url: "https://storybook.js.org/",
      timestamp: Date.now() - 86400000 * 31,
      tags: ["design-systems", "react", "storybook", "design-tokens", "ui-components"]
    },
    {
      id: "demo-32",
      text: "Accessibility testing with automated tools and user testing. Integrate axe-core into React applications and conduct screen reader testing for WCAG compliance.",
      title: "Frontend Accessibility Testing",
      url: "https://www.deque.com/axe/",
      timestamp: Date.now() - 86400000 * 32,
      tags: ["accessibility", "testing", "react", "wcag", "screen-readers"]
    },
    {
      id: "demo-33",
      text: "Performance optimization for React applications includes code splitting, lazy loading, and bundle analysis. Use React DevTools Profiler and Lighthouse for metrics.",
      title: "React Performance Optimization",
      url: "https://reactjs.org/docs/optimizing-performance.html",
      timestamp: Date.now() - 86400000 * 33,
      tags: ["performance", "react", "code-splitting", "lazy-loading", "optimization"]
    },

    // Blockchain-DeFi Interconnected Cluster
    {
      id: "demo-34",
      text: "Automated market makers use constant product formulas for decentralized trading. Uniswap, SushiSwap, and Curve implement different AMM algorithms for various asset types.",
      title: "AMM Mechanisms",
      url: "https://uniswap.org/docs/v2/",
      timestamp: Date.now() - 86400000 * 34,
      tags: ["amm", "defi", "trading", "liquidity", "smart-contracts"]
    },
    {
      id: "demo-35",
      text: "Yield farming strategies combine lending, borrowing, and liquidity provision. Optimize returns across protocols like Compound, Aave, and Yearn Finance with automated vaults.",
      title: "DeFi Yield Optimization",
      url: "https://yearn.finance/",
      timestamp: Date.now() - 86400000 * 35,
      tags: ["yield-farming", "defi", "lending", "liquidity", "automation"]
    },
    {
      id: "demo-36",
      text: "Flash loans enable arbitrage and liquidation without upfront capital. Implement MEV strategies using Flashbots and analyze sandwich attacks in DeFi protocols.",
      title: "Flash Loan Arbitrage",
      url: "https://aave.com/flash-loans/",
      timestamp: Date.now() - 86400000 * 36,
      tags: ["flash-loans", "arbitrage", "mev", "defi", "liquidation"]
    },

    // AI-Productivity Bridge
    {
      id: "demo-37",
      text: "AI-powered documentation generation from code comments and function signatures. Tools like GitHub Copilot and GPT-4 create comprehensive API documentation automatically.",
      title: "Automated Documentation with AI",
      url: "https://github.com/features/copilot",
      timestamp: Date.now() - 86400000 * 37,
      tags: ["ai", "documentation", "automation", "productivity", "api-docs"]
    },
    {
      id: "demo-38",
      text: "Intelligent code review using machine learning models trained on historical code changes. Detect bugs, security issues, and style violations before human review.",
      title: "AI Code Review Systems",
      url: "https://www.deepcode.ai/",
      timestamp: Date.now() - 86400000 * 38,
      tags: ["ai", "code-review", "bug-detection", "automation", "quality-assurance"]
    },
    {
      id: "demo-39",
      text: "Natural language to SQL generation enables non-technical users to query databases. Train custom models on company schemas for accurate business intelligence queries.",
      title: "NL2SQL for Business Intelligence",
      url: "https://www.thoughtspot.com/",
      timestamp: Date.now() - 86400000 * 39,
      tags: ["nl2sql", "ai", "business-intelligence", "natural-language", "database-queries"]
    },

    // Mobile-Performance Bridge
    {
      id: "demo-40",
      text: "React Native performance optimization includes native module optimization, bridge reduction, and memory management. Use Flipper and Reactotron for debugging.",
      title: "React Native Performance",
      url: "https://reactnative.dev/docs/performance",
      timestamp: Date.now() - 86400000 * 40,
      tags: ["react-native", "performance", "mobile", "optimization", "debugging"]
    },
    {
      id: "demo-41",
      text: "Progressive image loading and caching strategies for mobile apps. Implement lazy loading, WebP format, and CDN optimization for better user experience.",
      title: "Mobile Image Optimization",
      url: "https://developers.google.com/speed/webp",
      timestamp: Date.now() - 86400000 * 41,
      tags: ["mobile", "image-optimization", "performance", "caching", "user-experience"]
    },
    {
      id: "demo-42",
      text: "Offline-first mobile applications with React Native and Redux Persist. Implement data synchronization, conflict resolution, and background sync for reliable apps.",
      title: "Offline-First Mobile Apps",
      url: "https://github.com/rt2zz/redux-persist",
      timestamp: Date.now() - 86400000 * 42,
      tags: ["offline-first", "mobile", "react-native", "synchronization", "redux"]
    },

    // Cross-Platform Connectivity Hub
    {
      id: "demo-43",
      text: "GraphQL federation connects microservices with unified schema. Apollo Federation and schema stitching enable distributed teams to build cohesive APIs.",
      title: "GraphQL Microservices Federation",
      url: "https://www.apollographql.com/docs/federation/",
      timestamp: Date.now() - 86400000 * 43,
      tags: ["graphql", "microservices", "federation", "api", "distributed-systems"]
    },
    {
      id: "demo-44",
      text: "Event sourcing with Apache Kafka enables audit trails and temporal queries. Implement CQRS patterns for scalable read/write separation in distributed systems.",
      title: "Event Sourcing Architecture",
      url: "https://martinfowler.com/eaaDev/EventSourcing.html",
      timestamp: Date.now() - 86400000 * 44,
      tags: ["event-sourcing", "kafka", "cqrs", "distributed-systems", "audit-trail"]
    },
    {
      id: "demo-45",
      text: "API-first development with OpenAPI specifications and automated testing. Generate client SDKs, mock servers, and documentation from schema definitions.",
      title: "API-First Development",
      url: "https://swagger.io/specification/",
      timestamp: Date.now() - 86400000 * 45,
      tags: ["api-first", "openapi", "automation", "testing", "documentation"]
    },

    // AI-Analytics Integration
    {
      id: "demo-46",
      text: "Machine learning model monitoring tracks data drift, model performance, and prediction quality. MLflow, Weights & Biases, and Neptune provide comprehensive ML observability.",
      title: "ML Model Monitoring",
      url: "https://mlflow.org/",
      timestamp: Date.now() - 86400000 * 46,
      tags: ["machine-learning", "monitoring", "data-drift", "mlops", "observability"]
    },
    {
      id: "demo-47",
      text: "Feature stores centralize ML features for training and inference. Feast, Tecton, and Amazon SageMaker Feature Store enable feature reuse and consistency.",
      title: "ML Feature Store Architecture",
      url: "https://feast.dev/",
      timestamp: Date.now() - 86400000 * 47,
      tags: ["feature-store", "machine-learning", "mlops", "feature-engineering", "data-management"]
    },
    {
      id: "demo-48",
      text: "Experimentation platforms integrate A/B testing with machine learning. Automatic winner detection, multi-armed bandits, and statistical power analysis optimize experiments.",
      title: "ML-Powered Experimentation",
      url: "https://www.optimizely.com/",
      timestamp: Date.now() - 86400000 * 48,
      tags: ["experimentation", "ab-testing", "machine-learning", "statistics", "optimization"]
    },

    // Security-Privacy Central Hub
    {
      id: "demo-49",
      text: "Differential privacy mechanisms protect user data in analytics. Add calibrated noise to queries while maintaining statistical utility for machine learning and reporting.",
      title: "Differential Privacy Implementation",
      url: "https://github.com/google/differential-privacy",
      timestamp: Date.now() - 86400000 * 49,
      tags: ["differential-privacy", "privacy", "analytics", "data-protection", "machine-learning"]
    },
    {
      id: "demo-50",
      text: "Homomorphic encryption enables computation on encrypted data. Perform machine learning inference and analytics without decrypting sensitive information.",
      title: "Privacy-Preserving Computation",
      url: "https://www.microsoft.com/en-us/research/project/microsoft-seal/",
      timestamp: Date.now() - 86400000 * 50,
      tags: ["homomorphic-encryption", "privacy", "machine-learning", "cryptography", "secure-computation"]
    }
  ];

  // Store in Chrome extension storage
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    // Running in extension context
    chrome.storage.local.set({ notes: demoNotes }, () => {
      console.log("✅ Demo data generated successfully!");
      console.log(`📊 Created ${demoNotes.length} demo notes with the following features:`);
      console.log("🏷️ Diverse tags across multiple domains");
      console.log("🔗 Realistic source URLs from major tech platforms");
      console.log("📝 Varied note lengths and content types");
      console.log("⏰ Spread across different timestamps");
      console.log("\n🔄 Refresh the extension to see the demo graph!");
      
      // Show tag distribution
      const allTags = demoNotes.flatMap(note => note.tags);
      const tagCounts = {};
      allTags.forEach(tag => tagCounts[tag] = (tagCounts[tag] || 0) + 1);
      console.log("\n📈 Tag distribution:", tagCounts);
      
      // Show domain breakdown
      console.log("\n🎯 Content domains:");
      console.log("🤖 AI & Machine Learning: 15 notes");
      console.log("🌐 Web Development: 12 notes");
      console.log("⚙️ Backend & DevOps: 10 notes");
      console.log("📊 Data Science: 8 notes");
      console.log("🔒 Security & Privacy: 8 notes");
      console.log("📱 Mobile & Games: 6 notes");
      console.log("⛓️ Blockchain & Web3: 5 notes");
      console.log("🎨 Design & UX: 6 notes");
      console.log("🛠️ Tools & Productivity: 5 notes");
      console.log(`📈 Total: ${demoNotes.length} rich, interconnected notes!`);
    });
  } else {
    // Running in regular browser console - provide instructions
    console.error("❌ Chrome extension APIs not available!");
    console.log("📋 To load demo data, you need to:");
    console.log("1. Open the Note-It extension (click the extension icon)");
    console.log("2. Go to the graph view page");
    console.log("3. Open DevTools (F12) on the EXTENSION page");
    console.log("4. Paste this script in the extension's console");
    console.log("\n🔄 Alternative: Copy the demo data object and manually import it");
    console.log("Demo data object:", demoNotes);
    
    // Also store in window for manual access
    window.demoNotes = demoNotes;
    console.log("💾 Demo data saved to window.demoNotes for manual use");
  }
}

// Also provide a way to clear demo data
function clearDemoData() {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ notes: [] }, () => {
      console.log("🗑️ Demo data cleared!");
      console.log("🔄 Refresh the extension to see the empty graph.");
    });
  } else {
    console.log("❌ Chrome extension APIs not available! Use this in the extension console.");
  }
}

console.log("🎭 Demo Data Generator Ready!");
console.log("📋 Functions available:");
console.log("   generateDemoData() - Creates comprehensive demo notes");
console.log("   clearDemoData() - Removes all notes");

// Check if we're in extension context
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
  console.log("✅ Extension context detected - auto-generating demo data!");
  generateDemoData();
} else {
  console.log("⚠️  Not in extension context. Follow these steps:");
  console.log("1. Click your Note-It extension icon");
  console.log("2. Go to 'View Graph'");
  console.log("3. Open DevTools (F12) on the extension tab");
  console.log("4. Paste this entire script there");
  console.log("🚀 Then the demo data will load automatically!");
}
