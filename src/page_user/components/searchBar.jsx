import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { callAPI } from '../../service/API'
import './searchbar.css'

function SearchBar({ keyword }) {
    const [products, setProducts] = useState([]);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getData();
    }, [keyword]);

    const getData = async () => {
        setLoading(true);
        try {
            const res = await callAPI(`/api/search?keyword=${keyword}`, 'GET');
            setProducts(res.data.productList.content)
            setShops(res.data.shopList.content)
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    }

    const renderResults = () => {
        if (loading) {
            return <div>Loading...</div>;
        } else if (keyword !== '' && products.length === 0 && shops.length === 0) {
            return <div>Không có kết quả.</div>;
        } else {
            return (
                <div className="dataResult">
                    {products.map((value, key) => (
                        <Link className="dataItem" key={key} to={`/product/${value.id}`}>
                            {value.image_product && value.image_product.length > 0 && (
                                <img src={value.image_product[0].url} alt="" id="search-item-img" width="40px" height="40px" />
                            )}
                            <p id="search-item-name">{value.product_name}</p>
                        </Link>
                    ))}

                    {shops.map((value, key) => (
                        <Link className="dataItem" key={key} to={`/shops/${value.id}/shop`}>
                            <img src={value.image} alt="" id="search-item-img" width="40px" height="40px" />
                            <p id="search-item-name">{value.shop_name}</p>
                        </Link>
                    ))}
                </div>
            );
        }
    };
    return <div className="search">{renderResults()}</div>;
}

export default SearchBar;
