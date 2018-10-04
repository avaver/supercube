import Vue from 'vue'

export const EventHub = new Vue()
export const Events = {
    // e: Error | [error object]
    error: 'error',

    // name: string | [cube name]
    cubeConnect: 'cube-connect',

    // name: string | [cube name]
    cubeDisconnect: 'cube-disconnect',

    // state: Uint8Array | [raw cube state, normally prased with Cube.from(state)]
    cubeState: 'cube-state',

    // no parameters
    cubeReset: 'cube-reset',

    // scramble: string | [scramble cube scrambled with, i.e. 'D R2 F2 D\' B2...']
    cubeScrambled: 'cube-scrambled',

    // no parameters
    solveStarted: 'solve-started',

    // no parameters
    solveCancelled: 'solve-cancelled',

    // no parameters
    cubeSolved: 'cube-solved',

    // crossColor: string | ['B', 'Y', 'R', 'W', 'P', 'G']
    cfopCross: 'cfop-cross',

    // crossColor: string | ['B', 'Y', 'R', 'W', 'P', 'G']
    cfopF2l: 'cfop-f2l',

    // crossColor: string | ['B', 'Y', 'R', 'W', 'P', 'G']
    cfopOll: 'cfor-oll',

    // solved: boolean | true if cube is solved after PLL; false if AUF required
    cfopPll: 'cfop-pll'
}
