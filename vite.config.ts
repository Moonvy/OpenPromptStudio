import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue2"
import legacy from "@vitejs/plugin-legacy"
import fs from "fs"
import path from "path"
import { resolve } from "path"
import progress from "vite-plugin-progress"
import * as process from "process"
import * as dotenv from "dotenv"
dotenv.config()

// https://vitejs.dev/config/
let config = {
    root: "./web",
    base: "/apps/ops/",
    server: {
        port: 12833,
    },
    worker: {
        format: "es",
    },
    plugins: [vue(), progress()],
    css: {},
    build: {
        // minify: "terser",
        assetsInlineLimit: 1024 * 10 /* 10kb */,
        emptyOutDir: true,
        outDir: resolve(__dirname, "dist"),
        assetsDir: `version/2023-03/`,
        publicDir: resolve(__dirname, "web/public"),
        rollupOptions: {
            input: {
                main: resolve(__dirname, "web/index.html"),
            },
        },
        reportCompressedSize: false,
    },
    resolve: {
        alias: {
            "@ui": path.resolve(__dirname, "../../Old/moonvy-web/src/UIKit"),
            "@rc": path.resolve(__dirname, "../../Sub/richang/src"),
            "@/": path.resolve(__dirname, "../../Old/moonvy-web/src/"),
        },
    },
    define: {
      'process.env': {
        EXTERNAL_HOST: process.env.EXTERNAL_HOST || "",
        TRANSLATE_PORT: process.env.TRANSLATE_PORT || "19212",
        TRANSLATE_EXTERNAL_PORT: process.env.TRANSLATE_EXTERNAL_PORT || "39011",
      }
    }
}
// ------------- [vite build] ------------
if (process.env.NODE_ENV == "production") {
    // @ts-ignore
    // config.build.minify = "terser"
    config.plugins.push(legacy({ targets: ["defaults", "not IE 11"] }))
}
export default defineConfig(<any>config)
