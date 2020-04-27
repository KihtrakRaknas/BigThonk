import React from 'react';
import PostMini from '../Components/PostMini';
import LoadingDiv from '../Components/LoadingDiv';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {};
    this.getPosts();
    this.resetPageTags()
  }

  render(){
    return (
      <div className="App container">
        <div id="Posts" className="row">
          {this.state.miniPosts?this.state.miniPosts:<LoadingDiv></LoadingDiv>}
        </div>
      </div>
    );
  }

  getPosts = ()=>{
    fetch("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/").then((res)=>res.json()).then((postsJSON)=>{
      let miniPosts = [];
      for(let post of postsJSON.posts){
        console.log(post)
        miniPosts.push(<PostMini id={post.slug} text={post.excerpt} date={new Date(post.date)} title={post.title} img={post.post_thumbnail?post.post_thumbnail.URL:null} name={post.author.first_name+" "+post.author.last_name} key={post.id}></PostMini>)
      }
      this.setState({miniPosts})
    }).catch(()=>{
      fetch('https://wordpress-redirect.herokuapp.com/?url='+encodeURIComponent("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/")).then((res)=>res.json()).then((postsJSON)=>{
        let miniPosts = [];
        for(let post of postsJSON.posts){
          console.log(post)
          miniPosts.push(<PostMini id={post.slug} text={post.excerpt} date={new Date(post.date)} title={post.title} img={post.post_thumbnail?post.post_thumbnail.URL:null} name={post.author.first_name+" "+post.author.last_name} key={post.id}></PostMini>)
        }
        this.setState({miniPosts})
      })
    })
  }

  resetPageTags = (post)=>{
    document.title = "A Lack Of Clarity!";
    document.querySelectorAll('[property="og:title"]')[0].setAttribute('content',"A Lack Of Clarity! - Home Page")
    document.getElementsByTagName('meta').namedItem('description').setAttribute('content',"A blog written by some high schoolers. Exploring the topics we find interesting. Read if you dare.")
    document.querySelectorAll('[property="og:description"]')[0].setAttribute('content',"Check out the blog!")
    document.querySelectorAll('[property="og:image"]')[0].setAttribute('content',"")
    document.querySelectorAll('[property="og:type"]')[0].setAttribute('content','website')
    document.querySelectorAll('[property="og:url"]')[0].setAttribute('content',window.location.href)
  }
}
