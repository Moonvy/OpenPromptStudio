import type VueRouter, { Route } from "vue-router"
import type { I18n } from "@moonvy/app-core"
// 在 types/vue.d.ts 里 Vue 有构造函数类型
declare module "vue/types/vue" {
    // 声明为 Vue 补充的东西
    interface Vue {
        $route: Route
        $router: VueRouter
        t: typeof I18n.t
    }
    interface VueConstructor {
        $route: Route
        $router: VueRouter
        t: typeof I18n.t
    }
}
