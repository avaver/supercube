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

    // timestamp: number | [Date.now() when first solve move was done]
    solveStarted: 'solve-started',

    // time: number | [total solve time in ms]
    cubeSolved: 'cube-solved'
}
