import React, {Component} from 'react';
import FaShareAlt from 'react-icons/lib/fa/share-alt'
import FaStar from 'react-icons/lib/fa/star'
import FaStarO from 'react-icons/lib/fa/star-o'

class UserFileList extends Component {

    promptShare(fileId){
        let emails = prompt("Enter Email ID's you want to share with");
        let payload = {"emails" : emails , "fileId" : fileId};
        this.props.handleShare(payload);
    }

    setFilesPath(path, type, name) {
        this.props.handleSetFilesPath(path, type, name);
    }

    starFile(id) {
        let payload = {'id' : id, 'value': 1};
        this.props.handleStarFile(payload);
    }

    unStarFile(id){
        let payload = {'id' : id, 'value': 0};

        this.props.handleStarFile(payload);
    }

    render(){
        let userFiles = this.props.userFiles;
        if ( userFiles.length > 0 && userFiles[0].fileName !== undefined) {
            return (
                <table className="table table-striped table-hover table-bordered table-responsive" id="sample-table-2">
                    <thead>
                    <tr>
                        <th className="">File</th>
                        <th className="">Created Date</th>
                        <th className="">Type</th>
                        <th className="">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        userFiles.map((file, index) => {
                                if (file !== undefined && file !== null) return (
                                    <tr key={index}>
                                        <td><a
                                            onClick={() => this.setFilesPath(file.filePath, file.fileType, file.fileName)}> {file.fileName}</a>
                                        </td>
                                        <td>{file.fileCreatedDt}</td>
                                        <td>{(file.fileType === 0) ? "file" : "folder"} </td>
                                        <td className="col-3">
                                            <button onClick={() => this.promptShare(file._id)}><FaShareAlt/></button>
                                            {(file.fileStarInd === 1) ?
                                                <button onClick={() => this.unStarFile(file._id)}><FaStar/></button> :
                                                <button onClick={() => this.starFile(file._id)}><FaStarO/></button>}
                                        </td>
                                    </tr>
                                )
                            }
                        )
                    }
                    </tbody>
                </table>
            );
        }else{
            return(
                <div className="row-fluid">
                </div>
            );
        }
    }
}

export default UserFileList;