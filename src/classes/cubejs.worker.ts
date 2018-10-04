// tslint:disable:no-var-requires
const cubejs = require('cubejs')
require('cubejs/lib/solve.js')

const ctx: Worker = self as any
let initialized = false

ctx.onmessage = (event: MessageEvent) => {
    switch (event.data.cmd) {
        case 'init':
            cubejs.initSolver()
            initialized = true
            ctx.postMessage({ cmd: 'init', done: true })
            break
        case 'scramble':
            if (!initialized) {
                cubejs.initSolver()
            }
            const s = cubejs.scramble()
            ctx.postMessage({ cmd: 'scramble', scramble: s})
            break
    }
}
