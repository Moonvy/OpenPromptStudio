export function chinesePercentage(text: string) {
    var chineseCount = 0
    for (var i = 0; i < text.length; i++) {
        var charCode = text.charCodeAt(i)
        if (charCode >= 0x4e00 && charCode <= 0x9fa5) {
            // console.log("c",text[i])
            chineseCount++
        }
    }
    return (chineseCount / text.length) * 100
}

