export interface PremiumApp {
  id: string
  name: string
  description: string
  longDescription: string
  features: string[]
  price: number
  category: string
  icon: string
  image: string
  downloads: number
}

export const premiumApps: PremiumApp[] = [
  {
    id: "password-generator",
    name: "Advanced Password Generator",
    description: "Generate secure, cryptographically strong passwords",
    longDescription: "Create complex, unbreakable passwords with customizable length, special characters, and patterns. Perfect for security-conscious users.",
    features: [
      "Customizable length and complexity",
      "Special character options",
      "Pattern-based generation",
      "Clipboard copy functionality",
      "History tracking",
      "Batch generation",
    ],
    price: 100,
    category: "Security",
    icon: "🔐",
    image: "/images/password-gen.jpg",
    downloads: 1250,
  },
  {
    id: "code-formatter",
    name: "Pro Code Formatter",
    description: "Format and beautify code in multiple languages",
    longDescription: "Professional-grade code formatting tool supporting 20+ programming languages with customizable rules and instant preview.",
    features: [
      "20+ language support",
      "Custom formatting rules",
      "Syntax highlighting",
      "Batch processing",
      "Import/export configurations",
      "Dark/Light themes",
    ],
    price: 100,
    category: "Development",
    icon: "💻",
    image: "/images/code-formatter.jpg",
    downloads: 2840,
  },
  {
    id: "json-validator",
    name: "JSON Validator Pro",
    description: "Validate, format, and analyze JSON data",
    longDescription: "Enterprise-level JSON validation with schema support, error detection, and detailed analytics for debugging API responses.",
    features: [
      "JSON schema validation",
      "Error detection & reporting",
      "Auto-formatting",
      "Compression/minification",
      "Search & replace",
      "API response analysis",
    ],
    price: 100,
    category: "Development",
    icon: "📋",
    image: "/images/json-validator.jpg",
    downloads: 1890,
  },
  {
    id: "regex-tester",
    name: "Regex Master Tester",
    description: "Test and debug regular expressions in real-time",
    longDescription: "Interactive regex tester with visualization, explanation generator, and pattern library for common matching tasks.",
    features: [
      "Real-time testing",
      "Visual match highlighting",
      "Regex explanation",
      "Pattern library",
      "Replacement preview",
      "Export options",
    ],
    price: 100,
    category: "Development",
    icon: "🔍",
    image: "/images/regex-tester.jpg",
    downloads: 1456,
  },
  {
    id: "api-client",
    name: "API Client Pro",
    description: "Advanced REST API testing and debugging tool",
    longDescription: "Professional API testing platform with request history, environment variables, authentication support, and response analytics.",
    features: [
      "REST API testing",
      "Authentication methods",
      "Request history",
      "Environment variables",
      "Response validation",
      "Collection export",
    ],
    price: 100,
    category: "Development",
    icon: "🌐",
    image: "/images/api-client.jpg",
    downloads: 3120,
  },
  {
    id: "hash-generator",
    name: "Cryptographic Hash Generator",
    description: "Generate hashes and verify data integrity",
    longDescription: "Multi-algorithm hash generator supporting MD5, SHA-1, SHA-256, SHA-512, and more for security and verification tasks.",
    features: [
      "Multiple hash algorithms",
      "Batch processing",
      "File hashing",
      "HMAC support",
      "Hash verification",
      "Performance metrics",
    ],
    price: 100,
    category: "Security",
    icon: "🔑",
    image: "/images/hash-generator.jpg",
    downloads: 987,
  },
]
