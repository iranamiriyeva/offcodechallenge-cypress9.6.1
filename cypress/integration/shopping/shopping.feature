Feature: Testing functionality of Wishlist and Basket
As a customer I should be able to:
1. Add the items to my Wishlist,
2. Add all existing items of my Wishlist to my Basket,
3. Verify my Basket includes all items with the correct merchandise value.

@shopping
#1 Go to the website and select 5 items from the Webpage which will be added to your Wishlist
Scenario: As a customer I can add the items to my Wishlist
    Given User navigates to the Menu list
    When Chooses 5 random items by clicking on the wishlist icon 
    Then The list of items are added to the Wishlist 

@shopping
#2 Go to your Wishlist and add all 5 existing items of the Wishlist to your basket
Scenario: As a customer I can add all existing items to my Basket
    Given User navigates to the Wishlist page
    When Clicks on Add to basket button 
    Then A message is displayed about successful item addition

#@shopping
#3 Verify the Basket contains all items which were selected and that the merchandise value is correct (excluding shipping)
#Scenario: As a customer I can verify all items within merchandise value in my Basket
    #Given User navigates to the Basket page
    #When Reviews the list of items 
    #Then All the existing items are listed in the Basket page
    #And the total amount of merchandise value is correct




