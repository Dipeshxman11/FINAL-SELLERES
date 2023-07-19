// Get DOM elements
const productForm = document.getElementById('productForm');
const priceInput = document.getElementById('price');
const productNameInput = document.getElementById('productName');
const productList = document.getElementById('productList');
const totalValueElement = document.getElementById('totalValue');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

let products = [];

// Event listener for adding a product
productForm.addEventListener('submit', addProduct);

// Axios GET request to fetch products
window.addEventListener('DOMContentLoaded', async function() {
  try {
    const response = await axios.get("https://crudcrud.com/api/f2b9e9089f894e95a6d749595bbfe086/Productdata");
    console.log(response);

    products = response.data;

    // Clear the product list
    productList.innerHTML = '';

    // Add products to the product list
    products.forEach((product, index) => {
      const productItem = document.createElement('li');
      productItem.classList.add('product-item');
      productItem.innerHTML = `
        <span>${product.productName} - $${product.price}</span>
        <span class="delete-btn" onclick="deleteProductAxios(${index})">Delete</span>
      `;
      productList.appendChild(productItem);
    });

    // Update the total value
    updateTotalValue();
  } catch (error) {
    console.error(error);
    showError("Failed to fetch products.");
  }
});

// Function to add a product
async function addProduct(e) {
  e.preventDefault();

  const price = priceInput.value;
  const productName = productNameInput.value;

  if (price && productName) {
    
    const product = {
       price,
       productName 
      };

    try {
      const response = await axios.post("https://crudcrud.com/api/f2b9e9089f894e95a6d749595bbfe086/Productdata", product);
      console.log(response);
      products.push(response.data);

// Create the product item
      const productItem = document.createElement('li');
      productItem.classList.add('product-item');
      productItem.innerHTML = `
        <span>${productName} - $${price}</span>
        <span class="delete-btn" onclick="deleteProductAxios(${products.length - 1})">Delete</span>
      `;

// Append the product item to the product list
      productList.appendChild(productItem);

// Update the total value
      updateTotalValue();

// Clear the input fields
      priceInput.value = '';
      productNameInput.value = '';

      showSuccess("Product added successfully!");
    } catch (error) {
      console.error(error);
      showError("Failed to add product.");
    }
  }
}

// Function to delete a product
async function deleteProductAxios(index) {
  const productId = products[index]._id;

  try {
    const response = await axios.delete(`https://crudcrud.com/api/f2b9e9089f894e95a6d749595bbfe086/Productdata/${productId}`);
    console.log(response);
    products.splice(index, 1);

// Remove the product item from the product list
    productList.removeChild(productList.childNodes[index]);

// Update the total value
    updateTotalValue();

    showSuccess("Product deleted successfully!");
  } catch (error) {
    console.error(error);
    showError("Failed to delete product.");
  }
}

// Function to update the total value
function updateTotalValue() {
  const totalValue = products.reduce((sum, product) => sum + parseInt(product.price), 0);
  totalValueElement.textContent = "$" + totalValue;
}

// Function to show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";

  setTimeout(() => {
    errorMessage.textContent = '';
    errorMessage.style.display = "none";
  }, 1000);
}

// Function to show success message
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = "block";

  setTimeout(() => {
    successMessage.textContent = '';
    successMessage.style.display = "none";
  }, 1000);
}
