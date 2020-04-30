import React from 'react'

export default class Comment extends React.Component {
    getColor(){ 
        return "hsl(" + 360 * Math.random() + ',' + (25 + 70 * Math.random()) + '%,' + (85 + 10 * Math.random()) + '%)'
    }      

    render(){
        let color = this.getColor()
        console.log(color)
        return(
            <div className="comment" style={{borderRadius:"5px",borderWidth:"2px", borderColor:color, color:color, borderStyle:"solid", padding: "5px", margin:"10px"}}>
                <h5 style={{paddingLeft:"10px", textDecoration:"underline"}}>{this.props.name}</h5><br/>
                <p>{this.props.text}</p>
            </div>
        )
    }
}