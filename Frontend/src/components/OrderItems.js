import React, { Component } from 'react';
import {
    Table, Button, Modal, ModalHeader, ModalBody,
    ModalFooter, FormGroup, Label, Input
} from 'reactstrap';
import axios from 'axios';
import { CSVLink } from 'react-csv';

export default class OrderItems extends Component {
    constructor(props) {
        super(props);

        this.state = {
            orderitems: [],
            products: [],
            OrderId: '',
            //order items
            newOrderItemModal: false,

            editOrderItemModal: false,

            newOrderItemData: {
                OrderId: '',
                ProdId: '',
                Qty: 0,
                Rate: 0

            },

            editOrderItemData: {
                OrderId: '',
                ProdId: '',
                Qty: 0,
                Rate: 0
            },
            ProductNameError: '',
            QuantityError: '',
            RateError: ''

        }

    }

    validate = (param) => {

        let Qty = 0;
        let ProductId = "";
        let Rate = 0;

        let ProductNameError = '';
        let QuantityError = '';
        let RateError = '';

        if (param === 'add') {
            let { newOrderItemData } = this.state;
            Qty = newOrderItemData.Qty;
            Rate = newOrderItemData.Rate;
            ProductId = newOrderItemData.ProdId;

        } else {
            let { editOrderItemData } = this.state;
            Qty = editOrderItemData.Qty;
            Rate = editOrderItemData.Rate;
            ProductId = editOrderItemData.ProdId;
        }

        //console.log(Qty);
        if (Qty === 0 || Qty === null || Qty === '') {
            QuantityError = "Quantity is required.";
        }

        if (Rate === 0 || Rate === null || Rate === '') {
            RateError = "Rate is required.";
        }

        if (!ProductId) {
            ProductNameError = "Product is required.";
        }

        if (QuantityError || ProductNameError || RateError) {
            this.setState({ QuantityError, ProductNameError, RateError })
            return false;
        }

        return true;

    }
    componentDidMount() {

        var userToken = localStorage.getItem('usertoken');

        if (userToken) {

            // order products
            this._refereshOrderItems();

            // order products
            this._refereshProduct();

        } else
            this.props.history.push('/login');

    }

    togglenewOrderItemModal() {
        this.setState({
            newOrderItemModal: !this.state.newOrderItemModal,
            ProductNameError: '',
            QuantityError: '',
            RateError: ''
        })
    }

    toggleeditOrderItemModal() {
        this.setState({
            editOrderItemModal: !this.state.editOrderItemModal,
            ProductNameError: '',
            QuantityError: '',
            RateError: ''
        })
    }

    addOrderItems = (e) => {

        e.preventDefault();

        var param = "add";

        const isValid = this.validate(param);

        if (isValid) {

            axios.post('http://localhost:5000/order/orderdetails', this.state.newOrderItemData).then((response) => {

                let { orderitems } = this.state;

                orderitems.push(response.data);

                this._refereshOrderItems();

                this.setState({
                    orderitems, newOrderItemModal: false, newOrderItemData: {
                        OrderId: '',
                        ProdId: '',
                        Qty: 0,
                        Rate: 0
                    },
                    ProductNameError: '',
                    QuantityError: '',
                    RateError: ''

                });

            })

        }


    }

    editOrderItems(_id, ProdId, Qty, Rate, Amount) {

        this.setState({
            editOrderItemData: { _id, ProdId, Qty, Rate, Amount }, editOrderItemModal: !this.editOrderItemModal
        });


    }

    updateOrderItems = (e) => {
        e.preventDefault();

        var param = "edit";
        const isValid = this.validate(param);

        if (isValid) {
            let { _id, OrderId, ProdId, Qty, Rate, Amount } = this.state.editOrderItemData;

            axios.put(`http://localhost:5000/order/orderdetails/` + this.state.editOrderItemData._id, {
                _id, OrderId, ProdId, Qty, Rate, Amount
            }).then((response) => {

                this._refereshOrderItems();

                this.setState({
                    editOrderItemModal: false, editOrderItemData: { _id: '', OrderId: '', ProdId: '', Qty: 0, Rate: 0, Amount: 0 },
                    ProductNameError: '',
                    QuantityError: '',
                    RateError: ''
                })

            });

        }

    }

