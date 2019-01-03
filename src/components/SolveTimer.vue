<template>
    <v-layout justify-start align-center column>
        <v-flex>
            <v-flex class="display-4 font-weight-bold main_timer" style="text-align: center">
                <span>{{(game.time / 1000).toFixed(3)}}</span>
                <div class="cancel">
                    <v-btn icon ripple @click="game.cancel()" v-show="game.active">
                        <v-icon large color="accent">cancel</v-icon>
                    </v-btn>
                </div>
            </v-flex>
                <v-flex class="text-xs-center">
                    <v-chip color="blue-grey" text-color="white">
                        <v-avatar class="blue-grey darken-4">{{game.turns}}</v-avatar>
                        turns
                        <!--<v-icon right color="green accent-2">arrow_drop_up</v-icon>-->
                    </v-chip><span class="spacer"></span>
                    <v-chip color="blue-grey" text-color="white">
                        <v-avatar class="blue-grey darken-4">{{game.tps()}}</v-avatar>
                        TPS
                        <!--<v-icon right color="yellow">star</v-icon>-->
                    </v-chip>
                </v-flex>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Timer from '@/classes/timer'
import CubeState from '@/classes/cube-state'
import GameState from '@/classes/game-state'

@Component
export default class SolveTimer extends Vue {
    @Prop()
    private game!: GameState
}
</script>

<style scoped>
.cancel {
    display: inline-block;
    position: absolute;
    padding-left: 20px;
}

.spacer {
    display:inline-block;
    width:50px;
}
</style>
