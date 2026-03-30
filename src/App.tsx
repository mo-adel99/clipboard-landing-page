import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LobbyPage } from './pages/LobbyPage'
import { GamePage } from './pages/GamePage'

export default function App() {
  const [nickname, setNickname] = useState('')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage nickname={nickname} setNickname={setNickname} />} />
        <Route path="/lobby/:code" element={<LobbyPage />} />
        <Route path="/game/:code" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  )
}
