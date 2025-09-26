import { config } from "@money-lens/eslint-config/react-internal";

export default [
  ...config,
  {
    ignores: ["dist/*"],
  },
];
