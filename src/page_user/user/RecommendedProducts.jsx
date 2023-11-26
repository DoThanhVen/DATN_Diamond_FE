import React from 'react';
import '../css/user/suggestedProducts.css'

const RecommendedProducts = () => {
  return (
   <>
   <div className="container bg-white p-4" style={{borderRadius: '8px'}}>
    <nav className="navbar navbar-expand-md navbar-light bg-white">
        <div className="container-fluid p-0"> <a className="navbar-brand text-uppercase fw-800" href="#"><span className="border-red pe-2">GỢI Ý DÀNH CHO BẠN</span></a> <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#myNav" aria-controls="myNav" aria-expanded="false" aria-label="Toggle navigation"> <span className="fas fa-bars"></span> </button>
            <div className="collapse navbar-collapse" id="myNav">
                <div className="navbar-nav ms-auto"> <a className="nav-link active" aria-current="page" href="#">All</a> <a className="nav-link" href="#">Women's</a> <a className="nav-link" href="#">Men's</a> <a className="nav-link" href="#">Kid's</a> <a className="nav-link" href="#">Accessories</a> <a className="nav-link" href="#">Cosmetics</a> </div>
            </div>
        </div>
    </nav>
    
    <div className="row">
        <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product"> <img src="https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                    <li className="icon"><span className="fas fa-expand-arrows-alt"></span></li>
                    <li className="icon mx-3"><span className="far fa-heart"></span></li>
                    <li className="icon"><span className="fas fa-shopping-bag"></span></li>
                </ul>
            </div>
            <div className="tag bg-red">sale</div>
            <div className="title pt-4 pb-1">Winter Sweater</div>
            <div className="d-flex align-content-center justify-content-center"> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> </div>
            <div className="price">$ 60.0</div>
        </div>
        <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product"> <img src="https://images.pexels.com/photos/6764040/pexels-photo-6764040.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                    <li className="icon"><span className="fas fa-expand-arrows-alt"></span></li>
                    <li className="icon mx-3"><span className="far fa-heart"></span></li>
                    <li className="icon"><span className="fas fa-shopping-bag"></span></li>
                </ul>
            </div>
            <div className="tag bg-black">out of stock</div>
            <div className="title pt-4 pb-1">Denim Dresses</div>
            <div className="d-flex align-content-center justify-content-center"> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> </div>
            <div className="price">$ 55.0</div>
        </div>
        <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product"> <img src="https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                    <li className="icon"><span className="fas fa-expand-arrows-alt"></span></li>
                    <li className="icon mx-3"><span className="far fa-heart"></span></li>
                    <li className="icon"><span className="fas fa-shopping-bag"></span></li>
                </ul>
            </div>
            <div className="tag bg-green">new</div>
            <div className="title pt-4 pb-1"> Empire Waist Dresses</div>
            <div className="d-flex align-content-center justify-content-center"> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> </div>
            <div className="price">$ 70.0</div>
        </div>
        <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product"> <img src="https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                    <li className="icon"><span className="fas fa-expand-arrows-alt"></span></li>
                    <li className="icon mx-3"><span className="far fa-heart"></span></li>
                    <li className="icon"><span className="fas fa-shopping-bag"></span></li>
                </ul>
            </div>
            <div className="title pt-4 pb-1">Pinafore Dresses</div>
            <div className="d-flex align-content-center justify-content-center"> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> </div>
            <div className="price">$ 60.0</div>
        </div>
    </div>
    <div className="row">
        <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product"> <img src="https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                    <li className="icon"><span className="fas fa-expand-arrows-alt"></span></li>
                    <li className="icon mx-3"><span className="far fa-heart"></span></li>
                    <li className="icon"><span className="fas fa-shopping-bag"></span></li>
                </ul>
            </div>
            <div className="tag bg-red">sale</div>
            <div className="title pt-4 pb-1">Winter Sweater</div>
            <div className="d-flex align-content-center justify-content-center"> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> </div>
            <div className="price">$ 60.0</div>
        </div>
        <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product"> <img src="https://images.pexels.com/photos/6764040/pexels-photo-6764040.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                    <li className="icon"><span className="fas fa-expand-arrows-alt"></span></li>
                    <li className="icon mx-3"><span className="far fa-heart"></span></li>
                    <li className="icon"><span className="fas fa-shopping-bag"></span></li>
                </ul>
            </div>
            <div className="tag bg-black">out of stock</div>
            <div className="title pt-4 pb-1">Denim Dresses</div>
            <div className="d-flex align-content-center justify-content-center"> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> </div>
            <div className="price">$ 55.0</div>
        </div>
        <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product"> <img src="https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                    <li className="icon"><span className="fas fa-expand-arrows-alt"></span></li>
                    <li className="icon mx-3"><span className="far fa-heart"></span></li>
                    <li className="icon"><span className="fas fa-shopping-bag"></span></li>
                </ul>
            </div>
            <div className="title pt-4 pb-1"> Empire Waist Dresses</div>
            <div className="d-flex align-content-center justify-content-center"> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> </div>
            <div className="price">$ 70.0</div>
        </div>
        <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product"> <img src="https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                    <li className="icon"><span className="fas fa-expand-arrows-alt"></span></li>
                    <li className="icon mx-3"><span className="far fa-heart"></span></li>
                    <li className="icon"><span className="fas fa-shopping-bag"></span></li>
                </ul>
            </div>
            <div className="tag bg-green">new</div>
            <div className="title pt-4 pb-1">Pinafore Dresses</div>
            <div className="d-flex align-content-center justify-content-center"> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> </div>
            <div className="price">$ 60.0</div>
        </div>
    </div>
</div>
   </>
  );
};

export default RecommendedProducts;
