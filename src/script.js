// fetch("https://fakestoreapi.com/products")
//     .then((res) => res.json())
//     .then((json) => console.log(json));
const API_URL = 'https://fakestoreapi.com'

const imagesPlace = document.querySelector('article');

const searchButton = document.querySelector('button#search');
const searchLine = document.querySelector('input#searchLine');

async function getProducts() {
    try {
        const response = await fetch(`${API_URL}/products`)
        if(!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();
        console.log(products)
        setImages(products);
    } catch(error) {
        console.log(error);
    }
}

function setImages(products) {
    const images = products.map(index => index.image);
    const innerHTML = images.reduce((acc, item) => {
        const innerHTML = acc + `
        <img src="${item}">`
        return innerHTML;
    }, '')
    imagesPlace.innerHTML = innerHTML;
}

searchButton.onclick = () => {
    searchLine.focus();
}

getProducts();