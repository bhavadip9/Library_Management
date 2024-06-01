import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Rating from '../Componet/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../Componet/LoadingBox';
import MessageBox from '../Componet/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}


function ProductScreen() {
    const navigate = useNavigate()
    const params = useParams();
    const { slug } = params;
    const [{ loading, error, product }, dispatch] = useReducer(reducer, { product: [], loading: true, error: "", });

    // const [products, setProducts] = useState([]);
    useEffect(() => {
        //Hear give link is call to backend and fetch the data for the front end run;
        // await axios.get('http://localhost:5000/api/products')
        //     .then((response) => {
        //         setProducts(response.data);
        //     }).catch((error) => {
        //         console.log(error);
        //     })
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" });
            try {
                const result = await axios.get(`http://localhost:5000/api/products/slug/${slug}`);
                dispatch({ type: "FETCH_SUCCESS", payload: result.data });
            }
            catch (err) {

                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }

        };

        fetchData();
    }, [slug])
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;
    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry, Product is out of stock');
            return;
        }
        ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        navigate('/cart');
    }
    return (

        loading ? <div><LoadingBox /></div>
            : error ? <MessageBox variant="danger">{error}</MessageBox> :
                <div>

                    <Container   >
                        <Row className='bg-gradient' >
                            <Col md={6}>
                                <img className='img_large'
                                    src={product.image}
                                    alt={product.name}
                                ></img>
                            </Col>
                            <Col md={3} className="mt-3">
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Helmet>
                                            <title>{product.name}</title>
                                        </Helmet>
                                        <h1>{product.name}</h1>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Rating rating={product.rating}
                                            numReviews={product.numReviews}></Rating>
                                    </ListGroup.Item>
                                    <ListGroup.Item>Price : ₹{product.price}</ListGroup.Item>
                                    <ListGroup.Item>Description : <p>{product.description}</p></ListGroup.Item>
                                </ListGroup>
                            </Col>

                            <Col md={3} className="mt-3">
                                <Card>
                                    <Card.Body>
                                        <ListGroup variant='flush'>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Price :</Col>
                                                    <Col>₹{product.price}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Status :</Col>
                                                    <Col>{product.countInStock > 0 ? <Badge bg="success">In Stack</Badge> :
                                                        <Badge bg="danger">Unavailabel</Badge>}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            {product.countInStock > 0 && (
                                                <ListGroup.Item>
                                                    <div className='d-grid'>
                                                        <Button onClick={addToCartHandler} className='addtocart' variant='primary'>Add to cart</Button>
                                                    </div>
                                                </ListGroup.Item>
                                            )}
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div >

    )
}

export default ProductScreen
