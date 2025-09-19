import './ui/Calc.css'

export default function Calc()
{
    const buttons = [
       ["%", "CE", "C", "⌫"],          
       ["1/x", "x²", "√x", "÷"],      
       ["7", "8", "9", "×"],
       ["4", "5", "6", "−"],
       ["1", "2", "3", "+"],
       ["±", "0", ".", "="]    
    ];

    return <div className="calc border border-2 rounded-2 p-2">
        <div className="calc-display">
            0
        </div>
        {buttons.map((row, index) => <div key={index} className="calc-row">
            {row.map(face => <button key={face} className="calc-button">{face}</button>
            )}
        </div>)}
    </div>;
}