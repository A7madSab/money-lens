import { nextJsConfig } from "@money-lens/eslint-config/next-js";

const eslintConfig = [
  ...nextJsConfig,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
