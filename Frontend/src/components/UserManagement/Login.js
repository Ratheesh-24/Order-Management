import React, { Component } from 'react';
import axios from 'axios';

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            Email: '',
            UserPassword: '',
            UserName: '',
            EmailError: '',
            UserPasswordError: ''
        }
    }
    onChangeEmail(e) {

        this.setState({
            Email: e.target.value
        });
    }

    onChangeUserPassword(e) {

        this.setState({
            UserPassword: e.target.value
        });
    }


    validate = () => {

        let EmailError = "";
        let UserPasswordError = "";

        if (!this.state.Email) {
            EmailError = "Email is required.";
        } else if (!this.state.Email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            EmailError = "Email is not valid.";
        }

        if (!this.state.UserPassword) {
            UserPasswordError = "Password is required.";

        }

        if (EmailError || UserPasswordError) {
            this.setState({ EmailError, UserPasswordError })
            return false;
        }


        return true;

    }
    onSubmit(e) {

        e.preventDefault();

        const isValid = this.validate();

        if (isValid) {


            const obj = { Email: this.state.Email, UserPassword: this.state.UserPassword };

            axios.post('http://localhost:5000/user/login', obj)
                .then(res => {
                    let UserName = res.data.UserName;

                    this.setState({ UserName });

                    if (UserName) {

                        localStorage.setItem('usertoken', UserName)

                        this.props.history.push('/');
                    } else {

                        this.props.history.push('/login');
                        alert('Invalid email or password');

                    }
                });

        }

    }

    render() {

        return (
            <div className="container border border-secondary">

                <div className="container w-50" style={{ marginTop: 20 }}>

                    <h5 align="center">Login Information</h5>

                    <form onSubmit={this.onSubmit}>

                        <div className="form-group">
                            <label>Email </label>
                            <input
                                type="text"
                                className="form-control form-control-sm form-control form-control-sm-sm"
                                value={this.state.Email}
                                onChange={this.onChangeEmail}
                            />

                            <div style={{ color: "red" }}>
                                {this.state.EmailError}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password </label>
                            <input
                                type="password"
                                className="form-control form-control-sm form-control form-control-sm-sm"
                                value={this.state.UserPassword}
                                onChange={this.onChangeUserPassword}
                            />

                            <div style={{ color: "red" }}>
                                {this.state.UserPasswordError}
                            </div>
                        </div>

                        <div className="form-group"style={{marginBottom: 50 }}>
                            <input type="submit"
                                value="Login"
                                className="btn btn-success btn-sm" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}