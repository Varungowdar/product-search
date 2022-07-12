import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import "./App.css";

function App() {
  const [searchClick, setSearchClick] = useState(false);
  const [productListing, setProductListing] = useState(false);
  const [partialSearch, setpartialSearch] = useState("");
  const [productSearch, setproductSearch] = useState("");

  const searchChange = (e) => {
    setSearchClick(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: {
          match_phrase_prefix: {
            "product.name": e.target.value,
          },
        },
      }),
    };
    fetch(
      "https://search-pj-campaigns-index-oyaq7ruf3du2owxiiiuhyqcgcm.eu-west-1.es.amazonaws.com/campaign-se-4-deals/_search",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => setpartialSearch(data));
  };

  const onSearchEnter = (e) => {
    if (e.key === "Enter") {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: {
            match: {
              "product.name": e.target.value,
            },
          },
        }),
      };
      fetch(
        "https://search-pj-campaigns-index-oyaq7ruf3du2owxiiiuhyqcgcm.eu-west-1.es.amazonaws.com/campaign-se-4-deals/_search",
        requestOptions
        )
        .then((response) => response.json())
        
        .then((data) => {
          setproductSearch(data); 
          setProductListing(true);
          setSearchClick(false)
        });
    }
  };

  const onSearchboxClick = () => {
    setSearchClick(true);
  };

  const handleSearchClose = (e) => {
    if (e.target.className === "main") setSearchClick(false);
  };

  const listSuggestItems = partialSearch ? (
    partialSearch.hits.hits.map((value) => (
      <li className="clearfix" key={value._id}>
        <a
          rel="noreferrer"
          href={`${value._source.external_uri}`}
          target="_blank">
          <img
            alt="productName"
            src={`${value._source.product.media.product_images.first[140]}`}
          />
          <span className="product-name-suggestion">
            {value._source.product.name}
          </span>
          <span className="product-price-suggestion">
            fr. <b>{value._source.price.display.offer}</b>
          </span>
        </a>
      </li>
    ))
  ) : (
    <li>What are you looking for ?</li>
  );

  const productList = productSearch ? (
    productSearch.hits.hits.map((value) => (
      <li className="clearfix" key={value._id}>
        <a
          rel="noreferrer"
          href={`${value._source.external_uri}`}
          target="_blank">
          <img
            alt="productName"
            src={`${value._source.product.media.product_images.first[280]}`}
          />
          <p className="clearfix">
          <span className="product-name-listing">
            {value._source.product.name}
          </span>
          <span className="product-price-listing">
            <b>{value._source.price.display.offer}</b>
          </span>
          </p>
          <span className="product-price-drop clearfix">
            Price Drop <b>{value._source.price.diff_percentage} %</b>
          </span>
        </a>
      </li>
    ))
  ) : (
    <li>No products found</li>
  );

  return (
    <div className="main" onClick={handleSearchClose}>
      <h1>Product Search</h1>
      <div className="search">
        <TextField
          id="outlined-basic"
          onChange={searchChange}
          onClick={onSearchboxClick}
          onKeyPress={onSearchEnter}
          variant="outlined"
          fullWidth
          label="Search"
        />
      </div>
      {searchClick ? (
        <div className="suggestion-box">
          <ul className="product-suggestions">{listSuggestItems}</ul>
        </div>
      ) : (
        ""
      )}
      {productListing && productSearch.hits.hits.length > 0 ? (
        <div className="product-listing-wrapper">
          <h2 className="available-products">Available Products</h2>
          <ul className="product-listing">{productList}</ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
