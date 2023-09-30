import './App.css';
import Header from './components/layout/Header';
import Login from './components/login/Login';
import SongContext from './store/song-context';

function App() {
  const ctx = useContext(SongContext)

  useEffect(() => {
    if (Cookies.get("access_token") !== undefined) {
      ctx.setIsLoggedIn();
    }
  }, [])

  return (
    <SongProvider>
      <div className="App">
        <Header />
        <Login />
      </div>
    </SongProvider>
  );
}

export default App;
