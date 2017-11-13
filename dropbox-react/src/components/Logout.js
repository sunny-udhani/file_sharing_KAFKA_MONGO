import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Logout extends Component{
    render(){
        return(

            <div className ="row">
                <div className="col-sm-offset-4 col-md-offset-4 col-lg-offset-4 col-sm-6 col-md-6">
                    <div className="panel panel-default">
                        <div className="panel panel-body">
                            <ul id="dTab" className="nav nav-tabs">
                                <li><Link to='/login'><span className="glyphicon glyphicon-circle-arrow-right"></span>Login</Link></li>
                            </ul>
                            <div id="pane1" className="tab-pane">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Logout;