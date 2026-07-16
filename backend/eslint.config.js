import nextVitals from "eslint-config-next/core-web-vitals"; 
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      "src/generated/**",
      "node_modules/**",
    ],
  },

  ...nextVitals,
  ...nextTypescript,

  {
    files: [
      "**/__tests__/**/*.ts",
      "**/*.test.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default config;