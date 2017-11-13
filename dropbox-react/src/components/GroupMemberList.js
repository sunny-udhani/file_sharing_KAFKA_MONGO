import React, {Component} from 'react';

class GroupMemberList extends Component {

    render(){
        let memberList = this.props.memberList;
        console.log(memberList);
        if ( memberList !== null && memberList.length > 0 && memberList[0].userFirstName !== undefined){
            return (
                <div className="row-fluid">
                    <h4 className="text u-text-default">Group Members</h4>
                    <table className="table table-striped table-hover" id="sample-table-2">
                        <thead>
                        <tr>
                            <th className="hidden-xs">Members</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            memberList.map( (member, index) =>{
                                console.log(member);
                                if(member !== undefined && member !== null) return(
                                    <tr key={index}>
                                        <td><a> {member.userEmail} </a></td>
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

export default GroupMemberList;
