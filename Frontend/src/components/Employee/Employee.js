import React, { Component } from 'react';
import {
    Table, Button, Modal, ModalHeader, ModalBody,
    ModalFooter, FormGroup, Label, Input
} from 'reactstrap';

import axios from 'axios';

export default class Employee extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Employees: [],

            departments: [],

            newEmployeeModal: false,

            editEmployeeModal: false,

            newEmployeeData: {

                DepartmentId: '',
                EmployeeName: '',
                DateOfBirth: '',
                EmployeeAddress: '',
                EmployeePhone: ''

            },
            editEmployeeData: {

                DepartmentId: '',
                EmployeeName: '',
                DateOfBirth: '',
                EmployeeAddress: '',
                EmployeePhone: ''

            }

        }

    }

    componentDidMount() {

        var userToken = localStorage.getItem('usertoken');

        if (userToken) {
            // get employee list
            this._refereshEmployee();

            // get department list
            this._refereshDepartment();

        } else
            this.props.history.push('/login');

    }

    togglenewEmployeeModal() {
        this.setState({
            newEmployeeModal: !this.state.newEmployeeModal
        })
    }

    toggleeditEmployeeModal() {
        this.setState({
            editEmployeeModal: !this.state.editEmployeeModal
        })
    }

    addEmployee() {

        const formData = new FormData();

        formData.append('DepartmentId', this.state.newEmployeeData.DepartmentId);
        formData.append('EmployeeName', this.state.newEmployeeData.EmployeeName);
        formData.append('DateOfBirth', this.state.newEmployeeData.DateOfBirth);
        formData.append('EmployeeAddress', this.state.newEmployeeData.EmployeeAddress);
        formData.append('EmployeePhone', this.state.newEmployeeData.EmployeePhone);

        formData.append('file', this.state.newEmployeeData.profileImg);

        // console.log(formData);
        axios.post('http://localhost:5000/Employee', formData).then((response) => {
            // get employee list
            this._refereshEmployee();

            let { Employees } = this.state;
            //console.log(response.data);
            Employees.push(response.data);

            this.setState({
                Employees, newEmployeeModal: false, newEmployeeData: {

                    DepartmentId: '',
                    EmployeeName: '',
                    DateOfBirth: '',
                    EmployeeAddress: '',
                    EmployeePhone: ''

                }
            })

        })
    }

    editEmployee(_id, DepartmentId, EmployeeName, DateOfBirth, EmployeeAddress, EmployeePhone, ProfileImage) {
        //console.log(_id, DepartmentId, EmployeeName, DateOfBirth, EmployeeAddress, EmployeePhone,ProfileImage);
        this.setState({
            editEmployeeData: { _id, DepartmentId, EmployeeName, DateOfBirth, EmployeeAddress, EmployeePhone, ProfileImage }, editEmployeeModal: !this.editEmployeeModal
        });

    }

    updateEmployee() {

        const formData = new FormData();

        formData.append('DepartmentId', this.state.editEmployeeData.DepartmentId);
        formData.append('EmployeeName', this.state.editEmployeeData.EmployeeName);
        formData.append('DateOfBirth', this.state.editEmployeeData.DateOfBirth);
        formData.append('EmployeeAddress', this.state.editEmployeeData.EmployeeAddress);
        formData.append('EmployeePhone', this.state.editEmployeeData.EmployeePhone);

        formData.append('file', this.state.editEmployeeData.profileImg);
        axios.put(`http://localhost:5000/Employee/` + this.state.editEmployeeData._id, formData).then((response) => {

            this._refereshEmployee();

            this.setState({
                editEmployeeModal: false, editEmployeeData: {

                    DepartmentId: '',
                    EmployeeName: '',
                    DateOfBirth: '',
                    EmployeeAddress: '',
                    EmployeePhone: ''

                }
            })

        });

    }

    deleteEmployee(id) {
        axios.delete('http://localhost:5000/Employee/' + id).then((response) => {
            this._refereshEmployee();
        });

    }


    _refereshEmployee() {
        axios.get('http://localhost:5000/Employee').then((response) => {

            //console.log(response.data.employees);

            this.setState({
                Employees: response.data.employees

            })
        });
    }

    _refereshDepartment() {
        axios.get('http://localhost:5000/department').then((response) => {
            this.setState({
                departments: response.data.response
            })
        });
    }

    render() {

        let Employees = this.state.Employees.map((employee, index) => {

            //console.log(employee);

            return (
                <tr key={index}>
                    <td>{employee.EmployeeName}</td>
                    <td>{employee.DepartmentName} </td>
                    <td>{employee.DateOfBirth}</td>
                    <td>{employee.EmployeeAddress}</td>
                    <td>{employee.EmployeePhone}</td>
                    <td><img src={employee.ProfileImage} width="35" alt="profileImage" /></td>

                    <td>
                        <Button color="success" size="sm" className="mr-2" onClick={this.editEmployee.bind(this, employee._id, employee.DepartmentId, employee.EmployeeName, employee.DateOfBirth, employee.EmployeeAddress, employee.EmployeePhone, employee.ProfileImage)}>Edit</Button>
                        <Button color="danger" size="sm" onClick={this.deleteEmployee.bind(this, employee._id)}>Delete</Button>
                    </td>
                </tr>

            )
        })

        return (
            <div className="container border border-secondary">
                <div className="container" style={{ marginTop: 20 }}>

                    <br />

                    <h5 align="center">Employee List</h5>

                    <Button color="primary" size="sm" onClick={this.togglenewEmployeeModal.bind(this)}>Add</Button>

                    <br /><br />

                    <Modal isOpen={this.state.newEmployeeModal} toggle={this.togglenewEmployeeModal.bind(this)}>

                        <ModalHeader toggle={this.togglenewEmployeeModal.bind(this)}>Add new Employee</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="exampleSelect">Department</Label>

                                <select
                                    className="form-control form-control-sm"
                                    value={this.state.newEmployeeData.DepartmentId}
                                    onChange={(e) => {

                                        let { newEmployeeData } = this.state;
                                        newEmployeeData.DepartmentId = e.target.value;


                                        this.setState({ newEmployeeData });

                                    }}>

                                    <option value='none'>
                                        Please Select a Department
                                </option>

                                    {this.state.departments.map(dept => (
                                        <option key={dept._id} value={dept._id} >
                                            {dept.DepartmentName}
                                        </option>
                                    ))}


                                </select>
                            </FormGroup>

                            <FormGroup>
                                <Label for="EmployeeName">Employee Name</Label>
                                <Input
                                    id="EmployeeName"
                                    className="form-control form-control-sm"
                                    value={this.state.newEmployeeData.EmployeeName} onChange={(e) => {

                                        let { newEmployeeData } = this.state;

                                        newEmployeeData.EmployeeName = e.target.value;

                                        this.setState({ newEmployeeData });
                                    }} />
                            </FormGroup>

                            <FormGroup>
                                <Label for="DateOfBirth">DOB</Label>
                                <Input
                                    id="DateOfBirth"
                                    className="form-control form-control-sm"
                                    value={this.state.newEmployeeData.DateOfBirth} onChange={(e) => {

                                        let { newEmployeeData } = this.state;

                                        newEmployeeData.DateOfBirth = e.target.value;

                                        this.setState({ newEmployeeData });
                                    }} />
                            </FormGroup>

                            <FormGroup>
                                <Label for="EmployeeAddress">Address</Label>
                                <Input
                                    id="EmployeeAddress"
                                    className="form-control form-control-sm"
                                    value={this.state.newEmployeeData.EmployeeAddress} onChange={(e) => {

                                        let { newEmployeeData } = this.state;

                                        newEmployeeData.EmployeeAddress = e.target.value;

                                        this.setState({ newEmployeeData });
                                    }} />
                            </FormGroup>

                            <FormGroup>
                                <Label for="EmployeePhone">Phone#</Label>
                                <Input
                                    id="EmployeePhone"
                                    className="form-control form-control-sm"
                                    value={this.state.newEmployeeData.EmployeePhone} onChange={(e) => {

                                        let { newEmployeeData } = this.state;

                                        newEmployeeData.EmployeePhone = e.target.value;

                                        this.setState({ newEmployeeData });
                                    }} />
                            </FormGroup>

                            <FormGroup>
                                <Label for="Image">Image</Label>
                                <Input
                                    name="file"
                                    type="file"
                                    className="form-control form-control-sm"
                                    onChange={(e) => {

                                        let { newEmployeeData } = this.state;

                                        newEmployeeData.profileImg = e.target.files[0];

                                        this.setState({ newEmployeeData });
                                    }} />
                            </FormGroup>

                        </ModalBody>

                        <ModalFooter>
                            <Button size="sm" color="primary" onClick={this.addEmployee.bind(this)}>Save</Button>{' '}
                            <Button size="sm" color="secondary" onClick={this.togglenewEmployeeModal.bind(this)}>Cancel</Button>
                        </ModalFooter>

                    </Modal>

                    <Modal isOpen={this.state.editEmployeeModal} toggle={this.toggleeditEmployeeModal.bind(this)}>
                        <ModalHeader toggle={this.toggleeditEmployeeModal.bind(this)}>Edit Employee</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="Department">Department</Label>
                                <select
                                    className="form-control form-control-sm"
                                    value={this.state.editEmployeeData.DepartmentId}
                                    onChange={(e) => {
                                        let { editEmployeeData } = this.state;
                                        editEmployeeData.DepartmentId = e.target.value;

                                        this.setState({ editEmployeeData });

                                    }}>

                                    {this.state.departments.map(dept => (
                                        <option key={dept._id} value={dept._id} >
                                            {dept.DepartmentName}
                                        </option>
                                    ))}


                                </select>


                            </FormGroup>

                            <FormGroup>
                                <Label for="EmployeeName">Employee Name</Label>
                                <Input
                                    id="EmployeeName"
                                    className="form-control form-control-sm"
                                    value={this.state.editEmployeeData.EmployeeName} onChange={(e) => {

                                        let { editEmployeeData } = this.state;

                                        editEmployeeData.EmployeeName = e.target.value;

                                        this.setState({ editEmployeeData });
                                    }} />
                            </FormGroup>

                            <FormGroup>
                                <Label for="DateOfBirth">DOB</Label>
                                <Input
                                    id="DateOfBirth"
                                    className="form-control form-control-sm"
                                    value={this.state.editEmployeeData.DateOfBirth} onChange={(e) => {

                                        let { editEmployeeData } = this.state;

                                        editEmployeeData.DateOfBirth = e.target.value;

                                        this.setState({ editEmployeeData });
                                    }} />
                            </FormGroup>

                            <FormGroup>
                                <Label for="EmployeeAddress">Address</Label>
                                <Input
                                    id="EmployeeAddress"
                                    className="form-control form-control-sm"
                                    value={this.state.editEmployeeData.EmployeeAddress} onChange={(e) => {

                                        let { editEmployeeData } = this.state;

                                        editEmployeeData.EmployeeAddress = e.target.value;

                                        this.setState({ editEmployeeData });
                                    }} />
                            </FormGroup>

                            <FormGroup>
                                <Label for="EmployeePhone">Phone#</Label>
                                <Input
                                    id="EmployeePhone"
                                    className="form-control form-control-sm"
                                    value={this.state.editEmployeeData.EmployeePhone} onChange={(e) => {

                                        let { editEmployeeData } = this.state;

                                        editEmployeeData.EmployeePhone = e.target.value;

                                        this.setState({ editEmployeeData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Image">Image</Label>
                                <Input
                                    name="file"
                                    type="file"
                                    className="form-control form-control-sm"
                                    onChange={(e) => {

                                        let { editEmployeeData } = this.state;

                                        editEmployeeData.profileImg = e.target.files[0];

                                        this.setState({ editEmployeeData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <img src={this.state.editEmployeeData.ProfileImage} width="50" height="50" alt="profileImage" />
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button size="sm" color="primary" onClick={this.updateEmployee.bind(this)}>Save</Button>{' '}
                            <Button size="sm" color="secondary" onClick={this.toggleeditEmployeeModal.bind(this)}>Cancel</Button>
                        </ModalFooter>

                    </Modal>

                    <Table>
                        <thead className="thead-dark">
                            <tr>
                                <th>Name</th>
                                <th>Department</th>
                                <th>DOB</th>
                                <th>Address</th>
                                <th>Phone#</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Employees}
                        </tbody>
                    </Table>
                    <br /><br />
                </div>
            </div>
        )
    }

}