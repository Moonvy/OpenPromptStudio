import { parsePrompts } from "../ParsePrompts"

test("parsePrompts", () => {
    let re = parsePrompts(
        "Portrait Of a Dragon Princess, Makeup, Explosion Of Liquid Splash, pastel colors, Intricate, Highly Detailed, Fantasy Background, Illustration, Sharp Focus, Dramatic Lighting, Trending On Artstation, Cinematic, 8k, Concept Art, Elegant, Reflections"
    )

    console.log(re)
})
