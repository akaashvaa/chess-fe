import { Chess, Color, PieceSymbol, Square } from 'chess.js'
import { useState } from 'react'
import { MOVE } from '../screens/Game'

function ChessBoard({
  board,
  socket,
  setBoard,
  chess,
}: {
  setBoard: any
  chess: Chess
  board: ({
    square: Square
    type: PieceSymbol
    color: Color
  } | null)[][]
  socket: WebSocket | null
}) {
  const [from, setFrom] = useState<null | Square>(null)

  const handleMove = (squareRepresentation: Square) => {
    if (!from) setFrom(squareRepresentation)
    else {
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
      chess.move({
        from,
        to: squareRepresentation,
      })
      setBoard(chess.board())
    }
  }

  return (
    <main className="flex flex-col z-10 drop-shadow-lg ">
      {board.map((row, i) => (
        <div key={i} className="flex ">
          {row.map((square, j) => {
            const squareRepresentation = (String.fromCharCode(97 + (j % 8)) +
              '' +
              (8 - i)) as Square
            const imgPath =
              '/' + (square?.color == 'b' ? 'b' : 'w') + square?.type + '.png'

            return (
              <div
                onClick={() => handleMove(squareRepresentation)}
                key={i + j}
                className={`font-extrabold  drop-shadow-md font-serif text-center justify-center items-center flex w-16 h-16 ${
                  (i + j) % 2 == 0 ? 'bg-[#EBECD0] ' : 'bg-[#779556] '
                } text-black `}
              >
                {square ? (
                  <img src={imgPath} alt={`${square?.type} img`} />
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
