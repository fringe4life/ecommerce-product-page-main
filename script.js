/**
 * Ecommerce Product Page JavaScript
 * Handles gallery navigation, cart management, mobile menu, and lightbox functionality
 */

// ===== STATE MANAGEMENT =====
const state = {
  currentImageIndex: 0,
  cartItems: [],
  cartQuantity: 0,
  isCartOpen: false,
  isMobileMenuOpen: false,
  isLightboxOpen: false
};

// ===== DOM ELEMENTS =====
const elements = {
  // Gallery elements
  galleryWrapper: document.querySelector('.gallery-image-wrapper'),
  galleryMain: document.querySelector('.gallery-image-slide'),
  galleryThumbs: document.querySelectorAll('.gallery-thumb'),
  galleryControls: document.querySelectorAll('.gallery-control'),
  
  // Templates
  cartItemTemplate: document.querySelector('#cart-item-template'),
  
  // Lightbox elements
  lightbox: document.querySelector('.lightbox'),
  lightboxMain: document.querySelector('.lightbox-main-img'),
  lightboxThumbs: document.querySelectorAll('.lightbox-thumb'),
  lightboxControls: document.querySelectorAll('.lightbox-control'),
  lightboxClose: document.querySelector('.lightbox-close'),
  
  // Cart elements
  cart: document.querySelector('.cart'),
  cartBtn: document.querySelector('.nav-cart-btn'),
  cartCount: document.querySelector('.nav-cart-count'),
  cartEmpty: document.querySelector('.cart-empty'),
  cartItems: document.querySelector('.cart-items'),
  cartCheckout: document.querySelector('.btn-checkout'),
  
  // Quantity controls
  quantityValue: document.querySelector('.quantity-value'),
  quantityMinus: document.querySelector('.quantity-btn--minus'),
  quantityPlus: document.querySelector('.quantity-btn--plus'),
  addToCartBtn: document.querySelector('.btn-add-cart'),
  
  // Mobile menu
  mobileMenu: document.querySelector('.mobile-menu'),
  mobileMenuBtn: document.querySelector('.nav-menu-btn'),
  mobileMenuClose: document.querySelector('.mobile-menu-close'),
  
  // Lightbox button
  lightboxBtn: document.querySelector('.gallery-lightbox-btn')
};

// Debug DOM elements
console.log('🔍 DOM Elements Debug:');
console.log('🔍 mobileMenu:', elements.mobileMenu);
console.log('🔍 mobileMenuBtn:', elements.mobileMenuBtn);
console.log('🔍 mobileMenuClose:', elements.mobileMenuClose);
console.log('🔍 All elements:', elements);

// ===== PRODUCT DATA =====
const productData = {
  name: 'Fall Limited Edition Sneakers',
  price: 125.00,
  originalPrice: 250.00,
  images: [
    './images/image-product-1.jpg',
    './images/image-product-2.jpg',
    './images/image-product-3.jpg',
    './images/image-product-4.jpg'
  ],
  thumbnails: [
    './images/image-product-1-thumbnail.jpg',
    './images/image-product-2-thumbnail.jpg',
    './images/image-product-3-thumbnail.jpg',
    './images/image-product-4-thumbnail.jpg'
  ]
};



// ===== GALLERY FUNCTIONS =====

/**
 * Updates both galleries to the same image index
 * @param {number} index - The image index to display
 * @param {string} direction - The direction of the transition ('next', 'prev', or null)
 */
