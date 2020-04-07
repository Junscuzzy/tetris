import { rgba } from 'polished'

import { Shape } from '../../common/types'
import theme from '../../common/theme'
import { unit, canvasSize, cols, rows } from '../../common/config'

const { width, height } = canvasSize

// Clean the canvas
const clear = (ctx: any) => () =>
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

// Draw the Grid
const drawGrid = (ctx: any) => () => {
    const lineSize = 0.5
    ctx.fillStyle = rgba(theme.colors.red, 0.67)

    // Draw rows
    for (let i = 1; i < rows; i++) {
        ctx.fillRect(0, i * unit - lineSize / 2, width, lineSize)
    }

    // Draw Columns
    for (let i = 1; i < cols; i++) {
        ctx.fillRect(i * unit - lineSize / 2, 0, lineSize, height)
    }
}

// Draw one shape
const drawShape = (ctx: any) => (shape: Shape): void => {
    const { color, rects } = shape
    if (color) {
        ctx.fillStyle = color
    }
    if (rects) {
        rects.forEach(({ x, y }) => {
            ctx.fillRect(x, y, unit, unit)
        })
    }
}

// Draw All shapes
const drawShapes = (ctx: any) => (shapes: Shape[]): void => {
    if (ctx && shapes) {
        shapes.forEach((shape) => {
            drawShape(ctx)(shape)
        })
    }
}

const drawer = (ctx: any) => ({
    clear: clear(ctx),
    grid: drawGrid(ctx),
    shapes: drawShapes(ctx),
})

export default drawer
