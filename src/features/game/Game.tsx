/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */
import { FC, Fragment, useEffect } from 'react'
import { Grid, jsx, Flex, Heading } from 'theme-ui'
import { useSelector, useDispatch } from 'react-redux'

import { RootState } from '../../app/store'

import useInterval from '../../common/hooks/useInterval'
import { Styles } from '../../common/types'
import { canvasSize, cols } from '../../common/config'
import PostIt from '../../common/components/PostIt'

import Canvas from '../canvas/Canvas'

import MenuBar from './MenuBar'
import Keyboard from './Keyboard'
import Statistics from './Statistics'
import { getRandomShapeOptions } from './utils'
import * as actions from './module'

const style: Styles = {
    canvasWrap: {
        ...canvasSize,
        width: '100%',
        position: 'relative',
        justifyContent: 'center',
    },
    aside: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        px: 4,
    },
    gameOver: {
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        textAlign: 'center',
    },
}

const Game: FC<{}> = () => {
    const game = useSelector((state: RootState) => state.game)
    const dispatch = useDispatch()

    // Merge archived shapes with currentShape
    const allShapes = game.currentShape
        ? [...game.shapes, game.currentShape]
        : game.shapes

    const createNewShape = () => {
        dispatch(actions.createShape(getRandomShapeOptions()))
    }

    const toggleGaming = () => {
        dispatch(game.isGaming ? actions.resetGame() : actions.newGame())
    }

    const togglePlay = () => {
        dispatch(game.isTimeRunning ? actions.pause() : actions.play())
    }

    // Launch the timer
    useInterval(
        () => {
            dispatch(actions.setTime(game.tick + 1))
        },
        game.isTimeRunning ? game.tickSpeed : null,
    )

    // Move shape to bottom using timer
    useEffect(() => {
        dispatch(actions.moveBottom())
    }, [game.tick])

    // Check if has entire line and remove it
    useEffect(() => {
        let removedLines = 0
        const countByY: Record<string, number> = {}
        game.shapes.forEach(({ rects }) => {
            rects.forEach(({ y }) => {
                countByY[y] = countByY[y] ? countByY[y] + 1 : 1
                if (countByY[y] === cols) {
                    dispatch(actions.removeLine(y))
                    removedLines += 1
                }
            })
        })

        // increment the score
        if (removedLines) {
            switch (removedLines) {
                case 1:
                    dispatch(actions.incrementScore(100))
                    break
                case 2:
                    dispatch(actions.incrementScore(300))
                    break
                case 3:
                    dispatch(actions.incrementScore(500))
                    break
                case 4:
                    dispatch(actions.incrementScore(800))
                    break
                default:
                    break
            }
        }
    }, [game.shapes])

    // Create the new shape
    useEffect(() => {
        if (game.isGaming && typeof game.currentShape === 'undefined') {
            createNewShape()
        }
    }, [game.isGaming, game.currentShape])

    return (
        <Fragment>
            {game.isTimeRunning && !game.gameOver && <Keyboard />}

            <Grid columns={2}>
                <Flex opacity={game.gameOver ? 0.5 : 1} sx={style.canvasWrap}>
                    <Canvas shapes={allShapes} />
                    {game.gameOver && (
                        <Heading sx={style.gameOver}>Game over</Heading>
                    )}
                </Flex>

                <Flex as="aside" sx={style.aside}>
                    <MenuBar
                        isGaming={game.isGaming}
                        isTimeRunning={game.isTimeRunning}
                        onTogglePlay={togglePlay}
                        onToggleGaming={toggleGaming}
                    />

                    <PostIt
                        primary="Welcome to the Tetris Game!"
                        secondary="Use keyboard arrows to move shapes and ArrowTop to rotate."
                    />

                    <Statistics
                        isTimeRunning={game.isTimeRunning}
                        isGaming={game.isGaming}
                        score={game.score}
                        level={game.level}
                        lines={game.lines}
                    />
                </Flex>
            </Grid>
        </Fragment>
    )
}

export default Game
