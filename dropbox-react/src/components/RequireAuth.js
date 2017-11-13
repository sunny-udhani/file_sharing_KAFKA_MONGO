import React, {Component} from 'react';
class RequireAuth extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {isLoggedIn} = this.props;
        const {history} = this.props;

        console.log(this.props);
        console.log(JSON.stringify(this.props));
        if (!isLoggedIn) {
            // set the current url/path for future redirection (we use a Redux action)
            // then redirect (we use a React Router method)
            history.replace("/login")
        }
    }

    render() {
        const {isLoggedIn} = this.props;

        return null;
    }
}

export default RequireAuth