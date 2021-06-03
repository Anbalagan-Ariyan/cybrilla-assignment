import React from "react";
import { Container, Button, Col, Row, Card } from "reactstrap";
import axios from 'axios'
import cart from '../images/cart.png';
import { withRouter } from 'react-router-dom';

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            error: '',
            isAddedToCart: false
        }
    }
    async componentDidMount() {
        this.getproducts()
        
    }
    getproducts = async () => {
        await axios.get('http://localhost:8000/api/product/list')
            .then(res => {
                console.log(res)
                if(res.status == 200) {
                    let newdata = res.data.data.map(dt => ({...dt, noOfItems: 0, amount: 0}))
                    this.setState({
                        data: newdata,
                        loading: false
                    })
                }
            })
            .catch(err =>
                console.log("error", err)
            )
    }
    redirect = () => {
        this.props.history.push('/cart')
    }
    addItems = (index, value, item) => {
        let {data} = this.state
        let val = value ? parseInt(value) : 0
        data[index]["noOfItems"] = val
        data[index]["amount"] = val * parseInt(item.productPrice)
        this.setState({data, error: '', isAddedToCart: false}) 
    }
    addToCart = async () => {
        let {data} = this.state
        let checkIsEmpty = data.filter(pt => pt.noOfItems == 0)
        console.log("checkIsEmpty", checkIsEmpty)
        if(checkIsEmpty.length === data.length){
            this.setState({error: "Please Add Item", isAddedToCart: false})
        } else {
            let payload = data.filter(pt => pt.noOfItems != 0)
            console.log("payload", payload)
            this.setState({loading: true})
            await axios.post('http://localhost:8000/api/add/item/cart', payload)
                .then(async res => {
                    console.log("res", res)
                    if(res.status == 200){
                        await this.getproducts()
                        this.setState({
                            isAddedToCart: true,
                            loading: false
                        })
                    }
                })
        }
    }
    render() {
        let {data, loading, error, isAddedToCart } = this.state
        return (
            <Container style={{maxWidth: '500px', height: '100vh', backgroundColor: '#f7f7f7',}}>
                <Row>
                    <Col className="col-lg-12 col-12">
                        <div style={{ padding: '10px 10px'}}>
                            <Row style={{alignItems: 'center'}}>
                                <Col className="col-lg-6">
                                    <h4>PRODUCTS</h4>
                                </Col>
                                <Col className="col-lg-6 d-flex" style={{justifyContent: 'flex-end'}}>
                                    <img src={cart} style={{width: '50px', height: '50px'}} onClick={() => this.redirect()}/>
                                </Col>
                            </Row>
                            {
                                loading ?
                                <Row>
                                    <Col className="col-lg-12">
                                        <h4 style={{textAlign: 'center'}}>Loading</h4>
                                    </Col>
                                </Row>
                            :        
                            <>                    
                                <Row className="mt-5">
                                    <Col className="col-lg-12  d-flex flex-column">
                                    { error.length != 0 && <p style={{color: 'red'}}>{error}</p>}
                                    { isAddedToCart && <p style={{color: 'blue'}}>Products Added To Cart</p>}

                                        {data && data.map((dt, i) => (
                                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} key={i}>
                                                <div style={{paddingTop: '10px', display: 'flex'}}>
                                                    <h5 >{dt.productName}</h5>
                                                    <p style={{paddingLeft: '15px'}}>Rs {dt.productPrice}</p>
                                                </div>
                                                <div style={{display: 'flex',width: 220}}>
                                                    <input 
                                                        type="number"
                                                        name="noOfItems"
                                                        placeholder="no of items"
                                                        style={{width: 120, height: 30}}
                                                        // value={dt?.noOfItems}
                                                        onChange={(e) => this.addItems(i, e.target.value, dt)}
                                                    />
                                                    { dt.amount != 0 && <p style={{marginLeft: 10}}>Rs . {dt.amount}</p> }
                                                </div>
                                            </div>
                                        ))}
                                        
                                    </Col>
                                </Row>
                                <Row className="mt-5 ">
                                    <Col className="col-12 align-items-center d-flex justify-content-center">
                                        <button style={{width: 150}} onClick={() => this.addToCart()}>ADD</button>
                                    </Col>
                                </Row>
                                </>
                            }
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(Product);

