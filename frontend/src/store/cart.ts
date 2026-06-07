/**
 * 全局状态管理 - 购物车状态
 */
import { create } from 'zustand'
import Taro from '@tarojs/taro'

interface CartItem {
  id: string
  productId: string
  productName: string
  productImage: string
  skuId: string
  skuName: string
  price: number
  quantity: number
  maxQuantity: number
  selected: boolean
}

interface CartState {
  items: CartItem[]
  totalCount: number
  selectedCount: number
  totalAmount: number
  setItems: (items: CartItem[]) => void
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  toggleSelect: (id: string) => void
  selectAll: (selected: boolean) => void
  clearCart: () => void
  getSelectedItems: () => CartItem[]
  getSelectedAmount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalCount: 0,
  selectedCount: 0,
  totalAmount: 0,
  
  setItems: (items) => {
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const selectedItems = items.filter(item => item.selected)
    const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    set({ items, totalCount, selectedCount, totalAmount })
  },
  
  addItem: (item) => {
    const { items } = get()
    const existingIndex = items.findIndex(i => i.skuId === item.skuId)
    if (existingIndex > -1) {
      items[existingIndex].quantity += item.quantity
    } else {
      items.push({ ...item, selected: true })
    }
    get().setItems([...items])
  },
  
  removeItem: (id) => {
    const { items } = get()
    get().setItems(items.filter(item => item.id !== id))
  },
  
  updateQuantity: (id, quantity) => {
    const { items } = get()
    const index = items.findIndex(item => item.id === id)
    if (index > -1) {
      items[index].quantity = Math.min(quantity, items[index].maxQuantity)
      get().setItems([...items])
    }
  },
  
  toggleSelect: (id) => {
    const { items } = get()
    const index = items.findIndex(item => item.id === id)
    if (index > -1) {
      items[index].selected = !items[index].selected
      get().setItems([...items])
    }
  },
  
  selectAll: (selected) => {
    const { items } = get()
    items.forEach(item => item.selected = selected)
    get().setItems([...items])
  },
  
  clearCart: () => {
    set({ items: [], totalCount: 0, selectedCount: 0, totalAmount: 0 })
  },
  
  getSelectedItems: () => {
    return get().items.filter(item => item.selected)
  },
  
  getSelectedAmount: () => {
    return get().items.filter(item => item.selected).reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
}))