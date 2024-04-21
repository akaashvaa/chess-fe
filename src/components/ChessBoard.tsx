import { Color, PieceSymbol, Square } from 'chess.js'
import { useState } from 'react'
import { MOVE } from '../screens/Game'

function ChessBoard({
  board,
  socket,
  setBoard,
  chess,
}: {
  setBoard: any
  chess: any
  board: ({
    square: Square
    type: PieceSymbol
    color: Color
  } | null)[][]
  socket: WebSocket | null
}) {
  const [from, setFrom] = useState<null | Square>(null)

  return (
    <main className="flex flex-col z-10 drop-shadow-lg ">
      {board.map((row, i) => (
        <div key={i} className="flex ">
          {row.map((square, j) => {
            const squareRepresentation = (String.fromCharCode(97 + (j % 8)) +
              '' +
              (8 - i)) as Square
            return (
              <div
                onClick={() => {
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
                }}
                key={i + j}
                className={`font-extrabold  drop-shadow-md font-serif text-center justify-center items-center flex w-16 h-16 ${
                  (i + j) % 2 == 0 ? 'bg-[#EBECD0] ' : 'bg-[#779556] '
                } text-black `}
              >
                {square ? square.type : ''}
              </div>
            )
          })}
        </div>
      ))}
    </main>
  )
}

export default ChessBoard
