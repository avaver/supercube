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
      <td class="text-xs-center">{{ props.item.tps.toFixed(2) }}</td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Timer from '@/classes/timer'

@Component
export default class Results extends Vue {
    private localStorageKey = 'results'
    private scramble: string[] = []

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
      { text: 'TPS', value: 'tps', align: 'center' }
    ]

    private results = []

    private mounted() {
        EventHub.$on(Events.cubeSolved, () => this.onCubeSolved())
        this.loadResults()
    }

    private seconds(milliseconds: number): number {
      return milliseconds / 1000
    }

    // TODO: We need to extract the information about the current game to be
    // able to fill turns and tps. Something similar with the current scramble.
    private onCubeSolved() {
        this.results.unshift({
            value: false,
            scramble: this.scramble.join(' ') || 'Unknown',
            cross: this.seconds(Timer.getCrossSolveTime()),
            f2l: this.seconds(Timer.getF2l1SolveTime()),
            oll: this.seconds(Timer.getOllSolveTime()),
            pll: this.seconds(Timer.getPllSolveTime()),
            auf: this.seconds(Timer.getAUFTime()),
            turns: 0,
            tps: 0
        })
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.results))
    }

    private loadResults() {
      try {
        const value = localStorage.getItem(this.localStorageKey)

        if (value) {
          this.results = JSON.parse(value)
        }
      } finally {

      }
    }
}
</script>
