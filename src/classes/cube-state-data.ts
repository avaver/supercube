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

export const Colors = ['B', 'Y', 'R', 'W', 'P', 'G']

export const Faces  = ['B', 'D', 'L', 'U', 'R', 'F']

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
    [37, 39, 41, 43, 1, 32, 12, 52],
    [46, 48, 50, 52, 25, 16, 34, 43],
    [10, 12, 14, 16, 3, 41, 21, 48],
    [1, 3, 5, 7, 37, 10, 28, 19],
    [28, 30, 32, 34, 5, 23, 39, 50],
    [19, 21, 23, 25, 7, 14, 30, 46]
]
