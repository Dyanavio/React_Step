import { useEffect, useState } from 'react';
import './ui/Calc.css'
import CalcButton from './ui/CalcButton';
import CalcButton2 from './ui/CalcButton2';

export default function Calc()
{
    const divideByZeroExceptionMessage = "Cannot divide by zero";
    const invalidInputExceptionMessage = "Invalid input";
    const operations = ['÷', '*', '-', '+'];
    const buttons = [
       [, "CE", "C", "⌫"],          
       ["1/x", "x²", "√x", "÷"],      
       ["_7", "_8", "_9", "×"],
       ["_4", "_5", "_6", "−"],
       ["_1", "_2", "_3", "+"],
       ["_±", "_0", "_.", "="]    
    ];
    
    const [isAnticipating, setIsAnticipating] = useState(false);
    const [expressionString, setExpressionString] = useState("");
    const [expression, setExpression] = useState("");
    const [display, setDisplay] = useState("0");
    const [displayFontSize, setDisplayFontSize] = useState(32);

    useEffect(() => {
        if(display == divideByZeroExceptionMessage || display == invalidInputExceptionMessage)
        {
            setDisplayFontSize(20);
        }
        else
        {
            if(display.length > 8)
            {
                setDisplayFontSize(32 - 2 * (display.length - 8));
            }
            else
            {
                setDisplayFontSize(32);
            }
        }
        
    }, [display]);

    const onDotClick = (symbol) => {
        if(display.includes(symbol)) return;
        setDisplay(display + symbol);
        setExpressionString(expressionString === "0" ? "0." : expressionString + ".")
    };

    const onPmClick = () => {
        if(display === "0") return;
        setDisplay(display.startsWith('-') ? display.substring(1) : "-" + display);
    };

    const onBackspaceClick = () => {
        //let res = setDisplay(display.length > 1 ? display.substring(0, display.length - 1) : "0");
        //setDisplay(res === '-' ? "0" : res);
        if(!display.startsWith('-'))
        {
            setDisplay(display.length > 1 ? display.substring(0, display.length - 1) : "0");
        }
        else
        {
            setDisplay(display.length > 2 ? display.substring(0, display.length - 1) : "0");
        }
        
    };

    const onGlobalClearClick = () => {
        setDisplay("0");
        setExpressionString("");
        setExpression("");
    };

    const onClearClick = () =>
    {
        setDisplay("0");
        setExpressionString("");
        setExpression(expression.includes('=') ? expression : "");
    };

    const onDigitClick = (digit) => {
        let result = display;
        if(result === "0" || isAnticipating)
        {
            result = "";
            setIsAnticipating(false);
        }
        if(result.length > 14) return;
        
        result += digit;
        setExpressionString(expressionString + digit);
        setDisplay(result);
    };

    const onInverseClick = () =>
    {
        let result = (1 / Number(display));
        if(Number(display) === 0)
        {
            setDisplay(divideByZeroExceptionMessage);
        }
        else
        {
            setDisplay(result.toString().length <= 14 ? result : result.toString().substring(0, 15));
        }
        setExpression(expression == "" || expression.includes('=') ? `1/(${display})` : `1/(${expression})`);

    };

    const onSquaredClick = () => 
    {
        let result = (display) * (display);
        setDisplay(result.toString().length < 14 ? result : Number(result).toExponential(5));
        setExpression(expression == "" || expression.includes('=') ? `sqr(${display})` : `sqr(${expression})`);
    };

    const onSquareRootClick = () =>
    {
        let result = Math.sqrt(Number(display));
        if(Number.isNaN(result))
        {
            setDisplay(invalidInputExceptionMessage);
        }
        else
        {
            setDisplay(result.toString().length <= 14 ? result : result.toString().substring(0, 15));
        }
        setExpression(expression == "" || expression.includes('=') ? `√(${display})` : `√(${expression})`);
    };

    const onOperationClick = (face) => 
    {
        let result = null;
        if(isAnticipating && (operations.some(operation => expressionString.endsWith(operation))))
        {
            console.log(expressionString);
        }
        if(!isAnticipating)
        {
            result = eval(expressionString);
            setDisplay(result);
        }
        let operationSymbol = "";
        let expressionStringSymbol = "";
        switch(face)
        {
            case "÷": 
                operationSymbol = "÷"; 
                expressionStringSymbol = "/";
                break;
            case "×":
                operationSymbol = "×"; 
                expressionStringSymbol = "*";
                break;
            case "−":
                operationSymbol = "−"; 
                expressionStringSymbol = "-";
                break;
            case "+":
                operationSymbol = "+"; 
                expressionStringSymbol = "+";
                break;

        }
        setExpression(result != null ? result + operationSymbol : display + operationSymbol);
        setIsAnticipating(true);
        setExpressionString(result != null ? result + expressionStringSymbol : display + expressionStringSymbol);
    };

    const calculate = () =>
    {
        try
        {
            let result = eval(expressionString);
            console.log(result);

            if(!(Number.isFinite(result))) result = divideByZeroExceptionMessage;
            else
            {
                if(Number.isNaN(result)) result = invalidInputExceptionMessage;
            }
            setDisplay(Number.isFinite(result) ? (result.toString().length <= 14 ? result : result.toString().substring(0, 15)) : result);
            setExpression(`${expression}${display}=`);
        }
        catch(error)
        {
            console.log(error);
        }
    }

    const onPercentClick = () =>
    {
        if(isAnticipating)
        {
            let lastOperation = expressionString[expressionString.length - 1];
            let firstTerm = expressionString.substring(0, expressionString.indexOf(lastOperation));
            switch(lastOperation)
            {
                case "/": 
                case "*":
                    setExpression(expression + firstTerm / 100);
                    setExpressionString(expressionString + firstTerm / 100);
                    setDisplay(firstTerm / 100);
                    break;
                case "-":
                case "+":
                    let result = (firstTerm * (Number(firstTerm) / 100));
                    setExpression(expression + result);
                    setExpressionString(expressionString + result);
                    setDisplay(result);
                    break;
            }
        }
        //else
        //{
        //    let lastOperation = expressionString[expressionString.length - 1];
        //    let firstTerm = expressionString.substring(0, expressionString.indexOf(lastOperation));
        //}
    };


   const buttonObjects = [
        [ 
            {face: "%",  type: "func", action: onPercentClick},
            {face: "CE", type: "func", action: onClearClick},
            {face: "C",  type: "func", action: onGlobalClearClick},
            {face: "⌫", type: "func", action: onBackspaceClick},
        ],
        [ 
            {face: "1/x",  type: "func", action: onInverseClick},
            {face: "x²", type: "func", action: onSquaredClick},
            {face: "√x",  type: "func", action: onSquareRootClick},
            {face: "÷", type: "func", action: () => onOperationClick("÷")},
        ],
        [ 
            {face: "7",  type: "digit", action: onDigitClick},
            {face: "8", type:  "digit", action: onDigitClick},
            {face: "9",  type: "digit", action: onDigitClick},
            {face: "×", type: "func", action: () => onOperationClick("×")},
        ],
        [ 
            {face: "4",  type: "digit", action: onDigitClick},
            {face: "5", type:  "digit", action: onDigitClick},
            {face: "6",  type: "digit", action: onDigitClick},
            {face: "−", type: "func", action: () => onOperationClick("−")},
        ],
        [ 
            {face: "1",  type: "digit", action: onDigitClick},
            {face: "2",  type: "digit", action: onDigitClick},
            {face: "3",  type: "digit", action: onDigitClick},
            {face: "+", type: "func", action: () => onOperationClick("+")},
        ],
        [ 
            {face: "±",  type: "digit", action: onPmClick},
            {face: "0",  type: "digit", action: onDigitClick},
            {face: ".",  type: "digit", action: onDotClick},
            {face: "=", type: "func", action: calculate},
        ],        
    ];

    return <div className="calc border border-2 rounded-2 p-2">
        <div className="calc-expression">{expression}</div>
        <div className="calc-display" style={{fontSize: displayFontSize}}>{display}</div>
        {buttonObjects.map((row, index) => <div key={index} className="calc-row">
            {row.map(obj => <CalcButton2 key={obj.face} buttonObject={obj} />)}
        </div>)}
    </div>; 
    //return <div className="calc border border-2 rounded-2 p-2">
    //    <div className="calc-expression">{expression}</div>
    //    <div className="calc-display" style={{fontSize: displayFontSize}}>{display}</div>
    //    {buttons.map((row, index) => <div key={index} className="calc-row">
    //        {row.map(face => <CalcButton face={face} key={face} onClick={onButtonClick}/>)}
    //    </div>)}
    //</div>;
}