import React, {Component} from 'react';
import * as API from '../api/API';
import GroupList from './GroupList';
import GroupFileList from './GroupFileList';
import GroupMemberList from './GroupMemberList';

class Groups extends Component {

    state = {};

    constructor(props) {
        super(props);
        this.state = {
            userGroups: [],
            filesFromGroup: [],
            memberList: [],
            selectedGroup: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleMakeDirectory = this.handleMakeDirectory.bind(this);
        this.handleSelectGroup = this.handleSelectGroup.bind(this);
    }

    componentWillMount() {

        API.doListUserGroups()
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    res.json().then(data => {
                            console.log("data received");
                            console.log(data);
                            this.setState({
                                ...this.state,
                                userGroups: data.data,
                            });
                        }
                    );

                    API.doListGroupFiles()
                        .then(res => {
                            if (res.status === 200) {

                                res.json().then(data => {
                                        console.log(data);
                                        if (data.data !== null) {
                                            this.setState({
                                                ...this.state,
                                                filesFromGroup: data.data.files,
                                            });
                                        }
                                    }
                                );

                                API.doListGroupMembers()
                                    .then(res => {
                                        if (res.status === 200) {

                                            res.json().then(data => {
                                                    console.log(data);
                                                    if (data.data !== null) {
                                                        this.setState({
                                                            ...this.state,
                                                            memberList: data.data,
                                                        });
                                                    }
                                                }
                                            )
                                        } else {
                                            console.log("member list fail");
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })

                            } else {
                                console.log("path fail");
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })

                } else if (res.status === 400) {
                    this.setState({
                        ...this.state,
                        userGroups: [],
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleRedirectHome() {
        this.props.handleRedirectHome();
    }

    handleMakeDirectory() {
        let dir = prompt("Directory name: ");
        console.log("dir name: " + dir);
        let payload = {"dir": dir, "path": this.props.filesPath};
        this.props.handleCreateDirectory(payload);
    }

    handleChange(event) {
        let uploadPath = {"path": this.props.filesPath};
        let form = new FormData();
        let fileArr = Array.from(event.target.files);
        console.log("file array: " + fileArr);

        fileArr.map((file, index) => {
                form.append('file-upload' + index, file);
            }
        );
        API.doGroupFileUpload(form)
            .then(res => {
                console.log(res.status);
            })
            .catch(err => {
                console.log(err);
            })

    }

    handleSelectGroup(id) {
        this.props.handleSelectGroup(id);
    };

    addMembers() {
        let emails = prompt("Enter Emails to add in group")
        let payload = {memberEmail: emails};
        this.props.handleAddGroupMembers(payload);
    }

    handleMakeGroup() {
        let group = prompt("Group name: ");
        console.log("group name: " + group);
        let payload = {"groupname": group};
        this.props.handleCreateGroup(payload);
    }

    render() {

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-10">
                        <br/>
                        <h4 align={'justify'}>Groups</h4>
                    </div>
                    <div className="col-md-2" align={'justify'}>
                        <div className='row'>
                            <ul id="dTab" className="nav">
                                <li>
                                    <button className="btn btn-primary" onClick={() => this.handleRedirectHome()}>
                                        Home
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <br/>
                <div className="row justify-content-between">
                    <div className="col-6 col-md-8" align={'left'}>
                        <div className="panel panel-default">
                            <GroupList userGroups={this.state.userGroups}
                                       handleSelectGroup={this.handleSelectGroup}/>
                            <br/>
                            <br/>
                        </div>
                        <GroupFileList filesFromGroup={this.state.filesFromGroup} handleStarFile={this.starFile}
                                       handleShare={this.handleShare} handleSetFilesPath={this.setFilesPath}/>
                    </div>
                    <div className="col-md-2 offset-md-2">
                        <div className="row">
                            <input type="file"
                                   className="file file-upload"
                                   id="file-upload"
                                   name="file-upload"
                                   onChange={(e) => this.handleChange(e)}
                                   multiple/>
                        </div>
                        <div className="row">
                            <ul id="dTab" className="nav nav-tabs">
                                <li>
                                    <button className="btn btn-success" onClick={() => this.handleMakeDirectory()}>Make
                                        a Directory
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-info" onClick={() => this.addMembers()}>
                                        Add members by email
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-info" onClick={() => this.handleMakeGroup()}>Create a
                                        Group
                                    </button>
                                </li>
                                <li>
                                    <GroupMemberList memberList={this.state.memberList}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        );
    }

}

export default Groups;