<template>
    <v-layout justify-start align-center column v-if="enabled">
        <v-flex xs12>
            <v-card v-if="working">
                <v-card-title>
                    <h3>{{operation}}</h3>
                    <v-progress-linear :indeterminate="true"></v-progress-linear>
                </v-card-title>
            </v-card>
            <v-card v-else>
                <v-card-title class="headline">
                    <!--<v-checkbox v-model="simple" label="simple" @change="generateScrabmle"></v-checkbox>-->
                    <v-layout row wrap align-center>
                        <v-flex>
                            <v-btn flat icon color="primary" @click="generateScrabmle">
                                <v-icon>refresh</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex>
                            <v-checkbox v-model="simple" @change="generateScrabmle" style="margin-top: 20px !important"></v-checkbox>
                        </v-flex>
                        <v-flex v-for="(move, index) in scramble" :key="index" :class="[{'grey--text': position > index}]">
                            {{move}}
                        </v-flex>
                        <v-flex>
                            <v-icon class="scramble_info" style="cursor: pointer; line-height: 28px!important" @click.native.stop="tooltip = !tooltip">info</v-icon>
                            <v-tooltip bottom open-delay="0" v-model="tooltip" activator=".scramble_info">
                                <span>U is WHITE and F is BLUE</span>
                            </v-tooltip>
                        </v-flex>
                    </v-layout>
                </v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Worker from 'worker-loader!@/classes/cubejs.worker'
import * as Cubejs from 'cubejs'
import { Cube } from '@/classes/cube'

@Component
export default class Scramble extends Vue {
    private enabled = true
    private working = false
    private tooltip = false
    private simple = false

    private operation = ''
    private scramble: string[] = []
    private position = 0

    private worker = new Worker();

    private mounted() {
        this.worker.onmessage = (event: MessageEvent) => { 
            switch (event.data.cmd) {
                case 'init':
                    EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
                    EventHub.$on(Events.cubeSolved, () => this.generateScrabmle())
                    this.generateScrabmle()
                    break
                case 'scramble':
                    this.scramble = []
                    this.position = 0
                    event.data.scramble.split(' ').forEach((s: string) => this.scramble.push(s))
                    if (this.simple) {
                        this.scramble = this.scramble.slice(0, Math.floor(this.scramble.length / 2))
                    }
                    this.stopOperation()
                    break
            }
        }

        this.startOperation('Initializing scrambler...')
        this.worker.postMessage({ cmd: 'init'})
    }

    private generateScrabmle() {
        this.enabled = true
        this.startOperation('Generating scramble...')
        this.worker.postMessage({ cmd: 'scramble'})
    }

    private onCubeState(state: Uint8Array) {
        if (!this.scrambleAvailable() || this.scrambleCompleted()) {
            return
        }

        const a = this.scramble.slice(0, this.position + 1)
        const eCube: Cubejs = Cubejs.random()
        const aCube = new Cube()
        eCube.identity()
        eCube.move(a.join(' '))
        aCube.set(state)

        if (eCube.asString() === aCube.vcs) {
            this.position++
            if (this.scrambleCompleted()) {
                EventHub.$emit(Events.cubeScrambled, this.scramble.join(' '))
                this.enabled = false
            }
        }
    }

    private startOperation(message: string) {
        this.operation = message
        this.working = true
    }

    private stopOperation() {
        this.working = false
    }

    private scrambleAvailable() {
        return this.scramble.length > 0    
    }

    private scrambleCompleted() {
        return this.scramble.length > 0 && this.scramble.length === this.position
    }
}
</script>

<style>
</style>
