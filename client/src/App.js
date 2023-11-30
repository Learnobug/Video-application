
import './App.css';
import { Route ,Routes } from 'react-router-dom';
import Lobby from './Pages/Lobby';
import RoomPage from './Pages/Room';
function App() {
  return (
    <div className='App' >
     <Routes>
      <Route path="/" element={<Lobby/>}/>
      <Route path="/room/:roomId" element={<RoomPage/>}/>
     </Routes>
    </div>
  );
}

export default App;
