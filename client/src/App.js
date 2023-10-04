import { useEffect } from 'react';
import './App.css';
import Header from './components/layout/Header';
import Login from './components/login/Login';
import Cookies from 'js-cookie';
import SongProvider from './store/SongProvider';
import Footer from './components/layout/Footer';

function App() {
  console.log(Cookies.get("access_token"))
  if (Cookies.get("access_token") !== undefined) {
    console.log("OHHHHHHH")
    localStorage.setItem("access_token", Cookies.get("access_token"));
  }

  return (
    <SongProvider>
      <div className="App">
        <Header />
        <Login />
        <Footer />
      </div>
    </SongProvider>
  );
}

export default App;
