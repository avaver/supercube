import { Colors, Faces, OppositeColors, OppositeFaces } from '@/classes/cube-state-data'

export function colorToFace(color: string): string {
    return Faces[Colors.indexOf(color)]
}

export function faceToColor(face: string): string {
    return Colors[Faces.indexOf(face)]
}

export function oppositeColor(color: string): string {
    return OppositeColors[Colors.indexOf(color)]
}

export function oppositeFace(face: string): string {
    return OppositeFaces[Faces.indexOf(face)]
}
