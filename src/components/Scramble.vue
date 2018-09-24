<template>
    <v-layout justify-start align-center column>
        <v-flex xs12 sm6>
            <v-card v-if="working">
                <v-card-title>
                    <h3>Initializing scrambler...</h3>
                    <v-progress-linear :indeterminate="true"></v-progress-linear>
                </v-card-title>
            </v-card>
            <v-card v-else>
                <v-card-title class="display-1"><span v-for="step in scramble">{{step.move}}</span></v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Worker from 'worker-loader!@/classes/cubejs.worker'

@Component
export default class Scramble extends Vue {
    private working = false
    private operation = ''
    private scramble: Array<{move: string, done: boolean}> = []

    private mounted() {
        const worker = new Worker();
        worker.onmessage = (event: MessageEvent) => { 
            console.log('[scrambler] ' + JSON.stringify(event.data))
            switch (event.data.cmd) {
                case 'init':
                    this.startOperation('Generating scramble...')
                    worker.postMessage({ cmd: 'scramble'})
                    break
                case 'scramble':
                    // this.scramble = event.data.scramble
                    this.setScramble(event.data.scramble)
                    this.stopOperation()
                    break
            }
        }
        worker.postMessage({ cmd: 'init'})
        this.startOperation('Initializing scrambler...')
    }

    private setScramble(stringScramble: string) {
        stringScramble.split(' ').forEach(s => this.scramble.push({ move: s, done: false }))
    }

    private startOperation(message: string) {
        this.operation = message
        this.working = true
    }

    private stopOperation() {
        this.working = false
    }
}
</script>

<style>
</style>
