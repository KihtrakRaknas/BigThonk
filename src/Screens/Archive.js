import React from 'react';
import LoadingDiv from '../Components/LoadingDiv';

export default class Archive extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {posts:[]};
    this.page = 0;
    this.getPosts();
    this.resetPageTags()
  }

  render(){
    return (
      <div className="App container">
          <br/>
          {this.state.posts?this.state.posts:<LoadingDiv></LoadingDiv>}
      </div>
    );
  }

  getPosts = ()=>{
    this.page++;
    console.log(this.page)
    let link = "https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/?order=ASC&number=100&page="+this.page
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
    let posts = [...this.state.posts]
    for(let post of postsJSON.posts){
      //console.log(post)
      posts.push(<p key={post.slug}><a href={"https://kihtrak.com/clarity/"+post.slug} >{`${new Date(post.date).toLocaleDateString()} - ${post.title} by: ${post.author.first_name+" "+post.author.last_name}`}</a></p>)
    }
    this.setState({posts})
    if(postsJSON.meta.next_page)
        this.getPosts()
  }

  resetPageTags = ()=>{
                                                                document.title = "A Lack Of Clarity!";
    document.querySelectorAll('[property="og:title"]')[0].setAttribute('content',"A Lack Of Clarity! - Archive")
    document.getElementsByTagName('meta').namedItem('description').setAttribute('content',"An archive of all the posts on this blog")
       document.querySelectorAll('[property="og:description"]')[0].setAttribute('content',"An archive of all the posts on this blog")
    document.querySelectorAll('[property="og:image"]')[0].setAttribute('content',"https://github.com/KihtrakRaknas/clarity/raw/master/src/Images/LoCLogo.svg")
    document.querySelectorAll('[property="og:type"]')[0].setAttribute('content','website')
    document.querySelectorAll('[property="og:url"]')[0].setAttribute('content',"https://kihtrak.com/clarity/archive")
         document.querySelectorAll('[rel="canonical"]')[0].setAttribute('href',"https://kihtrak.com/clarity/archive")
  }
}
