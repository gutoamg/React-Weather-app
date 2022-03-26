import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect } from 'react'

function App() {

  useEffect(() => {
    
    const getData = async () => {
      const data = await axios.get('http://localhost:7600/', { mode: 'cors' });
      console.log(data.data);

      // const datahover = await axios.get('http://api.openweathermap.org/data/2.5/weather?q=London', {
      //   mode: 'cors',
      //   headers: {
      //     Authorization: 'afdc57a19766650b6ba9459fa9606f37'
      // }
      // })
      // console.log(datahover);
    }
    getData();
  })
  


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
