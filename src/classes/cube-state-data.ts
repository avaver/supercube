/*
Raw state ids:

             |------------|
             | C7  E11 C6 |
             | E7  whi E6 |
             | C3  E3  C2 |
|------------|------------|-------------|-------------|
| C7  E7  C3 | C3  E3  C2 | C2  E6  C6  | C6  E11 C7  |
| E12 red E4 | E4  gre E2 | E2  pin E10 | E10 blu E12 |
| C8  E8  C4 | C4  E1  C1 | C1  E5  C5  | C5  E9  C8  |
|------------|------------|-------------|-------------|
             | C4  E1  C1 |
             | E8  yel E5 |
             | C8  E9  C5 |
             |------------|


Color state:

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


Visual state:

           |----------|
           | 00 01 02 |
           | 03 04 05 |
           | 06 07 08 |
|----------|----------|----------|----------|
| 36 37 38 | 18 19 20 | 09 10 11 | 45 46 47 |
| 39 40 41 | 21 22 23 | 12 13 14 | 48 49 50 |
| 42 43 44 | 24 25 26 | 15 16 17 | 51 52 53 |
|----------|----------|----------|----------|
           | 27 28 29 |
           | 30 31 32 |
           | 33 34 35 |
           |----------|


4 | 00 - 08: WHITE  [U]
3 | 09 - 17: RED    [L]
6 | 18 - 26: GREEN  [F]
5 | 27 - 35: PINK   [R]
1 | 36 - 44: BLUE   [B]
2 | 45 - 53: YELLOW [D]

*/

// raw solved state
// tslint:disable-next-line:max-line-length
export const RawSolvedState = Uint8Array.from([0x12, 0x34, 0x56, 0x78, 0x33, 0x33, 0x33, 0x33, 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0x00, 0x00])

export enum ColorID {
    BLU = 1,
    YEL = 2,
    RED = 3,
    WHI = 4,
    PIN = 5,
    GRE = 6
}

export const ColorIDs = [ColorID.BLU, ColorID.YEL, ColorID.RED, ColorID.WHI, ColorID.PIN, ColorID.GRE]

export const OppositeColorIDs = [ColorID.GRE, ColorID.WHI, ColorID.PIN, ColorID.YEL, ColorID.RED, ColorID.BLU]

export const Colors = ['B', 'Y', 'R', 'W', 'P', 'G']

export const OppositeColors = ['G', 'W', 'P', 'Y', 'R', 'B']

export const Faces  = ['B', 'D', 'L', 'U', 'R', 'F']

export const OppositeFaces  = ['F', 'U', 'R', 'D', 'L', 'B']

// corner cubies colors in ccw direction
export const CornerColors = [
    [ColorID.GRE, ColorID.YEL, ColorID.PIN],
    [ColorID.GRE, ColorID.PIN, ColorID.WHI],
    [ColorID.GRE, ColorID.WHI, ColorID.RED],
    [ColorID.GRE, ColorID.RED, ColorID.YEL],
    [ColorID.BLU, ColorID.PIN, ColorID.YEL],
    [ColorID.BLU, ColorID.WHI, ColorID.PIN],
    [ColorID.BLU, ColorID.RED, ColorID.WHI],
    [ColorID.BLU, ColorID.YEL, ColorID.RED]
]

// edge cubies colors
export const EdgeColors = [
    [ColorID.GRE, ColorID.YEL],
    [ColorID.GRE, ColorID.PIN],
    [ColorID.GRE, ColorID.WHI],
    [ColorID.GRE, ColorID.RED],
    [ColorID.YEL, ColorID.PIN],
    [ColorID.WHI, ColorID.PIN],
    [ColorID.WHI, ColorID.RED],
    [ColorID.YEL, ColorID.RED],
    [ColorID.BLU, ColorID.YEL],
    [ColorID.BLU, ColorID.PIN],
    [ColorID.BLU, ColorID.WHI],
    [ColorID.BLU, ColorID.RED]
]

// corner cubies positions on the unwrapped cube
export const Corners = [
    [26, 47, 33],
    [20, 27,  8],
    [18,  6, 11],
    [24, 17, 45],
    [42, 35, 53],
    [36,  2, 29],
    [38,  9,  0],
    [44, 51, 15]
]

// edge cubies positions on the unwrapped cube
export const Edges = [
    [25, 46],
    [23, 30],
    [19,  7],
    [21, 14],
    [50, 34],
    [ 5, 28],
    [ 3, 10],
    [48, 16],
    [43, 52],
    [39, 32],
    [37,  1],
    [41, 12]
]

