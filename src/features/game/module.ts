import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Quarter, Shape } from '../../common/types'
import { unit, canvasSize } from '../../common/config'
import { getShape } from './shapes'

interface UserState {
    currentShape?: Shape
    isPlaying: boolean
    shapes: Shape[]
}

const initialState: UserState = {
    currentShape: undefined,
    shapes: [],
    isPlaying: false,
}

const game = createSlice({
    name: 'game',
    initialState,
    reducers: {
        createShape(state, action: PayloadAction<Shape>) {
            if (!state.isPlaying) {
                state.isPlaying = true
            }

            // Archive current shape in "static shapes array"
            if (typeof state.currentShape !== 'undefined') {
                state.shapes = [state.currentShape, ...state.shapes]
            }

            // Set the new shape from payload
            state.currentShape = action.payload
        },
        resetGame() {
            return initialState
        },
        rotate(state) {
            if (!state?.currentShape) {
                return state
            }

            const { location, type } = state.currentShape

            const quarterToNum = Number(state.currentShape.quarter)
            const quarter = `${
                quarterToNum < 3 ? quarterToNum + 1 : 0
            }` as Quarter

            // It can be without the canvas area
            const shape = getShape({ location, type, quarter })

            // Right wall touched
            if (location.x >= canvasSize.width - shape.width) {
                shape.location.x = canvasSize.width - shape.width
            }

            state.currentShape = shape
        },
        moveLeft(state) {
            if (!state?.currentShape) {
                return state
            }

            const shape = state.currentShape
            const { x } = shape.location

            // Left wall touched
            if (x <= 0) {
                return state
            }

            state.currentShape.location.x = x - unit
        },
        moveRight(state) {
            if (!state?.currentShape) {
                return state
            }

            const shape = state.currentShape
            const { x } = shape.location

            // Right wall touched
            if (x >= canvasSize.width - shape.width) {
                return state
            }

            state.currentShape.location.x = x + unit
        },
        moveBottom(state) {
            if (!state?.currentShape) {
                return state
            }

            const shape = state.currentShape
            const { y } = shape.location

            // Bottom touched
            if (y >= canvasSize.height - shape.height) {
                return state
            }

            state.currentShape.location.y = y + unit
        },
    },
})

export const {
    createShape,
    resetGame,
    rotate,
    moveLeft,
    moveRight,
    moveBottom,
} = game.actions

export default game.reducer
