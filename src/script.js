const API_URL = "https://fakestoreapi.com";

const categoriesPlace = document.querySelector("div.contentCategories");
const bestsellersPlace = document.querySelector("div.contentBestsellers");

const searchButton = document.querySelector("button#search");
const searchLine = document.querySelector("input#searchLine");
const toLeftButton = document.querySelector("button#toLeft");
const toRightButton = document.querySelector("button#toRight");

function getCountCategoriesFrame(x) {
    if (x.matches) {
        return 2;
    } else {
        return 4;
    }
}
var x = window.matchMedia("(max-width: 1024px)");
x.addEventListener('change', () => {
    getImageCategories();
});

async function getProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error("Network response was not ok");
        const products = await response.json();
        // console.log(products);
        return products;
    } catch (error) {
        console.log(error);
    }
}

async function getCategories() {
    try {
        const response = await fetch(`${API_URL}/products/categories`);
        if (!response.ok) throw new Error("Network response was not ok");
        const categories = await response.json();
        // console.log(categories);
        return categories;
    } catch (error) {
        console.log(error);
    }
}

async function getProductsCategory(category) {
    try {
        const response = await fetch(
            `${API_URL}/products/category/${category}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const productsCategory = await response.json();
        // console.log(productsCategory);
        return productsCategory;
    } catch (error) {
        console.log(error);
    }
}

async function getImageCategories() {
    const categories = await getCategories();
    const productsCategories = await Promise.all(
        (() => {
            return categories.map((item) => {
                return getProductsCategory(item);
            });
        })()
    );
    const randomProductCategories = productsCategories.map((item) => {
        const randomProductCategory =
            item[Math.floor(Math.random() * item.length)];
        return randomProductCategory;
    });
    setImageCategories(randomProductCategories, 1, getCountCategoriesFrame(x));
}

async function setImageCategories(
    randomProductCategories,
    numberFrameCategories,
    countProductsInFrame
) {
    const countFramesCategories = Math.ceil(
        randomProductCategories.length / countProductsInFrame
    );
    if (countFramesCategories != 1) {
        toRightButton.style.display = "block";
        toLeftButton.style.display = "block";
        document.querySelector('section.categories div h2').style.margin = '0'
        switch (numberFrameCategories) {
            case 1:
                toRightButton.className = "invert";
                toLeftButton.className = null;
                break;

            case countFramesCategories:
                toLeftButton.className = "invert";
                toRightButton.className = null;
                break;

            default:
                toRightButton.className = "invert";
                toLeftButton.className = "invert";
        }
    } else {
        toRightButton.style.display = null;
        toLeftButton.style.display = null;
        document.querySelector('section.categories div h2').style.margin = 'auto'
    }
    const frameRandomProductCategories = randomProductCategories.slice(
        0 + (numberFrameCategories - 1) * countProductsInFrame,
        countProductsInFrame * numberFrameCategories
    );

    const innerHTML = frameRandomProductCategories.reduce((acc, item) => {
        return (
            acc +
            `<button id="${item.category}"><figure><img src="${
                item.image
            }" alt="${item.title}"><figcaption>${
                item.category.charAt(0).toUpperCase() + item.category.slice(1)
            }</figcaption></figure></button>`
        );
    }, "");
    categoriesPlace.innerHTML = innerHTML;

    toLeftButton.onclick = toLeft;
    toRightButton.onclick = toRight;

    async function toLeft() {
        if (--numberFrameCategories < 1) {
            setImageCategories(
                randomProductCategories,
                countFramesCategories,
                countProductsInFrame
            );
            scrollWithAnimation("left");
        } else {
            setImageCategories(
                randomProductCategories,
                numberFrameCategories,
                countProductsInFrame
            );
            scrollWithAnimation("left");
        }
    }
    function toRight() {
        if (++numberFrameCategories > countFramesCategories) {
            setImageCategories(
                randomProductCategories,
                1,
                countProductsInFrame
            );
            scrollWithAnimation("right");
        } else {
            setImageCategories(
                randomProductCategories,
                numberFrameCategories,
                countProductsInFrame
            );
            scrollWithAnimation("right");
        }
    }
    async function scrollWithAnimation(direction) {
        for (let i = 1; i <= 20; ++i) {
            if (direction === "right") {
                categoriesPlace.style.left = 8 / i - i * (0.4 / i) + "vw";
                await new Promise((resolve) => setTimeout(resolve, 10));
            }
            if (direction === "left") {
                categoriesPlace.style.right = 8 / i - i * (0.4 / i) + "vw";
                await new Promise((resolve) => setTimeout(resolve, 10));
            }
            categoriesPlace.style.left = categoriesPlace.style.right = null;
        }
    }
}

async function setBestsellers() {
    const products = await getProducts();
    products
        .sort((a, b) => {
            if (!(b.rating.rate == a.rating.rate)) {
                return b.rating.rate - a.rating.rate;
            } else {
                return b.rating.count - a.rating.count;
            }
        })
        .splice(8);
    const innerHTML = products.reduce((acc, item, index) => {
        return (
            acc +
            `<div tabindex="0" class="product" id="${index}">
                        <figure>
                            <img
                                src="${item.image}"
                                alt="${item.title}"
                            />
                            <figcaption>
                                <p>${item.title}</p>
                                <p>$${item.price.toFixed(2)}</p>
                            </figcaption>
                        </figure>
                        <button class="addToCart">Add to Cart</button>
                        <button class="addToFavorite">
                            <svg
                                width="35"
                                viewBox="0 0 100 100"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    id="hover"
                                    d="M20.9652 58.715L50.2403 85.5L79.5155 58.715C90.1355 48.9984 92.236 35.1045 85.966 23.9465C81.5003 15.9995 72.1204 13.336 63.6375 15.9995C55.914 18.4245 50.2403 29.4102 50.2403 29.4102C50.2403 29.4102 44.5667 18.4245 36.8431 15.9995C28.3602 13.336 18.9803 15.9995 14.5146 23.9465C8.24466 35.1045 10.3452 48.9984 20.9652 58.715Z"
                                    fill="#FFFFFF"
                                />
                                <path
                                    d="M50.2403 85.5C50.2403 85.5 50.2403 85.5 20.9652 58.715C10.3452 48.9984 8.24466 35.1045 14.5146 23.9465C18.9803 15.9995 28.3602 13.336 36.8431 15.9995C44.5667 18.4245 50.2403 29.4102 50.2403 29.4102"
                                    stroke="black"
                                    stroke-width="6"
                                    stroke-linecap="round"
                                />
                                <path
                                    d="M50.2403 85.5C50.2403 85.5 50.2403 85.5 79.5155 58.715C90.1355 48.9984 92.236 35.1045 85.966 23.9465C81.5003 15.9995 72.1204 13.336 63.6375 15.9995C55.914 18.4245 50.2403 29.4102 50.2403 29.4102"
                                    stroke="black"
                                    stroke-width="6"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </button>
                    </div>`
        );
    }, "");
    bestsellersPlace.innerHTML = innerHTML;
}

searchButton.onclick = () => {
    searchLine.focus();
};
getImageCategories();

setBestsellers();