export const SolvedColorState = [
    ColorID.WHI, ColorID.WHI, ColorID.WHI,
    ColorID.WHI, ColorID.WHI, ColorID.WHI,
    ColorID.WHI, ColorID.WHI, ColorID.WHI,
    ColorID.RED, ColorID.RED, ColorID.RED,
    ColorID.RED, ColorID.RED, ColorID.RED,
    ColorID.RED, ColorID.RED, ColorID.RED,
    ColorID.GRE, ColorID.GRE, ColorID.GRE,
    ColorID.GRE, ColorID.GRE, ColorID.GRE,
    ColorID.GRE, ColorID.GRE, ColorID.GRE,
    ColorID.PIN, ColorID.PIN, ColorID.PIN,
    ColorID.PIN, ColorID.PIN, ColorID.PIN,
    ColorID.PIN, ColorID.PIN, ColorID.PIN,
    ColorID.BLU, ColorID.BLU, ColorID.BLU,
    ColorID.BLU, ColorID.BLU, ColorID.BLU,
    ColorID.BLU, ColorID.BLU, ColorID.BLU,
    ColorID.YEL, ColorID.YEL, ColorID.YEL,
    ColorID.YEL, ColorID.YEL, ColorID.YEL,
    ColorID.YEL, ColorID.YEL, ColorID.YEL
]

export const Cross = [
    [...Edges[8], ...Edges[9], ...Edges[10], ...Edges[11]], // E9 E10 E11 E12  |  blue cross
    [...Edges[0], ...Edges[4], ...Edges[7],  ...Edges[8] ], // E1 E5  E8  E9   |  yellow cross
    [...Edges[3], ...Edges[6], ...Edges[7],  ...Edges[11]], // E4 E7  E8  E12  |  red cross
    [...Edges[2], ...Edges[5], ...Edges[6],  ...Edges[10]], // E3 E6  E7  E11  |  white cross
    [...Edges[1], ...Edges[4], ...Edges[5],  ...Edges[9] ], // E2 E5  E6  E10  |  pink cross
    [...Edges[0], ...Edges[1], ...Edges[2],  ...Edges[3] ]  // E1 E2  E3  E4   |  green cross
]

export const F2L = [
    [
        [...Corners[4], ...Edges[4] ], // C5 E5
        [...Corners[5], ...Edges[5] ], // C6 E6
        [...Corners[6], ...Edges[6] ], // C7 E7
        [...Corners[7], ...Edges[7] ]  // C8 E8
    ],  // blue cross
    [
        [...Corners[0], ...Edges[1] ], // C1 E2
        [...Corners[3], ...Edges[3] ], // C4 E4
        [...Corners[4], ...Edges[9] ], // C5 E10
        [...Corners[7], ...Edges[11]]  // C8 E12
    ], // yellow cross
    [
        [...Corners[2], ...Edges[2] ], // C3 E3
        [...Corners[3], ...Edges[0] ], // C4 E1
        [...Corners[6], ...Edges[10]], // C7 E11
        [...Corners[7], ...Edges[8] ]  // C8 E9
    ], // red cross
    [
        [...Corners[1], ...Edges[1] ], // C2 E2
        [...Corners[2], ...Edges[3] ], // C3 E4
        [...Corners[5], ...Edges[9] ], // C6 E10
        [...Corners[6], ...Edges[11]]  // C7 E12
    ], // white cross
    [
        [...Corners[0], ...Edges[0] ], // C1 E1
        [...Corners[1], ...Edges[2] ], // C2 E3
        [...Corners[4], ...Edges[8] ], // C5 E9
        [...Corners[5], ...Edges[10]]  // C6 E11
    ], // pink cross
    [
        [...Corners[0], ...Edges[4] ], // C1 E5
        [...Corners[1], ...Edges[5] ], // C2 E6
        [...Corners[2], ...Edges[6] ], // C3 E7
        [...Corners[3], ...Edges[7] ]  // C4 E8
    ]  // green cross
]

export const OLL = [
    [18, 19, 20, 21, 22, 23, 24, 25, 26], // blue cross   -> green OLL
    [ 0,  1,  2,  3,  4,  5,  6,  7,  8], // yellow cross -> white OLL
    [27, 28, 29, 30, 31, 32, 33, 34, 35], // red cross    -> pink OLL
    [45, 46, 47, 48, 49, 50, 51, 52, 53], // white cross  -> yellow OLL
    [ 9, 10, 11, 12, 13, 14, 15, 16, 17], // pink cross   -> red OLL
    [36, 37, 38, 39, 40, 41, 42, 43, 44]  // green cross  -> blue OLL
]

export const PLL = [
    [ 6,  7,  8, 11, 14, 17, 27, 30, 33, 45, 46, 47], // blue cross
    [ 9, 10, 11, 18, 19, 20, 27, 28, 29, 36, 37, 38], // yellow cross
    [ 2,  5,  8, 20, 23, 26, 36, 39, 42, 47, 50, 53], // red cross
    [15, 16, 17, 24, 25, 26, 33, 34, 35, 42, 43, 44], // white cross
    [ 0,  3,  6, 18, 21, 24, 38, 41, 44, 45, 48, 51], // pink cross
    [ 0,  1,  2,  9, 12, 15, 29, 32, 35, 51, 52, 53]  // green cross
]
