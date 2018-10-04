// tslint:disable-next-line:max-line-length
import { RawSolvedState, ColorID, Corners, Edges, CornerColors, EdgeColors, Colors, Faces } from '@/classes/cube-state-data'
import CubeStateAnalyzer from '@/classes/cube-state-analyzer'

export default class CubeState {
    public static from(state: Uint8Array) {
        if (state.length !== 20) {
            throw new Error('raw cube state should be exactly 20 bytes')
        }

        return new CubeState(state)
    }

    public static OptimizeMoves(moves: string[]): string[] {
        const m: string[] = []
        for (let i = 0; i < moves.length; i++) {
            m.push((i < (moves.length - 1) && (moves[i] === moves[i + 1])) ? moves[i++][0] + '2' : moves[i])
        }

        return m
    }

    // current raw cube state
    public rawState = RawSolvedState

    // color cube state in format 'W...WR...RG...GP...PB...BY...Y'
    public colorState = ''

    // visual cube state in format 'U...UR...RF...FD...DL...LB...B'
    public visualState = ''

    private cp: Uint8Array = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8])
    private co: Uint8Array = Uint8Array.from([3, 3, 3, 3, 3, 3, 3, 3])
    private eo: Uint8Array = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    private ep: Uint8Array = Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0])

    private colorStateArray = new Uint8Array(54)
    private visualStateArray: string[] = []

    private analyzer: CubeStateAnalyzer

    private constructor(state: Uint8Array) {
        this.rawState = state
        this.cp = this.rawState.splitBytes(0, 4)
        this.co = this.rawState.splitBytes(4, 4)
        this.ep = this.rawState.splitBytes(8, 6)
        this.eo = this.rawState.splitBits(14, 2).slice(0, 12)

        this.normalizeCO()
        this.setupCenters()

        this.computeColorState()
        this.computeVisualState()

        this.analyzer = new CubeStateAnalyzer(this.colorStateArray)
    }

    public lastmove(): string {
        // tslint:disable:no-bitwise
        const move = Faces[(this.rawState[16] >> 4) - 1]
        return (this.rawState[16] & 0xf) === 3 ? move + '\'' : move
        // tslint:enable:no-bitwise
    }

    public cross() {
        return this.analyzer.getSolvedCrossColor()
    }

    public f2l(cross: string): string[] {
        return this.analyzer.getSolvedF2lsForCross(cross)
    }

    public oll(cross: string): boolean {
        return this.analyzer.isOllSolvedForCross(cross)
    }

    public pll(cross: string): boolean {
        return this.analyzer.isPllSolvedForCross(cross)
    }

    public solved(): boolean {
        for (let i = 0; i < 16; i++) {
            if (this.rawState[i] !== RawSolvedState[i]) {
                return false
            }
        }

        return true
    }

    // magic: some corners seems to have swapped orientation when not in solved state
    private normalizeCO() {
        [0, 2, 5, 7].forEach((i) => {
            if (this.co[i] !== 3) {
                this.co[i] = this.co[i] === 1 ? 2 : 1
            }
        })
    }

    private setupCenters(): void {
        this.colorStateArray[4]  = ColorID.WHI
        this.colorStateArray[13] = ColorID.RED
        this.colorStateArray[22] = ColorID.GRE
        this.colorStateArray[31] = ColorID.PIN
        this.colorStateArray[40] = ColorID.BLU
        this.colorStateArray[49] = ColorID.YEL
    }

    private computeColorState() {
        for (let cornerSlot = 0; cornerSlot < Corners.length; cornerSlot++) {
            const cornerIndices = Corners[cornerSlot]
            for (let cornerFace = 0; cornerFace < cornerIndices.length; cornerFace++) {
                const index = cornerIndices[cornerFace]
                const cornerColorSchema = CornerColors[this.cp[cornerSlot] - 1]
                const cornerColorIndex = (this.co[cornerSlot] + cornerFace) % 3
                this.colorStateArray[index] = cornerColorSchema[cornerColorIndex]
            }
        }

        for (let edgeSlot = 0; edgeSlot < Edges.length; edgeSlot++) {
            const edgeIndices = Edges[edgeSlot]
            for (let edgeFace = 0; edgeFace < edgeIndices.length; edgeFace++) {
                const index = edgeIndices[edgeFace]
                const edgeColorSchema = EdgeColors[this.ep[edgeSlot] - 1]
                const edgeColorIndex = (this.eo[edgeSlot] + edgeFace) % 2
                this.colorStateArray[index] = edgeColorSchema[edgeColorIndex]
            }
        }

        this.colorState = ''
        this.colorStateArray.forEach((colorCode) => this.colorState += Colors[colorCode - 1])
    }

    private computeVisualState() {
        this.visualStateArray = []
        for (let i =  0; i <  9; i++) { this.visualStateArray.push(Faces[this.colorStateArray[i] - 1]) }
        for (let i = 27; i < 36; i++) { this.visualStateArray.push(Faces[this.colorStateArray[i] - 1]) }
        for (let i = 18; i < 27; i++) { this.visualStateArray.push(Faces[this.colorStateArray[i] - 1]) }
        for (let i = 45; i < 54; i++) { this.visualStateArray.push(Faces[this.colorStateArray[i] - 1]) }
        for (let i =  9; i < 18; i++) { this.visualStateArray.push(Faces[this.colorStateArray[i] - 1]) }
        for (let i = 36; i < 45; i++) { this.visualStateArray.push(Faces[this.colorStateArray[i] - 1]) }

        this.visualState = this.visualStateArray.join('')
    }
}
