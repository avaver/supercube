import * as Cubejs from 'cubejs'
// tslint:disable-next-line:no-var-requires
require('cubejs/lib/solve.js')

const ctx: Worker = self as any
let initialized = false

ctx.onmessage = (event: MessageEvent) => {
    switch (event.data.cmd) {
        case 'init':
            Cubejs.initSolver()
            initialized = true
            ctx.postMessage({ cmd: 'init', done: true })
            break
        case 'scramble':
            if (!initialized) {
                Cubejs.initSolver()
            }
            const s = Cubejs.scramble()
            ctx.postMessage({ cmd: 'scramble', scramble: s})
            break
    }
}
