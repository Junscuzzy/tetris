/** @jsx jsx */
import { Container, Heading, jsx } from 'theme-ui'

import image from './background.jpg'
import { ObjectOfStyles } from '../common/types'
import Game from '../features/game/Game'

const styles: ObjectOfStyles = {
    root: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `url(${image})`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },
    paper: {
        py: 5,
        px: 4,
        backgroundColor: 'background',
    },
    title: {
        fontSize: 6,
        textAlign: 'center',
        textTransform: 'uppercase',
        mb: 4,
    },
}

function App() {
    return (
        <div sx={styles.root}>
            <Container>
                <div sx={styles.paper}>
                    <Heading sx={styles.title} color="primary">
                        Tetris game
                    </Heading>

                    <Game />
                </div>
            </Container>
        </div>
    )
}

export default App
