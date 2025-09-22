import './CalcButton.css'

export default function CalcButton({face, onClick})
{
    const isDigital = face.charAt(0) == '_';
    return <button onClick={() => onClick(face)} className={"calc-button " + 
        (isDigital ? "calc-button-digit" : "calc-button-func")}>
        {isDigital ? face.substring(1) : face}
    </button>;
}