// ******************************************************************************************
//Selectors
export const navMenu = '.menu__entry a.menu__linkHref';
export const productList = '.articleTile__content';
export const wishlistIcon = '.wishlistIcon--pointer';
export const productIdAttr = 'data-wish-list-entry-number';
export const productTitle = 'span.articleInfo__name';
export const wishlistEntry = 'data-wishlist-entry-id';
export const addToCardButton = '#articlePresentationAddToCart';
export const wishlistLink = '.headerElement--wishlist a';
export const basketHeader = '.headline--cart';

// ******************************************************************************************
//Methods
// ******************************************************************************************
//To navigate to menu
export const navigateMenu = () => {
  cy.get(navMenu)
  .invoke('attr', 'href')
  .then(href => {
    cy.visit(Cypress.env('baseUrl')+href);
  });
}

// ******************************************************************************************
//To add random products within required quantity to the Wishlist
export const addToWishlist = (quantity) => {
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
          cy.log(productId);  

        cy.get(`a[href*="${value}"] ${productTitle}`).then(element => {                 
            productName.push(element.text());
            cy.log(productName);
        });

       });
      }        
  }); 
  productData.push(productName, productId);
  cy.log(productData);
  return productData;
}

// ******************************************************************************************
//To verify addition of products to the Wishlist
export const verifyWishlistItems = (products) => {
    cy.get(wishlistLink).click();
    cy.url().should('include', 'wunschliste');
    products.forEach(product => cy.contains(product, { matchCase: true }, { timeout: 15000 }));
}

// ******************************************************************************************
//To add wishlisted products to the Basket
export const addToBasket = (productIDs) => {
    for(let i = 0; i <= productIDs.length-1; i ++) {
        cy.get(`[${wishlistEntry}="${productIDs[i]}"] `+addToCardButton).click();
        cy.contains('Zum Warenkorb').click();   
        cy.go('back');     
    }
}

