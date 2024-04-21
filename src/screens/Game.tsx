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

  const handleThat = () => {
    const newChess = new Chess()
    // initiate new chess
    // update the board with chess board
    setChess(newChess)
    setBoard(newChess.board())
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
          handleThat()
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
          break
        default:
          console.log('no match for your choice')
          break
      }
    }
  }, [chess, socket])

  const handleClick = () => {
    socket?.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    )
  }
  return (
    <section className="flex justify-evenly items-center w-full  flex-col md:flex-row  ">
      <ChessBoard
        chess={chess}
        setBoard={setBoard}
        board={board}
        socket={socket}
      />
      <div className="flex z-10">
        <button
          onClick={handleClick}
          className="bg-white drop-shadow-lg text-black text-center"
        >
          Play Game
        </button>
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
