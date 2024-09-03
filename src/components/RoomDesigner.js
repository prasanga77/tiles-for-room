import React, { useState, useRef } from 'react';
import { AlertCircle, Upload, Download, Menu } from 'lucide-react';

// Helper UI components
const Alert = ({ children }) => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">{children}</div>
);
const AlertTitle = ({ children }) => <h4 className="font-bold">{children}</h4>;
const AlertDescription = ({ children }) => <p>{children}</p>;
const Button = ({ children, onClick, className }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded ${className}`}>{children}</button>
);

const RoomDesigner = () => {
  const [wallGridSize, setWallGridSize] = useState({ width: 5, height: 3 });
  const [floorGridSize, setFloorGridSize] = useState({ width: 5, height: 4 });
  const [wallGroutColor, setWallGroutColor] = useState('#333333');
  const [floorGroutColor, setFloorGroutColor] = useState('#cccccc');
  const [selectedCell, setSelectedCell] = useState(null);
  const [wallDesign, setWallDesign] = useState(null);
  const [floorDesign, setFloorDesign] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [wallColor, setWallColor] = useState('#1a1a1a');
  const [floorColor, setFloorColor] = useState('#f0f0f0');

  const wallFileInputRef = useRef(null);
  const floorFileInputRef = useRef(null);

  const createGrid = (isWall) => {
    const gridSize = isWall ? wallGridSize : floorGridSize;
    const design = isWall ? wallDesign : floorDesign;
    const groutColor = isWall ? wallGroutColor : floorGroutColor;
    const backgroundColor = isWall ? wallColor : floorColor;
    const cells = [];

    for (let i = 0; i < gridSize.height; i++) {
      for (let j = 0; j < gridSize.width; j++) {
        cells.push(
          <div
            key={`${isWall ? 'wall' : 'floor'}-${i}-${j}`}
            className="border relative"
            style={{
              borderColor: groutColor,
              width: `${100 / gridSize.width}%`,
              height: `${100 / gridSize.height}%`,
              backgroundColor: backgroundColor,
              backgroundImage: design && design[i] && design[i][j] ? `url(${design[i][j]})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => setSelectedCell({ isWall, row: i, col: j })}
          >
            {selectedCell && selectedCell.isWall === isWall && selectedCell.row === i && selectedCell.col === j && (
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleImageUpload(e, isWall, i, j)}
              />
            )}
          </div>
        );
      }
    }
    return cells;
  };

  const handleImageUpload = (e, isWall, row, col) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const resizedImage = canvas.toDataURL();
          const newDesign = isWall ? [...(wallDesign || [])] : [...(floorDesign || [])];
          newDesign[row] = newDesign[row] || [];
          newDesign[row][col] = resizedImage;
          if (isWall) {
            setWallDesign(newDesign);
          } else {
            setFloorDesign(newDesign);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBulkUpload = (e, isWall) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newDesign = Array(isWall ? wallGridSize.height : floorGridSize.height)
          .fill()
          .map(() => Array(isWall ? wallGridSize.width : floorGridSize.width).fill(event.target.result));
        if (isWall) {
          setWallDesign(newDesign);
        } else {
          setFloorDesign(newDesign);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const designData = {
      wallGridSize,
      floorGridSize,
      wallGroutColor,
      floorGroutColor,
      wallDesign,
      floorDesign,
      wallColor,
      floorColor
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(designData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "room_design.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 relative">
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col" style={{ perspective: '1000px' }}>
          <div 
            className="w-full h-3/5 border-b border-white transform-gpu"
            style={{ transformOrigin: 'bottom', transform: 'rotateX(5deg)' }}
          >
            <div className="w-full h-full flex flex-wrap">{createGrid(true)}</div>
          </div>
          <div 
            className="w-full h-2/5 transform-gpu"
            style={{ transformOrigin: 'top', transform: 'rotateX(45deg)' }}
          >
            <div className="w-full h-full flex flex-wrap">{createGrid(false)}</div>
          </div>
        </div>
      </div>
      
      <button 
        className="fixed top-4 left-4 bg-gray-800 text-white p-2 rounded z-50"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu />
      </button>
      
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowSidebar(false)}></div>
      )}
      
      <div className={`fixed top-0 left-0 h-full bg-gray-800 p-4 overflow-y-auto transition-transform duration-300 ease-in-out z-50 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`} style={{width: '300px'}}>
        <button onClick={() => setShowSidebar(false)} className="absolute top-2 right-2 text-white text-2xl font-bold p-2">
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-white">Room Designer</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-white">Wall Grid Size</h3>
          <input
            type="number"
            value={wallGridSize.width}
            onChange={(e) => setWallGridSize({ ...wallGridSize, width: parseInt(e.target.value) || 1 })}
            className="w-full mb-2 p-1 border rounded bg-gray-700 text-white"
            min="1"
          />
          <input
            type="number"
            value={wallGridSize.height}
            onChange={(e) => setWallGridSize({ ...wallGridSize, height: parseInt(e.target.value) || 1 })}
            className="w-full p-1 border rounded bg-gray-700 text-white"
            min="1"
          />
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-white">Floor Grid Size</h3>
          <input
            type="number"
            value={floorGridSize.width}
            onChange={(e) => setFloorGridSize({ ...floorGridSize, width: parseInt(e.target.value) || 1 })}
            className="w-full mb-2 p-1 border rounded bg-gray-700 text-white"
            min="1"
          />
          <input
            type="number"
            value={floorGridSize.height}
            onChange={(e) => setFloorGridSize({ ...floorGridSize, height: parseInt(e.target.value) || 1 })}
            className="w-full p-1 border rounded bg-gray-700 text-white"
            min="1"
          />
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-white">Wall Grout Color</h3>
          <input
            type="color"
            value={wallGroutColor}
            onChange={(e) => setWallGroutColor(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-white">Floor Grout Color</h3>
          <input
            type="color"
            value={floorGroutColor}
            onChange={(e) => setFloorGroutColor(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-white">Wall Color</h3>
          <input
            type="color"
            value={wallColor}
            onChange={(e) => setWallColor(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-white">Floor Color</h3>
          <input
            type="color"
            value={floorColor}
            onChange={(e) => setFloorColor(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-white">Upload Wall Design</h3>
          <input
            type="file"
            accept="image/*"
            ref={wallFileInputRef}
            className="hidden"
            onChange={(e) => handleBulkUpload(e, true)}
          />
          <Button onClick={() => wallFileInputRef.current.click()} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Upload className="mr-2 h-4 w-4" /> Upload Wall Design
          </Button>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-white">Upload Floor Design</h3>
          <input
            type="file"
            accept="image/*"
            ref={floorFileInputRef}
            className="hidden"
            onChange={(e) => handleBulkUpload(e, false)}
          />
          <Button onClick={() => floorFileInputRef.current.click()} className="w-full bg-green-600 hover:bg-green-700 text-white">
            <Upload className="mr-2 h-4 w-4" /> Upload Floor Design
          </Button>
        </div>
        <Button onClick={handleDownload} className="w-full mb-4 bg-green-500 text-white">
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Tip</AlertTitle>
          <AlertDescription className="text-sm">
            Click on a grid cell to upload a unique image for that cell.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default RoomDesigner;
