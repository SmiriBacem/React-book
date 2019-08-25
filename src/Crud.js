import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
import { Table, Alert } from 'react-bootstrap';
import axios from 'axios'
import { booleanLiteral } from '@babel/types';

class Crud extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: '',

            books: [],
            newBookModal: false,
            newBookData : {
                name: '',
                isbn: 0,
                price: '',
                author: '',
                availability: false
            }
        }
    }
    componentDidMount() {
        axios.get('http://localhost:8000/api/books.json')
            .then(response => {
                console.log(response)
                this.setState({ books: response.data })
                this._refreshBooks();
            })
            .catch(error => {
                console.log(error)
            })
    }

    changeHandler = e => {
        this.setState({ [e.target.name]: e.target.value })
    }


    handleRemove(id) {
        console.log(id)
        const url = 'http://localhost:8000/api/books/'
        axios.delete(url + id)
            .then(res => { this._refreshBooks(); }
            )
            .catch((err) => {
                console.log(err)
            })

    }

    _refreshBooks() {
        axios.get('http://localhost:8000/api/books.json').then((response) => {
            this.setState({
                books: response.data
            })
        })
    }

    toggleNewBookModal() {
        this.setState({
            newBookModal: !this.state.newBookModal
        })
    }
    addBook(){
      //  const book= JSON.parse(this.state.newBookData)
        console.log((this.state.newBookData.availability));


        axios.post('http://localhost:8000/api/books', this.state.newBookData, { headers : { 'Content-Type': 'application/json' }})
        .then(response => {
            console.log(response);
            let {books} = this.state;
            books.push(response.data)
            this.setState({books, newBookModal: false, newBookData : {
                name: '',
                isbn: 0,
                price: '',
                author: '',
                availability: false
                } 
            })
            this._refreshBooks();
        })
        .catch(error => {
            console.log(this.state.newBookData)
            console.log(error)
        })
    }

    render() {
        const { books } = this.state
        const {name, isbn, price, author, availability} = this.state.newBookData
        return (

            <div >
                <Button color="primary" onClick={this.toggleNewBookModal.bind(this)}>Add a new Book</Button>
                <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)}>
                    <ModalHeader toggle={this.toggleNewBookModal.bind(this)} >Add a new Book</ModalHeader>
                    <ModalBody>
                            <FormGroup onSubmit={this.formSubmit}>
                                <Label for="Name">Name</Label>
                                <Input type="text" name="name" value={name} id="Name" placeholder="please enter the name of book !" onChange={(e) => {
                                    let {newBookData} = this.state;
                                    newBookData.name = e.target.value;
                                    this.setState({newBookData});
                                }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Isbn">Isbn</Label>
                                <Input type="number" name="isbn" value={isbn} id="Isbn" placeholder="Please enter the ISBN of book" onChange={(e) => {
                                    let {newBookData} = this.state;
                                    newBookData.isbn = e.target.value;
                                    this.setState({newBookData});
                                }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Price">Price</Label>
                                <Input type="number" name="price" value={price} id="Price" step="any" placeholder="Please enter the price of book !" onChange={(e) => {
                                    let {newBookData} = this.state;
                                    newBookData.price = e.target.value;
                                    this.setState({newBookData});
                                }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Author">Author</Label>
                                <Input type="text" name="author" value={author} id="Author" placeholder="Please enter the author name !" onChange={(e) => {
                                    let {newBookData} = this.state;
                                    newBookData.author = e.target.value;
                                    this.setState({newBookData});
                                }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Availiability">Availiability</Label>
                                <Input type="select" name="availability" id="Availiability" onChange={(e) => {
                                    let {newBookData} = this.state;
                                    newBookData.availability = e.target.value;
                                    this.setState({newBookData});
                                }}>
                                    <option>Select an option</option>
                                    <option value={true} >Available</option>
                                    <option value={false} >Not available</option>
                                </Input>
                            </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.addBook.bind(this)}>Add book</Button>{' '}
                        <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>


                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Available</th>
                            <th scope="col">Author</th>
                            <th scope="col">isbn</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            books.length ?
                                books.map(book =>
                                    <tr key={book.id}>
                                        <td>{book.name}</td>
                                        <td>{book.price}</td>
                                        <td>{book.availability ? <p>available</p> : <p>not available</p>}</td>
                                        <td>{book.author}</td>
                                        <td>{book.isbn}</td>
                                        <td><button color="danger" onClick={this.handleRemove.bind(this, book.id)}>Delete</button></td>
                                    </tr>) :
                                null
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Crud
