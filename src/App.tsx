import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomeScreen from './pages/HomeScreen'
import WorkoutStart from './pages/WorkoutStart'
import HomeWorkout from './pages/HomeWorkout'
import Player from './pages/Player'
import Library from './pages/Library'
import Food from './pages/Food'
import Progress from './pages/Progress'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomeScreen />} />
        <Route path="workout/gym" element={<WorkoutStart />} />
        <Route path="workout/home" element={<HomeWorkout />} />
        <Route path="workout/play" element={<Player />} />
        <Route path="library" element={<Library />} />
        <Route path="food" element={<Food />} />
        <Route path="progress" element={<Progress />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<HomeScreen />} />
      </Route>
    </Routes>
  )
}
