import React from 'react';
import {
    EmailShareButton,
    EmailIcon,
    FacebookShareButton,
    FacebookIcon,
    LinkedinShareButton,
    LinkedinIcon,
    PinterestShareButton,
    PinterestIcon,
    RedditShareButton,
    RedditIcon,
    TelegramShareButton,
    TelegramIcon,
    TumblrShareButton,
    TumblrIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
  } from "react-share";

  export default class ShareBar extends React.Component {
      render(){
          let checkOutThisBlogPost = "Check out this blogpost: "+this.props.title
          let titleAndAuthor = `"${this.props.title}" was written by ${this.props.name}. Give it a read!`
          let tags = ["Blogpost","A Lack Of Clarity","High School Authors","Teen Writing"]
          return(
              <div className="share-bar text-center">
                <EmailShareButton url={this.props.url} subject={checkOutThisBlogPost} body="Here is the link:"><EmailIcon size={32} round /></EmailShareButton>
                <FacebookShareButton url={this.props.url} hashtag="#ALackOfClarity" quote={titleAndAuthor}><FacebookIcon size={32} round /></FacebookShareButton>
                <LinkedinShareButton url={this.props.url} title={this.props.title} summary={titleAndAuthor} source="A Lack Of Clarity (Blog)"><LinkedinIcon size={32} round /></LinkedinShareButton>
                <PinterestShareButton url={this.props.url} media={this.props.image} description={titleAndAuthor}><PinterestIcon size={32} round /></PinterestShareButton>
                <RedditShareButton url={this.props.url} title={this.props.title}><RedditIcon size={32} round /></RedditShareButton>
                <TelegramShareButton url={this.props.url} title={this.props.title}><TelegramIcon size={32} round /></TelegramShareButton>
                <TumblrShareButton url={this.props.url} title={this.props.title} tags={tags} caption={titleAndAuthor}><TumblrIcon size={32} round /></TumblrShareButton>
                <TwitterShareButton url={this.props.url} title={this.props.title} hashtags={tags.map((item)=>"#"+item)}><TwitterIcon size={32} round /></TwitterShareButton>
                <WhatsappShareButton url={this.props.url} title={this.props.title}><WhatsappIcon size={32} round /></WhatsappShareButton>
              </div>
          )
      }
  }