export enum Colors {
    GRE = 1,
    YEL = 2,
    PIN = 3,
    WHI = 4,
    RED = 5,
    BLU = 6
}

export class Cube {

    // visual cube state
    public vcs = ''

    // raw solved state
    private rss = [0x12, 0x34, 0x56, 0x78, 0x33, 0x33, 0x33, 0x33, 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0x00, 0x00]

    // paper solved state
    private pss: number[]

    // corner cubies colors in ccw direction, always starting from either blue or green
    private ccol = [
        [Colors.GRE, Colors.YEL, Colors.PIN],
        [Colors.GRE, Colors.PIN, Colors.WHI],
        [Colors.GRE, Colors.WHI, Colors.RED],
        [Colors.GRE, Colors.RED, Colors.YEL],
        [Colors.BLU, Colors.PIN, Colors.YEL],
        [Colors.BLU, Colors.WHI, Colors.PIN],
        [Colors.BLU, Colors.RED, Colors.WHI],
        [Colors.BLU, Colors.YEL, Colors.RED]
    ]

    // edge cubies colors, always starting from green, blue, yellow or white
    private ecol = [
        [Colors.GRE, Colors.YEL],
        [Colors.GRE, Colors.PIN],
        [Colors.GRE, Colors.WHI],
        [Colors.GRE, Colors.RED],
        [Colors.YEL, Colors.PIN],
        [Colors.WHI, Colors.PIN],
        [Colors.WHI, Colors.RED],
        [Colors.YEL, Colors.RED],
        [Colors.BLU, Colors.YEL],
        [Colors.BLU, Colors.PIN],
        [Colors.BLU, Colors.WHI],
        [Colors.BLU, Colors.RED]
    ]

    // corner cubies positions on the unwrapped cube
    private cpos = [
        [44, 51, 15],
        [38,  9,  0],
        [36,  2, 29],
        [42, 35, 53],
        [24, 17, 45],
        [18,  6, 11],
        [20, 27,  8],
        [26, 47, 33]
    ]

    // edge cubies positions on the unwrapped cube
    private epos = [
        [43, 52],
        [41, 12],
        [37,  1],
        [39, 32],
        [48, 16],
        [ 3, 10],
        [ 5, 28],
        [50, 34],
        [25, 46],
        [21, 14],
        [19,  7],
        [23, 30]
    ]

    // possible solved crosses
    private scro = [
        [[], [0x3, 0x6, 0x7, 0xb]], // white
        [[], [0x2, 0x5, 0x6, 0xa]], // pink
        [[], [0x9, 0xa, 0xb, 0xc]], // blue
        [[], [0x4, 0x7, 0x8, 0xc]], // red
        [[], [0x1, 0x2, 0x3, 0x4]], // green
        [[], [0x1, 0x5, 0x8, 0x9]]  // yellow
    ]

    // possible solved f2l's
    private sf2l =  [
        [[0x2, 0x3, 0x6, 0x7], [0x2, 0x3, 0x4, 0x6, 0x7, 0xa, 0xb, 0xc]], // white
        [[0x1, 0x2, 0x5, 0x6], [0x1, 0x2, 0x3, 0x5, 0x6, 0x9, 0xa, 0xb]], // pink
        [[0x5, 0x6, 0x7, 0x8], [0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc]], // blue
        [[0x3, 0x4, 0x7, 0x8], [0x1, 0x3, 0x4, 0x7, 0x8, 0x9, 0xb, 0xc]], // red
        [[0x1, 0x2, 0x3, 0x4], [0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]], // green
        [[0x1, 0x4, 0x5, 0x8], [0x1, 0x2, 0x4, 0x5, 0x8, 0x9, 0xa, 0xc]]  // yellow
    ]

    // possible solved oll's in relation to f2l
    private soll = [
        [45, 53], // yellow
        [27, 35], // red
        [36, 44], // green
        [ 9, 17], // pink
        [18, 26], // blue
        [ 0,  8]  // white
    ]

    private faces = ['b', 'd', 'l', 'u', 'r', 'f']

    // raw state as received from cube
    private rs = new Uint8Array(20)
    // paper state (unwrapped cube)
    private ps = new Uint8Array(54)
    // corners permutation
    private cp = new Uint8Array(8)
    // corners orientation
    private co = new Uint8Array(8)
    // edges permutation
    private ep = new Uint8Array(12)
    // edges orientation
    private eo = new Uint8Array(12)

    constructor() {
        this.pss = []
        for (let i =  0; i <  9; i++) { this.pss[i] = 4 }
        for (let i =  9; i < 18; i++) { this.pss[i] = 3 }
        for (let i = 18; i < 27; i++) { this.pss[i] = 6 }
        for (let i = 27; i < 36; i++) { this.pss[i] = 5 }
        for (let i = 36; i < 45; i++) { this.pss[i] = 1 }
        for (let i = 45; i < 54; i++) { this.pss[i] = 2 }
    }

