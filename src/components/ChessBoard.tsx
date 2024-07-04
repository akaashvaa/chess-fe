import { Chess, Color, PieceSymbol, Square } from 'chess.js'
import { useState } from 'react'
import { MOVE } from '../screens/Game'

function ChessBoard({
  board,
  socket,
  setBoard,
  chess,
}: {
  setBoard: React.Dispatch<
    React.SetStateAction<
      ({
        square: Square
        type: PieceSymbol
        color: Color
      } | null)[][]
    >
  >
  chess: Chess
  board: ({
    square: Square
    type: PieceSymbol
    color: Color
  } | null)[][]
  socket: WebSocket | null
}) {
  const [from, setFrom] = useState<null | Square>(null)
  const [err, setErr] = useState(false)

  const handleMove = async (squareRepresentation: Square) => {
    if (!from) {
      setFrom(squareRepresentation)
    } else {
      console.log({ from, to: squareRepresentation })
      socket?.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            move: {
              from,
              to: squareRepresentation,
            },
          },
        })
      )
      setFrom(null)
      // update the board with chess board
      try {
        chess.move({
          from,
          to: squareRepresentation,
        })
        setBoard(chess.board())
      } catch (error) {
        console.log(error)
        alert(
          'heyy ' +
            (chess.turn() === 'w' ? ' white' : 'black') +
            ", it's wrong move"
        )
        setErr(true)
        setTimeout(() => {
          setErr(false)
        }, 300)
      }
    }
  }

  return (
    <main
      className={`flex flex-col z-10 ${
        err && 'border-2 rounded-md border-red-800'
      }`}
    >
      {board.map((row, i) => (
        <div key={i} className="flex ">
          {row.map((square, j) => {
            const squareRepresentation = (String.fromCharCode(97 + (j % 8)) +
              '' +
              (8 - i)) as Square
            const imgPath =
              '/' + (square?.color == 'b' ? 'b' : 'w') + square?.type + '.png'
            const active: boolean | null =
              square && (chess.turn() === 'w' || chess.turn() === 'b')
            return (
              <div
                onClick={() => handleMove(squareRepresentation)}
                key={i + j}
                className={`font-extrabold font-serif text-center justify-center items-center flex w-20 h-20 ${
                  (i + j) % 2 == 0 ? 'bg-[#D2B788] ' : 'bg-[#845B37] '
                } ${active && 'drop-shadow-2xl'} text-black `}
              >
                {square ? (
                  <img width={80} src={imgPath} alt={`${square?.type} img`} />
                ) : null}
              </div>
            )
          })}
        </div>
      ))}
    </main>
  )
}

export default ChessBoard
