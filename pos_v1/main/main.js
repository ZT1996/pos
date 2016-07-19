'use strict';
let printReceipt = (inputs) => {
  let allItems = loadAllItems();
  let promotions = loadPromotions();
  let cartItems = countItems(allItems, inputs);
  let newCartItems = countPromotions(cartItems,promotions);
};

let countItems = (allItems,inputs) => {
  let cartItems = [];

  for(let input of inputs){
    let splittedInputs = input.split('-');
    let barcode = splittedInputs[0];
    let count = parseFloat(splittedInputs[1] || 1);
    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if(cartItem){
      cartItem.count++;
    }else {
      let item = allItems.find(item => item.barcode === barcode);
      cartItems.push({item:item,count:count});
    }
  }
  return cartItems;
};

let countPromotions = (cartItems,promotions) => {
 
  let newCartItems = [];
  for(let cartItem of cartItems){
    let barcode = cartItem.item.barcode;
    let promotionTags = promotions[0].barcodes.find(promotion => promotion === barcode);
    let originSubtotal = cartItem.item.price * cartItem.count;
    let save = 0;
    if(promotionTags){
       save = cartItem.count%2 * cartItem.item.price;
    }
    newCartItems.push({cartItem:cartItem,originSubtotal:originSubtotal,save:save});
  }
  return newCartItems;
};












































