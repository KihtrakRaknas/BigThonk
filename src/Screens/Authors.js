import React from 'react';
import ProfileCard from '../Components/ProfileCard';
import LoadingDiv from '../Components/LoadingDiv';

export default class Authors extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {};
    this.getAuthors();
    this.resetPageTags()
  }

  render(){
    if(this.state.err)
        return  <div id="author-err-screen" className="App container"><br/><br/><h1 className="text-center">Couldn't load in the information about our authors</h1><h3 className="text-center">Try again later!</h3></div>
    return (
      <div className="all-screen-container">
        <div id="author-screen" className="App container">
          <div id="authors" className="row pb-3 pt-2">
            <br/>
            {this.state.authors?this.state.authors:<LoadingDiv></LoadingDiv>}
            <br/>
          </div>
        </div>
      </div>
    );
  }

  getAuthors = ()=>{
    let postId = "authors";
    fetch("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId).then((res)=>res.json()).then((post)=>{
        this.readPostContent(post.content)
    }).catch((err)=>{
        console.log('https://wordpress-redirect.herokuapp.com/?url='+encodeURIComponent("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId))
        fetch('https://wordpress-redirect.herokuapp.com/?url='+encodeURIComponent("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId)).then((res)=>res.json()).then((post)=>{
            this.readPostContent(post.content)
        }).catch((err)=>{
            console.log(err)
            this.setState({err:true})
        })
    })
  }

  readPostContent = (authors) => {
    console.log(authors)
    authors = authors.split(/<h[^>]>?/gm)
    console.log(authors)
    authors = authors.map((author)=>{
        let authorObj = {}
        if(author.includes('src="')){
            let src = author.substring(author.indexOf('src="')+5)
            src = src.substring(0,src.indexOf('"'))
            console.log(src)
            authorObj.image = src;
        }
        if(author.includes('href="')){
            let src = author.substring(author.indexOf('href="')+6)
            src = src.substring(0,src.indexOf('"'))
            console.log(src)
            authorObj.link = src;
        }
        let authorComponents = author.split(/<[^>]*>?/gm).filter((el)=>{
            return el.trim() !== ""
        })
        
        for(let part of authorComponents)
            if(part.split(":").length>1){
                console.log(part.substring(part.indexOf(':')+1).trim())
                console.log(part)
                authorObj[part.split(":")[0].toLowerCase()] = part.substring(part.indexOf(':')+1).trim()
            }
        return authorObj;
    })
      console.log(authors)
    let authorElements = []
    for(let author of authors){
        if(JSON.stringify(author)!==JSON.stringify({}))
            authorElements.push(<ProfileCard key={author.name} name={author.name?author.name:""} description={author.description?author.description:""} link={author.link?author.link:""} linktxt={author.linktxt?author.linktxt:""} image={author.image?author.image:""}/>)
    }
    console.log(authorElements)

    this.setState({authors:authorElements})
  }

  resetPageTags = (post)=>{
    if(document.querySelectorAll('[property="article:published_time"]').length>0)
        document.querySelectorAll('[property="article:published_time"]')[0].remove()
    if(document.querySelectorAll('[property="article:modified_time"]').length>0)
        document.querySelectorAll('[property="article:modified_time"]')[0].remove()
                                                                document.title = "Authors - A Lack Of Clarity!";
    document.querySelectorAll('[property="og:title"]')[0].setAttribute('content',"Authors - A Lack Of Clarity!")
    document.getElementsByTagName('meta').namedItem('author').setAttribute('content',"Karthik Sankar")
    document.getElementsByTagName('meta').namedItem('description').setAttribute('content',"A list of the authors at A Lack Of Clarity")
       document.querySelectorAll('[property="og:description"]')[0].setAttribute('content',"A list of the authors at A Lack Of Clarity")
    document.querySelectorAll('[property="og:image"]')[0].setAttribute('content',"logo512.png")
    document.querySelectorAll('[property="og:type"]')[0].setAttribute('content','website')
    document.querySelectorAll('[property="og:url"]')[0].setAttribute('content',"https://kihtrak.com/clarity/authors/")
         document.querySelectorAll('[rel="canonical"]')[0].setAttribute('href',"https://kihtrak.com/clarity/authors/")
  }
}
