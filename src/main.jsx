import React from 'react'
import ReactDOM from 'react-dom'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import '@/style/_main.scss'
import 'virtual:svg-icons-register'
import Index from '@/pages/Index/Index'
import About from '@/pages/About/About'

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                <Route path='/about'>
                    <About />
                </Route>
                <Route path='/'>
                    <Index />
                </Route>
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
)
