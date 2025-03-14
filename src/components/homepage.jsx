import Header from './header'


const homepage = () => {
  return (
    <section className='homepage' id='homepage'>

        <Header />
        
        <div className='homepage-logo'>
            <h1>Emotion Path</h1>
        </div>

        <div className='homepage-footer'>

          <div>

          <p>Don't forget to put on <br />the music on section</p>

          </div>

           <div className='homepage-content'>
            <p>
                No one CARES. <br />
                JUST SHOW UP <br />
                LIFES DOES NOT <br />
                WAIT FOR YOU.
            </p>
        </div>
        </div>

    </section>
  );
}

export default homepage;