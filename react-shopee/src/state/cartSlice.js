import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")).items || []
      : [],
    storeName: "",
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find((item) => {
        return (
          action.payload.item.id === item.id &&
          JSON.stringify(item.selectedOptions) ===
          JSON.stringify(action.payload.item.selectedOptions) &&
          item.userId === action.payload.item.userId // Thêm kiểm tra userId để liên kết với người dùng
        );
      });

      if (existingItem === undefined) {
        state.items = [...state.items, action.payload.item];
      } else {
        state.items = state.items.map((item) => {
          if (
            item.id === action.payload.item.id &&
            JSON.stringify(item.selectedOptions.attribute2) ===
            JSON.stringify(action.payload.item.selectedOptions.attribute2)
          ) {
            item.count += action.payload.item.count;
          }
          return item;
        });
      }
      state.storeName = action.payload.item.storeName;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    updateCart: (state, action) => {
      state.items = action.payload;
      localStorage.setItem("cart", JSON.stringify(state)); // Cập nhật danh sách sản phẩm trong giỏ hàng với payload được truyền vào
    },
    removeFromCart: (state, action) => {
      const { id, userId, selectedOptions } = action.payload; // Lấy id của sản phẩm cần xóa từ action.payload
      let found = false; // Biến đánh dấu liệu đã tìm thấy sản phẩm cùng ID chưa

      // Lọc bỏ sản phẩm có itemId tương ứng khỏi danh sách items trong state
      state.items = state.items.filter((item) => {
        // Kiểm tra nếu ID và userId khớp và các thuộc tính selectedOptions không giống nhau
        if (
          item.id === id &&
          item.userId === userId &&
          JSON.stringify(item.selectedOptions) ===
          JSON.stringify(selectedOptions)
        ) {
          // Nếu đã tìm thấy sản phẩm cùng ID, không bỏ qua sản phẩm này
          if (found) {
            return true; // Trả về true để giữ lại sản phẩm
          } else {
            found = true; // Đánh dấu đã tìm thấy sản phẩm cùng ID
            return false; // Trả về false để loại bỏ sản phẩm này
          }
        }
        return true; // Giữ lại các sản phẩm khác
      });

      // Lưu lại thông tin giỏ hàng vào localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeOneFromCart: (state, action) => {
      const { id, selectedOptions, userId } = action.payload; // Lấy id, selectedOptions và userId từ action.payload

      // Tìm sản phẩm cần xóa trong giỏ hàng của người dùng đã đăng nhập
      const itemToRemoveIndex = state.items.findIndex((item) => {
        return (
          item.id === id &&
          JSON.stringify(item.selectedOptions) ===
          JSON.stringify(selectedOptions) &&
          item.userId === userId
        ); // Kiểm tra userId để liên kết với người dùng
      });

      // Kiểm tra xem sản phẩm cần xóa có tồn tại trong giỏ hàng của người dùng hay không
      if (itemToRemoveIndex !== -1) {
        // Nếu sản phẩm có tồn tại, loại bỏ sản phẩm đó khỏi giỏ hàng
        const updatedItems = [...state.items];
        updatedItems.splice(itemToRemoveIndex, 1);

        state.items = updatedItems;
        // Lưu lại thông tin giỏ hàng vào localStorage
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    increaseCountProductDetail: (state, action) => {
      const { id, selectedOptions, userId, count } = action.payload; // Lấy id, selectedOptions và userId từ action.payload

      // Tìm sản phẩm cần tăng số lượng trong giỏ hàng của người dùng đã đăng nhập
      const itemToIncreaseIndex = state.items.findIndex((item) => {
        return (
          item.id === id &&
          JSON.stringify(item.selectedOptions) ===
          JSON.stringify(selectedOptions) &&
          item.userId === userId
        ); // Kiểm tra userId để liên kết với người dùng
      });

      // Kiểm tra xem sản phẩm cần tăng số lượng có tồn tại trong giỏ hàng của người dùng hay không
      if (itemToIncreaseIndex !== -1) {
        // Nếu sản phẩm có tồn tại, tăng số lượng lên 
        state.items[itemToIncreaseIndex].count = count;
        // Lưu lại thông tin giỏ hàng vào localStorage
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    increaseCountCart: (state, action) => {
      const { id, selectedOptions, userId } = action.payload; // Lấy id, selectedOptions và userId từ action.payload

      // Tìm sản phẩm cần tăng số lượng trong giỏ hàng của người dùng đã đăng nhập
      const itemToIncreaseIndex = state.items.findIndex((item) => {
        return (
          item.id === id &&
          JSON.stringify(item.selectedOptions) ===
          JSON.stringify(selectedOptions) &&
          item.userId === userId
        ); // Kiểm tra userId để liên kết với người dùng
      });

      // Kiểm tra xem sản phẩm cần tăng số lượng có tồn tại trong giỏ hàng của người dùng hay không
      if (itemToIncreaseIndex !== -1) {
        // Nếu sản phẩm có tồn tại, tăng số lượng lên 
        state.items[itemToIncreaseIndex].count++;
        // Lưu lại thông tin giỏ hàng vào localStorage
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    decreaseCount: (state, action) => {
      const { id, selectedOptions, userId } = action.payload;
      // Tìm sản phẩm cần giảm số lượng trong giỏ hàng
      const itemToDecreaseIndex = state.items.findIndex((item) => {
        return (
          item.id === id &&
          JSON.stringify(item.selectedOptions) ===
          JSON.stringify(selectedOptions) &&
          item.userId === userId
        ); // Kiểm tra userId để liên kết với người dùng
      });
      // Kiểm tra xem sản phẩm cần giảm số lượng có tồn tại trong giỏ hàng hay không
      if (itemToDecreaseIndex !== -1) {
        // Nếu số lượng sản phẩm lớn hơn 1, giảm số lượng đi 1
        if (state.items[itemToDecreaseIndex].count > 1) {
          state.items[itemToDecreaseIndex].count--;
        } else {
          // Nếu số lượng sản phẩm chỉ còn 1, xóa sản phẩm khỏi giỏ hàng
          state.items.splice(itemToDecreaseIndex, 1);
        }
        // Lưu lại thông tin giỏ hàng vào localStorage
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
  },
});

export const {
  removeOneFromCart,
  addToCart,
  removeFromCart,
  increaseCountCart,
  increaseCountProductDetail,
  decreaseCount,
  updateCart,
} = cartSlice.actions;
export default cartSlice.reducer;
