// create-component.js
import fs from "fs";
import path from "path";

// --- Helper to convert kebab-case or snake_case to PascalCase ---
function toPascalCase(str) {
  return str
    .replace(/[-_](.)/g, (_, group1) => group1.toUpperCase())
    .replace(/^(.)/, (_, group1) => group1.toUpperCase());
}

// --- Get arguments ---
const args = process.argv.slice(2);
const componentFileName = args[0]; // e.g., button-toggle
const targetDir = args[1] || "src/components";
const propsInput = args[2] || ""; // Example: "number:number,style:React.CSSProperties"

if (!componentFileName) {
  console.error(
    "Usage: node create-component.js <component-file-name> [targetDir] [props]"
  );
  process.exit(1);
}

const componentName = toPascalCase(componentFileName); // ButtonToggle
const componentDir = path.join(targetDir, componentFileName);
fs.mkdirSync(componentDir, { recursive: true });

// --- Parse props string into TypeScript interface ---
function parseProps(propsStr) {
  if (!propsStr) return "";
  return propsStr
    .split(",")
    .map((p) => {
      const [name, type] = p.split(":").map((s) => s.trim());
      const optional = type?.endsWith("?") ? "?" : "";
      const cleanType = type?.replace("?", "") || "any";
      return `  ${name}${optional}: ${cleanType};`;
    })
    .join("\n");
}

// --- Generate .tsx content ---
const tsxContent = `import styles from './${componentFileName}.module.css';

interface ${componentName}Props {
${parseProps(propsInput)}
}

function ${componentName}({${propsInput
  .split(",")
  .map((p) => p.split(":")[0].trim())
  .filter(Boolean)
  .join(", ")}}: ${componentName}Props) {
  return <div className={styles.${componentName}}>${componentName}</div>;
}

export default ${componentName};
`;

// --- Write component file ---
fs.writeFileSync(
  path.join(componentDir, `${componentFileName}.tsx`),
  tsxContent
);

// --- Write CSS module ---
fs.writeFileSync(
  path.join(componentDir, `${componentFileName}.module.css`),
  `.${componentName} {\n\n}\n`
);

// --- Write index.ts ---
fs.writeFileSync(
  path.join(componentDir, `index.ts`),
  `export { default } from './${componentFileName}';\n`
);

console.log(`${componentName} component created at ${componentDir}`);
