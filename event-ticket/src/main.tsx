import { createRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

const root = createRoot(document.getElementById('root')!)

root.render(<StartClient router={router} />)