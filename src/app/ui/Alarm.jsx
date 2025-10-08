import { useEffect, useRef, useState } from "react";

export default function Alarm({alarmData})
{
  let iconCode = "" 
  const [isResolved, setResolved] = useState(false);
  const closeRef = useRef();
  const modalRef = useRef();

  if(alarmData.icon)
  {
    if(alarmData.icon == 'info')
    {
        iconCode = "bi bi-info-circle";
    }
    if(alarmData.icon == 'warning')
    {
        iconCode = "bi bi-exclamation-triangle";
    }
    if(alarmData.icon == 'stop')
    {
        iconCode = "bi bi-sign-stop";
    }
  }

  const resolveClick = (e) => 
  {
    setResolved(true);
    alarmData.resolve(e.target.getAttribute('status'));
    setTimeout(() => {closeRef.current.click(); setResolved(false);}, 4);
  };
  
  const rejectClick = () => 
  {
    if(!isResolved)
    {
      alarmData.reject();
    }
  };

   useEffect(() => {
        modalRef.current.addEventListener('hide.bs.modal', rejectClick);
        
        return () => {
            if(modalRef.current)
            {
                modalRef.current.removeEventListener('hide.bs.modal', rejectClick);
            }
        }
    }, [alarmData]);

    const btnClasses = ["btn-dark", "btn-danger", "btn-secondary", "btn-success", "btn-warning", "btn-primary", "btn-light", "btn-info"];

    return <div ref={modalRef} className="modal fade" id="alarmModal" tabIndex="-1" aria-labelledby="alarmModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="d-flex align-items-start delete-cart-modal-header modal-header justify-content-center" style={{background: alarmData.color ?? "white"}}>
                    <div style={{ width: "99%" }}>
                        <div className="icon-box">
                            {alarmData.icon && <i className={iconCode}></i>}
                            
                        </div>
                    </div>
                    <div style={{ width: "1%" }}>
                            <button onClick={rejectClick} ref={closeRef} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div className="modal-body text-center">
                    <h4>{alarmData.title}</h4>
                    <p id="delete-cart-items-message">{alarmData.message}</p>
                    {typeof alarmData.buttons == 'object' && alarmData.buttons.map((btn, index) => 
                        <button key={btn.title} status={btn.status} 
                        onClick={resolveClick} type="button" 
                        className={"btn " + (btnClasses.includes(`btn-${btn.status}`) ? `btn-${btn.status}` : btnClasses[index % btnClasses.length]) + " mx-1 my-1"} >
                            {btn.title}
                        </button>)
                    }
                </div>
            </div>
        </div>
    </div>
  //return <div ref={modalRef} className="modal fade" id="alarmModal" tabIndex="-1" aria-labelledby="alarmModalLabel" aria-hidden="true">
  //  <div className="modal-dialog" >
  //    <div className="modal-content">
  //      <div className="modal-header">
  //        <h1 className="modal-title fs-5" id="alarmModalLabel">{alarmData.title}</h1>
  //        <button onClick={rejectClick} ref={closeRef} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  //        </div>
  //        <div className="modal-body">{alarmData.message}</div>
  //        <div className="modal-footer">
  //          {alarmData.negativeButtonText && 
  //            <button status="Negative" onClick={resolveClick} type="button" className="btn btn-secondary" >{alarmData.negativeButtonText}</button>
  //          }
  //          {alarmData.positiveButtonText && 
  //            <button status="Positive" onClick={resolveClick} type="button" className="btn btn-primary">{alarmData.positiveButtonText}</button>
  //          }
  //          </div>
  //      </div>
  //    </div>
  //  </div>;
}
