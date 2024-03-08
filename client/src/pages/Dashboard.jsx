import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import DashboardProfile from '../components/dashboard/DashboardProfile'
import DashboardUsers from '../components/dashboard/DashboardUsers'
import DashboardPosts from '../components/dashboard/DashboardPosts'
import DashboardComments from '../components/dashboard/DashboardComments'
import DashboardDetails from '../components/dashboard/DashboardDetails'

export default function Dashboard() {
  const location = useLocation()
  const [tab, setTab] = useState(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const urlTab = urlParams.get('tab')
    urlTab && setTab(urlTab)
  }, [location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashboardSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashboardProfile />}
      {/* posts... */}
      {tab === 'posts' && <DashboardPosts />}
      {/* users */}
      {tab === 'users' && <DashboardUsers />}
      {/* comments  */}
      {tab === 'comments' && <DashboardComments />}
      {/* dashboard comp */}
      {tab === 'details' && <DashboardDetails />}
    </div>
  )
}
