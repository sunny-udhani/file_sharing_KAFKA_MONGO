import React, {Component} from 'react';

class SharedFileList extends Component {

    setSharePath(path, type, name) {
        this.props.handleSetSharePath(path,type,name);
    }

    render(){
        let sharedFiles = this.props.sharedFiles;
        if ( sharedFiles.length > 0 && sharedFiles[0]._id !== undefined){
            return (
                <div className="row-fluid">
                    <h4 className="text u-text-default">Files shared with user</h4>
                    <table className="table table-striped table-hover" id="sample-table-2">
                        <thead>
                        <tr>
                            <th className="hidden-xs">File</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            sharedFiles.map( (file, index) =>{
                                console.log(file);
                                if(file !== undefined && file !== null) return(
                                    <tr key={index}>
                                        <td><a onClick={() => this.setSharePath(file.filePath,file.fileType,file.fileName)}> {file.fileName}</a></td>
                                    </tr>
                                )}
                            )
                        }

                        </tbody>
                    </table>
                </div>
            );
        }else{
            return(
                <div className="row-fluid">
                </div>
                );
        }
    }
}

export default SharedFileList;
