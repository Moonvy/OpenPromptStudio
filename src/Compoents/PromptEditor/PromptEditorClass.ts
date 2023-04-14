import { PromptWork } from "./Sub/PromptWork"

export class PromptEditorClass {
    data = {
        server: location.host.startsWith("localhost")
            ? "http://localhost:19212/prompt-studio"
            : "https://indexfs.moonvy.com:19213/prompt-studio",
        enablePngExportFixed: false,
        enablePngExportCopy: false,
    }

    works: PromptWork[] = [
        new PromptWork({
            initText: `apple, forest ::-1 big bad wolf, wood ::2 unreal engine, cinematic lighting, UHD, super detail --aspect 2:3`,
        }),
        new PromptWork({
            // initText: `symmetrical,(PureErosFace_V1:0.8), [:(highly detail face: 1.2):0.1],[to:when],[from::when], [[df]], (((twintails))), <lora:koreanDollLikeness_v10:0.5>`,
            // parser: "stable-diffusion-webui",
        }),
    ]
    addWorkspace() {
        this.works.push(new PromptWork())
    }
    removeWorkspace(promptWork: PromptWork) {
        this.works = this.works.filter((item) => item !== promptWork)
    }
}
