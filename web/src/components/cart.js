import React from "react";
import { Container, Button, Col, Row, Table } from "reactstrap";
import axios from 'axios'
import home from '../images/home.png';
import { withRouter } from 'react-router-dom';

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: {

            }
        }
    }
    async componentDidMount() {
        this.getCart()
        
    }
    getCart = async () => {
        await axios.get('http://localhost:8000/api/cart/list')
            .then(res => {
                console.log(res)
                if(res.status == 200) {
                    let data = {
                        ...res.data.data
                    }
                    this.setState({
                        data: data,
                        loading: false
                    })
                }
            })
            .catch(err =>
                console.log("error", err)
            )
    }
    redirect = () => {
        this.props.history.push('/')
    }
    deletecart = async () => {
        await axios.get('http://localhost:8000/api/delete/cart')
            .then(res => {
                console.log("res", res)
                if(res.status == 200) {
                    this.getCart()
                    this.setState({
                        loading: false

                    })
                }
            })
            .catch(err =>
                console.log("error", err)
            )
    }
    render() {
        let {data, loading } = this.state
        return (
            <Container style={{ height: '100vh', backgroundColor: '#f7f7f7'}}>
                <Row>
                    <Col className="col-lg-12 col-12">
                        <div style={{padding: '10px 10px'}}>
                            <Row style={{alignItems: 'center'}}>
                                <Col className="col-lg-6">
                                    <h4>CART</h4>
                                </Col>
                                <Col className="col-lg-6 d-flex" style={{justifyContent: 'flex-end'}}>
                                    <img src={home} style={{width: '50px', height: '50px'}} onClick={() => this.redirect()}/>
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
                                        <Table >
                                            <tr>
                                                <th>product Name</th>
                                                <th>product price</th>
                                                <th>No of items added</th>
                                                <th>price</th>
                                                <th>Discount Amount</th>
                                                <th>Price After Discount</th>
                                            </tr>
                                            {data.data && data.data.map((dt, i) => (
                                                <tr>
                                                    <td className="text-center">{dt.productName}</td>
                                                    <td className="text-center">Rs. {dt.productPrice}</td>
                                                    <td className="text-center">{dt.noOfItems}</td>
                                                    <td className="text-center">Rs. {dt.amount}</td>
                                                    <td className="text-center">Rs. {dt.discountPrice}</td>
                                                    <td className="text-center">Rs. {dt.discountPrice == 0 ? dt.amount : dt.priceAfterDiscount}</td>
                                                </tr>
                                            ))}
                                        </Table>
                                    </Col>
                                </Row>
                                <Row className="mt-5 ">
                                    <Col className="col-12 align-items-center d-flex " style={{justifyContent: 'space-between'}}>
                                        <h5 >Total Price Rs.{data.originalTotal}</h5>
                                        <div>
                                            <h5 >total Discount  Rs.{data.totalDiscount}</h5>
                                            {data.isTwentyRsDiscountApplied && <p>Extra Rs 20 applied </p>}
                                        </div>
                                        <h5 >Total Price After Discount Rs.{data.newtotal}</h5>
                                    </Col>
                                </Row>
                                </>
                            }
                        </div>
                        <div>
                            <button style={{width: 150}} onClick={() => this.deletecart()}>Delete cart</button>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(Cart);

