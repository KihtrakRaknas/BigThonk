import React, {Fragment} from 'react'
import ReactHtmlParser from 'react-html-parser';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import firebase from '../firebase.js';
export default class PostMini extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        const postRef = firebase.database().ref(this.props.id)
        postRef.on('value',(snapshot)=>{
            let snap = snapshot.val()
            if(snap)
                this.setState({views: snap.views?snap.views:0,comments: snap.comments?Object.keys(snap.comments).length:0})
        })
    }
    state={
        views:0,
        comments:0
    }

    render(){
        return(
            <div className="col-sm-6">
                <div className="card" >
                    {this.props.img?<img className="card-img-top" src={this.props.img} alt="Card image cap"/>:null}
                    <div className="card-body" >
                        <h3 className="card-title">{this.props.title}</h3>
                        <p className="card-text">{ReactHtmlParser(this.props.text.replace(' [&hellip;]','...'))}</p>
                        <div className="btn-div">
                        <Link to={"/"+this.props.id}><a className="btn btn btn-outline-primary">Click Here to Read More</a></Link>
                        </div>
                    </div>
                    <div className="card-footer">
                        { this.props.name +" - "+this.props.date.toLocaleDateString()+" - 👀"+this.state.views+" 💬"+this.state.comments}
                    </div>
                </div>
            </div>
        )
    }
}