    public set(data: Uint8Array) {
        if (data.length !== 20) {
            throw new Error('raw cube data should be exactly 20 bytes')
        }

        this.rs = data
        this.calcps()
        this.calcvcs()
    }

    public solved(): boolean {
        for (let i = 0; i < 16; i++) {
            if (this.rss[i] !== this.rs[i]) {
                return false
            }
        }

        return true
    }

    public cross(): boolean {
        return this.verify(this.scro) !== 0
    }

    public f2l(): boolean {
        return this.verify(this.sf2l) !== 0
    }

    public oll(): boolean {
        const f = this.verify(this.sf2l)
        if (f > 0) {
            for (let i = this.soll[f - 1][0]; i <= this.soll[f - 1][1]; i++) {
                if (this.ps[i] !== this.pss[i]) {
                    return false
                }
            }
            return true
        }
        return false
    }

    // calculate paper state
    private calcps(): void {
        this.cp = this.rs.splitBytes(0, 4)
        this.co = this.rs.splitBytes(4, 4)
        this.ep = this.rs.splitBytes(8, 6)
        this.eo = this.rs.splitBits(14, 2).slice(0, 12)

        this.normalizeCO(this.co)
        this.setupCenters()

        // tslint:disable:max-line-length
        this.cpos.forEach((pos, i) => pos.forEach((c, k) => this.ps[c] = this.ccol[this.cp[i] - 1][(this.co[i] + k) % 3]))
        this.epos.forEach((pos, i) => pos.forEach((c, k) => this.ps[c] = this.ecol[this.ep[i] - 1][(this.eo[i] + k) % 2]))
        // tslint:enable:max-line-length
    }

    private normalizeCO(co: Uint8Array) {
        [0, 2, 5, 7].forEach((i) => {
            if (co[i] !== 3) {
                co[i] = co[i] === 1 ? 2 : 1
            }
        })
    }

    private setupCenters(): void {
        this.ps[4]  = Colors.WHI
        this.ps[13] = Colors.PIN
        this.ps[22] = Colors.BLU
        this.ps[31] = Colors.RED
        this.ps[40] = Colors.GRE
        this.ps[49] = Colors.YEL
    }

    private verify(s: number[][][]): number {
        for (let i = 0; i < s.length; i++) {
            if (this.stateEquals(s[i])) {
                return i + 1
            }
        }
        return 0
    }

    private stateEquals(s: number[][]): boolean {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < s[0].length; i++) {
            if (this.cp[s[0][i] - 1] !== s[0][i] || this.co[s[0][i] - 1] !== 3) {
                return false
            }
        }

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < s[1].length; i++) {
            if (this.ep[s[1][i] - 1] !== s[1][i] || this.eo[s[1][i] - 1] !== 0) {
                return false
            }
        }
        return true
    }

    private calcvcs() {
        const vcsarr: string[] = []
        for (let i =  0; i <  9; i++) { vcsarr.push(this.faces[this.ps[i] - 1]) }
        for (let i = 27; i < 36; i++) { vcsarr.push(this.faces[this.ps[i] - 1]) }
        for (let i = 18; i < 27; i++) { vcsarr.push(this.faces[this.ps[i] - 1]) }
        for (let i = 45; i < 54; i++) { vcsarr.push(this.faces[this.ps[i] - 1]) }
        for (let i =  9; i < 18; i++) { vcsarr.push(this.faces[this.ps[i] - 1]) }
        for (let i = 36; i < 45; i++) { vcsarr.push(this.faces[this.ps[i] - 1]) }

        this.vcs = vcsarr.join('')
    }
}

/*
              |-------------|
              | C2  E3  C3  |
              | E6  whi E7  |
              | C6  E11 C7  |
|-------------|-------------|------------|------------|
| C2  E6  C6  | C6  E11 C7  | C7  E7  C3 | C3  E3  C2 |
| E2  pin E10 | E10 blu E12 | E12 red E4 | E4  gre E2 |
| C1  E5  C5  | C5  E9  C8  | C8  E8  C4 | C4  E1  C1 |
|-------------|-------------|------------|------------|
              | C5  E9  C8  |
              | E5  yel E8  |
              | C1  E1  C4  |
              |-------------|


           |----------|
           | 00 01 02 |
           | 03 04 05 |
           | 06 07 08 |
|----------|----------|----------|----------|
| 09 10 11 | 18 19 20 | 27 28 29 | 36 37 38 |
| 12 13 14 | 21 22 23 | 30 31 32 | 39 40 41 |
| 15 16 17 | 24 25 26 | 33 34 35 | 42 43 44 |
|----------|----------|----------|----------|
           | 45 46 47 |
           | 48 49 50 |
           | 51 52 53 |
           |----------|


4 | 00 - 08: WHITE  [U]
3 | 09 - 17: PINK   [L]
6 | 18 - 26: BLUE   [F]
5 | 27 - 35: RED    [R]
1 | 36 - 44: GREEN  [B]
2 | 45 - 53: YELLOW [D]

*/
