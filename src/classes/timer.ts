const Marks = {
    start: 'mark-start',
    inspection: 'mark-inspection',
    cross: 'mark-cross',
    f2l1Inspection: 'mark-f2l1i',
    f2l1Solve: 'mark-f2l1s',
    f2l2Inspection: 'mark-f2l2i',
    f2l2Solve: 'mark-f2l2s',
    f2l3Inspection: 'mark-f2l3i',
    f2l3Solve: 'mark-f2l3s',
    f2l4Inspection: 'mark-f2l4i',
    f2l4Solve: 'mark-f2l4s',
    ollInspection: 'mark-olli',
    ollSolve: 'mark-olls',
    pllInspection: 'mark-plli',
    pllSolve: 'mark-plls',
    solved: 'mark-solved'
}

const Measurements = {
    inspection: 'meas-inspection',
    cross: 'meas-cross',
    f2l1Inspection: 'meas-f2l1i',
    f2l1Solve: 'meas-f2l1s',
    f2l2Inspection: 'meas-f2l2i',
    f2l2Solve: 'meas-f2l2s',
    f2l3Inspection: 'meas-f2l3i',
    f2l3Solve: 'meas-f2l3s',
    f2l4Inspection: 'meas-f2l4i',
    f2l4Solve: 'meas-f2l4s',
    ollInspection: 'meas-olli',
    ollSolve: 'meas-olls',
    pllInspection: 'meas-plli',
    pllSolve: 'meas-plls',
    auf: 'meas-auf',
    solved: 'meas-solved'
}

