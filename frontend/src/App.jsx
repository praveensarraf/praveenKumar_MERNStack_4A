import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import EditTask from './components/EditTask';

function App() {

  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/task/:id',
      element: <EditTask/>
    }
  ]);

  return (
    <>
      <RouterProvider router={appRouter}/>
    </>
  )
}

export default App
