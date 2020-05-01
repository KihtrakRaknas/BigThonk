import React from 'react'
import ReactHtmlParser from 'react-html-parser';
import { Link } from 'react-router-dom';
import firebase from '../firebase.js';
export default class PostMini extends React.Component {

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
        let catagories = []
        console.log(this.props.categories)
        if(this.props.categories)
            for(let category in this.props.categories)
                catagories.push(<small key={category} style={{paddingLeft:5,paddingRight:5,marginLeft:5,marginRight:3, paddingBottom:2, borderRadius:5, backgroundColor:"white", color:"black"}}>{category}</small>)
        else
            catagories = [<small key="err" style={{marginRight:10,marginLeft:10, backgroundColor:"grey"}}>No categories found!</small>]
        return(
            <div className="" id={this.props.id}>
                <div className="card" >
                    {this.props.img?<img className="card-img-top" src={this.props.img} alt={this.props.title}/>:null}
                    <div className="card-body" >
                        <h3 className="card-title"><strong>{this.props.title}</strong></h3>
                        <div className="card-text categories" style={{textAlign:"center"}}>{catagories}</div>
                        <div className="card-text">{ReactHtmlParser(this.props.text.replace(' [&hellip;]','...'))}</div>
                        <div className="btn-div">
                        {window.location.search !== "?showBtn=false"?<Link to={"/"+this.props.id} className="btn btn btn-outline-primary">Click Here to Read More</Link>:null}
                        </div>
                    </div>
                    <div className="card-footer">
                        { this.props.name +" - "+this.props.date.toLocaleDateString()+" - 👀"+(window.location.search !== "?showBtn=false"?(this.state.views+" 💬"+this.state.comments):"")}
                    </div>
                </div>
            </div>
        )
    }
}