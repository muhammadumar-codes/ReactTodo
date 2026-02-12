import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
