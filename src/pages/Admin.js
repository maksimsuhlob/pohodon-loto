import { ref, set, update } from "firebase/database";
import { fbDatabase, getGameRef } from "../firebase/config";
import { useEffect, useState } from "react";
import { useGameInfo } from "../hooks/use-game-info";
import { validateField } from "../helpers/field-validation";

function Admin() {
    const [myGameId, setMyGameId] = useState('')
    const [size, setSize] = useState(3)
    const [amount, setAmount] = useState(size * size)
    const [numbers, setNumbers] = useState([])
    const gameInfo = useGameInfo(myGameId)
    const createNewGame = async (e) => {
        e.preventDefault()
        const gameId = new Date().getTime()
        setMyGameId(gameId)
        await set(
            getGameRef(gameId),
            {
                date: new Date().toString(),
                matrixSize: size,
                amount,
                members: null,
            }
        );

    }
    const handleGetNumber = async () => {
        const newNumber = numbers[Math.floor(Math.random() * numbers.length)]
        setNumbers(numbers.filter(item => item !== newNumber))
        const numbersList = gameInfo.numbers ? [...gameInfo.numbers, newNumber] : [newNumber]
        await update(ref(fbDatabase), {
            [`games/${myGameId}/numbers`]: { ...numbersList },
        })
    }
    const createField = (values) => {
        const field = []
        for (let i = 0; i < gameInfo.matrixSize; i++) {
            const row = []
            for (let j = 0; j < gameInfo.matrixSize; j++) {
                row.push(<div key={`${i}_${j}`}
                              className={`card__cell ${gameInfo?.numbers?.includes(Number(values[`${i}_${j}`])) ? 'card__cell--checked' : ''}`}>{values[`${i}_${j}`]}</div>)
            }
            field.push(<div key={i} className="card__row">{row}</div>)
        }
        return field
    }

    const getResults = () => {
        const results = validateField(gameInfo?.members, gameInfo?.numbers)


        return <>
            <div>Собрали строки: {results?.row.map((name) => <span>{name}, </span>)}</div>
            <div>Собрали столбцы: {results?.column.map((name) => <span>{name}, </span>)}</div>
            <div>Собрали диагонали: {results?.diagonal.map((name) => <span>{name}, </span>)}</div>
            <div>Собрали все: {results?.full.map((name) => <span>{name}, </span>)}</div>
        </>
    }

    useEffect(() => {
        if (myGameId) {
            const availableNumbers = []
            for (let i = 0; i < amount; i++) {
                availableNumbers[i] = i + 1
            }
            setNumbers(availableNumbers)
        }
    }, [myGameId]);

    return (<div className={'admin'}>
        <p>Панель владельца игры</p>
        <form onSubmit={createNewGame}>
            <label>
                Размер поля
                <input
                    type="number"
                    name={'size'}
                    min={3}
                    value={size}
                    disabled={!!myGameId}
                    onChange={e => setSize(e.target.value)}
                />
            </label>
            <label>
                Количество боченков
                <input
                    type="number"
                    name={'amount'}
                    min={size * size}
                    disabled={!size || myGameId}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </label>
            <button type={'submit'} disabled={!size || !amount || myGameId}>Начать игру</button>
        </form>
        <strong> ID игры: {myGameId} </strong>
        <div className={'numbers'}>
            <span>Выпавшие номера:</span> {gameInfo?.numbers?.map(item => <span key={item}
                                                                                className={'number'}>{item}</span>)}
        </div>
        <button onClick={handleGetNumber} disabled={!numbers.length}>Вытянуть боченок</button>
        <div className={'resilts'}>
            {getResults()}
        </div>

        <div className={'members'}>
            {
                gameInfo?.members && Object.entries(gameInfo.members).map((member) => {
                    return <div className="card">
                        <div className="card__title">{member[0]}</div>
                        {createField(member[1])}
                    </div>
                })
            }
        </div>
    </div>)
}

export default Admin
