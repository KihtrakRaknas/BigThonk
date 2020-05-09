import React from 'react'
import ReactHtmlParser from 'react-html-parser';
import LoadingDiv from '../Components/LoadingDiv';
import '../WordPressCore.css';
import EmailJoin from '../Components/EmailJoin'

export default class About extends React.Component {
    constructor(props) {
        super(props);
        this.getPost()
    }
    state={comments:[]}

    render(){
        if(this.state.err)
            return  <div id="about-err-screen" className="App container"><br/><br/><h1 className="text-center">Page had trouble loading. Try again later.</h1><h3 className="text-center">Double check your link!</h3></div>
        return  (!this.state.content)?<LoadingDiv></LoadingDiv>:
        <div class="all-screen-container">
            <div id="about-screen" className="App container">
                <br/>
                {ReactHtmlParser(this.state.content)}
                <br/><br/>
                <EmailJoin/>
                <br/><br/>
            </div>
        </div>
    }


    getPost = ()=>{
            let postId ="about";
            console.log(postId)
            console.log("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId)
            fetch("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId).then((res)=>res.json()).then((post)=>{
                //console.log(post)
                this.updatePageTags(post)
                console.log("page tags updated")
                this.setState({content:post.content, err:false})
                console.log("STATE UPDATED")
            }).catch((err)=>{
                console.log('https://wordpress-redirect.herokuapp.com/?url='+encodeURIComponent("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId))
                fetch('https://wordpress-redirect.herokuapp.com/?url='+encodeURIComponent("https://public-api.wordpress.com/rest/v1.1/sites/176343073/posts/slug:"+postId)).then((res)=>res.json()).then((post)=>{
                    //console.log(post)
                    this.updatePageTags(post)
                    this.setState({content:post.content, err:false})
                    if(this.postId !== "about")
                        this.checkFirebase();
                }).catch((err)=>{
                    console.log(err)
                    this.setState({err:true})
                })
            })
      }

      updatePageTags = (post)=>{
                                                                    document.title = "About - A Lack Of Clarity!";
        document.querySelectorAll('[property="og:title"]')[0].setAttribute('content',"About - A Lack Of Clarity!")
        document.getElementsByTagName('meta').namedItem('description').setAttribute('content',"The about page for A Lack Of Clarity")
           document.querySelectorAll('[property="og:description"]')[0].setAttribute('content',"The about page for A Lack Of Clarity")
        document.querySelectorAll('[property="og:image"]')[0].setAttribute('content',post.post_thumbnail?post.post_thumbnail.URL:"")
         document.querySelectorAll('[property="og:type"]')[0].setAttribute('content','website')
        document.querySelectorAll('[property="og:url"]')[0].setAttribute('content',"https://kihtrak.com/clarity/about")
             document.querySelectorAll('[rel="canonical"]')[0].setAttribute('href',"https://kihtrak.com/clarity/about")
      }
}