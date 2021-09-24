import React, { Component } from 'react';
import {
    Table, Button, Modal, ModalHeader, ModalBody,
    ModalFooter, FormGroup, Label, Input
} from 'reactstrap';
import axios from 'axios';
import { CSVLink } from 'react-csv';

export default class Order extends Component {
    state = {

        orders: [],

        customers: [],

        newOrderModal: false,

        editOrderModal: false,

        param: '',

        newOrderData: {
            CustomerId: '',
            OrderAmount: 0

        },

        editOrderData: {
            CustomerId: '',
            OrderAmount: 0
        },
        OrderAmountError: '',
        CustomerNameError: ''

    }

    validate = (param) => {

        let ordAmt = 0;
        let CustomerId = "";

        let OrderAmountError = "";
        let CustomerNameError = "";

        if (param === 'add') {
            let { newOrderData } = this.state;
            ordAmt = newOrderData.OrderAmount;
            CustomerId = newOrderData.CustomerId;

        } else {
            let { editOrderData } = this.state;
            ordAmt = editOrderData.OrderAmount;
            CustomerId = editOrderData.CustomerId;
        }

        // console.log(ordAmt);
        if (ordAmt === 0 || ordAmt === null || ordAmt === '') {
            OrderAmountError = "Amout is required.";
        }


        if (!CustomerId) {
            CustomerNameError = "Customer is required.";
        }

        if (OrderAmountError || CustomerNameError) {
            this.setState({ OrderAmountError, CustomerNameError })
            return false;
        }

        return true;

    }
    componentDidMount() {

        var userToken = localStorage.getItem('usertoken');

        if (userToken) {

            this._refereshOrder();
            this._refereshCust();

        } else
            this.props.history.push('/login');

    }

    togglenewOrderModal() {
        this.setState({
            newOrderModal: !this.state.newOrderModal,
            OrderAmountError: '',
            CustomerNameError: ''

        })
    }

    toggleeditOrderModal() {
        this.setState({
            editOrderModal: !this.state.editOrderModal,
            OrderAmountError: '',
            CustomerNameError: ''

        })
    }


    addOrder = (e) => {

        e.preventDefault();

        var param = "add";

        const isValid = this.validate(param);

        if (isValid) {
            axios.post('http://localhost:5000/order', this.state.newOrderData).then((response) => {

                let { orders } = this.state;

                //console.log(response.data);
                orders.push(response.data);

                this._refereshOrder();

                this.setState({
                    orders, newOrderModal: false, newOrderData: {
                        CustomerId: '',
                        OrderAmount: 0
                    },
                    OrderAmountError: '',
                    CustomerNameError: ''

                });

            })

        }



    }

    editOrder(_id, CustomerId, OrderAmount) {
        // console.log(_id);
        // console.log(OrderAmount);
        // console.log(CustomerId);
        this.setState({
            editOrderData: { _id, CustomerId, OrderAmount }, editOrderModal: !this.editOrderModal
        });


    }

    updateOrder = (e) => {

        e.preventDefault();

        var param = "edit";
        const isValid = this.validate(param);

        if (isValid) {

            let { _id, CustomerId, OrderAmount } = this.state.editOrderData;

            axios.put(`http://localhost:5000/order/` + this.state.editOrderData._id, {
                _id, CustomerId, OrderAmount
            }).then((response) => {

                this._refereshOrder();

                this.setState({
                    editOrderModal: false, editOrderData: { _id: '', CustomerId: '', OrderAmount: 0 },
                    OrderAmountError: '',
                    CustomerNameError: ''
                })

            });

        }

    }

    deleteOrder(id) {
        axios.delete('http://localhost:5000/order/' + id).then((response) => {
            this._refereshOrder();
        });

    }

    _refereshOrder() {
        axios.get('http://localhost:5000/order').then((response) => {
            //console.log(response.data.Orders);
            this.setState({
                orders: response.data.Orders

            })
        });
    }

    _refereshCust() {
        axios.get('http://localhost:5000/customer').then((response) => {
            //console.log(response.data.response);
            this.setState({
                customers: response.data.response
            })
        });
    }

    orderItem(_id, CustomerId, CustomerName, OrderAmount) {


        const order_id = _id;

        this.props.history.push({
            pathname: '/OrderItems',
            search: '?id=' + order_id,
            state: { detail: { order_id, CustomerName } }
        })

    }

