import Vue from 'vue'

export const EventHub = new Vue()
export const Events = {
    error: 'error',
    cubeConnect: 'cube-connect',
    cubeDisconnect: 'cube-disconnect',
    cubeState: 'cube-state',
    cubeReset: 'cube-reset'
}

export class CubeState {
    public data: Uint8Array
    public initial: boolean

    constructor(data: Uint8Array, initial: boolean = false) {
        this.data = data
        this.initial = initial
    }
}
