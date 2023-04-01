import VueRouter from "vue-router"
import vIndex from "../Pages/Index/Index.vue"
import type { VueConstructor } from "vue"

export function getRoutes() {
    return [
        {
            path: "/",
            redirect: "/apps/ops/",
        },
        {
            path: "/apps/ops/",
            name: "Index",
            component: vIndex,
        },
    ]
}

export function getPagesRouter(Vue: VueConstructor) {
    let routes = getRoutes()
    Vue.use(VueRouter)
    let router = new VueRouter({ mode: "history", routes })
    return router
}
