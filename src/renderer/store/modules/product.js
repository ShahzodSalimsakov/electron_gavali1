const state = {
    items: [],
    categories: [],
    cartItems: [],
    cartTabs: [{
      title: 'Корзина #1'
    }],
    cartTabItems: [
        []
    ]
}

import ProductItems from "../models/items";

const getters = {
  items: (state) => state.items,
  categories: (state) => state.categories,
  cartItems: (state) => state.cartItems,
  cartTabs: (state) => state.cartTabs,
  cartTabItems: (state) => state.cartTabItems
}

const mutations = {
  CHANGE_ITEM(state, { index, key, val }) {
    state.items = state.items.map((item, i) => {
      if (i === index) {
        item[key] = val
      }
      return item
    })
  },
  SET_CATEGORIES(state, { val }) {
    state.categories = val
  },
  SET_ITEMS(state, { val }) {
    state.items = val
  },
  REFRESH_DATA(state, { val }) {
    const newData = {};
    val.map(item => {
      if (item.totalAmountCount > 0) newData[item.id] = item;
    });

    state.items.filter(item => item.totalAmountCount > 0)

    state.items = state.items.map(item => {
      const newItem = {...newData[item.id]};
      const res = { ...newItem, selected: item.selected }
      return res
    });
    state.items.map(item => {
      delete newData[item.id];
    });

    for(let id in newData) {
      state.items.push(newData[id])
    }
  },
  TOGGLE_PRODUCT(state, { item }) {
    const prod = ProductItems.find(item.id)
    ProductItems.update({
      where: item.id,
      data: {
        selected: !prod.selected
      }
    })
    // state.items = state.items.map(prod => {
    //   if(prod.id === item.id) {
    //     prod.selected = !prod.selected
    //   }
    //   return prod
    // })
  },
  TOGGLE_PRODUCT_CART(state, {item}) {
    const foundIndex = state.cartItems.findIndex(prod => {
      return item.id === prod.id
    });
    if (foundIndex < 0) {
      state.cartItems.push({
        id: item.id,
        name: item.name,
        barcode: item.barcode,
        img: item.image,
        price: item.price,
        totalPrice: 0,
        weight: 0
      })
    } else {
      state.cartItems.splice(foundIndex, 1)
    }
  },
  ADD_PRODUCT_TO_CART(state, {item}) {
    const newItem = {
      id: item.id,
      name: item.name,
      barcode: item.barcode,
      img: item.image,
      price: item.price,
      totalPrice: 0,
      weight: 0,
      type: item.type
    };
    if(item.childs) {
      newItem.childs = item.childs
    }
    state.cartItems.push(newItem)
  },
  REMOVE_PRODUCT_CART(state, { item }) {
    if(item.parentId) {
      state.cartItems = state.cartItems.map(parent => {
        if (parent.id === item.parentId) {
          parent.childs = parent.childs.filter(child => child.id !== item.id)
        }
        return parent
      })
    } else {
      state.cartItems = state.cartItems.filter(prod => item.id !== prod.id)
    }
  },
  UNSELECT_ALL_ITEMS(state) {
    state.items = state.items.map(item => {
      item.selected = false;
      return item;
    })
  },
  CLEAR_CART(state) {
    state.cartItems = []
  },
  SET_WEIGHT(state, {id, weight, parentId}) {
    if (parentId) {
      state.cartItems = state.cartItems.map(parent => {
        parent.totalPrice = 0
        parent.price = 0
        parent.weight = 1
        if (parent.id === parentId) {
          parent.childs = parent.childs.map(child => {
            if (child.id === id) {
              child.weight = +weight;
              child.totalPrice = +weight * +child.price
            }
            parent.totalPrice += child.totalPrice || 0
            parent.price += child.totalPrice || 0
            return child
          });
        } else if (parent.childs) {
          parent.childs = parent.childs.map(child => {
            parent.totalPrice += child.totalPrice || 0
            parent.price += child.totalPrice || 0
            return child
          });
        }
        return parent
      })
    } else {
      state.cartItems = state.cartItems.map(item => {
        if(item.id === id) {
          item.weight = +weight;
          item.totalPrice = +weight * +item.price
        }
        return item;
      });
    }
  },
  APPEND_SET_WITH_ITEMS(state, {setId, items}) {
    state.cartItems = state.cartItems.map(item => {

      if (item.type === 'set' && item.id === setId) {
        items.map(child => {

          const foundIndex = item.childs.findIndex((prod) => {
            return child.id === prod.id;
          });
          if (child.totalAmountCount > 0) {
            if (foundIndex < 0) {
              item.childs.push({...child, parentId: setId})
            }
          }
        })
      }

      return item;
    })
  },
  APPEND_CART_TAB(state) {
    state.cartTabs.push({
      title: 'Корзина #' + (+state.cartTabs.length + 1)
    });
    state.cartTabItems.push([]);
  },
  CLOSE_TAB_BY_INDEX(state, { index }) {
    state.cartTabs.splice(index, 1);
    state.cartTabItems.splice(index, 1);
  },
  SET_TAB_ITEMS_BY_INDEX(state, { index, items }) {
    state.cartTabItems = state.cartTabItems.map((tab, i) => {
      if(i === index) {
        return items;
      }
      return tab
    });
  },
  PUSH_TAB_ITEM_BY_INDEX(state, { index, item }) {
    state.cartTabItems = state.cartTabItems.map((tab, i) => {
      if(i === index) {
        tab.push(item);
      }
      return tab;
    })
  }
}

const actions = {
  changeItem({ commit }, { index, key, val }) {
    commit('CHANGE_ITEM', { index, key, val })
  },
  setCategories({ commit }, { val }) {
    commit('SET_CATEGORIES', { val })
  },
  setCartItems({ commit }, { val }) {
    commit('SET_ITEMS', { val })
  },
  refreshData({ commit }, { val }) {
    commit('REFRESH_DATA', { val })
  },
  toggleProduct({ commit }, { item }) {
    commit('TOGGLE_PRODUCT', { item })
  },
  toggleProductCart({commit}, {item}) {
    commit('TOGGLE_PRODUCT_CART', {item})
  },
  addProductToCart({commit}, {item}) {
    commit('ADD_PRODUCT_TO_CART', {item})
  },
  removeProductCart({commit}, {item}) {
    commit('REMOVE_PRODUCT_CART', {item})
  },
  unselectAllItems({commit}) {
    commit('UNSELECT_ALL_ITEMS');
  },
  setWeight({commit}, {id, weight, parentId}) {
    commit('SET_WEIGHT', {id, weight, parentId})
  },
  clearCart({commit}) {
    commit('CLEAR_CART')
  },
  appendSetWithItems({commit}, {setId, items}) {
    commit('APPEND_SET_WITH_ITEMS', {setId, items})
  },
  appendCartTab({commit}) {
    commit('APPEND_CART_TAB');
  },
  closeTabByIndex({commit}, {index}) {
    commit('CLOSE_TAB_BY_INDEX', {index});
  },
  setTabItemsByIndex({commit}, {index, items}) {
    commit('SET_TAB_ITEMS_BY_INDEX', {index, items});
  },
  pushTabItemByIndex({commit}, {index, item}) {
    commit('PUSH_TAB_ITEM_BY_INDEX', {index, item});
  }
}


export default {
  state,
  mutations,
  actions,
  getters,
  strict: false
}
