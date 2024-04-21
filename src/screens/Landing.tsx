import chessLogo from '../assets/chesslogo.svg'
import { useNavigate } from 'react-router-dom'
export function Landing() {
  const navigate = useNavigate()

  return (
    <section className="flex w-full justify-evenly items-center gap-10">
      <img
        className="drop-shadow-2xl "
        src={chessLogo}
        alt="chesslogo"
        width={400}
      />
      <button
        onClick={() => navigate('/game')}
        className="bg-white drop-shadow-lg text-black text-center"
      >
        Join Game
      </button>
    </section>
  )
}
