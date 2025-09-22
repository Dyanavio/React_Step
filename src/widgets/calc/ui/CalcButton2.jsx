import './CalcButton.css'

export default function CalcButton2({buttonObject})
{
    const isDigital = buttonObject.type == 'digit';
    return <button onClick={() => buttonObject.action(buttonObject.face)} className={"calc-button " + 
        (isDigital ? "calc-button-digit" : "calc-button-func")}>
        {buttonObject.face}
    </button>;
}