import './App.scss';
import { useRef, useState } from "react";
import Game from "./pages/Game";
import Admin from "./pages/Admin";

function App() {
    const gameIdRef = useRef(null)

    const [isNewGame, setIsNewGame] = useState(false)
    const [disableJoinButton, setDisableJoinButton] = useState(false)
    const [gameId, setGameId] = useState('')

    const handleSubmitGame = async (e) => {
        e.preventDefault()
        setGameId(gameIdRef.current.value)
        setDisableJoinButton(true)
    }
    const handleClickNewGame = () => {
        setIsNewGame(!isNewGame)
        setDisableJoinButton(false)
    }
    const renderPage = () => {
        if (isNewGame) {
            return <Admin/>
        }
        if (gameId) {
            return <Game gameId={gameId}/>
        }
    }
    return (
        <div className="App">
            <div className="header">
                <form onSubmit={handleSubmitGame}>
                    <input ref={gameIdRef} type="text" name={'gameId'} required placeholder={'gameId'}/>
                    <button type={'submit'} disabled={disableJoinButton}>Присоединиться к игре</button>
                </form>
                <button onClick={handleClickNewGame}>Создать игру</button>
            </div>
            <div className="body">
                {renderPage()}
            </div>
        </div>
    );
}

export default App;
