<template>
    <v-container grid-list-xl>
        <v-layout row wrap>
            <v-flex>
                <v-card color="teal" dark ripple>
                    <v-card-title class="display-2">
                        Cross
                        <v-spacer />
                        <v-chip color="white" text-color="black" v-if="cross">
                            <v-avatar :color="crossColors[cross].color" class="font-weight-bold white--text">{{crossColors[cross].letter}}</v-avatar>
                            <span>{{crossColors[cross].text}}</span>
                        </v-chip>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap align-center>
                            <v-flex class="display-2">{{(crossTime / 1000).toFixed(2)}}</v-flex>
                        </v-layout>
                        <span>{{crossMoves.join(' ')}}</span>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex>
                <v-card color="indigo" dark ripple>
                    <v-card-title class="display-2">
                        F2L
                    </v-card-title>
                    <v-card-text class="text-truncate">
                        <v-layout row wrap align-center>
                            <v-flex class="display-2">{{(f2lTime / 1000).toFixed(2)}}</v-flex>
                            <v-flex class="headline text-xs-right">{{(f2liTime / 1000).toFixed(2)}} | {{(f2lsTime / 1000).toFixed(2)}}</v-flex> 
                        </v-layout>
                        <span>{{f2lMoves.join(' ')}}</span>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex>
                <v-card color="cyan" dark ripple>
                    <v-card-title class="display-2">
                        OLL
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap align-center>
                            <v-flex class="display-2">{{(ollTime / 1000).toFixed(2)}}</v-flex>
                            <v-flex class="headline text-xs-right">{{(olliTime / 1000).toFixed(2)}} | {{(ollsTime / 1000).toFixed(2)}}</v-flex> 
                        </v-layout>
                        <span>{{ollMoves.join(' ')}}</span>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex>
                <v-card color="deep-purple" dark ripple>
                    <v-card-title class="display-2">
                        PLL
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap align-center>
                            <v-flex class="display-2">{{(pllTime / 1000).toFixed(2)}}</v-flex>
                            <v-flex class="headline text-xs-right">{{(plliTime / 1000).toFixed(2)}} | {{(pllsTime / 1000).toFixed(2)}}</v-flex> 
                        </v-layout>
                        <span>{{pllMoves.join(' ')}}</span>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import { Cube } from '@/classes/cube'

enum Stage {
    none,
    cross,
    f2li,
    f2l,
    olli,
    oll,
    plli,
    pll
} 

@Component
export default class CFOP extends Vue {
    private startTime = 0
    private interval = 0

    private stage: Stage = Stage.none

    private crossTime = 0.0
    private crossMoves: string[] = []
    private cross = 0

    private f2lTime = 0.0
    private f2liTime = 0.0
    private f2lsTime = 0.0
    private f2lMoves: string[] = []

    private ollTime = 0.0
    private olliTime = 0.0
    private ollsTime = 0.0
    private ollMoves: string[] = []

    private pllTime = 0.0
    private plliTime = 0.0
    private pllsTime = 0.0
    private pllMoves: string[] = []

    private crossColors = [
        { letter: '-', color: '-', text: '-' },
        { letter: 'G', color: 'green', text: 'green' },
        { letter: 'Y', color: 'yellow', text: 'yellow' },
        { letter: 'P', color: 'pink', text: 'pink' },
        { letter: 'W', color: 'grey lighten-1', text: 'white' },
        { letter: 'R', color: 'red', text: 'red' },
        { letter: 'B', color: 'blue', text: 'blue' }
    ]

    private mounted() {
        EventHub.$on(Events.cubeScrambled, () => this.onCubeScrambled())
        EventHub.$on(Events.solveStarted, (st: number) => this.onSolveStarted(st))
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
        EventHub.$on(Events.cubeSolved, () => this.onCubeSolved())
    }

    private onCubeScrambled() {
        this.cross = this.crossTime = 0.0
        this.crossMoves = []

        this.f2lTime = this.f2liTime = this.f2lsTime = 0.0
        this.f2lMoves = []

        this.ollTime = this.olliTime = this.ollsTime = 0.0
        this.ollMoves = []

        this.pllTime = this.plliTime = this.pllsTime = 0.0
        this.pllMoves = []

        this.stage = Stage.cross
    }

    private onSolveStarted(st: number) {
        this.startTime = st
        this.interval = window.setInterval(() => this.onTimer(), 10)
    }

