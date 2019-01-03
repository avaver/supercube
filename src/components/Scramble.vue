<template>
    <v-layout justify-start align-center column v-if="game.scrambling">
        <v-flex xs12 class="card-scramble">
            <v-card v-if="game.working">
                <v-card-title>
                    <h3>{{game.operation}}</h3>
                    <v-progress-linear :indeterminate="true"></v-progress-linear>
                </v-card-title>
            </v-card>
            <v-card v-else>
                <v-card-title class="headline">
                    <v-layout row wrap align-center>
                        <v-flex>
                            <v-btn flat icon color="primary" @click="game.generateScramble()">
                                <v-icon>refresh</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex v-for="(move, index) in game.scramble" :key="index" :class="[{'grey--text': game.position > index}]">
                            {{move}}
                        </v-flex>
                        <v-flex>
                            <v-icon class="scramble_info" style="cursor: pointer; line-height: 28px!important" @click.native.stop="tooltip = !tooltip">info</v-icon>
                            <v-tooltip bottom open-delay="0" v-model="tooltip" activator=".scramble_info">
                                <span class="subheading">
                                    - <kbd>U</kbd> is <strong>white</strong> and <kbd>F</kbd> is <strong>green</strong><br/>
                                    - <kbd>{{game.solveTrigger.join(' ')}}</kbd> to start solve without completing the scramble
                                </span>
                            </v-tooltip>
                        </v-flex>
                    </v-layout>
                </v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Timer from '@/classes/timer'
import Worker from 'worker-loader!@/classes/cubejs.worker'
import CubeState from '@/classes/cube-state'
import GameState from '@/classes/game-state'

@Component
export default class Scramble extends Vue {
    @Prop()
    private game!: GameState

    private tooltip = false
}
</script>

<style>
</style>
