import './App.css'
import './css/global.css'

import Homepage from './components/homepage'
import Noise from './components/Noise'
import HomeTransition from './components/HomeTransition'



function App() {

  return (
    <>
    <div style={{width: '100%', height: '100%', position: 'absolute', overflow: 'hidden'}}>

      <Noise

        patternSize={250}

        patternScaleX={3}

        patternScaleY={3}

        patternRefreshInterval={2}

        patternAlpha={15}

      />

    </div>
    <Homepage />
    <HomeTransition />
    </>
  )
}

export default App
