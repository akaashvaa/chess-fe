import React from 'react'

import { Chess, Color, PieceSymbol, Square } from 'chess.js'

export function ChessRow({row}) {
  return (
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
                  (i + j) % 2 == 0 ? 'bg-[#D2B788] ' : 'bg-[#3A230D] '
                } text-black `}
              >
                {square ? (
                  <img src={imgPath} alt={`${square?.type} img`} />
                ) : null}
              </div>
            )
          })}
        </div>
  )
}
