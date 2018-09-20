import '@babel/polyfill'
import './plugins/vuetify'
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
new Vue({ render: (h) => h(App) }).$mount('#app')

declare global {
    interface Uint8Array {
        splitBytes: (start: number, count: number) => Uint8Array,
        splitBits: (start: number, count: number) => Uint8Array,
        toHexString: () => string
    }
}

Uint8Array.prototype.splitBytes = function(start: number, count: number): Uint8Array {
    return this.slice(start, start + count).reduce((b, x, i) => {
        // tslint:disable:no-bitwise
        b[i * 2] = x >> 4
        b[i * 2 + 1] = x & 0xf
        // tslint:enable:no-bitwise
        return b
    }, new Uint8Array((count) * 2))
}

Uint8Array.prototype.splitBits = function(start: number, count: number): Uint8Array {
    let s = ''
    for (let i = start; i < (start + count); i++) {
        s += this[i].toString(2).padStart(8, '0')
    }
    return Uint8Array.from(s.split('').map(parseInt))
}

Uint8Array.prototype.toHexString = function(): string {
    return Array.from(this).map((b) => b.toString(16).padStart(2, '0')).join('-')
}