    private onCubeState(state: Uint8Array) {
        if (this.stage === Stage.none) {
            return
        }

        let handled = this.handleCross(state)
        if (!handled) {
            handled = this.handleF2l(state)
        }
        if (!handled) {
            handled = this.handleOll(state)
        }
        if (!handled) {
            handled = this.handlePll(state)
        }
    }

    private onTimer() {
        if (this.stage === Stage.cross) {
            this.crossTime = Date.now() - this.startTime
        } else if (this.stage === Stage.f2li) {
            this.f2lTime = this.f2liTime = Date.now() - this.startTime - this.crossTime
        } else if (this.stage === Stage.f2l) {
            this.f2lTime = Date.now() - this.startTime - this.crossTime
            this.f2lsTime = Date.now() - this.startTime - this.crossTime - this.f2liTime
        } else if (this.stage === Stage.olli) {
            this.ollTime = this.olliTime = Date.now() - this.startTime - this.crossTime - this.f2lTime
        } else if (this.stage === Stage.oll) {
            this.ollTime = Date.now() - this.startTime - this.crossTime - this.f2lTime
            this.ollsTime = Date.now() - this.startTime - this.crossTime - this.f2lTime - this.olliTime
        } else if (this.stage === Stage.plli) {
            this.pllTime = this.plliTime = Date.now() - this.startTime - this.crossTime - this.f2lTime - this.ollTime
        } else if (this.stage === Stage.pll) {
            this.pllTime = Date.now() - this.startTime - this.crossTime - this.f2lTime - this.ollTime
            this.pllsTime = Date.now() - this.startTime - this.crossTime - this.f2lTime - this.ollTime - this.plliTime
        } 
    }

    private onCubeSolved() {
        this.stage = Stage.none
        window.clearInterval(this.interval)
        this.interval = 0
    }

    private handleCross(state: Uint8Array): boolean {
        if (this.stage !== Stage.cross) {
            return false
        }

        const cube = Cube.from(state)
        this.crossMoves = this.optimizeMoves([...this.crossMoves, cube.lastmove()])

        if (cube.cross()) {
            this.cross = cube.cross()
            this.crossTime = Date.now() - this.startTime
            this.stage = Stage.f2li
        }

        return true
    }

    private handleF2l(state: Uint8Array): boolean {
        if (this.stage === Stage.f2li) {
            this.f2liTime = Date.now() - this.startTime - this.crossTime
            this.stage = Stage.f2l
        }

        if (this.stage !== Stage.f2l) {
            return false
        }

        const cube = Cube.from(state)
        this.f2lMoves = this.optimizeMoves([...this.f2lMoves, cube.lastmove()])

        if (cube.f2l()) {
            this.f2lTime = Date.now() - this.startTime - this.crossTime
            this.f2lsTime = this.f2lTime - this.f2liTime
            this.stage = Stage.olli
        }

        return true
    }

    private handleOll(state: Uint8Array): boolean {
        if (this.stage === Stage.olli) {
            this.olliTime = Date.now() - this.startTime - this.crossTime - this.f2lTime
            this.stage = Stage.oll
        }

        if (this.stage !== Stage.oll) {
            return false
        }

        const cube = Cube.from(state)
        this.ollMoves = this.optimizeMoves([...this.ollMoves, cube.lastmove()])

        if (cube.oll()) {
            this.ollTime = Date.now() - this.startTime - this.crossTime - this.f2lTime
            this.ollsTime = this.ollTime - this.olliTime
            this.stage = Stage.plli
        }

        return true
    }

    private handlePll(state: Uint8Array): boolean {
        if (this.stage === Stage.plli) {
            this.plliTime = Date.now() - this.startTime - this.crossTime - this.f2lTime - this.ollTime
            this.stage = Stage.pll
        }

        if (this.stage !== Stage.pll) {
            return false
        }

        const cube = Cube.from(state)
        this.pllMoves = this.optimizeMoves([...this.pllMoves, cube.lastmove()])

        if (cube.solved()) {
            this.pllTime = Date.now() - this.startTime - this.crossTime - this.f2lTime - this.ollTime
            this.pllsTime = this.pllTime - this.plliTime
            this.stage = Stage.none
        }

        return true
    }

    private optimizeMoves(moves: string[]): string[] {
        let m: string[] = []
        for (let i = 0; i < moves.length; i++) {
            m.push((i < (moves.length - 1) && (moves[i][0] === moves[i + 1][0])) ? moves[i++][0] + '2' : moves[i])
        }

        return m
    }
}
</script>
