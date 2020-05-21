import React from 'react'
import ReactHtmlParser from 'react-html-parser';
import LoadingDiv from '../Components/LoadingDiv';
import Comment from '../Components/Comment';
import firebase from '../firebase.js'
import '../WordPressCore.css';
import '../App.css';
import ShareBar from '../Components/ShareBar';

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

    state={comments:[],commentsLength:0}

    render(){
        let postId = this.props.match?this.props.match.params.postId:"feed"
        if(postId==="about")
            return  <div className="App container"><br/>{ReactHtmlParser(this.state.content)}</div>
        console.log(this.state.err)
        if(this.state.err)
            return  <div className="App container"><br/><br/><h1 className="text-center">Couldn't find the post you are looking for</h1><h3 className="text-center">Double check your link!</h3></div>
        console.log("rendering blogpost ");
        console.log(this.state.content)
        //console.log(temp)
        return(<div className="all-screen-container" itemscope itemtype="http://schema.org/BlogPosting">
            <div id="blogpost-screen" className="App container blogpost">
                    <br/>
                    {!this.state.content && false?<LoadingDiv></LoadingDiv>:<div>
                        <h1 className="text-center" itemprop="headline">{this.state.title}</h1>
                        <div className="d-flex justify-content-between author-box"><p rel="author">{this.state.name&&this.state.name.trim()?this.state.name:<em>Anonymous Submission</em>}</p>{this.state.date?<p><span>Published </span><span>{`${this.state.date.toLocaleString('default', { month: 'short', day: "numeric", year: "numeric"})}   ${this.state.date.toLocaleTimeString().replace(/([\d])(:[\d]{2})(:[\d]{2})(.*)/, "$1$4")}`}</span></p>:null}</div>
                        <hr/>
                        <br/>
                        <div itemprop="articleBody">{ReactHtmlParser(this.state.content)}</div>
                        <br/>
                        <hr/>
                        <ShareBar url={"https://kihtrak.com/clarity/"+this.postId} title={this.state.title} name={this.state.name} image={this.state.image}/>
                        <h2 className="text-center">Comments: <span itemprop="commentCount">({this.state.commentsLength})</span> </h2><br/>{this.commentInput()}
                        {this.state.comments.length>0?<div>{this.state.comments}{this.commentsObj&&Object.keys(this.commentsObj).length>0?<button className="btn btn btn-outline-info btn-block" onClick={this.get5Comments}>Show more comments</button>:null}</div>:<p><em>No comments yet. You could be the first!</em></p>}
                        <br/>
                    </div>}
            </div>
        </div>)
    }
    
    componentDidUpdate = () =>{
        if(document.getElementsByClassName("App container").length>0){
            if(document.getElementsByClassName("App container")[document.getElementsByClassName("App container").length-1].classList.contains("blogpost"))
                console.log("WORKING NORMALLY")
            else{
                console.log("adding blogpost")
                document.getElementsByClassName("App container")[document.getElementsByClassName("App container").length-1].classList.add("blogpost")
            }
        }
    }   

    commentInput = ()=>{
        if(!this.state.writing)
            return <div><button className="btn btn btn-outline-success btn-block" onClick={()=>this.setState({writing:true})}>Create Comment</button><br/></div>
        return(
            <div>
            <input className="form-control" id="nameInput" placeholder="Type your name here"></input><br/>
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
            this.oldKeys.push(postKey)
            postRef.child('comments').update({[postKey]:{name,text,time:firebase.database.ServerValue.TIMESTAMP}})
            document.getElementById("textInput").value = ""
            let commentsEl = [...this.state.comments]
            commentsEl.unshift(<Comment name={name} text={text} time={new Date().getTime()} key={text}></Comment>)
            this.setState({comments:commentsEl,commentsLength:(this.commentsObj?Object.keys(this.commentsObj).length:0)+commentsEl.length, writing:false})
        }
    }

    checkFirebase = () =>{
        console.log("post: "+this.postId)
        const postRef = firebase.database().ref(this.postId)
        console.log("User Agent: "+navigator.userAgent)
        if(!navigator.userAgent.includes("headless")&&!navigator.userAgent.includes("ReactSnap"))
            postRef.child('views').transaction(function(views) {
                return (views || 0) + 1;
            }).catch(err=>{
                console.log("FIREBASE DIDN'T UPDATE")
                console.log(err)
            })
        postRef.child('comments').on('value',(snapshot)=>{
            let snapVal = snapshot.val()?snapshot.val():{}
            if(this.oldKeys){
                for(let commentID in snapVal)
                    if(this.oldKeys.indexOf(commentID)==-1)
                        this.commentsObj[commentID] = snapVal[commentID]
            }else
                this.commentsObj = snapVal;
            this.oldKeys = Object.keys(snapVal)
            console.log(Object.keys(this.commentsObj).length)
            this.setState({commentsLength: Object.keys(this.commentsObj).length + this.state.comments.length});
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
                commentsEl.push(<Comment name={comment.name?comment.name:"No Name"} text={comment.text?comment.text:"No Text"} time={comment.time} key={JSON.stringify(comment)}></Comment>)
            }
        console.log(commentsEl.length)
        this.setState({comments:commentsEl,commentsLength:(this.commentsObj?Object.keys(this.commentsObj).length:0)+commentsEl.length})
    }

    getPost = ()=>{
        if(this.props.post){
            let post = this.props.post;
            //console.log(post)
            
            this.updatePageTags(post)
            this.state = {name:post.author.first_name+" "+post.author.last_name,title:post.title,content:post.content, date:new Date(post.date), image:post.post_thumbnail?post.post_thumbnail.URL:"", err:false, comments:[]}
            this.checkFirebase();
        }else{
            let postId = this.postId === "about"?"first-blog-post":this.postId
            console.log(postId)
            console.log("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId)
            console.log(navigator.userAgent)
            if(navigator.userAgent.includes("headless"))
                this.getPostFetch('https://wordpress-redirect.herokuapp.com/?url='+encodeURIComponent("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId)).catch((err)=>{
                    console.log(err)
                    this.setState({err:true})
                })
            else
                this.getPostFetch("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId).catch((err)=>{
                    console.log('https://wordpress-redirect.herokuapp.com/?url='+encodeURIComponent("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId))
                    this.getPostFetch('https://wordpress-redirect.herokuapp.com/?url='+encodeURIComponent("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId)).catch((err)=>{
                        console.log(err)
                        this.setState({err:true})
                    })
                })
        }
      }

      getPostFetch = (url) =>{
          return fetch(url).then((res)=>res.json()).then((post)=>{
            if(post.error)
                this.setState({err:true})
            else{
                //console.log(post)
                console.log(post.author.first_name)
                this.updatePageTags(post)
                console.log("page tags updated")
                this.setState({name:post.author.first_name+" "+post.author.last_name,title:post.title,content:post.content, date:new Date(post.date), image:post.post_thumbnail?post.post_thumbnail.URL:"", err:false})
                console.log("STATE UPDATED")
                if(this.postId !== "about")
                    this.checkFirebase();
            }
        })
      }

      updatePageTags = (post)=>{
                                                                     document.title = post.title;
        document.querySelectorAll('[property="og:title"]')[0].setAttribute('content', post.title)
        document.getElementsByTagName('meta').namedItem('author').setAttribute('content',post.author.first_name+" "+post.author.last_name)
        if(document.querySelectorAll('[property="article:published_time"]').length>0)
            document.querySelectorAll('[property="article:published_time"]')[0].setAttribute('content',post.date)
        else{
            let tag = document.createElement("meta")
            tag.setAttribute('property',"article:published_time")
            tag.setAttribute('content',post.date)
            document.head.appendChild(tag)
        }
        if(document.querySelectorAll('[property="article:modified_time"]').length>0)
            document.querySelectorAll('[property="article:modified_time"]')[0].setAttribute('content',post.modified)
        else{
            let tag = document.createElement("meta")
            tag.setAttribute('property',"article:modified_time")
            tag.setAttribute('content',post.modified)
            document.head.appendChild(tag)
        }
        document.getElementsByTagName('meta').namedItem('description').setAttribute('content',post.excerpt?post.excerpt.replace(/<[^>]*>?/gm, '').replace(' [&hellip;]','...'):"A article titled: "+post.title)
           document.querySelectorAll('[property="og:description"]')[0].setAttribute('content',post.excerpt?post.excerpt.replace(/<[^>]*>?/gm, '').replace(' [&hellip;]','...'):"A article titled: "+post.title)
        document.querySelectorAll('[property="og:image"]')[0].setAttribute('content',post.post_thumbnail?post.post_thumbnail.URL:"")
        document.querySelectorAll('[property="og:type"]')[0].setAttribute('content','article')
        document.querySelectorAll('[property="og:url"]')[0].setAttribute('content',"https://kihtrak.com/clarity/"+post.slug+"/")
             document.querySelectorAll('[rel="canonical"]')[0].setAttribute('href',"https://kihtrak.com/clarity/"+post.slug+"/")
      }
}