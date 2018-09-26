import Vue from 'vue'

export const EventHub = new Vue()
export const Events = {
    error: 'error',
    cubeConnect: 'cube-connect',
    cubeDisconnect: 'cube-disconnect',
    cubeState: 'cube-state',
    cubeReset: 'cube-reset',
    cubeScrambled: 'cube-scrambled',
    cubeSolved: 'cube-solved'
}
