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
            initText: `forest, big bad wolf, unreal engine, UHD, super detail, cinematic lighting, --aspect 2:3`,
        }),
        new PromptWork(),
    ]

    addWorkspace() {
        this.works.push(new PromptWork())
    }
    removeWorkspace(promptWork: PromptWork) {
        this.works = this.works.filter((item) => item !== promptWork)
    }
}
