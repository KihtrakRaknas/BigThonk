import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Home from './Screens/Home'
import BlogPost from './Screens/BlogPost.js'
import './App.css';
import Feed from './Screens/Feed'

export default function App() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div>
            <nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
                <Link to="/" style={{color:"white"}}><a class="navbar-brand">A Lack Of Clarity</a></Link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item active">
                            <Link to="/"><a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a></Link>
                        </li>
                        <li class="nav-item active">
                            <Link to="/feed"><a class="nav-link" href="#">Feed</a></Link>
                        </li>
                        <li class="nav-item">
                            <Link to="/about"><a class="nav-link" href="#">About</a></Link>
                        </li>
                        <li class="nav-item">
                            <Link to="/authors"><a class="nav-link" href="#">Authors</a></Link>
                        </li>
                    </ul>
                </div>
            </nav>
  
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route exact={true} path="/feed" component = {Feed}/>
            <Route path="/:postId" component={BlogPost} />
            <Route exact={true} path="/" component = {Home}/>
          </Switch>
        </div>
      </Router>
    );
  }