    deleteOrderItems(id) {
        axios.delete('http://localhost:5000/order/orderdetails/' + id).then((response) => {
            this._refereshOrderItems();
        });

    }

    _refereshOrderItems() {

        //console.log(this.props.location.state.detail);
        axios.get('http://localhost:5000/order/orderdetails/' + this.props.location.state.detail.order_id).then((response) => {
            //console.log(response.data.Orders);
            this.setState({
                orderitems: response.data.Orders
            })
        });
    }

    _refereshProduct() {
        //console.log(this.props.location.state.detail);
        axios.get('http://localhost:5000/product').then((response) => {
            //console.log(response.data.Orders);
            this.setState({
                products: response.data.products
            })
        });
    }

    backToOrderList = () => {
        this.props.history.push("/Order");
    }

    render() {

        let grandTotal = 0;
        let orderitems = this.state.orderitems.map((dept, index) => {
            grandTotal += dept.Amount;
            return (
                <tr key={index}>
                    <td>{dept._id}</td>
                    <td>{dept.ProductName}</td>
                    <td>{dept.Qty}</td>
                    <td>{dept.Rate}</td>
                    <td>{dept.Amount}</td>
                    <td>
                        <Button color="success" size="sm" className="mr-2" onClick={this.editOrderItems.bind(this, dept._id, dept.ProdId, dept.Qty, dept.Rate, dept.Amount)}>Edit</Button>
                        <Button color="danger" size="sm" onClick={this.deleteOrderItems.bind(this, dept._id)}>Delete</Button>
                    </td>
                </tr>
            )
        })


        return (

            <div className="container" style={{ marginTop: 20 }}>
                <Button color="success" size="sm" onClick={this.togglenewOrderItemModal.bind(this)}>Add Items</Button>
                <Button color="primary" size="sm" onClick={this.backToOrderList.bind(this)}>Back</Button>
                <br /><br />

                <label >Customer</label>
                <input className="form-control form-control-sm col-md-6" value={this.props.location.state.detail.CustomerName} type="text" readOnly></input>

                <Modal isOpen={this.state.newOrderItemModal} toggle={this.togglenewOrderItemModal.bind(this)}>
                    <ModalHeader toggle={this.togglenewOrderItemModal.bind(this)}>Add new Item</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="exampleSelect">Product</Label>

                            <select
                                className="form-control form-control-sm"
                                value={this.state.newOrderItemData.ProdId}
                                onChange={(e) => {

                                    let { newOrderItemData } = this.state;
                                    newOrderItemData.ProdId = e.target.value;
                                    newOrderItemData.OrderId = this.props.location.state.detail.order_id;


                                    this.setState({ newOrderItemData });

                                }}>

                                <option value='none'>
                                    Please Select a Product
                                </option>

                                {this.state.products.map(cat => (
                                    <option key={cat._id} value={cat._id} >
                                        {cat.ProductName}
                                    </option>
                                ))}


                            </select>
                            <div style={{ color: "red" }}>
                                {this.state.ProductNameError}
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <Label for="Qty">Qty</Label>
                            <Input
                                id="Qty"
                                className="form-control form-control-sm"
                                value={this.state.newOrderItemData.Qty} onChange={(e) => {

                                    let { newOrderItemData } = this.state;

                                    newOrderItemData.Qty = e.target.value;

                                    // calculate amount
                                    newOrderItemData.Amount = newOrderItemData.Qty * newOrderItemData.Rate;

                                    this.setState({ newOrderItemData });
                                }} />
                            <div style={{ color: "red" }}>
                                {this.state.QuantityError}
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <Label for="Rate">Rate</Label>
                            <Input
                                id="Rate"
                                className="form-control form-control-sm"
                                value={this.state.newOrderItemData.Rate} onChange={(e) => {

                                    let { newOrderItemData } = this.state;

                                    newOrderItemData.Rate = e.target.value;
                                    // calculate amount
                                    newOrderItemData.Amount = newOrderItemData.Qty * newOrderItemData.Rate;

                                    this.setState({ newOrderItemData });
                                }} />
                            <div style={{ color: "red" }}>
                                {this.state.RateError}
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <Label for="Amount">Amount</Label>
                            <Input
                                id="Amount"
                                className="form-control form-control-sm"
                                readOnly
                                value={this.state.newOrderItemData.Amount} onChange={(e) => {

                                    let { newOrderItemData } = this.state;

                                    newOrderItemData.Amount = e.target.value;

                                    this.setState({ newOrderItemData });
                                }} />
                        </FormGroup>

                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" color="primary" onClick={this.addOrderItems.bind(this)}>Save</Button>{' '}
                        <Button size="sm" color="secondary" onClick={this.togglenewOrderItemModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.editOrderItemModal} toggle={this.toggleeditOrderItemModal.bind(this)}>
                    <ModalHeader toggle={this.toggleeditOrderItemModal.bind(this)}>Edit Order Items</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="exampleSelect">Product</Label>

                            <select
                                className="form-control form-control-sm"
                                value={this.state.editOrderItemData.ProdId}
                                onChange={(e) => {
                                    let { editOrderItemData } = this.state;
                                    editOrderItemData.ProdId = e.target.value;

                                    this.setState({ editOrderItemData });

                                }}>

                                {this.state.products.map(cat => (
                                    <option key={cat._id} value={cat._id} >
                                        {cat.ProductName}
                                    </option>
                                ))}


                            </select>
                            <div style={{ color: "red" }}>
                                {this.state.ProductNameError}
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <Label for="Qty">Qty</Label>
                            <Input
                                id="Qty"
                                className="form-control form-control-sm"
                                value={this.state.editOrderItemData.Qty} onChange={(e) => {

                                    let { editOrderItemData } = this.state;

                                    editOrderItemData.Qty = e.target.value;

                                    // calculate amount
                                    editOrderItemData.Amount = editOrderItemData.Qty * editOrderItemData.Rate;


                                    this.setState({ editOrderItemData });
                                }} />
                            <div style={{ color: "red" }}>
                                {this.state.QuantityError}
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <Label for="Rate">Rate</Label>
                            <Input
                                id="Rate"
                                className="form-control form-control-sm"
                                value={this.state.editOrderItemData.Rate} onChange={(e) => {

                                    let { editOrderItemData } = this.state;

                                    editOrderItemData.Rate = e.target.value;
                                    // calculate amount
                                    editOrderItemData.Amount = editOrderItemData.Qty * editOrderItemData.Rate;

                                    this.setState({ editOrderItemData });
                                }} />
                            <div style={{ color: "red" }}>
                                {this.state.RateError}
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <Label for="Amount">Amount</Label>
                            <Input
                                id="Amount"
                                className="form-control form-control-sm"
                                readOnly
                                value={this.state.editOrderItemData.Amount} onChange={(e) => {

                                    let { editOrderItemData } = this.state;

                                    editOrderItemData.Amount = e.target.value;

                                    this.setState({ editOrderItemData });
                                }} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" color="primary" onClick={this.updateOrderItems.bind(this)}>Save</Button>{' '}
                        <Button size="sm" color="secondary" onClick={this.toggleeditOrderItemModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                                    
                <Button size="sm" color="warning">
                        <CSVLink data={this.state.orderitems} filename="RptOrderItems">Export</CSVLink>
                    </Button>
                <Table>
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Product Name</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderitems}
                    </tbody>
                </Table>
                <br /><br />

                <div className="container border" style={{ backgroundColor: "gray" }}>
                    <h4 align="center">Grand Amount: {grandTotal}</h4>
                </div>
            </div>

        )
    }

}