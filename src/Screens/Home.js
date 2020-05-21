import React from 'react';
import PostMini from '../Components/PostMini';
import LoadingDiv from '../Components/LoadingDiv';
import EmailJoin from '../Components/EmailJoin'
import Masonry from 'react-masonry-component';
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {posts:[], categories:[<option value="" key="all">Show All Posts</option>]};
    this.readyToCheckForMore = false;
    this.page = 0;
    this.cat = ""
    this.getPosts();
    this.resetPageTags()
    this.getCategories()
    
  }

  componentDidMount(){
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () =>{
    if(this.readyToCheckForMore!=false && this.isMore && window.scrollY + window.innerHeight*3>document.body.scrollHeight){
      console.log("RENDER MORE"+this.page)
      this.getPosts()
    }
}

  render(){
    return (
        <div id="home-screen" className="App container-fluid">
          <select id="filter" className="custom-select mt-2" onChange={this.filterByCat}>
            {this.state.categories}
          </select>
          
          <Masonry className={'my-gallery-class'} style={{padding:0}}>
            {this.state.posts.length>0?this.state.posts:<LoadingDiv></LoadingDiv>}
          </Masonry>
          {/*<div className="row"></div>*/}
        </div>
    );
  }

  filterByCat = (event) =>{
    console.log(event.target.value)
    this.cat = event.target.value
    this.page = 0;
    this.setState({posts:[]})
    this.getPosts()
  }

  componentDidUpdate (){
    if(this.state.posts.length>0 && window.location.href.includes("#")){
      let scrollId = window.location.href.substring(window.location.href.indexOf("#")+1)
      console.log(scrollId)
      if(document.getElementById(scrollId))
        document.getElementById(scrollId).scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    }
  }

  getCategories = () =>{
    let link = "https://public-api.wordpress.com/rest/v1.1/sites/176343073/categories"
    fetch(link).then((res)=>res.json()).then((categoriesJSON)=>{
      this.updateWithCategoriesJSON(categoriesJSON)
    }).catch((err)=>{
      console.log(err)
      fetch('https://wordpress-redirect.herokuapp.com/?url='+encodeURIComponent(link)).then((res)=>res.json()).then((categoriesJSON)=>{
        this.updateWithCategoriesJSON(categoriesJSON)
      }).catch((err)=>{
        console.log(err)
      })
    })
  }

  updateWithCategoriesJSON = (categoriesJSON) =>{
    let categories = [...this.state.categories]
    for(let category of categoriesJSON.categories){
      if(category.post_count>0)
        categories.push(<option value={category.slug} key={category.slug}>{category.name}</option>)
    }
    this.setState({categories})
  }

  getPosts = ()=>{
    this.page++;
    console.log(this.page)
    this.readyToCheckForMore=false;
    let link = "https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/?category="+this.cat+"&page="+this.page
    console.log(link)
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
    if(postsJSON.meta.next_page || postsJSON.found>this.page*20)
      this.isMore = true;
    else
      this.isMore = false;
    this.readyToCheckForMore = true;
    /*let pages = [...this.state.pages]
    if(this.state.pages.length>0 && this.page!=1){
      pages.push(<hr key={"hr"+this.page}/>)
    }*/
    let miniPosts = [...this.state.posts];
    for(let post of postsJSON.posts){
      //console.log(post)
      miniPosts.push(<PostMini id={post.slug} text={post.excerpt} date={new Date(post.date)} content={post.content} title={post.title} img={post.post_thumbnail?post.post_thumbnail.URL:null} name={post.author.first_name+" "+post.author.last_name} key={post.slug} categories={post.categories}></PostMini>)
    }
    if(this.page==1 && localStorage.getItem("hideEmailCard")!="true")
      miniPosts.splice( 1+Math.floor(Math.random()*(miniPosts.length-1)), 0, <EmailJoin key="emailCard" card/>);
    //pages.push(<div id="Posts" key={"pageNum"+this.page} className="card-columns">{miniPosts}</div>)
    this.setState({posts:miniPosts})
  }

  resetPageTags = ()=>{
    if(document.querySelectorAll('[property="article:published_time"]').length>0)
        document.querySelectorAll('[property="article:published_time"]')[0].remove()
    if(document.querySelectorAll('[property="article:modified_time"]').length>0)
        document.querySelectorAll('[property="article:modified_time"]')[0].remove()
                                                                document.title = "A Lack Of Clarity!";
    document.querySelectorAll('[property="og:title"]')[0].setAttribute('content',"A Lack Of Clarity! - Home Page")
    document.getElementsByTagName('meta').namedItem('author').setAttribute('content',"Karthik Sankar")
    document.getElementsByTagName('meta').namedItem('description').setAttribute('content',"A blog written by some high schoolers. Exploring the topics we find interesting. Read if you dare.")
       document.querySelectorAll('[property="og:description"]')[0].setAttribute('content',"Check out the blog!")
    document.querySelectorAll('[property="og:image"]')[0].setAttribute('content',"https://github.com/KihtrakRaknas/clarity/raw/master/src/Images/logo512.png")
    document.querySelectorAll('[property="og:type"]')[0].setAttribute('content','website')
    document.querySelectorAll('[property="og:url"]')[0].setAttribute('content',"https://kihtrak.com/clarity/")
         document.querySelectorAll('[rel="canonical"]')[0].setAttribute('href',"https://kihtrak.com/clarity/")
  }
}
