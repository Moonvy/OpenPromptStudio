const Commands = [
    {
        keys: ["--version", "--v"],
        zh: "版本",
        desc: "模型版本",
        sampleCmds: ["4", "5", "6", "niji"],
    },
    {
        keys: ["--aspect", "--ar"],
        zh: "宽高比",
        sampleCmds: ["2:3", "16:9", "3:2"],
        desc: "生成图片的宽高比尺寸",
    },
    {
        keys: ["--cref"],
        zh: "一致性引用源",
        desc: "生成与提供的链接一致性的结果（后跟链接）",
    },
    {
        keys: ["--cw"],
        zh: "一致性权重",
        sampleCmds: [0, 50, 100],
        desc: "<0–100>，数值越大一致性越高",
    },
    {
        keys: ["--tile"],
        zh: "无缝拼贴图案",
        desc: "生成无缝拼贴图案",
    },
    {
        keys: ["--chaos", "--c"],
        zh: "多样性",
        sampleCmds: [0, 50, 100],
        desc: "<0–100>，多样性数值越高，越能产生更多意想不到的结果和组合，越小越能产生更稳定、更可重复的结果",
    },
    {
        keys: ["--no"],
        zh: "负面",
        sampleCmds: ["xxx"],
        desc: "<0–100> 多样性数值越高，越能产生更多意想不到的结果和组合，越小越能产生更稳定、更可重复的结果。默认值为 0",
    },
    {
        keys: ["--quality", "--q"],
        zh: "质量",
        sampleCmds: [".25", ".5", "1"],
        desc: "<.25, .5, 1, 2> 要花费多少渲染时间（迭代步数），更高通常会产生更多的细节，但高 --quality 并不总能产生更好的结果。默认值为 1 ",
    },
    {
        keys: ["--seed"],
        zh: "种子",
        desc: "<0–4294967295> 指定随机种子，相同的提示词与相同的种子能产生相似的结果",
    },
    {
        keys: ["--sameseed"],
        zh: "相似种子",
        desc: "<0–4294967295> 比 --seed 能生成更相似的结果",
    },
    {
        keys: ["--stop"],
        zh: "停止",
        desc: "<10–100> 在流程中途结束生成。以较早的百分比停止流程会产生更模糊、更不细致的结果",
    },
    {
        keys: ["--style"],
        zh: "风格",
        sampleCmds: ["raw", "4a", "4b", "4c"],
        desc: "<raw, 4a, 4b or 4c> 模型版本的风格之间切换",
    },
    {
        keys: ["--stylize", "--s"],
        zh: "风格化",
        sampleCmds: ["0", "500", "1000"],
        desc: "<0–1000> 越高结果的艺术性越高，越低越像真实图片。默认 100",
    },
    {
        keys: ["--iw"],
        zh: "图像权重",
        desc: "相对于文本权重的图像提示权重，默认 0.25",
    },
    {
        keys: ["--uplight"],
        zh: "轻量放大器",
        desc: "选择 U 按钮时使用替代的“轻量”放大器。结果更接近原始网格图像，放大后的图像细节更少，更平滑",
    },
    {
        keys: ["--upbeta"],
        zh: "测试版放大器",
        desc: "选择 U 按钮时使用替代的“beta”放大器。结果更接近原始网格图像。放大后的图像添加的细节明显更少",
    },
    {
        keys: ["--niji"],
        sampleCmds: ["", "5", "6"],
        zh: "动漫模型",
        desc: "另一种模型专注于动漫风格的图像",
    },
    {
        keys: ["--test"],
        zh: "测试模型",
        desc: "特殊测试模型",
    },
    {
        keys: ["--testp"],
        zh: "摄影测试模型",
        desc: "特殊的以摄影为重点的测试模型",
    },
    {
        keys: ["--hd"],
        zh: "高清模型",
        desc: "使用早期的替代模型来生成更大、更不一致的图像。该算法可能适用于抽象和风景图像",
    },
    {
        keys: ["--repeat"],
        zh: "重复",
        sampleCmds: ["1", "3"],
        desc: "重复",
    },
]

export default function () {
    let descs = []
    for (let command of Object.values(Commands)) {
        let i = 0
        for (let key of command.keys) {
            let item = {
                text: key,
                lang_zh: command.zh,
                subType: "command",
                desc: command.desc,
            }
            descs.push(item)
            if (i == 0) {
                item.sampleCmds = command.sampleCmds
                item.dir = `命令/${command.zh}`
            }
            descs.push({
                text: key.replace("--", "—"),
                lang_zh: command.zh,
                subType: "command",
                desc: command.desc,
            })
            i++
        }
    }
    return descs
}
