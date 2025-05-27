import React, { useState, useEffect, useCallback } from 'react';

const KEY_LAYOUT_ANSI = [
  [
    { code: 'Escape', display: 'Esc', size: 1 },
    { code: 'F1', display: 'F1', size: 1 }, { code: 'F2', display: 'F2', size: 1 },
    { code: 'F3', display: 'F3', size: 1 }, { code: 'F4', display: 'F4', size: 1 },
    { code: 'F5', display: 'F5', size: 1 }, { code: 'F6', display: 'F6', size: 1 },
    { code: 'F7', display: 'F7', size: 1 }, { code: 'F8', display: 'F8', size: 1 },
    { code: 'F9', display: 'F9', size: 1 }, { code: 'F10', display: 'F10', size: 1 },
    { code: 'F11', display: 'F11', size: 1 }, { code: 'F12', display: 'F12', size: 1 },
  ],
  [ // Original Row 0
    { code: 'Backquote', display: '`', size: 1 }, { code: 'Digit1', display: '1', size: 1 },
    { code: 'Digit2', display: '2', size: 1 }, { code: 'Digit3', display: '3', size: 1 },
    { code: 'Digit4', display: '4', size: 1 }, { code: 'Digit5', display: '5', size: 1 },
    { code: 'Digit6', display: '6', size: 1 }, { code: 'Digit7', display: '7', size: 1 },
    { code: 'Digit8', display: '8', size: 1 }, { code: 'Digit9', display: '9', size: 1 },
    { code: 'Digit0', display: '0', size: 1 }, { code: 'Minus', display: '-', size: 1 },
    { code: 'Equal', display: '=', size: 1 }, { code: 'Backspace', display: 'Backspace', size: 2 },
  ],
  [ // Original Row 1
    { code: 'Tab', display: 'Tab', size: 1.5 }, { code: 'KeyQ', display: 'Q', size: 1 },
    { code: 'KeyW', display: 'W', size: 1 }, { code: 'KeyE', display: 'E', size: 1 },
    { code: 'KeyR', display: 'R', size: 1 }, { code: 'KeyT', display: 'T', size: 1 },
    { code: 'KeyY', display: 'Y', size: 1 }, { code: 'KeyU', display: 'U', size: 1 },
    { code: 'KeyI', display: 'I', size: 1 }, { code: 'KeyO', display: 'O', size: 1 },
    { code: 'KeyP', display: 'P', size: 1 }, { code: 'BracketLeft', display: '[', size: 1 },
    { code: 'BracketRight', display: ']', size: 1 }, { code: 'Backslash', display: '\\', size: 1.5 },
  ],
  [ // Original Row 2
    { code: 'CapsLock', display: 'Caps Lock', size: 1.75 }, { code: 'KeyA', display: 'A', size: 1 },
    { code: 'KeyS', display: 'S', size: 1 }, { code: 'KeyD', display: 'D', size: 1 },
    { code: 'KeyF', display: 'F', size: 1 }, { code: 'KeyG', display: 'G', size: 1 },
    { code: 'KeyH', display: 'H', size: 1 }, { code: 'KeyJ', display: 'J', size: 1 },
    { code: 'KeyK', display: 'K', size: 1 }, { code: 'KeyL', display: 'L', size: 1 },
    { code: 'Semicolon', display: ';', size: 1 }, { code: 'Quote', display: '\'', size: 1 },
    { code: 'Enter', display: 'Enter', size: 2.25 },
  ],
  [ // Original Row 3
    { code: 'ShiftLeft', display: 'Shift', size: 2.25 }, { code: 'KeyZ', display: 'Z', size: 1 },
    { code: 'KeyX', display: 'X', size: 1 }, { code: 'KeyC', display: 'C', size: 1 },
    { code: 'KeyV', display: 'V', size: 1 }, { code: 'KeyB', display: 'B', size: 1 },
    { code: 'KeyN', display: 'N', size: 1 }, { code: 'KeyM', display: 'M', size: 1 },
    { code: 'Comma', display: ',', size: 1 }, { code: 'Period', display: '.', size: 1 },
    { code: 'Slash', display: '/', size: 1 }, { code: 'ShiftRight', display: 'Shift', size: 2.75 },
  ],
  [ // Original Row 4 (main part)
    { code: 'ControlLeft', display: 'Ctrl', size: 1.25 }, { code: 'MetaLeft', display: 'Win', size: 1.25 },
    { code: 'AltLeft', display: 'Alt', size: 1.25 }, { code: 'Space', display: 'Space', size: 6.25 },
    { code: 'AltRight', display: 'Alt', size: 1.25 }, { code: 'MetaRight', display: 'Win', size: 1.25 },
    { code: 'ContextMenu', display: 'Menu', size: 1.25 }, { code: 'ControlRight', display: 'Ctrl', size: 1.25 },
  ],
  [ // Arrow keys row (top part of cluster)
    { code: 'Unused1', display: '', size: 9.5, style: { visibility: 'hidden' as React.CSSProperties['visibility'] } }, // Spacer
    { code: 'ArrowUp', display: '↑', size: 1 },
    { code: 'Unused2', display: '', size: 1, style: { visibility: 'hidden' as React.CSSProperties['visibility'] } }, // Spacer
  ],
  [ // Arrow keys row (bottom part of cluster)
    { code: 'Unused3', display: '', size: 8.5, style: { visibility: 'hidden' as React.CSSProperties['visibility'] } }, // Spacer
    { code: 'ArrowLeft', display: '←', size: 1 },
    { code: 'ArrowDown', display: '↓', size: 1 },
    { code: 'ArrowRight', display: '→', size: 1 },
  ]
];

