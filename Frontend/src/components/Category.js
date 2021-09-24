import React, { Component } from 'react';
import {
    Table, Button, Modal, ModalHeader, ModalBody,
    ModalFooter, FormGroup, Label, Input
} from 'reactstrap';
import axios from 'axios';
import { CSVLink } from 'react-csv'

export default class Category extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            newCategoryModal: false,
            editCategoryModal: false,
            newCategoryData: {
                CategoryName: ''
            },
            editCategoryData: {
                CategoryName: ''
            },
            CategoryNameError: '',

        }

    }

    validate = (param) => {

        let name = "";
        let CategoryNameError = "";

        if (param === 'add') {
            let { newCategoryData } = this.state;
            name = newCategoryData.CategoryName;
        } else {
            let { editCategoryData } = this.state;
            name = editCategoryData.CategoryName;
        }

        if (!name) {
            CategoryNameError = "Name is required.";
        }

        if (CategoryNameError) {
            this.setState({ CategoryNameError })
            return false;
        }

        return true;

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
            newCategoryModal: !this.state.newCategoryModal,
            CategoryNameError: ''
        })
    }

    toggleeditCategoryModal() {
        this.setState({
            editCategoryModal: !this.state.editCategoryModal,
            CategoryNameError: ''
        })
    }

    addCategory = (e) => {

        e.preventDefault();
        var param = "add";

        const isValid = this.validate(param);

        if (isValid) {

            axios.post('http://localhost:5000/category', this.state.newCategoryData).then((response) => {

                let { categories } = this.state;

                //console.log(response.data);
                categories.push(response.data);

                this.setState({
                    categories, newCategoryModal: false, newCategoryData: {
                        CategoryName: ''
                    }
                });

            })


        }


    }

    editCategory(_id, CategoryName, CategoryNameError) {

        this.setState({
            editCategoryData: { _id, CategoryName }, editCategoryModal: !this.editCategoryModal, CategoryNameError: ''
        });
    }

    updateCategory() {

        var param = "edit";
        const isValid = this.validate(param);

        if (isValid) {

            let { _id, CategoryName } = this.state.editCategoryData;

            axios.put(`http://localhost:5000/category/` + this.state.editCategoryData._id, {
                _id, CategoryName
            }).then((response) => {

                this._refereshCategory();

                this.setState({
                    editCategoryModal: false, editCategoryData: { _id: '', CategoryName: '' }
                })

            });
        }
    }

    deleteCategory(id) {
        axios.delete('http://localhost:5000/category/' + id).then((response) => {
            this._refereshCategory();
        });

    }


    _refereshCategory() {
        axios.get('http://localhost:5000/category').then((response) => {
            this.setState({
                categories: response.data.response
            })
        });
    }

    render() {
        let categories = this.state.categories.map((cat, index) => {
            return (

                <tr key={index}>
                    <td>{cat._id}</td>
                    <td>{cat.CategoryName}</td>
                    <td>
                        <Button color="success" size="sm" className="mr-2" onClick={this.editCategory.bind(this, cat._id, cat.CategoryName, this.CategoryNameError)}>Edit</Button>
                        <Button color="danger" size="sm" onClick={this.deleteCategory.bind(this, cat._id)}>Delete</Button>
                    </td>
                </tr>


            )
        })

        return (
            <div className="container border border-secondary">
                <div className="container" style={{ marginTop: 20 }}>
                    <br />
                    <h5 align="center">Category List</h5>
                    <Button color="primary" size="sm" onClick={this.togglenewCategoryModal.bind(this)}>Add</Button>
                    <br /><br />
                    <Modal isOpen={this.state.newCategoryModal} toggle={this.togglenewCategoryModal.bind(this)}>
                        <ModalHeader toggle={this.togglenewCategoryModal.bind(this)}>Add new Category</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="CategoryName">Category Name</Label>
                                <Input
                                    id="CategoryName"
                                    className="form-control form-control-sm"
                                    value={this.state.newCategoryData.CategoryName} onChange={(e) => {

                                        let { newCategoryData } = this.state;

                                        newCategoryData.CategoryName = e.target.value;

                                        this.setState({ newCategoryData });
                                    }} />
                                <div style={{ color: "red" }}>
                                    {this.state.CategoryNameError}
                                </div>
                            </FormGroup>

                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="primary" onClick={this.addCategory.bind(this)}>Save</Button>{' '}
                            <Button size="sm" color="secondary" onClick={this.togglenewCategoryModal.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.editCategoryModal} toggle={this.toggleeditCategoryModal.bind(this)}>
                        <ModalHeader toggle={this.toggleeditCategoryModal.bind(this)}>Edit Category</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="CategoryName">Category Name</Label>
                                <Input
                                    id="CategoryName"
                                    className="form-control form-control-sm"
                                    value={this.state.editCategoryData.CategoryName} onChange={(e) => {

                                        let { editCategoryData } = this.state;

                                        editCategoryData.CategoryName = e.target.value;

                                        this.setState({ editCategoryData });
                                    }} />
                                <div style={{ color: "red" }}>
                                    {this.state.CategoryNameError}
                                </div>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="primary" onClick={this.updateCategory.bind(this)}>Save</Button>{' '}
                            <Button size="sm" color="secondary" onClick={this.toggleeditCategoryModal.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    <Button size="sm" color="warning">
                        <CSVLink data={this.state.categories} filename="RptCateogry">Export</CSVLink>
                    </Button>
                    
                    <Table>
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Category Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories}
                        </tbody>
                    </Table>
                    <br /><br />
                </div>
            </div>

        )
    }

}