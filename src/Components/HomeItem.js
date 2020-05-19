import React from 'react'

export default class HomeItem extends React.Component {
    constructor(props){
        super(props)
        this.state={small:(window.innerWidth>=1800)}
    }

    componentDidMount(){
        this.lastScreenWidth=window.innerWidth;
        window.addEventListener("resize", this.handleResize);
        
    }
    componentWillUnmount(){
        window.removeEventListener("resize", this.handleResize);
    }
    
    handleResize = () =>{
        //console.log((window.innerWidth<1800) != (this.lastScreenWidth<1800))
        if((window.innerWidth<1800) != (this.lastScreenWidth<1800)){
          this.setState({small:(window.innerWidth>=1800)});
          this.lastScreenWidth=window.innerWidth;
        }
    }

    render(){
        return(<div className={"col-sm-6"+ (this.state.small?" col-xl-3":" col-xl-4")} style={{margin:0,padding:5}}>{this.props.children}</div>)
    }
}