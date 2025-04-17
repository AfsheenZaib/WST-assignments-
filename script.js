document.addEventListener('DOMContentLoaded', () => {
    /**
   1.  * Retrieves the cart items from the browser's localStorage.
     * @returns {Array} An array of cart items, or an empty array if no cart data is found.
     */
    function getCart() {
      try {
        const cartData = localStorage.getItem('cart');
        return cartData ? JSON.parse(cartData) : [];
      } catch (error) {
        console.error("Error getting cart:", error);
        return []; // Return an empty cart on error to prevent further issues.
      }
    }
  
    /**
   2.  * Saves the cart items to the browser's localStorage.
     * @param {Array} cart An array of cart items to be stored.
     */
    function saveCart(cart) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error("Error saving cart:", error);
        // Consider showing an error message to the user here, if appropriate.
      }
    }
  
    /**
    2. * Handles adding a product to the cart. This function is called directly
     * from the 'onclick' event of the 'Add to Cart' buttons on product pages.
     * @param {string} id The unique ID of the product.
     * @param {string} name The name of the product.
     * @param {number} price The price of the product.
     * @param {string} image The URL or path to the product image.
     */
    window.addToCart = function (id, name, price, image) {
      const cart = getCart();
      const existingItem = cart.find(item => item.id === id);
  
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          id: id,
          name: name,
          price: price,
          image: image,
          quantity: 1
        });
      }
  
      saveCart(cart);
      alert(`${name} added to cart! (Total items: ${cart.reduce((sum, item) => sum + item.quantity, 0)})`);
    };
  
    // --- Cart Page Functionality (cart.html) ---
    // Get the element where the cart items will be displayed.
    const cartListElement = document.getElementById('cart-list');
    // Get the element where the total price of the cart will be displayed.
    const cartTotalElement = document.querySelector('.text-right .text-yellow-600');
    // Get the "Clear Cart" button.
    const clearCartButton = document.getElementById('clear-cart');
    // Get the container holding the example cart items.
    const cartItemsContainerExample = document.querySelector('.space-y-6');
  
    /**
    3. * Displays the items in the cart on the cart page.
     * Retrieves cart data from localStorage and renders the HTML for each item.
     * Also updates the cart total.
     */
    function displayCart() {
      // Get the current cart items.
      const cart = getCart();
      // If the cart list element exists, clear its content.
      if (cartListElement) {
        cartListElement.innerHTML = ''; // Clear the cart display
      }
      //clear any existing content
      if(cartItemsContainerExample){
        cartItemsContainerExample.innerHTML = '';
      }
  
      let total = 0;
      let itemCount = 0; // Keep track of the number of items
  
     4. // If the cart is empty, display a message.
      if (cart.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Your cart is empty.';
        if (cartListElement) cartListElement.appendChild(emptyMessage);
        if (cartTotalElement) cartTotalElement.textContent = '$0.00';
        return;
      }
  
      // Iterate through each item in the cart and create its HTML representation.
      cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('flex', 'items-center', 'justify-between', 'border-b', 'pb-4', 'cart-item');
        cartItemDiv.dataset.productId = item.id;
  
        cartItemDiv.innerHTML = `
          <div class="flex items-center gap-4">
            <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded">
            <div>
              <h3 class="text-lg font-semibold">${item.name}</h3>
              <p class="text-yellow-600 font-bold">$${(item.price * item.quantity).toFixed(2)}</p>
              <button class="delete-btn text-red-500 text-sm mt-1 hover:underline">Remove</button>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="quantity-btn decrease bg-gray-300 px-3 py-1 rounded">-</button>
            <span class="item-quantity">${item.quantity}</span>
            <button class="quantity-btn increase bg-gray-300 px-3 py-1 rounded">+</button>
          </div>
        `;
        if (cartListElement) {
          cartListElement.appendChild(cartItemDiv);
        }
        total += item.price * item.quantity;
        itemCount += item.quantity;
      });
  
     5. // Update the displayed cart total.
      if (cartTotalElement) {
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
        const subtotalTextElement = cartTotalElement.parentNode.querySelector('p');
        if (subtotalTextElement) {
          subtotalTextElement.textContent = `Subtotal (${itemCount} items): `;
          subtotalTextElement.appendChild(cartTotalElement);
        }
      }
  
      // After rendering the cart items, attach event listeners to the delete and quantity update buttons.
      const deleteButtons = document.querySelectorAll('.cart-item .delete-btn');
      deleteButtons.forEach(button => {
        button.addEventListener('click', deleteCartItem);
      });
  
      const quantityButtons = document.querySelectorAll('.cart-item .quantity-btn');
      quantityButtons.forEach(button => {
        button.addEventListener('click', updateQuantity);
      });
    }
  
    /**
     6.* Handles the removal of an item from the cart.
     * @param {Event} event The click event triggered by the delete button.
     */
    function deleteCartItem(event) {
      const deleteButton = event.target;
      const cartItemElement = deleteButton.closest('.cart-item');
      if (!cartItemElement) return;
  
      const productId = cartItemElement.dataset.productId;
      let cart = getCart();
      // Filter out the item with the matching product ID.
      cart = cart.filter(item => item.id !== productId);
      saveCart(cart);
      displayCart(); // Re-render the cart to reflect the removal.
    }
  
    /**
    * Handles the updating of the quantity of an item in the cart.
     * @param {Event} event The click event triggered by the increase or decrease button.
     */
    function updateQuantity(event) {
      const quantityButton = event.target;
      const cartItemElement = quantityButton.closest('.cart-item');
      if (!cartItemElement) return;
  
      const productId = cartItemElement.dataset.productId;
      const quantitySpan = cartItemElement.querySelector('.item-quantity');
      let quantity = parseInt(quantitySpan.textContent);
  
      if (quantityButton.classList.contains('increase')) {
        quantity++;
      } else if (quantityButton.classList.contains('decrease') && quantity > 1) {
        quantity--;
      }
  
      7.// Update the quantity in the cart array.
      let cart = getCart();
      const itemToUpdate = cart.find(item => item.id === productId);
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
      }
      saveCart(cart);
      displayCart(); // Re-render the cart to reflect the quantity change.
    }
  
    // Add an event listener to the "Clear Cart" button to remove all items from the cart.
    if (clearCartButton) {
      clearCartButton.addEventListener('click', () => {
        localStorage.removeItem('cart');
        displayCart(); // Re-render the cart to show it's empty.
      });
    }
  
    // Initialize the cart display when the cart page loads.
    if (window.location.pathname.includes('cart.html')) {
      displayCart();
    }
  
   // --- 8. "Back to Top" Button (index.html) ---
 const backToTopBtn = document.getElementById('back-to-top');
 if (backToTopBtn) {
     backToTopBtn.addEventListener('click', () => {
         window.scrollTo({ top: 0, behavior: 'smooth' });
     });
 }

 // --- 9. Hero Banner Link Alert (index.html) ---
 const heroBannerLink = document.getElementById('hero-banner-link');
 if (heroBannerLink) {
     heroBannerLink.addEventListener('click', (event) => {
         event.preventDefault(); // Prevent navigation for this example
         alert('You clicked the hero banner link!');
     });
 }

 // --- 10. Mobile Menu Toggle (index.html) ---
 const menuIcon = document.querySelector('.fa-bars');
 const panelLinks = document.querySelector('.bg-[#222f3d] .md\\:hidden:not(.flex)'); // Select the hidden links
 if (menuIcon && panelLinks) {
     menuIcon.addEventListener('click', () => {
         panelLinks.classList.toggle('hidden');
     });
 }
});