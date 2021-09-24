import React, { Component } from 'react';
import {
    Table, Button, Modal, ModalHeader, ModalBody,
    ModalFooter, FormGroup, Label, Input
} from 'reactstrap';

import axios from 'axios';
import { CSVLink } from 'react-csv'

export default class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Products: [],
            categories: [],
            newProductModal: false,
            editProductModal: false,
            newProductData: {

                ProductId: '',
                ProductName: '',
                Description: '',
                PurchaseRate: '',

            },
            editProductData: {

                ProductId: '',
                ProductName: '',
                Description: '',
                PurchaseRate: ''

            },
            ProductNameError: '',
            CategoryNameError: '',
            DescriptionError: '',
            PurchaseRateError: '',

        }


    }


    validate = (param) => {

        let ProductName = "";
        //let CategoryName = "";
        let Description = "";
        let PurchaseRate = "";

        if (param === 'add') {
            let { newProductData } = this.state;
            //  CategoryName = newProductData.CategoryName;
            ProductName = newProductData.ProductName;
            Description = newProductData.Description;
            PurchaseRate = newProductData.PurchaseRate;
        } else {
            let { editProductData } = this.state;
            //  CategoryName = newProductData.CategoryName;
            ProductName = editProductData.ProductName;
            Description = editProductData.Description;
            PurchaseRate = editProductData.PurchaseRate;
        }

        let ProductNameError = "";
        //let CategoryNameError = "";
        let DescriptionError = "";
        let PurchaseRateError = "";

        if (!ProductName) {
            ProductNameError = "Name is required.";
        }

        if (!Description) {
            DescriptionError = "Description is required.";
        }
        if (!PurchaseRate) {
            PurchaseRateError = "Rate is required.";
        }

        if (ProductNameError || DescriptionError || PurchaseRateError) {
            this.setState({ ProductNameError, DescriptionError, PurchaseRateError })
            return false;
        }

        return true;

    }

    componentDidMount() {

        var userToken = localStorage.getItem('usertoken');

        if (userToken) {
            // get product list
            this._refereshProduct();

            // get department list
            this._refereshCategory();

        } else
            this.props.history.push('/login');

    }

    togglenewProductModal() {
        this.setState({
            newProductModal: !this.state.newProductModal,
            ProductNameError: '',
            CategoryNameError: '',
            DescriptionError: '',
            PurchaseRateError: '',
        })
    }

    toggleeditProductModal() {
        this.setState({
            editProductModal: !this.state.editProductModal,
            ProductNameError: '',
            CategoryNameError: '',
            DescriptionError: '',
            PurchaseRateError: '',
        })
    }

    addProduct = (e) => {
        e.preventDefault();

        var param = "add";

        const isValid = this.validate(param);

        if (isValid) {

            axios.post('http://localhost:5000/Product', this.state.newProductData).then((response) => {
                // get product list
                this._refereshProduct();

                let { Products } = this.state;

                Products.push(response.data);
                this.setState({
                    Products, newProductModal: false, newProductData: {

                        ProductId: '',
                        ProductName: '',
                        Description: '',
                        PurchaseRate: ''
                    }
                })

            })

        }

    }

    editProduct(_id, ProductId, ProductName, Description, PurchaseRate,ProductNameError,DescriptionError,PurchaseRateError) {

        this.setState({
            editProductData: { _id, ProductId, ProductName, Description, PurchaseRate }, editProductModal: !this.editProductModal,
            ProductNameError:'',DescriptionError:'',PurchaseRateError:''
        });



    }

    updateProduct = (e) => {

        var param = "edit";
        const isValid = this.validate(param);

        if (isValid) {
            let { _id, ProductId, ProductName, Description, PurchaseRate } = this.state.editProductData;

            axios.put(`http://localhost:5000/Product/` + this.state.editProductData._id, {

                _id, ProductId, ProductName, Description, PurchaseRate

            }).then((response) => {

                this._refereshProduct();

                this.setState({
                    editProductModal: false, editProductData: {

                        ProductId: '',
                        ProductName: '',
                        Description: '',
                        PurchaseRate: ''

                    }
                })

            });

        }


    }

    deleteProduct(id) {
        axios.delete('http://localhost:5000/Product/' + id).then((response) => {
            this._refereshProduct();
        });

    }


    _refereshProduct() {
        axios.get('http://localhost:5000/Product').then((response) => {

            //console.log(response.data.products);

            this.setState({
                Products: response.data.products

            })
        });
    }

    _refereshCategory() {
        axios.get('http://localhost:5000/Category').then((response) => {
            this.setState({
                categories: response.data.response
            })
        });
    }

    render() {

        let Products = this.state.Products.map((product, index) => {

            //console.log(product);

            return (
                <tr key={index}>

                    <td>{product.ProductName} </td>
                    <td>{product.CategoryName}</td>
                    <td>{product.Description}</td>
                    <td>{product.PurchaseRate}</td>

                    <td>
                        <Button color="success" size="sm" className="mr-2" onClick={this.editProduct.bind(this, product._id, product.CategoryId, product.ProductName, product.Description, product.PurchaseRate,this.ProductNameError, this.DescriptionError,this.PurchaseRateError)}>Edit</Button>
                        <Button color="danger" size="sm" onClick={this.deleteProduct.bind(this, product._id)}>Delete</Button>
                    </td>
                </tr>

            )
        })

        return (
            <div className="container border border-secondary">
                <div className="container" style={{ marginTop: 20 }}>

                    <br />

                    <h5 align="center">Product List</h5>

                    <Button color="primary" size="sm" onClick={this.togglenewProductModal.bind(this)}>Add</Button>

                    <br /><br />

                    <Modal isOpen={this.state.newProductModal} toggle={this.togglenewProductModal.bind(this)}>

                        <ModalHeader toggle={this.togglenewProductModal.bind(this)}>Add new product</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="exampleSelect">Product</Label>

                                <select
                                    className="form-control form-control-sm"
                                    value={this.state.newProductData.CategoryId}
                                    onChange={(e) => {

                                        let { newProductData } = this.state;
                                        newProductData.CategoryId = e.target.value;


                                        this.setState({ newProductData });

                                    }}>

                                    <option value='none'>
                                        Please Select a Category
                                </option>

                                    {this.state.categories.map(cat => (
                                        <option key={cat._id} value={cat._id} >
                                            {cat.CategoryName}
                                        </option>
                                    ))}


                                </select>
                                <div style={{ color: "red" }}>
                                    {this.state.CategoryNameError}
                                </div>
                            </FormGroup>

                            <FormGroup>
                                <Label for="ProductName">Product Name</Label>
                                <Input
                                    id="ProductName"
                                    className="form-control form-control-sm"
                                    value={this.state.newProductData.ProductName} onChange={(e) => {

                                        let { newProductData } = this.state;

                                        newProductData.ProductName = e.target.value;

                                        this.setState({ newProductData });
                                    }} />
                                <div style={{ color: "red" }}>
                                    {this.state.ProductNameError}
                                </div>
                            </FormGroup>

                            <FormGroup>
                                <Label for="Description">Description</Label>
                                <Input
                                    id="Description"
                                    className="form-control form-control-sm"
                                    value={this.state.newProductData.Description} onChange={(e) => {

                                        let { newProductData } = this.state;

                                        newProductData.Description = e.target.value;

                                        this.setState({ newProductData });
                                    }} />
                                <div style={{ color: "red" }}>
                                    {this.state.DescriptionError}
                                </div>
                            </FormGroup>

                            <FormGroup>
                                <Label for="PurchaseRate">Purchase Rate</Label>
                                <Input
                                    id="PurchaseRate"
                                    className="form-control form-control-sm"
                                    value={this.state.newProductData.PurchaseRate} onChange={(e) => {

                                        let { newProductData } = this.state;

                                        newProductData.PurchaseRate = e.target.value;

                                        this.setState({ newProductData });
                                    }} />
                                <div style={{ color: "red" }}>
                                    {this.state.PurchaseRateError}
                                </div>
                            </FormGroup>

                        </ModalBody>

                        <ModalFooter>
                            <Button size="sm" color="primary" onClick={this.addProduct.bind(this)}>Save</Button>{' '}
                            <Button size="sm" color="secondary" onClick={this.togglenewProductModal.bind(this)}>Cancel</Button>
                        </ModalFooter>

                    </Modal>

                    <Modal isOpen={this.state.editProductModal} toggle={this.toggleeditProductModal.bind(this)}>
                        <ModalHeader toggle={this.toggleeditProductModal.bind(this)}>Edit product</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="ProductName">Category</Label>
                                <select
                                    className="form-control form-control-sm"
                                    value={this.state.editProductData.CategoryId}
                                    onChange={(e) => {
                                        let { editProductData } = this.state;
                                        editProductData.CategoryId = e.target.value;

                                        this.setState({ editProductData });

                                    }}>

                                    {this.state.categories.map(cat => (
                                        <option key={cat._id} value={cat._id} >
                                            {cat.CategoryName}
                                        </option>
                                    ))}


                                </select>
                                <div style={{ color: "red" }}>
                                    {this.state.CategoryNameError}
                                </div>

                            </FormGroup>
                            <FormGroup>
                                <Label for="ProductName">Product Name</Label>
                                <Input
                                    id="ProductName"
                                    className="form-control form-control-sm"
                                    value={this.state.editProductData.ProductName} onChange={(e) => {

                                        let { editProductData } = this.state;

                                        editProductData.ProductName = e.target.value;

                                        this.setState({ editProductData });
                                    }} />
                                <div style={{ color: "red" }}>
                                    {this.state.ProductNameError}
                                </div>
                            </FormGroup>

                            <FormGroup>
                                <Label for="Description">Description</Label>
                                <Input
                                    id="Description"
                                    className="form-control form-control-sm"
                                    value={this.state.editProductData.Description} onChange={(e) => {

                                        let { editProductData } = this.state;

                                        editProductData.Description = e.target.value;

                                        this.setState({ editProductData });
                                    }} />
                                <div style={{ color: "red" }}>
                                    {this.state.DescriptionError}
                                </div>
                            </FormGroup>

                            <FormGroup>
                                <Label for="PurchaseRate">Purchase Rate</Label>
                                <Input
                                    id="PurchaseRate"
                                    className="form-control form-control-sm"
                                    value={this.state.editProductData.PurchaseRate} onChange={(e) => {

                                        let { editProductData } = this.state;

                                        editProductData.PurchaseRate = e.target.value;

                                        this.setState({ editProductData });
                                    }} />
                                <div style={{ color: "red" }}>
                                    {this.state.PurchaseRateError}
                                </div>
                            </FormGroup>


                        </ModalBody>

                        <ModalFooter>
                            <Button size="sm" color="primary" onClick={this.updateProduct.bind(this)}>Save</Button>{' '}
                            <Button size="sm" color="secondary" onClick={this.toggleeditProductModal.bind(this)}>Cancel</Button>
                        </ModalFooter>

                    </Modal>
                    <Button size="sm" color="warning">
                        <CSVLink data={this.state.Products} filename="RptProduct">Export</CSVLink>
                    </Button>

                    <Table>
                        <thead className="thead-dark">
                            <tr>
                                <th>Category</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Rate</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Products}
                        </tbody>
                    </Table>
                    <br /><br />
                </div>
            </div>
        )
    }

}