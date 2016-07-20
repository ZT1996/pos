'use strict';
let printReceipt = (inputs) => {
  let allItems = loadAllItems();
  let promotions = loadPromotions();
  let cartItems = countItems(allItems, inputs);
  let newCartItems = countPromotions(cartItems, promotions);
  let {total, saves} = calculatePrice(newCartItems);
  let receipt = cartList(newCartItems, {total, saves});
  console.log(receipt);
};

let countItems = (allItems, inputs) => {
  let cartItems = [];

  for (let input of inputs) {
    let splittedInputs = input.split('-');
    let barcode = splittedInputs[0];
    let count = parseFloat(splittedInputs[1] || 1);
    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if (cartItem) {
      cartItem.count += count;
    } else {
      let item = allItems.find(item => item.barcode === barcode);
      cartItems.push({item: item, count: count});
    }
  }
  return cartItems;
};

let countPromotions = (cartItems, promotions) => {
  return cartItems.map(cartItem => {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {subtotal, save} = discount(cartItem, promotionType);
    return {
      cartItem,
      subtotal,
      save
    }
  });
};

let getPromotionType = (barcode, promotions) => {
  let promotion = promotions.find(promotion => promotion.barcodes.includes(barcode));
  return promotion ? promotion.type : undefined;
};

let discount = (cartItem, promotionType) => {
  let freeItemCount = 0;
  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    freeItemCount = parseInt(cartItem.count / 3);
  }
  let save = cartItem.item.price * freeItemCount;
  let subtotal = cartItem.count * cartItem.item.price - save;
  return {subtotal, save};
};
let calculatePrice = (newCartItems) => {
  let total = 0;
  let saves = 0;
  for (let cart of newCartItems) {
    total += cart.subtotal;
    saves += cart.save
  }
  return {total, saves};
};

let cartList = (newCartItems, {total, saves}) => {
  let receipt;
  let carts = newCartItems.map(cart => {
    return `名称：${cart.cartItem.item.name}，\
数量：${cart.cartItem.count}${cart.cartItem.item.unit}，\
单价：${(cart.cartItem.item.price).toFixed(2)}(元)，\
小计：${(cart.subtotal).toFixed(2)}(元)`
  })
    .join('\n');

  receipt = `***<没钱赚商店>收据***
${carts}
----------------------
总计：${total.toFixed(2)}(元)
节省：${saves.toFixed(2)}(元)
**********************`;
  return receipt;
};
