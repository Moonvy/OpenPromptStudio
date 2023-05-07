import { PromptWork } from "./Sub/PromptWork"

export const LOCAL_TRANSLATE_SERVER = process.env.LOCAL_TRANSLATE_HOST
    ? `${
          process.env.LOCAL_TRANSLATE_HOST.startsWith("http")
              ? process.env.LOCAL_TRANSLATE_HOST
              : "//" + process.env.LOCAL_TRANSLATE_HOST
      }/prompt-studio`
    : "http://localhost:39011/prompt-studio"



export class PromptEditorClass {
    data = {
        server: location.host.startsWith("moonvy.com")
            ? "https://indexfs.moonvy.com:19213/prompt-studio"
            : LOCAL_TRANSLATE_SERVER,
        enablePngExportFixed: false,
        enablePngExportCopy: false,
    }

    works: PromptWork[]
    addWorkspace() {
        this.works.push(new PromptWork())
    }
    removeWorkspace(promptWork: PromptWork) {
        this.works = this.works.filter((item) => item !== promptWork)
    }

    constructor(options?: { initPrompts?: string[] }) {
        if (options?.initPrompts) {
            this.works = options.initPrompts.map((initText) => new PromptWork({ initText }))
        } else {
            this.works = [
                new PromptWork({
                    initText: `apple, forest ::-1 big bad wolf, wood ::2 unreal engine, cinematic lighting, UHD, super detail --aspect 2:3`,
                }),
                new PromptWork({
                    // initText: `symmetrical,(PureErosFace_V1:0.8), [:(highly detail face: 1.2):0.1],[to:when],[from::when], [[df]], (((twintails))), <lora:koreanDollLikeness_v10:0.5>`,
                    // parser: "stable-diffusion-webui",
                }),
            ]
        }
    }
}
