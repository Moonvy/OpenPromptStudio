// Created on 2023/03/26 - 00:39
import { publish, refreshCDN } from "@moonvy/deploy"

await publish("web", "./dist", "apps/ops")
await refreshCDN(["https://moonvy.com/apps/ops/"])
