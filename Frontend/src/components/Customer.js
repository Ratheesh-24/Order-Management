import React, { Component } from 'react';
import {
    Table, Button, Modal, ModalHeader, ModalBody,
    ModalFooter, FormGroup, Label, Input
} from 'reactstrap';
import axios from 'axios';

export default class Customer extends Component {
    state = {
        customers: [],
        newCategoryModal: false,
        editCategoryModal: false,
        newCategoryData: {
            CustomerName: ''
        },
        editCategoryData: {
            CustomerName: ''
        },

    }
    componentDidMount() {
        var userToken = localStorage.getItem('usertoken');

        if (userToken) {
            this._refereshCategory();
        } else
            this.props.history.push('/login');
      
    }

    togglenewCategoryModal() {
        this.setState({
            newCategoryModal: !this.state.newCategoryModal
        })
    }

    toggleeditCategoryModal() {
        this.setState({
            editCategoryModal: !this.state.editCategoryModal
        })
    }

    addCategory() {


        axios.post('http://localhost:5000/customer', this.state.newCategoryData).then((response) => {

            let { customers } = this.state;

            //console.log(response.data);
            customers.push(response.data);

            this.setState({
                customers, newCategoryModal: false, newCategoryData: {
                    CustomerName: ''
                }
            });

        })

    }

    editCategory(_id, CustomerName) {
        this.setState({
            editCategoryData: { _id, CustomerName }, editCategoryModal: !this.editCategoryModal
        });


    }

    updateCategory() {
        let { _id, CustomerName } = this.state.editCategoryData;

        axios.put(`http://localhost:5000/customer/` + this.state.editCategoryData._id, {
            _id, CustomerName
        }).then((response) => {

            this._refereshCategory();

            this.setState({
                editCategoryModal: false, editCategoryData: { _id: '', CustomerName: '' }
            })

        });

    }

    deleteCategory(id) {
        axios.delete('http://localhost:5000/customer/' + id).then((response) => {
            this._refereshCategory();
        });

    }


    _refereshCategory() {
        axios.get('http://localhost:5000/customer').then((response) => {
            this.setState({
                customers: response.data.response
            })
        });
    }

    render() {

        let customers = this.state.customers.map((cat, index) => {
            return (

                <tr key={index}>
                    <td>{cat._id}</td>
                    <td>{cat.CustomerName}</td>
                    <td>
                        <Button color="success" size="sm" className="mr-2" onClick={this.editCategory.bind(this, cat._id, cat.CustomerName)}>Edit</Button>
                        <Button color="danger" size="sm" onClick={this.deleteCategory.bind(this, cat._id)}>Delete</Button>
                    </td>
                </tr>


            )
        })

        return (
            <div className="container border border-secondary">
                <div className="container" style={{ marginTop: 20 }}>
                    <br />
                    <h5 align="center">Customer List</h5>
                    <Button color="primary" size="sm" onClick={this.togglenewCategoryModal.bind(this)}>Add</Button>
                    <br /><br />
                    <Modal isOpen={this.state.newCategoryModal} toggle={this.togglenewCategoryModal.bind(this)}>
                        <ModalHeader toggle={this.togglenewCategoryModal.bind(this)}>Add new Customer</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="CustomerName">Customer Name</Label>
                                <Input 
                                    id="CustomerName"
                                    className="form-control form-control-sm"
                                    value={this.state.newCategoryData.CustomerName} onChange={(e) => {

                                        let { newCategoryData } = this.state;

                                        newCategoryData.CustomerName = e.target.value;

                                        this.setState({ newCategoryData });
                                    }} />
                            </FormGroup>

                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="primary" onClick={this.addCategory.bind(this)}>Save</Button>{' '}
                            <Button size="sm" color="secondary" onClick={this.togglenewCategoryModal.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.editCategoryModal} toggle={this.toggleeditCategoryModal.bind(this)}>
                        <ModalHeader toggle={this.toggleeditCategoryModal.bind(this)}>Edit Customer</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="CustomerName">Customer Name</Label>
                                <Input 
                                    id="CustomerName" 
                                    className="form-control form-control-sm"
                                    value={this.state.editCategoryData.CustomerName} onChange={(e) => {

                                    let { editCategoryData } = this.state;

                                    editCategoryData.CustomerName = e.target.value;

                                    this.setState({ editCategoryData });
                                }} />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="primary" onClick={this.updateCategory.bind(this)}>Save</Button>{' '}
                            <Button size="sm" color="secondary" onClick={this.toggleeditCategoryModal.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    <Table>
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers}
                        </tbody>
                    </Table>
                    <br /><br />
                </div>
            </div>

        )
    }

}
