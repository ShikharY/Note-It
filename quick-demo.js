// Quick Demo Data for Testing
// Paste this in the extension's console

const quickDemo = [
  {
    id: "test-1",
    text: "React hooks make functional components more powerful. useState and useEffect are the most commonly used hooks for managing state and side effects.",
    title: "React Hooks Basics",
    url: "https://reactjs.org/docs/hooks-intro.html",
    timestamp: Date.now() - 86400000,
    tags: ["react", "hooks", "frontend", "javascript"]
  },
  {
    id: "test-2", 
    text: "JavaScript ES6 introduced arrow functions, destructuring, and template literals. These features make code more concise and readable.",
    title: "Modern JavaScript Features",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    timestamp: Date.now() - 172800000,
    tags: ["javascript", "es6", "frontend", "programming"]
  },
  {
    id: "test-3",
    text: "CSS Grid and Flexbox are powerful layout systems. Grid is best for 2D layouts while Flexbox excels at 1D layouts and component alignment.",
    title: "CSS Layout Systems",
    url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
    timestamp: Date.now() - 259200000,
    tags: ["css", "layout", "frontend", "design"]
  },
  {
    id: "test-4",
    text: "Node.js enables server-side JavaScript development. Express.js is a popular framework for building web APIs and handling HTTP requests.",
    title: "Node.js Backend Development",
    url: "https://nodejs.org/",
    timestamp: Date.now() - 345600000,
    tags: ["nodejs", "backend", "javascript", "api"]
  },
  {
    id: "test-5",
    text: "React components can be styled with CSS modules, styled-components, or traditional CSS. Each approach has trade-offs for maintainability and performance.",
    title: "React Styling Approaches",
    url: "https://reactjs.org/docs/faq-styling.html",
    timestamp: Date.now() - 432000000,
    tags: ["react", "css", "styling", "frontend"]
  }
];

if (typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.local.set({ notes: quickDemo }, () => {
    console.log("✅ Quick demo data loaded!");
    console.log("🔄 Refresh the extension to see the graph");
    location.reload();
  });
} else {
  console.log("❌ Not in extension context. Please run this in the extension console.");
}