const updateImage = (index, direction = null) => {
  const performTransition = () => {
    state.currentImageIndex = index;
    
    // Update main gallery
    elements.galleryMain.src = productData.images[index];
    elements.galleryMain.alt = `Product image ${index + 1}`;
    
    elements.galleryThumbs.forEach((thumb, i) => {
      thumb.classList.toggle('gallery-thumb-active', i === index);
    });
    
    // Update lightbox if open
    if (state.isLightboxOpen) {
      elements.lightboxMain.src = productData.images[index];
      elements.lightboxMain.alt = `Product image ${index + 1}`;
      
      elements.lightboxThumbs.forEach((thumb, i) => {
        thumb.classList.toggle('lightbox-thumb-active', i === index);
      });
    }
  };

  if (direction) {
    // Create slide transition
    const currentImage = elements.galleryMain;
    const newImage = currentImage.cloneNode(true);
    
    // Set up new image
    newImage.src = productData.images[index];
    newImage.alt = `Product image ${index + 1}`;
    newImage.classList.remove('active');
    
    // Position new image based on direction
    if (direction === 'next') {
      newImage.style.translate = '100% 0';
      newImage.style.opacity = '0';
    } else {
      newImage.style.translate = '-100% 0';
      newImage.style.opacity = '0';
    }
    
    // Add new image to wrapper
    elements.galleryWrapper.appendChild(newImage);
    
    // Trigger transition
    requestAnimationFrame(() => {
      // Animate current image out
      if (direction === 'next') {
        currentImage.style.translate = '-100% 0';
        currentImage.style.opacity = '0';
      } else {
        currentImage.style.translate = '100% 0';
        currentImage.style.opacity = '0';
      }
      
      // Animate new image in
      newImage.style.translate = '0 0';
      newImage.style.opacity = '1';
      
      // After transition, update state and clean up
      setTimeout(() => {
        performTransition();
        
        // Remove old image and clean up
        currentImage.remove();
        newImage.classList.add('active');
        newImage.style.translate = '';
        newImage.style.opacity = '';
      }, 300);
    });
  } else {
    // No transition for direct thumbnail clicks
    performTransition();
  }
};

/**
 * Navigates to the next image
 */
const nextImage = () => {
  const nextIndex = (state.currentImageIndex + 1) % productData.images.length;
  updateImage(nextIndex, 'next');
};

/**
 * Navigates to the previous image
 */
const previousImage = () => {
  const prevIndex = state.currentImageIndex === 0 
    ? productData.images.length - 1 
    : state.currentImageIndex - 1;
  updateImage(prevIndex, 'prev');
};

// ===== CART FUNCTIONS =====

/**
 * Updates the cart display
 */
const updateCartDisplay = () => {
  const totalItems = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Update cart count
  elements.cartCount.textContent = totalItems;
  elements.cartCount.style.display = totalItems > 0 ? 'block' : 'none';
  
  // Update cart content
  if (totalItems === 0) {
    elements.cartEmpty.style.display = 'block';
    elements.cartItems.style.display = 'none';
    elements.cartCheckout.style.display = 'none';
  } else {
    elements.cartEmpty.style.display = 'none';
    elements.cartItems.style.display = 'block';
    elements.cartCheckout.style.display = 'block';
    
    // Update cart items HTML using template
    elements.cartItems.innerHTML = '';
    state.cartItems.forEach(item => {
      const template = elements.cartItemTemplate.content.cloneNode(true);
      const cartItem = template.querySelector('.cart-item');
      
      // Set image
      const img = cartItem.querySelector('.cart-item-img');
      img.src = productData.thumbnails[0];
      img.alt = item.name;
      
      // Set text content
      cartItem.querySelector('.cart-item-title').textContent = item.name;
      cartItem.querySelector('.cart-item-price').textContent = `$${item.price.toFixed(2)} × ${item.quantity}`;
      cartItem.querySelector('.cart-item-total').textContent = `$${(item.price * item.quantity).toFixed(2)}`;
      
      // Add data attribute for identification
      cartItem.dataset.itemName = item.name;
      
      elements.cartItems.appendChild(template);
    });
  }
};

/**
 * Adds items to cart
 * @param {number} quantity - The quantity to add
 */
const addToCart = (quantity) => {
  if (quantity <= 0) return;
  
  const existingItem = state.cartItems.find(item => item.name === productData.name);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    state.cartItems.push({
      name: productData.name,
      price: productData.price,
      quantity: quantity
    });
  }
  
  updateCartDisplay();
};

