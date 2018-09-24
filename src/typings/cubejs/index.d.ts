declare module 'cubejs' {
    export = Cubejs
}

declare module Cubejs {
    export function fromString(s: string): Cubejs
    export function random(): Cubejs
    export function inverse(s: string): Cubejs
    export function inverse(a: number[]): Cubejs
    export function inverse(n: number): Cubejs
    export function initSolver(): void
    export function scramble(): string
    export function asyncInit(worker: string, callback: () => void): void
}

type CubejsState = {
    center: number[]
    cp: number[]
    co: number[]
    ep: number[]
    eo: number[]
}

declare class Cubejs {
    constructor()
    constructor(c: Cubejs)
    constructor(s: CubejsState)
    init(c: Cubejs): void
    identity(): void
    isSolved(): boolean
    toJson(): CubejsState
    move(moves: string): Cubejs
    move(moves: string[]): Cubejs
    asString(): string
}