    render() {

        let orders = this.state.orders.map((dept, index) => {
            return (

                <tr key={index}>
                    <td>{dept._id}</td>
                    <td>{dept.CustomerName}</td>
                    <td>{dept.OrderAmount}</td>
                    <td>
                        <Button color="warning" size="sm" className="mr-2" onClick={this.orderItem.bind(this, dept._id, dept.CustomerId, dept.CustomerName, dept.OrderAmount)}>Detail</Button>
                        <Button color="success" size="sm" className="mr-2" onClick={this.editOrder.bind(this, dept._id, dept.CustomerId, dept.OrderAmount)}>Edit</Button>
                        <Button color="danger" size="sm" onClick={this.deleteOrder.bind(this, dept._id)}>Delete</Button>
                    </td>
                </tr>

            )
        })

        return (
            <div className="container border border-secondary">
                <div className="container" style={{ marginTop: 20 }}>
                    <br />
                    <h5 align="center">Order List</h5>
                    <Button color="primary" size="sm" onClick={this.togglenewOrderModal.bind(this)}>Add</Button>
                    <br /><br />

                    <Modal isOpen={this.state.newOrderModal} toggle={this.togglenewOrderModal.bind(this)}>
                        <ModalHeader toggle={this.togglenewOrderModal.bind(this)}>Add new Customer</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="exampleSelect">Customer</Label>

                                <select
                                    className="form-control form-control-sm"
                                    value={this.state.newOrderData.CustomerId}
                                    onChange={(e) => {

                                        let { newOrderData } = this.state;
                                        newOrderData.CustomerId = e.target.value;


                                        this.setState({ newOrderData });

                                    }}>

                                    <option value='none'>
                                        Please Select a Customer
                                </option>

                                    {this.state.customers.map(cat => (
                                        <option key={cat._id} value={cat._id} >
                                            {cat.CustomerName}
                                        </option>
                                    ))}


                                </select>
                                <div style={{ color: "red" }}>
                                    {this.state.CustomerNameError}
                                </div>
                            </FormGroup>

                            <FormGroup>
                                <Label for="OrderAmount">Order Amount</Label>
                                <Input
                                    id="OrderAmount"
                                    className="form-control form-control-sm"
                                    value={this.state.newOrderData.OrderAmount} onChange={(e) => {

                                        let { newOrderData } = this.state;

                                        newOrderData.OrderAmount = e.target.value;

                                        this.setState({ newOrderData });
                                    }} />
                                <div style={{ color: "red" }}>
                                    {this.state.OrderAmountError}
                                </div>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="primary" onClick={this.addOrder.bind(this)}>Save</Button>{' '}
                            <Button size="sm" color="secondary" onClick={this.togglenewOrderModal.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.editOrderModal} toggle={this.toggleeditOrderModal.bind(this)}>
                        <ModalHeader toggle={this.toggleeditOrderModal.bind(this)}>Edit Order</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="exampleSelect">Customer</Label>

                                <select
                                    className="form-control form-control-sm"
                                    value={this.state.editOrderData.CustomerId}
                                    onChange={(e) => {
                                        let { editOrderData } = this.state;
                                        editOrderData.CustomerId = e.target.value;

                                        this.setState({ editOrderData });

                                    }}>

                                    {this.state.customers.map(cat => (
                                        <option key={cat._id} value={cat._id} >
                                            {cat.CustomerName}
                                        </option>
                                    ))}


                                </select>
                                <div style={{ color: "red" }}>
                                    {this.state.CustomerNameError}
                                </div>
                            </FormGroup>

                            <FormGroup>
                                <Label for="OrderAmount">Order Amount</Label>
                                <Input
                                    id="OrderAmount"
                                    className="form-control form-control-sm"
                                    value={this.state.editOrderData.OrderAmount} onChange={(e) => {

                                        let { editOrderData } = this.state;

                                        editOrderData.OrderAmount = e.target.value;

                                        this.setState({ editOrderData });
                                    }} />
                                <div style={{ color: "red" }}>
                                    {this.state.OrderAmountError}
                                </div>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="primary" onClick={this.updateOrder.bind(this)}>Save</Button>{' '}
                            <Button size="sm" color="secondary" onClick={this.toggleeditOrderModal.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    
                    <Button size="sm" color="warning">
                        <CSVLink data={this.state.orders} filename="RptOrder">Export</CSVLink>
                    </Button>

                    <Table>
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders}
                        </tbody>
                    </Table>
                    <br /><br />

                </div>
            </div>

        )
    }

}