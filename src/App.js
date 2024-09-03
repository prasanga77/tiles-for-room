import React, { useState } from 'react';
import RoomDesigner from './components/RoomDesigner';
import './App.css'; // Import CSS for animations
import logo from './black-white-background.jpg';

function App() {
  const [showDesigner, setShowDesigner] = useState(false);

  const handleButtonClick = () => {
    setShowDesigner(true);
  };

  return (
    <div className="App">
      <img src={logo} alt="Logo" />
      {!showDesigner ? (
        <div className="welcome-screen">
          <h2 className="welcome-text"><b>WELCOME TO THE WORLD OF</b></h2>
          <h1 className="welcome-text"><b>REDESIGNING YOUR ROOM TILES</b></h1>
          <button className="creative-button" onClick={handleButtonClick}>
            Start Designing
          </button>
        </div>
      ) : (
        <div className="room-designer-animation">
          <RoomDesigner />
        </div>
      )}
    </div>
  );
}

export default App;
