import React, {Component} from 'react';
import {Route, withRouter, Switch, Router} from 'react-router-dom';
import './App.css';
import SignUp from "./components/SignUp"
import Login from "./components/Login";
import Home from "./components/Home";
import * as API from './api/API';
import Profile from "./components/Profile";
import Groups from "./components/Groups";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            username: '',
            filespath: "",
            sharepath: ""
        };
    }

    setFilesPath = (path, type, name) => {
        if (type === 1) {
            path = path + "/" + name;
        }
        if (name === ".." && (path !== null || path !== "")) {
            path = path.substring(0, path.lastIndexOf('/'));
        }
        console.log(path);
        if (path === this.state.filespath) {
            console.log("no change in path")
        } else {
            this.setState({
                ...this.state,
                filespath: path
            });
        }
    };

    setSharedFilesPath = (path, type, name) => {
        if (type === 1) {
            path = path + "/" + name;
        }
        if (name === ".." && (path !== null || path !== "")) {
            path = path.substring(0, path.lastIndexOf('/'));
        }
        console.log(path);
        if (path === this.state.sharepath) {
            console.log("no change in path")
        } else {
            this.setState({
                ...this.state,
                sharepath: path
            });
        }
    };

    starFile = (payload) => {
        API.doStarFile(payload)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        ...this.state,
                        message: "success"
                    });
                }
            })
            .catch(err => {
                console.log(err);
            })
    };

    getCookie = (cname) => {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        console.log("cookie decoded: " + ca);
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    handleSubmit = (userdata) => {
        API.doRegister(userdata)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({
                        ...this.state,
                        isLoggedIn: true
                    });
                    console.log("cookies: " + this.getCookie('aaj'));
                    this.props.history.push("/login");
                } else if (res.status === 400) {
                    this.props.history.push("/");
                    this.setState({
                        ...this.state,
                        isLoggedIn: false,
                        message: "Error with input. Please Try again..!!"
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    handleSubmitLogin = (userdata) => {
        API.doLogin(userdata)
            .then((res) => {
                    if (res.status === 200) {
                        res.json().then(data => {
                            console.log("data received");
                            console.log(data);
                            this.setState({
                                ...this.state,
                                isLoggedIn: true,
                                filespath: './' + data.userEmail,
                                sharepath: '',
                                username: data.userEmail
                            });
                        });
                        console.log(this.state);
                        let x = document.cookie;
                        console.log("username from session storage: " + this.getCookie('aaj'));
                        this.props.history.push("/home");
                    } else if (res.status === 400) {
                        this.setState({
                            isLoggedIn: false,
                            message: "Wrong username or password. Try again..!!"
                        });
                    }
                }
            )
            .catch((err) => {
                console.log(err);
            })
    };

    handleSubmitLogout = () => {
        API.doLogout()
            .then((res) => {
                console.log("res status" + res.status)
                if (res.status === 200) {
                    this.setState({
                        isLoggedIn: false,
                        message: "Logged out successfully!!"
                    });
                    console.log(this.state);

                    this.props.history.push("/");
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    handleCreateDirectory = (dir) => {
        API.doMakeDirectory(dir)
            .then((res) => {
                console.log("res status" + res.status)
                if (res.status === 200) {
                    this.setState({
                        isLoggedIn: false,
                        message: "Directory created"
                    });
                } else {
                    if (res.status === 400) {
                        console.log("no directory created");
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    handleCreateGroup = (dir) => {
        API.doCreateGroup(dir)
            .then((res) => {
                console.log("res status" + res.status)
                if (res.status === 200) {
                    this.setState({
                        ...this.state,
                        groupCreated : true
                    })
                    console.log("Group created");
                } else {
                    if (res.status === 400) {
                        console.log("no group created");
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    handleSubmitUpload = (file) => {
        API.doFileUpload(file)
            .then((status) => {
                console.log("res status " + status);
                if (status === 200) {
                    this.setState({
                        ...this.state,
                        message: "uploaded"
                    });
                } else {
                    console.log("no file upload -----------")
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    handleRedirectProfile = () => {
        this.props.history.push("/profile");
    };

    handleRedirectHome = () => {
        this.props.history.push("/home");
    };

    handleRedirectGroups = () => {
        this.props.history.push("/Groups");
    };

    handleSelectGroup = (id) => {
        let payload = {groupId: id};
        API.doSetGroup(payload)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        ...this.state,
                        selectedGroup: id
                    })
                } else {
                    console.log("set fail");
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    addGroupMembers = (payload) => {
        payload = { ...payload, groupId : this.state.selectedGroup};
        API.doAddGroupMembers(payload)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        ...this.state,
                        groupMembersAdded: true
                    })
                } else {
                    console.log("add fail");
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        return (
            <Switch>
                <Route exact path="/" component={() => <SignUp handleSubmit={this.handleSubmit}/>}/>
                <Route exact path="/login" component={() => <Login handleSubmit={this.handleSubmitLogin}/>}/>
                {/*<Route component = { (props) =>  <RequireAuth {...props} isLoggedIn = {this.state.isLoggedIn}/>} >*/}
                <Route exact path="/home" component={() => <Home handleStarFile={this.starFile}
                                                                 redirectProfile={this.handleRedirectProfile}
                                                                 handleRedirectGroups={this.handleRedirectGroups}
                                                                 filesPath={this.state.filespath}
                                                                 sharePath={this.state.sharepath}
                                                                 handleSetFilesPath={this.setFilesPath}
                                                                 handleSetSharePath={this.setSharedFilesPath}
                                                                 handleSubmitLogout={this.handleSubmitLogout}
                                                                 handleCreateDirectory={this.handleCreateDirectory}
                                                                 handleCreateGroup={this.handleCreateGroup}
                                                                 handleSubmitUpload={this.handleSubmitUpload}/>}/>
                <Route exact path="/profile" component={() => <Profile handleSubmit={this.handleSubmit}/>}/>
                <Route exact path="/Groups" component={() => <Groups handleRedirectHome={this.handleRedirectHome}
                                                                    handleSelectGroup={this.handleSelectGroup}
                                                                     handleAddGroupMembers = {this.addGroupMembers}
                                                                     handleCreateGroup={this.handleCreateGroup}
                />}/>
                {/*</Route>*/}
            </Switch>
        );
    }
}

export default withRouter(App);
