import React from 'react'

export default class HomeItem extends React.Component {
    constructor(props){
        super(props)
        this.state={small:(window.innerWidth>=1800),mobile:(window.innerWidth<=450)}
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
        if((window.innerWidth<=575) != (this.lastScreenWidth<=450)){
            this.setState({mobile:(window.innerWidth<=575)});
            this.lastScreenWidth=window.innerWidth;
        }
    }

    render(){
        return(<div className={"mt-2 mb-2 col-sm-6"+ (this.state.small?" col-xl-3":" col-xl-4")+ (!this.state.mobile?" pl-1 pr-1":"")} style={{margin:0,padding:0}}>{this.props.children}</div>)
    }
}