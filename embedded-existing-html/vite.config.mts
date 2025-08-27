import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from '@tailwindcss/vite'


const outDir = resolve(__dirname, "./public");

export default defineConfig({
    plugins: [react(),
    viteStaticCopy({
        targets: [{ src: "src/existing.html", dest: "." }],
    }),
    tsconfigPaths(),
    tailwindcss(),
    ],
    define: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "production"),
        "process.env": JSON.stringify({}),
        global: "window",
    },
    build: {
        outDir, 
        lib: {
            entry: resolve(__dirname, "src/widget/index.ts"),
            name: "widget",
            formats: ["umd", "es"],
            fileName: (fmt) => `widget.${fmt}.js`, 
        },
        sourcemap: true,
    },
});
