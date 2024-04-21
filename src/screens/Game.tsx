/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import ChessBoard from '../components/ChessBoard'
import { useSocket } from '../hooks/useSocket'
import { Chess } from 'chess.js'
import chessLogo from '../assets/chesslogo.svg'

const INIT_GAME = 'init_game'
export const MOVE = 'move'
const GAME_OVER = 'game_over'

export function Game() {
  const socket = useSocket()
  const [chess, setChess] = useState(() => new Chess())
  const [board, setBoard] = useState(chess.board())
  const [gameStarted, setGameStarted] = useState(false)

  const initializeNewChess = () => {
    const newChess = new Chess()
    // initiate new chess
    // update the board with chess board
    setChess(newChess)
    setBoard(newChess.board())
  }

  const resetChessBoard = () => {
    initializeNewChess()
    setGameStarted(false)
  }

  const handleClick = () => {
    setGameStarted(true)
    socket?.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    )
  }
  useEffect(() => {
    console.log('before socket')

    if (!socket) return
    console.log('after socket')

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log('move from', message)

      switch (message.type) {
        case INIT_GAME:
          initializeNewChess()
          console.log('game initialized')
          break
        case MOVE:
          //update the chess
          chess.move(message.payload)

          //update the board freom chess
          setBoard(chess.board())

          console.log(' move made')
          break
        case GAME_OVER:
          console.log('game is over')
          alert('GAME IS OVER ! Please Visit Again')
          setGameStarted(false)
          resetChessBoard()
          break
        default:
          console.log('no match for your choice')
          break
      }
    }
  }, [chess, socket])

  return (
    <section className="flex justify-evenly items-center w-full  flex-col md:flex-row  ">
      <ChessBoard
        chess={chess}
        setBoard={setBoard}
        board={board}
        socket={socket}
      />
      <div className="flex z-10">
        {!gameStarted ? (
          <button
            disabled={gameStarted}
            onClick={handleClick}
            className="bg-[#81B64C] w-[400px] font-extrabold drop-shadow-lg text-center"
          >
            Play Game
          </button>
        ) : (
          <div className="flex flex-col gap-10 text-center  items-center">
            <p className="font-extrabold">
              Chess never has been and never can be aught but a recreation
            </p>
            <button
              onClick={resetChessBoard}
              className="bg-[#51504D] w-[400px] text-center"
            >
              Reset Game
            </button>
          </div>
        )}
      </div>
      <img
        className="absolute drop-shadow-md mix-blend-color-burn  right-16 select-none"
        src={chessLogo}
        alt="chesslogo"
        width={600}
      />
    </section>
  )
}
