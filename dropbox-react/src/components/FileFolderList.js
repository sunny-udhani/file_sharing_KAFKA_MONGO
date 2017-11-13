import React, {Component} from 'react';
class FileFolderList extends Component {


    render(){

        return (
            <tbody>

        {

            this.state.results.map( (file, index) =>{
                return(
                    <tr key={index}>
                        <td><a onClick={() => this.setPath(file.path,file.type,file.name)}> {file.name}</a></td>
                        <td> {file.createDt}</td>
                        <td> {file.id}</td>
                    </tr>
                )}
            )
        }


        </tbody>
        );
    }
}

export default FileFolderList;