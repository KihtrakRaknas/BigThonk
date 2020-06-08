import React from 'react'
import { Link } from 'react-router-dom';
import HomeItem from './HomeItem.js';
export default class EmailJoin extends React.Component {
    state={
        show:true,
        done:false
    }
    render(){
        if(!this.state.show)
            return null;
        if(this.state.done)
            return <h3>Done!</h3>;
        if(this.props.card)
            return(
                <HomeItem>
                    <div className="card" style={{backgroundColor:"blue"}}>
                        <div className="card-body" >
                            <h3 className="card-title"><strong>Sign up for our email list!</strong></h3>
                            <br/>
                            <div className="card-text">
                                <input id="emailInput" type="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter your email"/>
                                <select id="listInput" className="custom-select mb-2 mt-2">
                                    <option value="32537">Updates every 3 days</option>
                                    <option value="32535">Daily Updates</option>
                                    <option value="32538">Updates once a week</option>
                                    <option value="33054">Instant updates (1 email per blog post)</option>
                                </select>
                                <button type="button" className="btn btn-success btn-block mb-3" onClick={this.submit}>Join!</button>
                                <h6>Or follow us on Instagram:</h6>
                                <button type="button" className="btn btn-danger btn-block" onClick={()=>window.open("https://www.instagram.com/alackofclarity/", '_blank')}>Go to @alackofclarity</button>
                                <button type="button" className="btn btn-link btn-block" onClick={this.hideForever}>Click here to hide this box forever</button>
                            </div>
                        </div>
                    </div>
                </HomeItem>
            )
        return(
            <div>
                <h3>Sign up for email updates:</h3>
            
                <form className="form-inline">
                    
                    <input id="emailInput" type="email" className="form-control mr-2" aria-describedby="emailHelp" placeholder="Enter your email"/>
                    <select id="listInput" className="custom-select mb-2 mt-2 mr-2">
                        <option value="32537">Updates every 3 days</option>
                        <option value="32535">Daily updates</option>
                        <option value="32538">Updates once a week</option>
                        <option value="33054">Instant updates (1 email per blog post)</option>
                    </select>
                    <button type="button" className="btn btn-primary" onClick={this.submit}>Join!</button>
                </form>
            </div>
        )
    }
    submit = () =>{
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(document.getElementById("emailInput").value)){
            fetch("https://bigthonk-emaillist.herokuapp.com/addEmail?email="+ encodeURIComponent(document.getElementById("emailInput").value) +"&list=" +encodeURIComponent(document.getElementById("listInput").value)).then((res)=>res.json()).then((resJSON)=>{
                console.log(resJSON)
                if(resJSON.done){
                    this.setState({done:true})
                    setTimeout(this.hideForever,1000)
                }
                if(resJSON.err)
                    alert(resJSON.err)
            })
        }else{
            alert("Enter a valid email address!")
        }
    }
    hideForever = () =>{
        localStorage.setItem('hideEmailCard',"true")
        this.setState({show:false})
    }
}