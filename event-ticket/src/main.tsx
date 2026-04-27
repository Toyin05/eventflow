import './styles.css'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

const root = createRoot(document.getElementById('root')!)

root.render(<RouterProvider router={router} />)