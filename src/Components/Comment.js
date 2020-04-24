import React, {Fragment} from 'react'

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
    }
    getColor(){ 
        return "hsl(" + 360 * Math.random() + ',' + (25 + 70 * Math.random()) + '%,' + (85 + 10 * Math.random()) + '%)'
    }      

    render(){
        console.log(this.getColor())
        return(
            <div className="comment" style={{borderRadius:"5px",borderWidth:"2px", borderColor:this.getColor(), color:this.getColor(), borderStyle:"solid", padding: "5px" }}>
                <h5 style={{paddingLeft:"10px", textDecoration:"underline"}}>{this.props.name}</h5>
                <p>{this.props.text}</p>
            </div>
        )
    }
}