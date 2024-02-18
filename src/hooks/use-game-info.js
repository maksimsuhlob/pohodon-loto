import { useEffect, useState } from "react";
import { off, onValue } from "firebase/database";
import { getGameRef } from "../firebase/config";

export const useGameInfo = (gameId) => {
    const [gameInfo, setGameInfo] = useState(null)

    useEffect(() => {
        if (gameId) {
            onValue(getGameRef(gameId), (snapshot) => {
                const data = snapshot.val();
                setGameInfo(data)
            });
        }
        return () => {
            off(getGameRef(gameId))
        }
    }, [gameId]);
    return gameInfo
}
