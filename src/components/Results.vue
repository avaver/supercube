<template>
  <v-data-table
    :headers="headers"
    :items="results"
    :hide-actions="true"
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.scramble }}</td>
      <td class="text-xs-center">{{ props.item.cross.toFixed(2) }}</td>
      <td class="text-xs-center">{{ props.item.f2l.toFixed(2) }}</td>
      <td class="text-xs-center">{{ props.item.oll.toFixed(2) }}</td>
      <td class="text-xs-center">{{ props.item.pll.toFixed(2) }}</td>
      <td class="text-xs-center">{{ props.item.auf.toFixed(2) }}</td>
      <td class="text-xs-center">{{ props.item.turns }}</td>
      <td class="text-xs-center">{{ props.item.tps }}</td>
      <td class="text-xs-center">{{ props.item.time.toFixed(2) }}</td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Timer from '@/classes/timer'
import GameState from '@/classes/game-state'

@Component
export default class Results extends Vue {
    @Prop()
    private game!: GameState

    private localStorageKey = 'results'

    private headers = [
      {
        text: 'Scramble',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Cross', value: 'cross', align: 'center' },
      { text: 'F2L', value: 'f2l', align: 'center' },
      { text: 'OLL', value: 'oll', align: 'center' },
      { text: 'PLL', value: 'pll', align: 'center' },
      { text: 'AUF', value: 'auf', align: 'center' },
      { text: 'Turns', value: 'turns', align: 'center' },
      { text: 'TPS', value: 'tps', align: 'center' },
      { text: 'Time', value: 'time', align: 'center', sortable: true }
    ]

    private results: object[] = []

    private mounted() {
        EventHub.$on(Events.cubeSolved, () => this.onCubeSolved())

        this.loadResults()
    }

    private seconds(milliseconds: number): number {
      return milliseconds / 1000
    }

    private onCubeSolved() {
        this.results.unshift({
            scramble: this.game.scramble.join(' ') || 'Unknown',
            cross: this.seconds(Timer.getCrossSolveTime()),
            f2l: this.seconds(Timer.getF2l1SolveTime()),
            oll: this.seconds(Timer.getOllSolveTime()),
            pll: this.seconds(Timer.getPllSolveTime()),
            auf: this.seconds(Timer.getAUFTime()),
            turns: this.game.turns,
            tps: this.game.tps(),
            time: this.game.time / 1000
        })
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.results))
    }

    private loadResults() {
      try {
        const value = localStorage.getItem(this.localStorageKey)

        if (value) {
          this.results = JSON.parse(value)
        }
      } catch (Exception) {
        this.results = []
      }
    }
}
</script>
