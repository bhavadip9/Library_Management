import { useContext } from 'react'
import { Store } from '../Store'
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import MessageBox from '../Componet/MessageBox';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button';

const CartScreen = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;
    return (
        <div>
            <Helmet>
                <title>Shopping Cart </title>
            </Helmet>
            <h1>Shopping cart</h1>
            <Row>
                <Col md={8}>
                    {cartItems.length === 0 ? (<MessageBox>Cart is empty . <Link to="/">Go Shopping</Link></MessageBox>) : (<ListGroup>
                        {
                            cartItems.map((item) => (
                                <ListGroup.Item key={item.id}>
                                    <Row className='align-item-center'>
                                        <Col md={4}>
                                            <img src={item.image}
                                                alt={item.name}
                                                className='img-fluid rounded img-thumbnail'></img>{"  "}
                                            <Link className='Countproduct' to={`/product/${item.slug}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={3}>
                                            <Button variant='light' bisabled={item.quantity === item.countInStock}>
                                                <i className='fas fa-minus-circle'></i>
                                            </Button>{'  '}
                                            <span className='Countproduct'>{item.quantity}</span>{'  '}
                                            <Button variant='light' bisabled={item.quantity === 1}>
                                                <i className='fas fa-plus-circle'></i>
                                            </Button>
                                        </Col>
                                        <Col md={3}>₹{item.price}</Col>
                                        <Col md={2}>
                                            <Button variant='light'>
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))
                        }
                    </ListGroup>)}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>
                                        Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{"  "} items):₹{cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className='d-grid'>
                                        <Button type='button'
                                            variant='primary'
                                            disabled={cartItems.length === 0}
                                        >Proceed to Checkout</Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default CartScreen