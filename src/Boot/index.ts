import { bootVue } from "./vue.boot"
import { I18n } from "@moonvy/app-core"

export function boot() {
    ;(<any>globalThis).I18n = I18n
    ;(<any>globalThis).t = I18n.t

    bootVue((Vue) => {
        Vue.prototype.t = I18n.t
    })
}
