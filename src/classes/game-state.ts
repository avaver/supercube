import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Timer from '@/classes/timer'
import Worker from 'worker-loader!@/classes/cubejs.worker'
import CubeState from '@/classes/cube-state'

// tslint:disable-next-line:no-var-requires
const cubejs = require('cubejs')

export default class GameState {
    // Current game scramble
    public scramble: string[] = []

    // Total time to solve the cube
    public time = 0

    // Number of turns used to solve the cube
    public turns = 0

    // Number of completed steps to reach the scrambled state
    public position = 0

    // Player is scrambling the cube
    public scrambling = true

    // Player is solving the cube
    public active = false

    // A new scramble is been computed
    public working = false

    // Current game operation
    public operation = 'Initializing scrambler...'

    // Sequence to start the game
    public solveTrigger = ['R', 'R\'']

    private triggerBuffer: string[] = []
    private lastMoveTimestamp = 0
    private worker = new Worker()

    public constructor() {
        EventHub.$on(Events.cubeScrambled, () => this.onCubeScrambled())
        EventHub.$on(Events.cubeSolved, () => this.generateScramble())
        EventHub.$on(Events.solveCancelled, () => this.generateScramble())
        EventHub.$on(Events.solveStarted, () => this.onSolveStarted())
        EventHub.$on(Events.cubeSolved, () => this.stop())
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))

        this.worker.onmessage = (event: MessageEvent) => {
            switch (event.data.cmd) {
                case 'init':
                    this.generateScramble()
                    break
                case 'scramble':
                    this.onScrambleGenerated(event.data.scramble)
                    break
            }
        }

        this.worker.postMessage({ cmd: 'init'})
    }

    public cancel() {
        this.stop()
        EventHub.$emit(Events.solveCancelled)
    }

    public tps(): string {
        if (!this.time) { return '0.00' }

        return (this.turns / (this.time / 1000)).toFixed(2)
    }

    public generateScramble() {
        this.scrambling = true
        this.operation = 'Generating scramble...'
        this.working = true
        this.worker.postMessage({ cmd: 'scramble'})
    }

    private onCubeState(state: Uint8Array) {
        this.turns = this.active ? this.turns + 1 : this.turns

        if (!this.scrambling || !this.scrambleAvailable() || this.scrambleCompleted()) {
            return
        }

        const cubeState = CubeState.from(state)
        this.checkTrigger(cubeState)

        const expectedState: any = new cubejs()
        expectedState.move(this.scramble.slice(0, this.position + 1).join(' '))

        if (cubeState.visualState === expectedState.asString()) {
            this.position++
            if (this.scrambleCompleted()) {
                this.onScrambleCompleted()
            }
        }
    }

    private onScrambleGenerated(scramble: string) {
        this.working = false
        this.scramble = []
        this.position = 0
        scramble.split(' ').forEach((s: string) => this.scramble.push(s))
    }

    private onScrambleCompleted() {
        Timer.cubeScrambled()
        Vue.nextTick(() => EventHub.$emit(Events.cubeScrambled, this.scramble.join(' ')))
        this.scrambling = false
    }

    private scrambleAvailable() {
        return this.scramble.length > 0
    }

    private scrambleCompleted() {
        return this.scramble.length > 0 && this.scramble.length === this.position
    }

    private checkTrigger(state: CubeState) {
        if (state.lastmove() === this.solveTrigger[this.triggerBuffer.length] &&
        (this.triggerBuffer.length === 0 || (Date.now() - this.lastMoveTimestamp < 200))) {
            this.triggerBuffer.push(state.lastmove())
            if (this.solveTrigger.join('') === this.triggerBuffer.join('')) {
                this.triggerBuffer = []
                this.onScrambleCompleted()
            }
        } else {
            this.triggerBuffer = []
        }

        this.lastMoveTimestamp = Date.now()
    }

    private onCubeScrambled() {
        this.time = this.turns = 0
        this.active = true
    }

    private onSolveStarted() {
        window.requestAnimationFrame(this.timer.bind(this))
    }

    private timer() {
        this.time = Timer.getSolveTime()

        if (this.active) {
            window.requestAnimationFrame(this.timer.bind(this))
        }
    }

    private stop() {
        this.active = false
    }
}
