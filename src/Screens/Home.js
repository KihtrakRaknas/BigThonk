import React from 'react';
import PostMini from '../Components/PostMini';
import LoadingDiv from '../Components/LoadingDiv';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {pages:[]};
    this.readyToCheckForMore = false;
    this.page = 0;
    this.getPosts();
    this.resetPageTags()
  }

  componentDidMount(){
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () =>{
    if(this.readyToCheckForMore!=false && this.isMore && window.scrollY + window.innerHeight*2>window.scrollMaxY){
      console.log("RENDER MORE"+this.page)
      this.getPosts()
    }
}

  render(){
    return (
      <div className="App container-fluid">
          {this.state.pages?this.state.pages:<LoadingDiv></LoadingDiv>}
      </div>
    );
  }

  componentDidUpdate (){
    if(this.state.pages.length>0 && window.location.href.includes("#")){
      let scrollId = window.location.href.substring(window.location.href.indexOf("#")+1)
      console.log(scrollId)
      if(document.getElementById(scrollId))
        document.getElementById(scrollId).scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    }
  }

  getPosts = ()=>{
    this.page++;
    console.log(this.page)
    this.readyToCheckForMore=false;
    let link = "https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/?page="+this.page
    fetch(link).then((res)=>res.json()).then((postsJSON)=>{
      this.updateWithPostsJSON(postsJSON)
    }).catch((err)=>{
      console.log(err)
      fetch('https://wordpress-redirect.herokuapp.com/?url='+encodeURIComponent(link)).then((res)=>res.json()).then((postsJSON)=>{
        this.updateWithPostsJSON(postsJSON)
      }).catch((err)=>{
        console.log(err)
      })
    })
  }

  updateWithPostsJSON = (postsJSON) =>{
    if(postsJSON.meta.next_page)
      this.isMore = true;
    else
      this.isMore = false;
    this.readyToCheckForMore = true;
    let pages = [...this.state.pages]
    if(this.state.pages.length>0 && this.page!=1){
      pages.push(<hr/>)
    }
    let miniPosts = [];
    for(let post of postsJSON.posts){
      //console.log(post)
      miniPosts.push(<PostMini id={post.slug} text={post.excerpt} date={new Date(post.date)} title={post.title} img={post.post_thumbnail?post.post_thumbnail.URL:null} name={post.author.first_name+" "+post.author.last_name} key={post.slug} categories={post.categories}></PostMini>)
    }
    pages.push(<div id="Posts" className="card-columns">{miniPosts}</div>)
    this.setState({pages})
  }

  resetPageTags = (post)=>{
                                                                document.title = "A Lack Of Clarity!";
    document.querySelectorAll('[property="og:title"]')[0].setAttribute('content',"A Lack Of Clarity! - Home Page")
    document.getElementsByTagName('meta').namedItem('description').setAttribute('content',"A blog written by some high schoolers. Exploring the topics we find interesting. Read if you dare.")
       document.querySelectorAll('[property="og:description"]')[0].setAttribute('content',"Check out the blog!")
    document.querySelectorAll('[property="og:image"]')[0].setAttribute('content',"https://github.com/KihtrakRaknas/clarity/raw/master/src/Images/LoCLogo.svg")
    document.querySelectorAll('[property="og:type"]')[0].setAttribute('content','website')
    document.querySelectorAll('[property="og:url"]')[0].setAttribute('content',"https://kihtrak.com/clarity/")
         document.querySelectorAll('[rel="canonical"]')[0].setAttribute('href',"https://kihtrak.com/clarity/")
  }
}
