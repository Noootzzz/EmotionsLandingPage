import './App.css'
import './css/global.css'

import Homepage from './components/homepage'
import Noise from './components/Noise'
import HomeTransition from './components/HomeTransition'
import Nostalgia from './components/Nostalgia'
import NostalgiaTransition from './components/NostalgiaTransition'




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
    <div className="nostalgia-container">
      <Nostalgia />
    </div>

    <NostalgiaTransition />

    </>
  )
}

export default App
