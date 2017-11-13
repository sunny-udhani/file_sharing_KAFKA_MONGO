import React, {Component} from 'react';
import * as API from '../api/API';
import {Link} from "react-router-dom";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userDetails : {}
        };
    }

    componentWillMount(){
        API.getUserDetail()
            .then( res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        console.log("data received");
                        console.log(data);
                        this.setState({
                            ...this.state,
                            userDetails: data[0]
                        });
                    })
                }
                else{
                    console.log("no session");
                }

            })
            .catch( err =>{
            })
    }


    render(){

        return (
            <div className="container">
                <br/>
                <br/>
                <br/>
                <br/>
                <div className="row justify-content-md-center">
                    <div className="col-md-12">
                        <div className="nav nav-tab">
                            <Link to='/home'><span className="glyphicon glyphicon-circle-arrow-right"></span>Back</Link><br/><br/>
                        </div>
                        <div className="panel-body">
                            <div className="form control-group">
                            <label className="col-md-3">User's First Name:</label>
                            <p className="text text-info">
                                {this.state.userDetails.userFirstName}
                            </p>
                            </div>
                            <label className="col-md-3">User's Last Name: </label>
                            <p className="text text-info"> {this.state.userDetails.userLastName}
                            </p>
                            <label className="col-md-3">User's Gender: </label>
                            <p className="text text-info"> {this.state.userDetails.UserGender}
                            </p>
                            <label className="col-md-3">User's Birthdate: </label>
                            <p className="text text-info"> {this.state.userDetails.userBDate}
                            </p>
                            <label className="col-md-3">User's work: </label>
                            <p className="text text-info"> {this.state.userDetails.userWork}
                            </p>
                            <label class="col-md-3">User's education: </label>
                            <p class="text text-info"> {this.state.userDetails.userEducation}
                            </p><label class="col-md-3">User's Interests: </label>
                            <p class="text text-info"> {this.state.userDetails.userInterests}
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;