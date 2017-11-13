import React, {Component} from 'react';

class GroupFileList extends Component {


    render(){
        let filesFromGroup = this.props.filesFromGroup;
        console.log(filesFromGroup);
        if ( filesFromGroup !== null && filesFromGroup.length > 0 && filesFromGroup[0].fileId !== undefined){
            return (
                <div className="row-fluid">
                    <h4 className="text u-text-default">Files shared in group</h4>
                    <table className="table table-striped table-hover" id="sample-table-2">
                        <thead>
                        <tr>
                            <th className="hidden-xs">File</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            filesFromGroup.map( (file, index) =>{
                                console.log(file);
                                if(file !== undefined && file !== null) return(
                                    <tr key={index}>
                                        <td><a > {file.fileName}</a></td>
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

export default GroupFileList;
