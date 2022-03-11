import {Component} from 'react/cjs/react.production.min'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'

import './index.css'

const statusList = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    loadingStatus: statusList.loading,
    productItemDetails: {},
    orderQuantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const convertToCamelCase = item => ({
      availability: item.availability,
      brand: item.brand,
      description: item.description,
      id: item.id,
      imageUrl: item.image_url,
      price: item.price,
      rating: item.rating,
      style: item.style,
      title: item.title,
      totalReviews: item.total_reviews,
    })

    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    if (response.ok === true) {
      const productDetails = await response.json()

      this.setState({
        productItemDetails: {
          mainProduct: convertToCamelCase(productDetails),
          similarProducts: productDetails.similar_products.map(eachItem =>
            convertToCamelCase(eachItem),
          ),
        },
        loadingStatus: statusList.success,
      })
    } else {
      this.setState({loadingStatus: statusList.failure})
    }
  }

  increaseQuantity = () => {
    this.setState(prevState => ({
      orderQuantity: prevState.orderQuantity + 1,
    }))
  }

  decreaseQuantity = () => {
    const {orderQuantity} = this.state
    if (orderQuantity >= 2) {
      this.setState(prevState => ({orderQuantity: prevState.orderQuantity - 1}))
    }
  }

  redirectToProducts = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoadingView = () => (
    <div testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  getSimilarProduct = item => {
    const {brand, imageUrl, price, rating, title} = item
    return (
      <>
        <img
          src={imageUrl}
          alt="similar product"
          className="similar-product-image"
        />
        <h1 className="similar-product-title">{title}</h1>
        <p className="similar-product-brand">by {brand}</p>
        <div className="price-and-rating-container">
          <p className="similar-product-price">Rs {price}/-</p>
          <div className="rating-container">
            <p className="rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </>
    )
  }

  renderProductDetailsView = () => {
    const {productItemDetails, orderQuantity} = this.state
    const {mainProduct, similarProducts} = productItemDetails

    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = mainProduct

    return (
      <div className="main-container">
        <Header />
        <div className="main-item">
          <img src={imageUrl} alt="product" className="main-item-image" />
          <div className="main-item-details">
            <h1 className="item-name">{title}</h1>
            <p className="item-price">Rs {price}/-</p>
            <div className="items-and-reivews-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="availability">
              <span className="span">Available:</span> {availability}
            </p>
            <p className="brand">
              <span className="span">Brand:</span> {brand}
            </p>
            <hr />
            <div className="order-count-container">
              <button
                type="button"
                className="quantity-change-btn"
                testid="minus"
                onClick={this.decreaseQuantity}
              >
                <BsDashSquare className="icon" />
              </button>

              <p className="order-quantity">{orderQuantity}</p>
              <button
                type="button"
                className="quantity-change-btn"
                testid="plus"
                onClick={this.increaseQuantity}
              >
                <BsPlusSquare className="icon" />
              </button>
            </div>
            <button type="button" className="add-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <div className="similar-products-container">
          {similarProducts.map(eachItem => (
            <div className="similar-product" key={eachItem.id}>
              {this.getSimilarProduct(eachItem)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="not-found-image"
      />
      <h1 className="not-found-heading">Product Not Found</h1>
      <button
        type="button"
        className="not-found-button"
        onClick={this.redirectToProducts}
      >
        Continue Shopping
      </button>
    </div>
  )

  render() {
    const {loadingStatus} = this.state

    switch (loadingStatus) {
      case statusList.loading:
        return this.renderLoadingView()
      case statusList.success:
        return this.renderProductDetailsView()
      case statusList.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
