import React, {Component} from 'react';

class GroupList extends Component {

    selectGroup(id) {
        this.props.handleSelectGroup(id);
    }

    render() {
        let userGroups = this.props.userGroups;
        console.log(userGroups);
        if (userGroups.length > 0 && userGroups[0]._id !== undefined) {
            return (
                <div className="row-fluid">
                    <h4 className="text u-text-default">User's Groups</h4>
                    <table className="table table-striped table-hover" id="sample-table-2">
                        <thead>
                        <tr>
                            <th className="hidden-xs">Group</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            userGroups.map((group, index) => {
                                    console.log(group);
                                    if (group !== undefined && group !== null) return (
                                        <tr key={index}>
                                            <td><a onClick={() => this.selectGroup(group._id)}> {group.groupName}</a></td>
                                        </tr>
                                    )
                                }
                            )
                        }

                        </tbody>
                    </table>
                </div>
            );
        } else {
            return (
                <div className="row-fluid">
                </div>
            );
        }
    }
}

export default GroupList;