interface KeyInfo {
  code: string;
  display: string;
  size: number;
  style?: React.CSSProperties; 
}

const Keyboard: React.FC = () => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [keyHistory, setKeyHistory] = useState<string[]>([]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    const { code } = event; 
    setPressedKeys((prev) => new Set(prev).add(code));
    
    let displayKey = event.key;
    if (event.key === ' ') {
        displayKey = 'Space';
    } else if (event.key.length === 1) {
        displayKey = event.key.toUpperCase();
    } else {
        displayKey = event.key;
    }
    
    if (['ShiftLeft', 'ShiftRight'].includes(code)) displayKey = 'Shift';
    if (['ControlLeft', 'ControlRight'].includes(code)) displayKey = 'Ctrl';
    if (['AltLeft', 'AltRight'].includes(code)) displayKey = 'Alt';
    if (['MetaLeft', 'MetaRight'].includes(code)) displayKey = 'Win';

    setKeyHistory((prev) => [displayKey, ...prev.slice(0, 19)]);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    const { code } = event;
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(code);
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleReset = () => {
    setPressedKeys(new Set());
    setKeyHistory([]);
  };

  const getKeyClass = (keyInfo: KeyInfo) => {
    let classes = 'keycap';
    if (pressedKeys.has(keyInfo.code)) {
      classes += ' pressed';
    }
    if (keyInfo.display.length > 1 && keyInfo.display !== 'Space' && keyInfo.display.length <= 5 ) { 
        classes += ' text-sm';
    } else if (keyInfo.display.length > 5) { 
        classes += ' text-xs';
    }
    if (['↑', '↓', '←', '→'].includes(keyInfo.display)) {
        classes += ' text-lg';
    }
    return classes;
  };
  
  const baseKeyWidth = 40; 
  const keyGap = 3; 

  return (
    <div className="keyboard-tester p-2 sm:p-4 bg-gray-100 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
      <div className="keyboard mb-6">
        {KEY_LAYOUT_ANSI.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row flex justify-center mb-1">
            {row.map((keyInfo) => (
              <div
                key={keyInfo.code}
                className={getKeyClass(keyInfo)}
                style={{ 
                    width: `${keyInfo.size * baseKeyWidth + (keyInfo.size -1) * keyGap}px`,
                    margin: `0 ${keyGap / 2}px`,
                    ...(keyInfo.style || {})
                }}
                title={keyInfo.code}
              >
                {keyInfo.display}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="controls text-center mb-6">
        <button
          onClick={handleReset}
          className="reset-button px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="key-history bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Key History (Last 20):</h3>
        {keyHistory.length === 0 ? (
          <p className="text-gray-500">No keys pressed yet.</p>
        ) : (
          <ul className="history-list flex flex-wrap gap-2">
            {keyHistory.map((key, index) => (
              <li key={index} className="history-item bg-gray-200 px-2 py-1 rounded text-sm text-gray-700">
                {key}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Keyboard;
