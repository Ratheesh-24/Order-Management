import React, { Component } from 'react';
import axios from 'axios';

export default class Gallery extends Component {

    constructor(props) {
        super(props);

        this.onFileChange = this.onFileChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            profileImg: '',
            images: [],
        }


    }
    componentDidMount() {
        this._refereshCategory();
    }


    onFileChange(e) {
        this.setState({ profileImg: e.target.files[0] })
    }

    onSubmit(e) {

        e.preventDefault()

        const formData = new FormData()
        formData.append('profileImg', this.state.profileImg)

        axios.post("http://localhost:5000/gallery/uploads", formData, {
        }).then(res => {
            this.setState({ profileImg: '' })
            this._refereshCategory();
        })



    }

    _refereshCategory() {
        axios.get('http://localhost:5000/gallery').then((response) => {
            console.log(response.data.users);
            this.setState({
                images: response.data.users
            })
        });
    }

    deleteImage = (id) => {
        axios.delete('http://localhost:5000/gallery/' + id).then((response) => {
            this._refereshCategory();
        });

    }
    render() {
        let images = this.state.images.map((cat, index) => {

            return (
                <div key={index}>
                    <img src={cat.profileImg} alt="ab" height="220px" width="250px" style={{ marginLeft: 10, marginTop: 10 }} /><br />
                    <button className="btn btn-danger " style={{ width: 250, marginLeft: 10 }} type="button" onClick={this.deleteImage.bind(this, cat._id)}>Delete</button>
                </div>

            )

        })
        return (
            <div className="container border border-secondary">
                <div className="container" style={{ textAlign: "center" }}>
                    <br />
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <h5>Select a file to upload</h5>
                            <input type="file" onChange={this.onFileChange} name="profileImg" />
                            <button className="btn btn-success  btn-sm" type="submit">Upload</button>
                        </div>

                    </form>
                    <div className="row">
                        {images}
                    </div>
                    <br />

                </div>
            </div>
        )
    }
}