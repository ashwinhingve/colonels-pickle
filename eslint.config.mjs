import next from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "build/**",
      "out/**",
      "next-env.d.ts",
    ],
  },
  ...next,
];

export default eslintConfig;
