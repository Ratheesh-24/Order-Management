import React, { Component } from 'react';
import axios from 'axios';

export default class Register extends Component {
    constructor(props) {
        super(props);


        this.state = {
            UserName: '',
            UserPassword: '',
            PasswordMatch: '',
            Email: '',
            UserNameError: '',
            EmailError: '',
            UserPasswordError: '',
            PasswordMatchError: ''

        }

        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.onChangePasswordMatch = this.onChangePasswordMatch.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    onChangeEmail(e) {

        this.setState({
            Email: e.target.value
        });
    }

    onChangeUserName(e) {

        this.setState({
            UserName: e.target.value
        });
    }

    onChangeUserPassword(e) {

        this.setState({
            UserPassword: e.target.value
        });
    }

    onChangePasswordMatch(e) {

        this.setState({
            PasswordMatch: e.target.value
        });
    }

    validate = () => {

        let EmailError = "";
        let UserPasswordError = "";
        let PasswordMatchError = "";
        let UserNameError ="";

        if (!this.state.Email) {
            EmailError = "Email is required.";
        } else if (!this.state.Email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            EmailError = "Email is not valid.";
        }

        if (!this.state.UserPassword) {
            UserPasswordError = "Password is required.";

        }

        if (!this.state.PasswordMatch) {
            PasswordMatchError = "Confirm password is required.";
        }else if (this.state.PasswordMatch!== this.state.UserPassword) {
            PasswordMatchError = "Confirm password should be matched.";
        }

        if (!this.state.UserName) {
            UserNameError = "Name is required.";

        }

        if (EmailError || UserPasswordError|| UserNameError|| PasswordMatchError) {
            this.setState({ EmailError, UserPasswordError,UserNameError, PasswordMatchError })
            return false;
        }


        return true;

    }

    onSubmit(e) {

        e.preventDefault();

        const isValid = this.validate();
        
        //console.log(isValid);

        if (isValid) {


            const obj = { Email: this.state.Email, 
                        UserPassword: this.state.UserPassword,
                        UserName: this.state.UserName,
                        PasswordMatch: this.state.PasswordMatch };

            axios.post('http://localhost:5000/user/search', obj)
                .then(res => {

                    if (res.data==='new') {

                        axios.post('http://localhost:5000/user/create', obj)
                        .then(res => {
                            //console.log(res.data);

                        });
                        this.props.history.push('/login');

                    } else {

                        this.props.history.push('/register');
                        alert('Email already exist.');

                    }
                });
        }

    }

    render() {

        return (
            <div className="container border border-secondary">
                <div className="container w-50" style={{ marginTop: 20 }}>
                    <br />
                    <h5 align="center">Registration</h5>
                    <br />
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">

                            <label >User Name</label>
                            <input type="text"
                                className="form-control form-control-sm form-control form-control-sm-sm"
                                id="UserName"
                                placeholder="Enter user name"
                                value={this.state.UserName} 
                                onChange={this.onChangeUserName} />

                        </div>
                        <div style={{ color: "red" }}>
                            {this.state.UserNameError}
                        </div>

                        <div className="form-group">

                            <label>Email</label>
                            <input type="text"
                                className="form-control form-control-sm form-control form-control-sm-sm"
                                id="Email"
                                placeholder="Enter email"
                                value={this.state.Email} 
                                onChange={this.onChangeEmail} />

                        </div>
                        <div style={{ color: "red" }}>
                            {this.state.EmailError}
                        </div>

                        <div className="form-group">

                            <label>Password</label>
                            <input type="password"
                                className="form-control form-control-sm form-control form-control-sm-sm"
                                id="UserPassword"
                                placeholder="Enter password"
                                value={this.state.UserPassword} 
                                onChange={this.onChangeUserPassword} />

                        </div>
                        <div style={{ color: "red" }}>
                            {this.state.UserPasswordError}
                        </div>

                        <div className="form-group">

                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control form-control-sm form-control form-control-sm-sm"
                                id="PasswordMatch"
                                placeholder="Confirm password"
                                value={this.state.PasswordMatch} 
                                onChange={this.onChangePasswordMatch} />

                        </div>
                        <div style={{ color: "red" }}>
                            {this.state.PasswordMatchError}
                        </div>
                        <div className="form-group" style={{marginBottom: 50 }}>
                            <input type="submit"
                                value="Save"
                                className="btn btn-success btn-sm" />
                        </div>
                        <br />


                    </form>



                </div>
            </div>

        )
    }
}