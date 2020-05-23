import React from 'react'
import ReactHtmlParser from 'react-html-parser';
import { Link } from 'react-router-dom';
import firebase from '../firebase.js';
import HomeItem from './HomeItem.js';
import ColorThief from "colorthief";
const readingTime = require('reading-time');
const rs = require('text-readability')
const colorThief = new ColorThief();
export default class PostMini extends React.Component {
    constructor(props) {
        super(props);
        this.state={postColor:"black",textColor:"white"}
        if(this.props.img){
            if(!localStorage.getItem(this.props.img)){
                fetch('https://cors-anywhere.herokuapp.com/'+this.props.img).then(res=>{
                    var reader = new FileReader();
                    reader.onloadend = () => {
                        if(reader.result.substring(0,30) != "data:application/octet-stream;"){
                            this.callColorTheif(reader.result)
                        }else
                            console.log("qouta hit")
                    };
                    res.blob().then(myBlob=>{
                        reader.readAsDataURL(myBlob);
                    });
                    reader.onerror = () => {
                        console.log("failed");
                    };
                })
            }else{
                this.state.postColor = localStorage.getItem(this.props.img)
                let colors = this.state.postColor.split(",").map(item=>Number(item.replace(/\D/g,'')))
                this.state.textColor = ((colors[0]*299)+(colors[1]*587)+(colors[2]*114))/1000 >= 128 ? 'black' : 'white'
            }
        }
    }

    callColorTheif = (base64) =>{
        let imgEl = new Image();
        imgEl.src=base64;
        if (imgEl.complete) {
            this.colorImgDone(imgEl);
            //alert(result)
        } else {
            imgEl.addEventListener('load', ()=>{
                this.colorImgDone(imgEl);
                //alert(result)
            });
        }
    }

    colorImgDone = (imgEl)=>{
        this.colorArr = colorThief.getColor(imgEl)
        this.alpha=.05
        if(window.location.search == "?showBtn=false")
            this.alpha =.95
        const result = "rgba("+this.colorArr.toString()+","+this.alpha+")";
        this.setState({postColor:result, textColor: ((this.colorArr[0]*299)+(this.colorArr[1]*587)+(this.colorArr[2]*114))/1000 >= 128 ? 'black' : 'white'})
        localStorage.setItem(this.props.img,"rgba("+this.colorArr.toString()+",1)")
        setTimeout(this.incrementAlpha,50)
    }

    incrementAlpha = () =>{
        this.alpha+=.05
        const result = "rgba("+this.colorArr.toString()+","+this.alpha+")";
        this.setState({postColor:result})
        if(this.alpha<1)
            setTimeout(this.incrementAlpha,50)
    }

    componentDidMount(){
        const postRef = firebase.database().ref(this.props.id)
        postRef.on('value',(snapshot)=>{
            let snap = snapshot.val()
            if(snap)
                this.setState({views: snap.views?snap.views:0,comments: snap.comments&&Object.keys(snap.comments).length>0?Object.keys(snap.comments).length:0})
        })
    }

    state={
        views:0,
        comments:0
    }

    tag = (category, color) =>{
        return <small key={category} style={{display:"inline-block", paddingLeft:5,paddingRight:5,marginLeft:5,marginRight:3, paddingBottom:2, borderRadius:5, backgroundColor:color?color:"white", color:color?"white":"black"}}>{category}</small>
    }

    easeOfReading = (content) =>{
        let score = rs.fleschReadingEase(content)
        if(score>75)
            return "Easy"
        if(score>50)
            return "Intermediate"
        if(score>25)
            return "Advanced"
        return "Very Advanced"
    }

    render(){
        let catagories = []
        //console.log(this.props.categories)
        if(this.props.categories)
            for(let category in this.props.categories)
                catagories.push(this.tag(category))
        catagories.push(this.tag(readingTime(this.props.content).text, "grey"))
        catagories.push(this.tag("Readability: "+this.easeOfReading(this.props.content.replace(/<[^>]*>?/gm, '')), "grey"))
        return(
            <HomeItem>
                <div className="card" id={this.props.id} style={{backgroundColor:this.state.postColor}}>
                    {this.props.img?<img className="card-img-top" src={this.props.img} alt={this.props.title}/>:null}
                    <div className="card-body" style={{color: this.state.textColor}}>
                        <h3 className="card-title"><strong>{this.props.title}</strong></h3>
                        <div className="card-text categories" style={{textAlign:"center"}}>{catagories}</div>
                        <div className="card-text">{ReactHtmlParser(this.props.text.replace(' [&hellip;]','...'))}</div>
                        <div className="btn-div">
                        {window.location.search !== "?showBtn=false"?<Link to={"/"+this.props.id} className={`btn btn btn-outline-${this.state.textColor=="black"?"dark":"light"}`}>Click Here to Read More</Link>:null}
                        </div>
                    </div>
                    <div className="card-footer">
                        { (this.props.name.trim()?this.props.name:"Anonymous Submission") +" - "+this.props.date.toLocaleDateString()+" - 👀"+(window.location.search !== "?showBtn=false"?(this.state.views+" 💬"+this.state.comments):"")}
                    </div>
                </div>
            </HomeItem>
        )
    }
}