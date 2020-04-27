import React from 'react';
import ReactLoading from 'react-loading';
export default class LoadingDiv extends React.Component {
    constructor(props) {
        super(props);
        this.state={showText:false}
    }

    componentDidMount(){
        this.showTimeout = setTimeout(()=>this.setState({showText:true}),500)
    }

    componentWillUnmount(){
        clearTimeout(this.showTimeout);
    }
    
    render(){
        return(
            <div>
                <br/><br/><br/><br/><br/><br/><br/>
                {this.state.showText?<p className="display-4">Geting the latest content!</p>:null}
                <ReactLoading type="cubes" color="#ffffff" height={'20%'} width={'20%'} />
            </div>
        )
    }
  }