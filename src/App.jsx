import './App.css'
import './css/global.css'


import Homepage from './components/homepage'
import Noise from './components/Noise'


function App() {

  return (
    <>
    <div style={{width: '100%', height: '100%', position: 'absolute', overflow: 'hidden'}}>

      <Noise

        patternSize={250}

        patternScaleX={2}

        patternScaleY={2}

        patternRefreshInterval={2}

        patternAlpha={15}

      />

    </div>
    <Homepage />
    </>
  )
}

export default App
