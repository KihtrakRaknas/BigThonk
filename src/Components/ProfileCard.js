import React from 'react'
import ReactHtmlParser from 'react-html-parser';

export default class ProfileCard extends React.Component {
    render(){//{this.props.image?this.props.image:"https://www.pngkit.com/png/detail/799-7998601_profile-placeholder-person-icon.png"}
        return(
            <div className="col-12 profile mt-2">
                <div className="d-none d-md-flex flex-row rounded">
                    <div className="circular--landscape mt-2 mb-2">
                        <img alt={this.props.name+" profile"} src={this.props.image?this.props.image:"https://www.pngkit.com/png/detail/799-7998601_profile-placeholder-person-icon.png"}/>
                    </div>

                    <div className="pl-3 pt-2 pr-2 pb-2 w-75">
                            <h3>{this.props.name}</h3>
                            {ReactHtmlParser('<p>'+this.props.description+'</p>')}
                            {this.props.link?<p className="text-right m-0"><a href={this.props.link} className="btn btn-primary">{this.props.linktxt?this.props.linktxt:"My Link"}</a></p>:null}
                    </div>
                </div>
                <div className="d-block d-md-none rounded ">
                    <div className="d-block mx-auto circular--landscape mt-2 mb-2 text-center">
                        <img alt="Placeholder profile" src={this.props.image?this.props.image:"https://www.pngkit.com/png/detail/799-7998601_profile-placeholder-person-icon.png"}/>
                    </div>

                    <div className="p2-3 pt-2 pr-3 pb-2">
                            <h3>{this.props.name}</h3>
                            {ReactHtmlParser('<p>'+this.props.description+'</p>')}
                            {this.props.link?<p className="text-center m-0"><a href={this.props.link} className="btn btn-primary">{this.props.linktxt?this.props.linktxt:"My Link"}</a></p>:null}
                    </div>
                </div>
            </div>
        )
    }
}