/**
 * Removes item from cart
 * @param {string} itemName - The name of the item to remove
 */
const removeFromCart = (itemName) => {
  state.cartItems = state.cartItems.filter(item => item.name !== itemName);
  updateCartDisplay();
};

/**
 * Toggles cart visibility
 */
const toggleCart = () => {
  console.log('🔍 toggleCart called');
  console.log('🔍 elements.cart:', elements.cart);
  
  state.isCartOpen = !state.isCartOpen;
  console.log('🔍 state.isCartOpen set to:', state.isCartOpen);
  
  if (state.isCartOpen) {
    try {
      elements.cart.showModal();
      console.log('🔍 cart showModal() called successfully');
    } catch (error) {
      console.error('❌ Error calling cart showModal():', error);
    }
  } else {
    try {
      elements.cart.close();
      console.log('🔍 cart close() called successfully');
    } catch (error) {
      console.error('❌ Error calling cart close():', error);
    }
  }
  
  elements.cartBtn.setAttribute('aria-expanded', state.isCartOpen);
  console.log('🔍 cart aria-expanded set to:', state.isCartOpen);
};

// ===== QUANTITY FUNCTIONS =====

/**
 * Updates quantity display
 */
const updateQuantityDisplay = () => {
  elements.quantityValue.textContent = state.cartQuantity;
  elements.addToCartBtn.disabled = state.cartQuantity === 0;
};

/**
 * Increases quantity
 */
const increaseQuantity = () => {
  state.cartQuantity++;
  updateQuantityDisplay();
};

/**
 * Decreases quantity
 */
const decreaseQuantity = () => {
  if (state.cartQuantity > 0) {
    state.cartQuantity--;
    updateQuantityDisplay();
  }
};

// ===== MODAL FUNCTIONS =====

/**
 * Opens the lightbox
 */
const openLightbox = () => {
  state.isLightboxOpen = true;
  elements.lightbox.showModal();
  
  // Update lightbox to current image
  elements.lightboxMain.src = productData.images[state.currentImageIndex];
  elements.lightboxMain.alt = `Product image ${state.currentImageIndex + 1}`;
  
  elements.lightboxThumbs.forEach((thumb, i) => {
          thumb.classList.toggle('lightbox-thumb-active', i === state.currentImageIndex);
  });
};

/**
 * Closes the lightbox
 */
const closeLightbox = () => {
  state.isLightboxOpen = false;
  elements.lightbox.close();
};

/**
 * Opens the mobile menu
 */
const openMobileMenu = () => {
  console.log('🔍 openMobileMenu called');
  console.log('🔍 elements.mobileMenu:', elements.mobileMenu);
  console.log('🔍 elements.mobileMenuBtn:', elements.mobileMenuBtn);
  
  state.isMobileMenuOpen = true;
  console.log('🔍 state.isMobileMenuOpen set to:', state.isMobileMenuOpen);
  
  try {
    elements.mobileMenu.showModal();
    console.log('🔍 showModal() called successfully');
  } catch (error) {
    console.error('❌ Error calling showModal():', error);
  }
  
  elements.mobileMenuBtn.setAttribute('aria-expanded', 'true');
  console.log('🔍 aria-expanded set to true');
  
  console.log('🔍 Mobile menu should now be open');
};

/**
 * Closes the mobile menu
 */
const closeMobileMenu = () => {
  console.log('🔍 closeMobileMenu called');
  console.log('🔍 elements.mobileMenu:', elements.mobileMenu);
  
  state.isMobileMenuOpen = false;
  console.log('🔍 state.isMobileMenuOpen set to:', state.isMobileMenuOpen);
  
  try {
    elements.mobileMenu.close();
    console.log('🔍 close() called successfully');
  } catch (error) {
    console.error('❌ Error calling close():', error);
  }
  
  elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
  console.log('🔍 aria-expanded set to false');
  
  console.log('🔍 Mobile menu should now be closed');
};

