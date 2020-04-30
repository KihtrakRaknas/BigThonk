import React from 'react';
import LoadingDiv from '../Components/LoadingDiv';
import BlogPost from './BlogPost.js'

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {};
    this.getPosts();
  }

  handleScroll = (event) =>{
    if(document.body.scrollHeight - window.innerHeight - window.scrollY <500)
        this.renderNewPost();
  }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll);
    }

  render(){
    return (
      <div className="App container">
        <div id="Posts" className="row">
          {this.state.posts?this.state.posts:<LoadingDiv></LoadingDiv>}
        </div>
      </div>
    );
  }

  getPosts = ()=>{
    fetch("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/").then((res)=>res.json()).then((postsJSON)=>{
        this.postsJSON = postsJSON.posts
        this.renderNewPost()
    }).catch(()=>{
      fetch('https://wordpress-redirect.herokuapp.com/?url='+encodeURIComponent("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/")).then((res)=>res.json()).then((postsJSON)=>{
        this.postsJSON = postsJSON.posts
        this.renderNewPost()
      })
    })
  }

  renderNewPost = () =>{
        let posts = [];
        if(this.state.posts)
            posts = [...this.state.posts]
        if(this.postsJSON && this.postsJSON.length>0){
            posts.push(<BlogPost post={this.postsJSON[0]}></BlogPost>)
            this.postsJSON.splice(0,1)
            this.setState({posts})
        }
  }

  resetPageTags = (post)=>{
    document.title = "Feed A Lack Of Clarity!";
    document.querySelectorAll('[property="og:title"]')[0].setAttribute('content',"Feed - A Lack Of Clarity!")
    document.getElementsByTagName('meta').namedItem('description').setAttribute('content',"A blog written by some high schoolers. Exploring the topics we find interesting. Read if you dare.")
    document.querySelectorAll('[property="og:description"]')[0].setAttribute('content',"This is the blog feed, it lets you veiw our posts all on one page!")
    document.querySelectorAll('[property="og:image"]')[0].setAttribute('content',"https://github.com/KihtrakRaknas/clarity/raw/master/src/Images/LoCLogo.svg")
    document.querySelectorAll('[property="og:type"]')[0].setAttribute('content','website')
    document.querySelectorAll('[property="og:url"]')[0].setAttribute('content',window.location.href)
  }
}
