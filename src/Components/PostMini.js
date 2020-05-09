import React from 'react'
import ReactHtmlParser from 'react-html-parser';
import { Link } from 'react-router-dom';
import firebase from '../firebase.js';
import HomeItem from './HomeItem.js';
const readingTime = require('reading-time');
const rs = require('text-readability')
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

    tag = (category, color) =>{
        return <small key={category} style={{display:"inline-block", paddingLeft:5,paddingRight:5,marginLeft:5,marginRight:3, paddingBottom:2, borderRadius:5, backgroundColor:color?color:"white", color:color?"white":"black"}}>{category}</small>
    }

    easeOfReading = (content) =>{
        let score = rs.fleschReadingEase(content)
        if(score>75)
            return "Easy"
        if(score>50)
            return "Intermediate"
        if(score>25)
            return "Advanced"
        return "Very Advanced"
    }

    render(){
        let catagories = []
        //console.log(this.props.categories)
        if(this.props.categories)
            for(let category in this.props.categories)
                catagories.push(this.tag(category))
        catagories.push(this.tag(readingTime(this.props.content).text, "grey"))
        catagories.push(this.tag("Readability: "+this.easeOfReading(this.props.content.replace(/<[^>]*>?/gm, '')), "grey"))
        return(
            <HomeItem>
                <div className="card" id={this.props.id}>
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
                        { (this.props.name.trim()?this.props.name:"Anonymous Submission") +" - "+this.props.date.toLocaleDateString()+" - 👀"+(window.location.search !== "?showBtn=false"?(this.state.views+" 💬"+this.state.comments):"")}
                    </div>
                </div>
            </HomeItem>
        )
    }
}