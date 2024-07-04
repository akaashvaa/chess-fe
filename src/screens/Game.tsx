/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import ChessBoard from '../components/ChessBoard'
import { useSocket } from '../hooks/useSocket'
import { Chess } from 'chess.js'
import chessLogo from '../assets/chesslogo.svg'
import blackTurn from '../../public/bp.png'
import whiteTurn from '../../public/wp.png'

const INIT_GAME = 'init_game'
export const MOVE = 'move'
const GAME_OVER = 'game_over'
const RESET_GAME = 'reset_game'

export function Game() {
  const socket = useSocket()
  const [chess, setChess] = useState(() => new Chess())
  const [board, setBoard] = useState(chess.board())
  const [gameStarted, setGameStarted] = useState(false)
  const [moveType, setMoveTYpe] = useState<string>('')

  const initializeNewChess = () => {
    const newChess = new Chess()
    // initiate new chess
    // update the board with chess board
    setChess(newChess)
    setBoard(newChess.board())
  }

  const resetChessBoard = () => {
    socket?.send(
      JSON.stringify({
        type: RESET_GAME,
      })
    )
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
    // console.log('before socket')

    if (!socket) return

    console.log('turn', chess.turn())
    socket.onclose = () => {
      console.log('web scoket close')
    }

    socket.onerror = (e) => {
      console.log('onerror', e)
    }
    // console.log('after socket')

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      // console.log('move from', message)

      if (moveType === '') setMoveTYpe(message.payload?.colors)

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
        case RESET_GAME:
          chess.reset()
          setChess(new Chess())
          setBoard(new Chess().board())
          alert(
            `The game has been reset by a player with the ${moveType} pieces.`
          )

          break
        default:
          console.log('unknown message', message)
          break
      }
    }
  }, [chess, socket])

  return (
    <section className="flex justify-evenly py-12 items-center w-full  flex-col md:flex-row  ">
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
          <div className="relative flex  flex-col w-full gap-4 text-center  items-center">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              board={board}
              socket={socket}
            />
            <div
              className={`font-extrabold text-[#845B37]  border border-[#845B37] rounded-md px-10 flex justify-center items-center z-50 absolute ${
                moveType === 'white' ? ' -bottom-12' : '-top-12 '
              }`}
            >
              {moveType === '' ? (
                'Wait for another person to join this game'
              ) : (
                <div className="flex justify-center items-center">
                  You are playing with the{' '}
                  <img
                    src={moveType === 'white' ? whiteTurn : blackTurn}
                    alt={`${chess.turn()}-turn`}
                    width={50}
                  />{' '}
                  pieces
                </div>
              )}
            </div>

            <img
              src={chess.turn() === 'w' ? whiteTurn : blackTurn}
              alt={`${chess.turn()}-turn`}
              width={100}
              className={`absolute z-10 p-5 -left-32 drop-shadow-2xl border rounded-md  ${
                chess.turn() === 'w' ? ' bottom-0' : 'top-0 '
              }`}
            />

            <button
              onClick={resetChessBoard}
              className="absolute -left-56 z-10 top-[50%] border-2 border-[#51504d] bg-[#51504D] text-center  active:border-[#6d6c6a]"
            >
              Reset Game
            </button>
          </div>
        )}
      </div>
      <img
        className="absolute drop-shadow-md mix-blend-color-burn  right-[33%] select-none"
        src={chessLogo}
        alt="chesslogo"
        width={600}
      />
    </section>
  )
}
