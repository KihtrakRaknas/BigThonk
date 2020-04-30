import React from 'react'
import ReactHtmlParser from 'react-html-parser';
import LoadingDiv from '../Components/LoadingDiv';
import Comment from '../Components/Comment';
import firebase from '../firebase.js'
import '../WordPressCore.css';
import '../App.css';

export default class BlogPost extends React.Component {
    constructor(props) {
        super(props);
        let postId;
        if(this.props.post)
            postId = this.props.post.slug
        else
            postId = this.props.match.params.postId
        console.log(postId)
        this.postId = postId;
        this.getPost()
    }

    state={comments:[]}

    render(){
        let postId = this.props.match?this.props.match.params.postId:"feed"
        if(postId==="about")
            return  <div className="App container"><br/>{ReactHtmlParser(this.state.content)}</div>
        if(this.state.err)
            return  <div className="App container"><br/><br/><h1 className="text-center">Couldn't find the post you are looking for</h1><h3 className="text-center">Double check your link!</h3></div>
        console.log("rendering blogpost ");
        return(
            <div className="App container blogpost">
                    <br/>
                    {!this.state.content?<LoadingDiv></LoadingDiv>:<div>
                        <h1 className="text-center">{this.state.title}</h1>
                        <div className="d-flex justify-content-between author-box"><p>{this.state.name?this.state.name:null}</p><p>{this.state.date?this.state.date.toLocaleDateString()+"   "+this.state.date.toLocaleTimeString():null}</p></div>
                        <hr/>
                        <br/>
                        {ReactHtmlParser(this.state.content)}
                        <br/>
                        <hr/>
                        <br/>
                        <h2 className="text-center">Comments: </h2><br/>{this.commentInput()}
                        {this.state.comments.length>0?<div>{this.state.comments}{this.commentsObj&&Object.keys(this.commentsObj).length>0?<button className="btn btn btn-outline-info btn-block" onClick={this.get5Comments}>Show more comments</button>:null}</div>:<p><em>No comments yet. You could be the first!</em></p>}
                        <br/>
                    </div>}
            </div>
        )
    }
    
    componentDidUpdate = () =>{
        if(document.getElementsByClassName("App container")[0].classList.contains("blogpost"))
            console.log("WORKING NORMALLY")
        else{
            console.log("adding blogpost")
            document.getElementsByClassName("App container")[0].classList.add("blogpost")
        }
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
        const postRef = firebase.database().ref(this.postId)
        let name = document.getElementById("nameInput").value
        let text = document.getElementById("textInput").value
        if(name.trim()==="" || text.trim()==="")
            alert("Please include a name and a comment before posting");
        else{
            let postKey = postRef.child('comments').push().key
            postRef.child('comments').update({[postKey]:{name,text}})
            document.getElementById("textInput").value = ""
        }
    }

    checkFirebase = () =>{
        console.log("post: "+this.postId)
        const postRef = firebase.database().ref(this.postId)
        if(!navigator.userAgent.includes("headless"))
            postRef.child('views').transaction(function(views) {
                return (views || 0) + 1;
            }).catch(err=>{
                console.log("FIREBASE DIDN'T UPDATE")
                console.log(err)
            })
        postRef.child('comments').on('value',(snapshot)=>{
            this.commentsObj = snapshot.val();
            if(this.state.comments.length===0)
                this.get5Comments();
        })  
    }

    get5Comments = () =>{
        let commentsEl = [];
        if(this.state.comments)
            commentsEl = [...this.state.comments];
        if(this.commentsObj)
            for(var i = 0; i!==5; i++){
                if(Object.keys(this.commentsObj).length===0)
                    break;
                let commentID = Object.keys(this.commentsObj)[Math.floor(Math.random()*Object.keys(this.commentsObj).length)]
                let comment = JSON.parse(JSON.stringify(this.commentsObj[commentID]))
                delete this.commentsObj[commentID];
                commentsEl.push(<Comment name={comment.name?comment.name:"No Name"} text={comment.text?comment.text:"No Text"} key={JSON.stringify(comment)}></Comment>)
            }
        console.log(commentsEl.length)
        this.setState({comments:commentsEl})
    }

    getPost = ()=>{
        if(this.props.post){
            let post = this.props.post;
            //console.log(post)
            
            this.updatePageTags(post)
            this.state = {name:post.author.first_name+" "+post.author.last_name,title:post.title,content:post.content, date:new Date(post.date), err:false, comments:[]}
            this.checkFirebase();
        }else{
            let postId = this.postId === "about"?"first-blog-post":this.postId
            console.log(postId)
            console.log("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId)
            fetch("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId).then((res)=>res.json()).then((post)=>{
                //console.log(post)
                console.log(post.author.first_name)
                this.updatePageTags(post)
                console.log("page tags updated")
                this.setState({name:post.author.first_name+" "+post.author.last_name,title:post.title,content:post.content, date:new Date(post.date), err:false})
                console.log("STATE UPDATED")
                if(this.postId !== "about")
                    this.checkFirebase();
            }).catch((err)=>{
                console.log('https://wordpress-redirect.herokuapp.com/?url='+encodeURIComponent("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId))
                fetch('https://wordpress-redirect.herokuapp.com/?url='+encodeURIComponent("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId)).then((res)=>res.json()).then((post)=>{
                    //console.log(post)
                    this.updatePageTags(post)
                    this.setState({name:post.author.first_name+" "+post.author.last_name,title:post.title,content:post.content, date:new Date(post.date), err:false})
                    if(this.postId !== "about")
                        this.checkFirebase();
                }).catch((err)=>{
                    console.log(err)
                    this.setState({err:true})
                })
            })
        }
      }

      updatePageTags = (post)=>{
                                                                     document.title = post.title;
        document.querySelectorAll('[property="og:title"]')[0].setAttribute('content', post.title)
        document.getElementsByTagName('meta').namedItem('description').setAttribute('content',post.excerpt?post.excerpt.replace(/<[^>]*>?/gm, '').replace(' [&hellip;]','...'):"A article titled: "+post.title)
           document.querySelectorAll('[property="og:description"]')[0].setAttribute('content',post.excerpt?post.excerpt.replace(/<[^>]*>?/gm, '').replace(' [&hellip;]','...'):"A article titled: "+post.title)
        document.querySelectorAll('[property="og:image"]')[0].setAttribute('content',post.post_thumbnail?post.post_thumbnail.URL:"")
        document.querySelectorAll('[property="og:type"]')[0].setAttribute('content','article')
        document.querySelectorAll('[property="og:url"]')[0].setAttribute('content',"https://kihtrak.com/clarity/"+post.slug)
             document.querySelectorAll('[rel="canonical"]')[0].setAttribute('href',"https://kihtrak.com/clarity/"+post.slug)
      }
}