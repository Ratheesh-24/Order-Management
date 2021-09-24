import React, { Component } from 'react';
import {
    Table, Button, Modal, ModalHeader, ModalBody,
    ModalFooter, FormGroup, Label, Input
} from 'reactstrap';
import axios from 'axios';

export default class Department extends Component {
    state = {
        departments: [],
        newDepartmentModal: false,
        editDepartmentModal: false,
        newDepartmentData: {
            DepartmentName: ''
        },
        editDepartmentData: {
            DepartmentName: ''
        },

    }
    componentDidMount() {
        var userToken = localStorage.getItem('usertoken');

        if (userToken) {
            this._refereshDept();
        } else
            this.props.history.push('/login');
    }

    togglenewDepartmentModal() {
        this.setState({
            newDepartmentModal: !this.state.newDepartmentModal
        })
    }

    toggleeditDepartmentModal() {
        this.setState({
            editDepartmentModal: !this.state.editDepartmentModal
        })
    }

    addDepartment() {


        axios.post('http://localhost:5000/department', this.state.newDepartmentData).then((response) => {

            let { departments } = this.state;

            //console.log(response.data);
            departments.push(response.data);

            this.setState({
                departments, newDepartmentModal: false, newDepartmentData: {
                    DepartmentName: ''
                }
            });

        })

    }

    editDepartment(_id, DepartmentName) {
        this.setState({
            editDepartmentData: { _id, DepartmentName }, editDepartmentModal: !this.editDepartmentModal
        });


    }

    updateDepartment() {
        let { _id, DepartmentName } = this.state.editDepartmentData;

        axios.put(`http://localhost:5000/department/` + this.state.editDepartmentData._id, {
            _id, DepartmentName
        }).then((response) => {

            this._refereshDept();

            this.setState({
                editDepartmentModal: false, editDepartmentData: { _id: '', DepartmentName: '' }
            })

        });

    }

    deleteDepartment(id) {
        axios.delete('http://localhost:5000/department/' + id).then((response) => {
            this._refereshDept();
        });

    }


    _refereshDept() {
        axios.get('http://localhost:5000/department').then((response) => {
            this.setState({
                departments: response.data.response
            })
        });
    }

    render() {

        let departments = this.state.departments.map((dept, index) => {
            return (

                <tr key={index}>
                    <td>{dept._id}</td>
                    <td>{dept.DepartmentName}</td>
                    <td>
                        <Button color="success" size="sm" className="mr-2" onClick={this.editDepartment.bind(this, dept._id, dept.DepartmentName)}>Edit</Button>
                        <Button color="danger" size="sm" onClick={this.deleteDepartment.bind(this, dept._id)}>Delete</Button>
                    </td>
                </tr>


            )
        })

        return (
            <div className="container border border-secondary">
                <div className="container" style={{ marginTop: 20 }}>
                    <br />
                    <h5 align="center">Department List</h5>
                    <Button color="primary" size="sm" onClick={this.togglenewDepartmentModal.bind(this)}>Add</Button>
                    <br /><br />
                    <Modal isOpen={this.state.newDepartmentModal} toggle={this.togglenewDepartmentModal.bind(this)}>
                        <ModalHeader toggle={this.togglenewDepartmentModal.bind(this)}>Add new Department</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="DepartmentName">Department Name</Label>
                                <Input
                                    id="DepartmentName"
                                    className="form-control form-control-sm"
                                    value={this.state.newDepartmentData.DepartmentName} onChange={(e) => {

                                        let { newDepartmentData } = this.state;

                                        newDepartmentData.DepartmentName = e.target.value;

                                        this.setState({ newDepartmentData });
                                    }} />
                            </FormGroup>

                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="primary" onClick={this.addDepartment.bind(this)}>Save</Button>{' '}
                            <Button size="sm" color="secondary" onClick={this.togglenewDepartmentModal.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.editDepartmentModal} toggle={this.toggleeditDepartmentModal.bind(this)}>
                        <ModalHeader toggle={this.toggleeditDepartmentModal.bind(this)}>Edit Department</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="DepartmentName">Department Name</Label>
                                <Input
                                    id="DepartmentName"
                                    className="form-control form-control-sm"
                                    value={this.state.editDepartmentData.DepartmentName} onChange={(e) => {

                                        let { editDepartmentData } = this.state;

                                        editDepartmentData.DepartmentName = e.target.value;

                                        this.setState({ editDepartmentData });
                                    }} />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="primary" onClick={this.updateDepartment.bind(this)}>Save</Button>{' '}
                            <Button size="sm" color="secondary" onClick={this.toggleeditDepartmentModal.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    <Table>
                        <thead className="thead-dark">
                            <tr>
                                <th>Department ID</th>
                                <th>Department Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments}
                        </tbody>
                    </Table>
                    <br /><br />
                </div>
            </div>

        )
    }

}