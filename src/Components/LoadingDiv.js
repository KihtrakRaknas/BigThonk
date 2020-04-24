import React from 'react';
import ReactLoading from 'react-loading';
export default class LoadingDiv extends React.Component {
    constructor(props) {
        super(props);
        setTimeout(()=>this.setState({showText:true}),500)
        this.state={showText:false}
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