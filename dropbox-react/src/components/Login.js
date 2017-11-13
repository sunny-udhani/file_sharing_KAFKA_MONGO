import React, {Component} from 'react';
class Login extends Component {
    constructor(props) {

        super(props);
        this.state = {
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }

    handleChange(event) {
        this.setState(
            ...this.state,
            {
                [event.target.name]: event.target.value
            });
    }

    handleSubmitClick(event) {

        console.log(this.state);

        var formData = new FormData();
        formData = this.state;
        this.props.handleSubmit(formData);
    }

    render(){

        return (
            <div className="row">
                <div className="col-md-6 col-lg-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Login</div><br/>
                        <div className="panel-body">
                            <form className="form-horizontal" >
                                <div className="form-group ">
                                    <label className="col-lg-3">Username  </label>
                                    <div className="col-sm-8 col-md-8 col-lg-8">
                                        <input onChange={ (e) => this.handleChange(e)} type="email" className="form-control" name="inputUsername"
                                               id="inputUsername" placeholder="Email Id"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 col-md-3 col-lg-3" >Password  </label>
                                    <div className="col-sm-8 col-md-8 col-lg-8">
                                        <input onChange={ (e) => this.handleChange(e)} type="password" className="form-control"
                                               name="inputPassword" id="inputPassword" placeholder="Password"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div
                                        className="col-xs-offset-4 col-sm-offset-4 col-md-offset-4 col-lg-offset-4">
                                        <button type="button"
                                                onClick={() => this.handleSubmitClick()}
                                                className="btn btn-primary">Sign in</button>
                                    </div>
                                </div>
                            </form>
                            <div className="row-fluid">
                                <button data-toggle="tab"><span className="glyphicon glyphicon-circle-arrow-right"></span>New user?Sign Up</button>
                            </div>
                            {/*<div className="row col-offset-2">*/}
                                {/*<div className="panel panel-default">*/}
                                    {/*<span className="text text-danger">Invalid username / password</span>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;