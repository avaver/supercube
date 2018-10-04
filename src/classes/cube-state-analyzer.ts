import { Cross, SolvedColorState, Colors, F2L, Corners, CornerColors, OLL, PLL } from '@/classes/cube-state-data'

export default class CubeStateAnalyzer {
    private colorStateArray: Uint8Array

    constructor(colorState: Uint8Array) {
        this.colorStateArray = colorState
    }

    public getSolvedCrossColor(): string {
        for (let i = 0; i < Cross.length; i++) {
            let match = true
            for (const index of Cross[i]) {
                if (this.colorStateArray[index] !== SolvedColorState[index]) {
                    match = false
                    break
                }
            }

            if (match) { return Colors[i] }
        }

        return ''
    }

    public getSolvedF2lsForCross(cross: string): string[] {
        const crossColor = Colors.indexOf(cross)
        if (crossColor < 0) { return [] }

        const f2ls = F2L[crossColor]
        const solved: string[] = []
        for (const f2l of f2ls) {
            let match = true
            for (const index of f2l) {
                if (this.colorStateArray[index] !== SolvedColorState[index]) {
                    match = false
                    break
                }
            }

            if (match) {
                const cornerId = Corners.findIndex((c) => JSON.stringify(c) === JSON.stringify(f2l.slice(0, 3)))
                const cornerCubie = CornerColors[cornerId].map((color) => Colors[color - 1]).join('')
                solved.push(cornerCubie)
            }
        }

        return solved
    }

    public isOllSolvedForCross(cross: string): boolean {
        const crossColor = Colors.indexOf(cross)
        if (crossColor < 0) { return false }

        for (const index of OLL[crossColor]) {
            if (this.colorStateArray[index] !== SolvedColorState[index]) { return false }
        }

        return true
    }

    public isPllSolvedForCross(cross: string): boolean {
        const crossColor = Colors.indexOf(cross)
        if (crossColor < 0) { return false }

        const pll = PLL[crossColor]
        for (let i = 0; i < pll.length; i += 3) {
            if ((this.colorStateArray[pll[i]] !== this.colorStateArray[pll[i + 1]]) ||
                (this.colorStateArray[pll[i]] !== this.colorStateArray[pll[i + 2]])) {
                    return false
                }
        }

        return true
    }
}
