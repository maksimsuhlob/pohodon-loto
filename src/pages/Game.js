import { useEffect, useRef, useState } from "react";
import { ref, update } from "firebase/database";
import { fbDatabase } from "../firebase/config";
import { useGameInfo } from "../hooks/use-game-info";

function Game({ gameId }) {
    const nameRef = useRef(null)
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [disableSubmit, setDisableSubmit] = useState(false)
    const gameInfo = useGameInfo(gameId)

    const handleSubmitName = async (e) => {
        e.preventDefault()
        const userName = nameRef.current.value.trim()
        setError('')
        if (gameInfo.members && Object.keys(gameInfo.members).includes(userName)) {
            setError('Игрок с таким именем уже существует')
            return
        }
        setName(userName)
        await update(ref(fbDatabase), {
            [`games/${gameId}/members/${userName}`]: ''
        })
    }
    const handleSubmitTable = async (e) => {
        e.preventDefault()
        setError('')
        setDisableSubmit(true)

        const values = {}
        for (let i = 0; i < gameInfo.matrixSize; i++) {
            for (let j = 0; j < gameInfo.matrixSize; j++) {
                values[`${i}_${j}`] = e.target[`${i}_${j}`].value
            }
        }
        const uniq = new Set(Object.values(values))
        if ([...uniq].length === gameInfo.matrixSize * gameInfo.matrixSize) {
            await update(ref(fbDatabase), {
                [`games/${gameId}/members/${name}`]: { ...values }
            })
            return
        }
        setError('Числа в карточке не должнв повторяться')
        setDisableSubmit(false)
    }
    useEffect(() => {
        if (gameInfo && gameInfo.members && gameInfo.members[name]) {
            const myCard = Object.values(gameInfo.members[name])
            const members = gameInfo.members
            delete members[name]
            const hasSameCard = Object.values(members).reduce((acc, card) => {
                if (!card) return false
                if (acc) {
                    return true
                }

                if (Object.values(card).every((value, idx) => value === myCard[idx])) {
                    return true
                }
                return false
            }, false)

            if (hasSameCard) {
                setError('Такая карточка уже создана другим игроком')
                setDisableSubmit(false)
            }
        }
    }, [gameInfo, name]);

    const createField = () => {
        if (!gameInfo) {
            return <div>Загрузка...</div>
        }
        const field = []
        for (let i = 0; i < gameInfo.matrixSize; i++) {
            const row = []
            for (let j = 0; j < gameInfo.matrixSize; j++) {
                row.push(<input
                    key={`${i}_${j}`}
                    name={`${i}_${j}`}
                    type={"number"}
                    min={1}
                    max={gameInfo.amount}
                    required
                    className={`field__cell`}
                />)
            }
            field.push(<div key={i} className="field__row">{row}</div>)
        }
        return field
    }
    if (!name) {
        return <div className="game">
            <form onSubmit={handleSubmitName}>
                <input ref={nameRef} type="text" name={'name'} required placeholder={'Имя игрока'}/>
                <button type={'submit'}>Сохранить имя</button>
                {error && <div>{error}</div>}
            </form>
        </div>
    }
    return (<div className={'game'}>
        Игрок: {name}
        <form onSubmit={handleSubmitTable} className="field">
            {createField()}
            <button type={'submit'} disabled={disableSubmit}>Сохранить карточку</button>
        </form>
        <div className={'numbers'}>
            <span>Выпавшие номера:</span> {gameInfo?.numbers?.map(item => <span key={item}
                                                                                className={'number'}>{item}</span>)}
        </div>
        {error && <div className={'error'}>{error}</div>}
    </div>)
}

export default Game
