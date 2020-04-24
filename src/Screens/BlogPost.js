import React, {Fragment} from 'react'
import ReactHtmlParser from 'react-html-parser';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import LoadingDiv from '../Components/LoadingDiv';
import Comment from '../Components/Comment';
import firebase from '../firebase.js'

export default class BlogPost extends React.Component {
    constructor(props) {
        super(props);
        this.getPost()
    }
    state={}
    render(){
        let postId = this.props.match.params.postId
        if(postId=="about"||postId=="authors")
            return  <div className="App container">{ReactHtmlParser(this.state.content)}</div>
        return(
            <div className="App container">
                <br/>
                {!this.state.content?<LoadingDiv></LoadingDiv>:null}
                <h1 className="text-center">{this.state.title}</h1>
                <h3 className="text-center">{this.state.name?"By: "+this.state.name+" - "+this.state.date.toLocaleDateString()+"   "+this.state.date.toLocaleTimeString():null}</h3>
                {ReactHtmlParser(this.state.content)}
                <br/>
                <br/>
                {this.state.comments?<div><h2 className="text-center">Comments:</h2><br/>{this.commentInput()}{this.state.comments}</div>:null}
                <br/>
            </div>
        )
    }

    commentInput = ()=>{
        if(!this.state.writing)
            return <div><button className="btn btn btn-outline-success btn-block" onClick={()=>this.setState({writing:true})}>Create Comment</button><br/></div>
        return(
            <div>
            <input class="form-control" id="nameInput" placeholder="Type your name here"></input><br/>
            <textarea className="form-control" id="textInput" rows="3" placeholder="Type your comment here"></textarea><br/>
            <button className="btn btn btn-outline-success btn-block" onClick={this.post}>Post</button><br/>
            </div>
        )
    }

    post = () =>{
        const postRef = firebase.database().ref(this.props.match.params.postId)
        let name = document.getElementById("nameInput").value
        let text = document.getElementById("textInput").value
        if(name.trim()=="" || text.trim()=="")
            alert("Please include a name and a comment before posting");
        else{
            let postKey = postRef.child('comments').push().key
            postRef.child('comments').update({[postKey]:{name,text}})
        }
    }

    componentDidMount(){
        const postRef = firebase.database().ref(this.props.match.params.postId)
        postRef.child('views').transaction(function(views) {
            return (views || 0) + 1;
        });
        postRef.child('comments').on('value',(snapshot)=>{
            let commentsEl = [];
            let comments = snapshot.val()
            if(comments)
                for(let commentID in comments){
                    let comment = comments[commentID]
                    commentsEl.push(<Comment name={comment.name?comment.name:"No Name"} text={comment.text?comment.text:"No Text"}></Comment>)
                }
            this.setState({comments:commentsEl})
        })
    }

    getPost = ()=>{
        fetch("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+this.props.match.params.postId).then((res)=>res.json()).then((post)=>{
            console.log(post)
          this.setState({name:post.author.first_name+" "+post.author.last_name,title:post.title,content:post.content, date:new Date(post.date)})
        }).catch((err)=>{
            this.setState({content:`<h6 class="text-center">Double check your link!</h6>`,title:"Couldn't find the post you are looking for"})
        })
      }
}