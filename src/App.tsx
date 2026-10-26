import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomeScreen from './pages/HomeScreen'
import WorkoutStart from './pages/WorkoutStart'
import Food from './pages/Food'
import Progress from './pages/Progress'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomeScreen />} />
        <Route path="workout/gym" element={<WorkoutStart mode="gym" />} />
        <Route path="workout/home" element={<WorkoutStart mode="home" />} />
        <Route path="food" element={<Food />} />
        <Route path="progress" element={<Progress />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<HomeScreen />} />
      </Route>
    </Routes>
  )
}
