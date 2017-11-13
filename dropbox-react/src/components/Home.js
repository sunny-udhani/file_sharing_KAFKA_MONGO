import React, {Component} from 'react';
import * as API from '../api/API';
import UserFileList from "./UserFileList";
import SharedFileList from "./SharedFileList";
// import Aaj from "material-ui/Snackbar";

class Home extends Component{

    state = {};

    constructor(props) {
        super(props);
        this.state = {
            fileResults: [],
            shareResults: [],
            modalIsOpen: false,
            sharedTable : false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitLogout = this.handleSubmitLogout.bind(this);
        this.setFilesPath = this.setFilesPath.bind(this);
        this.setSharePath = this.setSharePath.bind(this);
        this.starFile = this.starFile.bind(this);
    }

    componentWillMount(){
        console.log(this.props.filesPath);
        console.log(this.props.sharePath);
        let payload = {"filesPath" : this.props.filesPath , "sharePath" : this.props.sharePath};
        console.log(payload);
        API.doListFiles(payload)
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    res.json().then( data => {
                            console.log("data received");
                            console.log(data);
                            let st = (!(data.sharedFileList[0] !== null && data.sharedFileList[0].name === undefined || data.sharedFileList[0].name === null));
                            this.setState({...this.state,
                                fileResults: data.userFileList,
                                shareResults: data.sharedFileList,
                                sharedTable : st
                            });
                        }
                    )
                } else if (res.status === 400) {
                    this.setState({...this.state,
                        fileResults: [],
                        shareResults: []
                    });
                }
            })
            .catch ((err) =>{
                console.log(err);
            });
    }

    handleSubmitLogout() {
        this.props.handleSubmitLogout();
    }

    handleMakeDirectory() {
        let dir = prompt("Directory name: ");
        console.log("dir name: " + dir);
        let payload = {"dir" : dir, "path" : this.props.filesPath};
        this.props.handleCreateDirectory(payload);
    }

    handleMakeGroup() {
        let group = prompt("Group name: ");
        console.log("group name: " + group);
        let payload = {"groupname" : group};
        this.props.handleCreateGroup(payload);
    }

    setSharePath(path, type, name) {
        this.props.handleSetSharePath(path,type,name);
    }

    handleChange(event) {
        let uploadPath = {"path": this.props.filesPath};
        let form = new FormData();
        let fileArr = Array.from(event.target.files);
        console.log("file array: "+ fileArr);
        API.doSetUploadPath(uploadPath)
            .then( res => {
                if(res.status === 200){
                    fileArr.map((file,index) => {
                            form.append('file-upload'+index , file);
                        }
                    );
                    this.props.handleSubmitUpload(form);
                }else{
                    console.log("path fail");
                }
            })
            .catch(err => {
                console.log(err);
            });

    }

    openShareDialog(){
        this.setState({
            ...this.state,
            modalIsOpen: true
        })
    }

    handleShare (payload) {
        API.doShare(payload)
            .then( res => {
                if(res.status === 200){
                    this.setState({
                        ...this.state,
                        message : "shared successfully"
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })

    }

    redirectProfile(){
        this.props.redirectProfile();
    }

    handleGroups(){
        this.props.handleRedirectGroups();
    }

    starFile(payload){
        this.props.handleStarFile(payload);
    }

    setFilesPath (path, type, name) {
        this.props.handleSetFilesPath(path, type, name);
    }

    render(){

        return(
            <div className="container-fluid">
                <div className="row">
                {/*<Aaj/>*/}
                    <div className="col-md-10">
                        <br/>
                        <img src = "../../public/logo.png"></img> <h4 align={'justify'}>Home</h4>
                    </div>
                    <div className="col-md-2" align={'justify'}>
                        <div className='row'>
                            <ul id="dTab" className="nav">
                                <li><button className="btn btn-primary" onClick={() => this.handleSubmitLogout()}>Logout</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <br/>
                <div className="row justify-content-between">
                    <div className="col-6 col-md-8" align={'left'}>
                        <div className="panel panel-default">
                            <SharedFileList sharedFiles = {this.state.shareResults} handleSetSharePath = {this.setSharePath} />
                            <br/>
                            <br/>
                        </div>
                        <UserFileList userFiles = {this.state.fileResults} handleStarFile = {this.starFile} handleShare = {this.handleShare} handleSetFilesPath = {this.setFilesPath}/>
                    </div>
                    <div className="col-md-2 offset-md-2">
                        <div className="row">
                            <input type="file"
                                   className="file file-upload"
                                   id="file-upload"
                                   name="file-upload"
                                   onChange={ (e) => this.handleChange(e)}
                                   multiple/>
                        </div>
                        <div className="row">
                            <ul id="dTab" className="nav nav-tabs">
                                <li><button className="btn btn-success" onClick={() => this.handleMakeDirectory()}>Make a Directory</button></li>
                                <li><button className="btn btn-info" onClick={() => this.redirectProfile()}>User Profile</button></li>
                                <li><button className="btn btn-info" onClick={() => this.handleMakeGroup()}>Create a Group</button></li>
                                <li><button className="btn btn-info" onClick={() => this.handleGroups()}>Groups</button></li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

        );
    }

}

export default Home;