export default class Timer {
    public static cubeScrambled() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] cube scrambled')
        window.performance.clearMarks()
        window.performance.clearMeasures()
        window.performance.mark(Marks.start)
    }

    public static crossStarted() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] cross started')
        window.performance.mark(Marks.inspection)
        window.performance.measure(Measurements.inspection, Marks.start, Marks.inspection)
    }

    public static crossSolved() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] cross solved')
        window.performance.mark(Marks.cross)
        window.performance.measure(Measurements.cross, Marks.inspection, Marks.cross)
    }

    public static f2l1Started() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] F2L #1 started')
        window.performance.mark(Marks.f2l1Inspection)
        window.performance.measure(Measurements.f2l1Inspection, Marks.cross, Marks.f2l1Inspection)
    }

    public static f2l1Solved() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] F2L #1 solved')
        window.performance.mark(Marks.f2l1Solve)
        window.performance.measure(Measurements.f2l1Solve, Marks.f2l1Inspection, Marks.f2l1Solve)
    }

    public static f2l2Started() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] F2L #2 started')
        window.performance.mark(Marks.f2l2Inspection)
        window.performance.measure(Measurements.f2l2Inspection, Marks.f2l1Solve, Marks.f2l2Inspection)
    }

    public static f2l2Solved() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] F2L #2 solved')
        window.performance.mark(Marks.f2l2Solve)
        window.performance.measure(Measurements.f2l2Solve, Marks.f2l2Inspection, Marks.f2l2Solve)
    }

    public static f2l3Started() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] F2L #3 started')
        window.performance.mark(Marks.f2l3Inspection)
        window.performance.measure(Measurements.f2l3Inspection, Marks.f2l2Solve, Marks.f2l3Inspection)
    }

    public static f2l3Solved() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] F2L #3 solved')
        window.performance.mark(Marks.f2l3Solve)
        window.performance.measure(Measurements.f2l3Solve, Marks.f2l3Inspection, Marks.f2l3Solve)
    }

    public static f2l4Started() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] F2L #4 started')
        window.performance.mark(Marks.f2l4Inspection)
        window.performance.measure(Measurements.f2l4Inspection, Marks.f2l3Solve, Marks.f2l4Inspection)
    }

    public static f2l4Solved() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] F2L #4 solved')
        window.performance.mark(Marks.f2l4Solve)
        window.performance.measure(Measurements.f2l4Solve, Marks.f2l4Inspection, Marks.f2l4Solve)
    }

    public static ollStarted() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] OLL started')
        window.performance.mark(Marks.ollInspection)
        window.performance.measure(Measurements.ollInspection, Marks.f2l4Solve, Marks.ollInspection)
    }

    public static ollSolved() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] OLL solved')
        window.performance.mark(Marks.ollSolve)
        window.performance.measure(Measurements.ollSolve, Marks.ollInspection, Marks.ollSolve)
    }

    public static pllStarted() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] PLL started')
        window.performance.mark(Marks.pllInspection)
        window.performance.measure(Measurements.pllInspection, Marks.ollSolve, Marks.pllInspection)
    }

    public static pllSolved() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] PLL solved')
        window.performance.mark(Marks.pllSolve)
        window.performance.measure(Measurements.pllSolve, Marks.pllInspection, Marks.pllSolve)
    }

    public static cubeSolved() {
        console.log('[' + (window.performance.now() / 1000).toFixed(3) + '] cube solved')
        window.performance.mark(Marks.solved)
        window.performance.measure(Measurements.solved, Marks.inspection, Marks.solved)
        window.performance.measure(Measurements.auf, Marks.pllSolve, Marks.solved)
    }

    public static getInspectionTime(): number {
        return Timer.getTime(Measurements.inspection, Marks.start)
    }

    public static getCrossSolveTime(): number {
        return Timer.getTime(Measurements.cross, Marks.inspection)
    }

    public static getF2l1InspectionTime(): number {
        return Timer.getTime(Measurements.f2l1Inspection, Marks.cross)
    }

    public static getF2l1SolveTime(): number {
        return Timer.getTime(Measurements.f2l1Solve, Marks.f2l1Inspection)
    }

    public static getF2l2InspectionTime(): number {
        return Timer.getTime(Measurements.f2l2Inspection, Marks.f2l1Solve)
    }

    public static getF2l2SolveTime(): number {
        return Timer.getTime(Measurements.f2l2Solve, Marks.f2l2Inspection)
    }

    public static getF2l3InspectionTime(): number {
        return Timer.getTime(Measurements.f2l3Inspection, Marks.f2l2Solve)
    }

    public static getF2l3SolveTime(): number {
        return Timer.getTime(Measurements.f2l3Solve, Marks.f2l3Inspection)
    }

    public static getF2l4InspectionTime(): number {
        return Timer.getTime(Measurements.f2l4Inspection, Marks.f2l3Solve)
    }

    public static getF2l4SolveTime(): number {
        return Timer.getTime(Measurements.f2l4Solve, Marks.f2l4Inspection)
    }

    public static getOllInspectionTime(): number {
        return Timer.getTime(Measurements.ollInspection, Marks.f2l4Solve)
    }

    public static getOllSolveTime(): number {
        return Timer.getTime(Measurements.ollSolve, Marks.ollInspection)
    }

    public static getPllInspectionTime(): number {
        return Timer.getTime(Measurements.pllInspection, Marks.ollSolve)
    }

    public static getPllSolveTime(): number {
        return Timer.getTime(Measurements.pllSolve, Marks.pllInspection)
    }

    public static getAUFTime(): number {
        return Timer.getTime(Measurements.auf, Marks.pllSolve)
    }

    public static getSolveTime(): number {
        return Timer.getTime(Measurements.solved, Marks.inspection)
    }

    private static getEntry(name: string): number {
        const marks = window.performance.getEntriesByName(name)
        return marks.length ? (marks[0].duration || marks[0].startTime) : 0
    }

    private static getTime(measurement: string, mark: string): number {
        const measurementTime = Timer.getEntry(measurement)
        const markTime = Timer.getEntry(mark)
        return measurementTime || (markTime ? window.performance.now() - markTime : 0)
    }
}
