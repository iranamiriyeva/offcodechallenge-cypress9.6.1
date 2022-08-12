// ******************************************************************************************
//Selectors
export const productList = '.articleTile__content';
export const wishlistIcon = '.wishlistIcon--pointer';
export const productIdAttr = 'data-wish-list-entry-number';
export const productNameInfo = '.articleTile__info'; 
export const productTitle = 'span.articleInfo__name';
export const selectProductName = '//span[normalize-space()=';
//productPrice //span[normalize-space()='Baron']/ancestor::div//descendant::div[@class='articlePrice__integer']
//productButtonspan[normalize-space()='Baron']/ancestor::div//descendant::div[@class='wishlistEntry__deliveryAddToCart wishlistEntry__deliveryAddToCart--logistics']//button[@id='add-to-cart-logistic']
export const wishlistEntry = 'data-wishlist-entry-id';
export const addToCardButton = '#articlePresentationAddToCart';

// ******************************************************************************************
//Methods
//To add random products within required quantity
export const addProductToWishlist = (quantity) => {
  cy.intercept({method: 'PUT', url: '*/wishlist/*'}).as('productAddition');  
  let itemCount = '';
  let randomProduct = ''; 
  let productId = [];
  let productName = [];
  let i = '';
  let productData =[];
  
  cy.get(productList).then((product) => { 
      itemCount += Cypress.$(product).length;

      for(i = 1; i <= quantity; i ++) {
        randomProduct = Math.floor(Math.random() * itemCount);
        cy.get(productList).find(wishlistIcon).eq(randomProduct).click({force: true});
        cy.wait('@productAddition');
       
        cy.get(productList).find(wishlistIcon).eq(randomProduct).invoke('attr', productIdAttr).then(value => {
          productId.push(value);
          console.log(productId);
          cy.log(productId);  

        cy.get(`a[href*="${value}"] ${productTitle}`).then(element => {                 
            productName.push(element.text());
            console.log(productName);
            cy.log(productName);
        });

       });
      }        
  }); 
  productData.push(productName, productId);
  console.log(productData);
  cy.log(productData);
  return productData;
}

// ******************************************************************************************
//To verify addition of products to the Wishlist
export const verifyWishlistProducts = (products) => {
    cy.get('.headerElement__link--wishlist').click();
    cy.url().should('include', 'wunschliste');
    products.forEach(product => cy.contains(product, { matchCase: true }, { timeout: 12000 }));
}

// ******************************************************************************************
//To add wishlisted products to Basket
export const addProductToBasket = (productIDs) => {
    for(let i = 0; i <= productIDs.length-1; i ++) {
        cy.get(`[${wishlistEntry}="${productIDs[i]}"] `+addToCardButton).click();
        cy.contains('Zum Warenkorb').click();   
        cy.go('back');     
    }
}

