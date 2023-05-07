import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue2"
import legacy from "@vitejs/plugin-legacy"
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
        host: "0.0.0.0",
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
    resolve: {},
    define: {
        "process.env.LOCAL_TRANSLATE_HOST": process.env.LOCAL_TRANSLATE_HOST
            ? `"${process.env.LOCAL_TRANSLATE_HOST}"`
            : "false",
    },
}
// ------------- [vite build] ------------
if (process.env.NODE_ENV == "production") {
    // @ts-ignore
    // config.build.minify = "terser"
    config.plugins.push(legacy({ targets: ["defaults", "not IE 11"] }))
}
export default defineConfig(<any>config)
