import React from 'react'

export default class Comment extends React.Component {
    constructor(props){
        super(props);
        this.state = {time: this.getTimeElapsed(this.props.time)}
    }
    getColor(){ 
        return "hsl(" + 360 * Math.random() + ',' + (25 + 70 * Math.random()) + '%,' + (85 + 10 * Math.random()) + '%)'
    }      

    render(){
        let color = this.getColor()
        console.log(color)
        //className="comment"
        return(
            <div className="media-body p-2 shadow-sm rounded bg-dark mb-1" style={{borderColor:color, borderStyle:"solid", borderWidth:"1px"}} itemprop="comment">
                <small className="float-right text-muted">{this.state.time}</small>
                <h5 style={{paddingLeft:"10px", color:color}} className="mt-0 mb-1">{this.props.name}</h5>
                <p style={{marginBottom:0}}>{this.props.text}</p>
            </div>
        )
    }
    
    updateTime = () =>{
        this.setState({time: this.getTimeElapsed(this.props.time)})
    }

    getTimeElapsed = (time) =>{
        if(!time)
            return""
        var timeNum = new Date().getTime() - time
        timeNum = Math.floor(timeNum/1000)// seconds
        if(timeNum<60){
            setTimeout(this.updateTime,1000)
            return timeNum+` second${timeNum!=1?"s":""} ago`
        }
        timeNum = Math.floor(timeNum/60)// minutes
        if(timeNum<60){
            setTimeout(this.updateTime,1000*60)
            return timeNum+` minute${timeNum!=1?"s":""} ago`
        }
        timeNum = Math.floor(timeNum/60)// hours
        if(timeNum<24){
            setTimeout(this.updateTime,1000*60*60)
            return timeNum+` hour${timeNum!=1?"s":""} ago`
        }
        timeNum = Math.floor(timeNum/24)// days
        if(timeNum<7){
            setTimeout(this.updateTime,1000*60*60*24)
            return timeNum+` day${timeNum!=1?"s":""} ago`
        }
        timeNum = Math.floor(timeNum/7)// weeks
        if(timeNum<365.25/7){
            setTimeout(this.updateTime,1000*60*60*24*7)
            return timeNum+` week${timeNum!=1?"s":""} ago`
        }
        setTimeout(this.updateTime,1000*60*60*24*365.25)
        timeNum = Math.floor(timeNum/(365.25/7))// years
        return timeNum+` year${timeNum!=1?"s":""} ago`
    }
}