function App(){
    const [displayTime,setDisplayTime] = React.useState(5);
    const [breakTime,setBreakTime] = React.useState(3);
    const [sessionTime,setSessionTime] = React.useState(5);
    const [timeOn,setTimeOn] = React.useState(false);
    const [onBreak,setOnBreak] = React.useState(false);
    const [breakAudio,setBreakAudio] = React.useState(
        new Audio("./alarm.mp3")
    )

    const playBreakAudio = () =>{
        breakAudio.currentTime = 0;
        breakAudio.play()
    }
    
    const formatTime = (time) =>{
        let minutes = Math.floor(time/60)
        let seconds = time % 60;
        return(
            (minutes < 10 ? "0" + minutes : minutes) + 
            ":" +
            (seconds < 10 ? "0" + seconds : seconds) 
        )
    }

    const changeTime = (amount,type) =>{
        if(type == "break"){
            if(breakTime <= 60 && amount < 0){
                return;
            }
            setBreakTime((prev) => prev + amount)
        }else{
            if(sessionTime <= 60 && amount < 0){
                return;
            }
            setSessionTime((prev) => prev + amount)
            if(!timeOn){
                setDisplayTime(sessionTime + amount)
            }
        }
    }
    const controlTime = () =>{
        let second = 1000;
        let date = new Date().getTime()
        let nextDate = new Date().getTime() + second
        let onBreakVariable = onBreak;

        if(!timeOn){
            let interval = setInterval(() => {
                date = new Date().getTime();
                if(date > nextDate){
                    setDisplayTime((prev) =>{
                        if(prev <= 0 && !onBreakVariable){
                            playBreakAudio();
                            onBreakVariable =true;
                            setOnBreak(true)
                            return breakTime
                        }
                        else if(prev <= 0 && onBreakVariable){
                            playBreakAudio();
                            onBreakVariable =false;
                            setOnBreak(false)
                            return sessionTime
                        }

                        return prev - 1;
                    });
                    nextDate += second
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem("interval-id",interval);
        }

        if(timeOn){
            clearInterval(localStorage.getItem("interval-id"))
        }
        setTimeOn(!timeOn)
    }

    const resetTime = () =>{
        setDisplayTime(25*60)
        setBreakTime(5*60)
        setSessionTime(25*60)
    }

return(
    <>
    <div className="center-align">
        <h1>Pomodoro Clock</h1>
        <div className="dual-container">
        <Length 
    title={"break length"}
    changeTime={changeTime}
    type={"break"}
    time={breakTime} 
    formatTime={formatTime}
    />
    <Length 
    title={"session length"}
    changeTime={changeTime}
    type={"session"}
    time={sessionTime} 
    formatTime={formatTime}
    />
    </div>
    <h1>{formatTime(displayTime)}</h1>
    <button className="btn-large deep-purple lighten-2" onClick={controlTime}>
        {timeOn ? 
            <i className="material-icons">pause_circle_filled</i> 
        :
            <i className="material-icons">play_circle_filled</i> 

        }
    </button>
    <button className="btn-large deep-purple lighten-2" onClick={resetTime}>
    <i className="material-icons">autorenew</i> 

    </button>
    </div>
     </>
)
}

function Length ({ title, changeTime,type,time,formatTime}){
    return(
        <div>
            <h3>{title}</h3>
            <div className="time-sets">
                <button className="btn-small deep-purple lighten-2"
                onClick={()=> changeTime(-60,type)}
                >
                    <i className="material-icons">arrow_downward</i>
                </button>
                <h3>{formatTime(time)}</h3>
                <button className="btn-small deep-purple lighten-2"
                onClick={()=> changeTime(60,type)}
                
                >
                    <i className="material-icons">arrow_upward</i>
                </button>
            </div>
        </div>

    );
}


ReactDOM.render(<App/> ,document.getElementById("root"))