// ===== EVENT LISTENERS =====

/**
 * Sets up all event listeners
 */
const setupEventListeners = () => {
  // Gallery thumbnail clicks
  elements.galleryThumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => updateImage(index, null));
  });
  
  // Gallery controls
  elements.galleryControls.forEach(control => {
    if (control.classList.contains('gallery-control-next')) {
      control.addEventListener('click', nextImage);
          } else if (control.classList.contains('gallery-control-prev')) {
      control.addEventListener('click', previousImage);
    }
  });
  
  // Lightbox thumbnail clicks
  elements.lightboxThumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => updateImage(index, null));
  });
  
  // Lightbox controls
  elements.lightboxControls.forEach(control => {
          if (control.classList.contains('lightbox-control-next')) {
      control.addEventListener('click', nextImage);
          } else if (control.classList.contains('lightbox-control-prev')) {
      control.addEventListener('click', previousImage);
    }
  });
  
  // Lightbox close
  elements.lightboxClose.addEventListener('click', closeLightbox);
  
  // Cart toggle
  elements.cartBtn.addEventListener('click', toggleCart);
  
  // Cart backdrop click to close
  elements.cart.addEventListener('click', (e) => {
    if (e.target === elements.cart) {
      toggleCart();
    }
  });
  
  // Quantity controls
  elements.quantityPlus.addEventListener('click', increaseQuantity);
  elements.quantityMinus.addEventListener('click', decreaseQuantity);
  
  // Add to cart
  elements.addToCartBtn.addEventListener('click', () => {
    addToCart(state.cartQuantity);
    state.cartQuantity = 0;
    updateQuantityDisplay();
  });
  
  // Mobile menu
  console.log('🔍 Setting up mobile menu event listeners');
  console.log('🔍 elements.mobileMenuBtn:', elements.mobileMenuBtn);
  console.log('🔍 elements.mobileMenuClose:', elements.mobileMenuClose);
  
  if (elements.mobileMenuBtn) {
    elements.mobileMenuBtn.addEventListener('click', () => {
      console.log('🔍 Mobile menu button clicked!');
      openMobileMenu();
    });
    console.log('🔍 Mobile menu button click listener attached');
  } else {
    console.error('❌ Mobile menu button not found!');
  }
  
  if (elements.mobileMenuClose) {
    elements.mobileMenuClose.addEventListener('click', () => {
      console.log('🔍 Mobile menu close button clicked!');
      closeMobileMenu();
    });
    console.log('🔍 Mobile menu close button click listener attached');
  } else {
    console.error('❌ Mobile menu close button not found!');
  }
  
  // Lightbox button
  elements.lightboxBtn.addEventListener('click', openLightbox);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (state.isLightboxOpen) {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          previousImage();
          break;
      }
    }
    
    if (state.isMobileMenuOpen && e.key === 'Escape') {
      closeMobileMenu();
    }
  });
  
  // Click outside to close modals
  elements.lightbox.addEventListener('click', (e) => {
    if (e.target === elements.lightbox) {
      closeLightbox();
    }
  });
  
  elements.mobileMenu.addEventListener('click', (e) => {
    if (e.target === elements.mobileMenu) {
      closeMobileMenu();
    }
  });
  
  // Cart item deletion (delegated event)
  elements.cartItems.addEventListener('click', (e) => {
    if (e.target.closest('.cart-item-delete')) {
      const cartItem = e.target.closest('.cart-item');
      const itemName = cartItem.dataset.itemName;
      removeFromCart(itemName);
    }
  });
};

// ===== INITIALIZATION =====

/**
 * Initializes the application
 */
const init = () => {
  // Set initial state
  updateQuantityDisplay();
  updateCartDisplay();
  
  // Setup event listeners
  setupEventListeners();
  
  // Set initial image
  updateImage(0);
};

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 