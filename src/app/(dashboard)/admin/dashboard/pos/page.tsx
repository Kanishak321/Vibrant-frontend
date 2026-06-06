"use client";

import { useState } from "react";
import Image from "next/image";
import { usePosStore, PosItem } from "@/store/pos-store";
import { Minus, Plus, Trash2, Search, Utensils, CheckCircle2, Printer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Starters", "Main Course", "Breads", "Desserts", "Beverages"];
const DUMMY_ITEMS: PosItem[] = [
  { id: "1", name: "Paneer Tikka", price: 280, category: "Starters", image: "/images/menu/paneer.png" },
  { id: "2", name: "Chicken Kabab", price: 320, category: "Starters", image: "/images/menu/chicken_kabab.png" },
  { id: "3", name: "Butter Chicken", price: 450, category: "Main Course", image: "/images/menu/butter_chicken.png" },
  { id: "4", name: "Dal Makhani", price: 250, category: "Main Course", image: "/images/menu/dal_makhani.png" },
  { id: "5", name: "Garlic Naan", price: 60, category: "Breads", image: "/images/menu/garlic_naan.png" },
  { id: "6", name: "Tandoori Roti", price: 40, category: "Breads", image: "/images/menu/tandoori_roti.png" },
  { id: "7", name: "Gulab Jamun", price: 120, category: "Desserts", image: "/images/menu/gulab_jamun.png" },
  { id: "8", name: "Mojito", price: 180, category: "Beverages", image: "/images/menu/mojito.png" },
  { id: "9", name: "Cold Coffee", price: 150, category: "Beverages", image: "/images/menu/cold_coffee.png" },
];

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [showKOTSuccess, setShowKOTSuccess] = useState(false);
  
  const { cart, addToCart, removeFromCart, updateQuantity, getCartTotal, clearCart } = usePosStore();

  const filteredItems = DUMMY_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = getCartTotal();
  const tax = cartTotal * 0.05;
  const grandTotal = cartTotal + tax;

  const handleCheckout = () => {
    setShowCheckoutSuccess(true);
    setTimeout(() => {
      clearCart();
      setShowCheckoutSuccess(false);
    }, 2500);
  };

  const handlePrintKOT = () => {
    setShowKOTSuccess(true);
    setTimeout(() => {
      setShowKOTSuccess(false);
    }, 2000);
  };

  return (
    <>
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        {/* Menu Area */}
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex flex-col space-y-4 rounded-xl border border-border bg-card p-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search menu items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-background px-9 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
              {filteredItems.map((item) => (
                <div key={item.id} onClick={() => addToCart(item)}
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200">
                  <div className="aspect-video w-full bg-muted/30 flex items-center justify-center relative">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <Utensils className="h-8 w-8 text-muted-foreground/30 group-hover:text-primary/30 transition-colors" />
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2">{item.name}</h3>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="font-bold text-primary">₹{item.price}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1 bg-muted rounded-md">{item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="w-[400px] flex flex-col rounded-xl border border-border bg-card overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <h2 className="font-semibold text-lg text-foreground">Current Order</h2>
            <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
              {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                <ShoppingBagIcon className="h-12 w-12 opacity-20" />
                <p className="text-sm font-medium">Cart is empty</p>
                <p className="text-xs text-center">Add items from the menu to start a new order.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="flex flex-col space-y-2 pb-4 border-b border-border/50 last:border-0">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm text-foreground">{item.name}</span>
                    <span className="font-semibold text-sm text-foreground">₹{item.price * item.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">₹{item.price} x {item.quantity}</span>
                    <div className="flex items-center space-x-2 bg-muted/50 rounded-lg p-1">
                      <button onClick={() => item.quantity > 1 ? updateQuantity(item.cartItemId, item.quantity - 1) : removeFromCart(item.cartItemId)}
                        className="p-1 hover:bg-background rounded-md text-muted-foreground hover:text-foreground transition-colors"><Minus className="h-3 w-3" /></button>
                      <span className="text-sm font-medium w-6 text-center text-foreground">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1 hover:bg-background rounded-md text-muted-foreground hover:text-foreground transition-colors"><Plus className="h-3 w-3" /></button>
                      <button onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1 text-red-500 hover:bg-red-500/10 rounded-md transition-colors ml-2"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-border bg-muted/10 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-muted-foreground"><span>Tax (5% GST)</span><span>₹{tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border mt-2 text-foreground"><span>Total</span><span className="text-primary">₹{grandTotal.toFixed(2)}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={clearCart} disabled={cart.length === 0}
                className="w-full py-2.5 px-4 rounded-lg font-medium text-sm border border-border bg-background text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Cancel</button>
              <button onClick={handlePrintKOT} disabled={cart.length === 0}
                className="w-full py-2.5 px-4 rounded-lg font-bold text-sm bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Print KOT</button>
            </div>
            <button onClick={handleCheckout} disabled={cart.length === 0}
              className="w-full py-3 px-4 rounded-lg font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md">Checkout Order</button>
          </div>
        </div>
      </div>

      {/* Success Modals */}
      <AnimatePresence>
        {showCheckoutSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card border border-border shadow-2xl rounded-2xl p-8 flex flex-col items-center text-center max-w-sm w-full"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h2>
              <p className="text-muted-foreground text-sm">Amount Paid: <span className="font-semibold text-foreground">₹{grandTotal.toFixed(2)}</span></p>
              <p className="text-xs text-muted-foreground mt-1">Starting new session...</p>
            </motion.div>
          </div>
        )}

        {showKOTSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="bg-card border border-border shadow-2xl rounded-xl p-4 flex items-center gap-4 min-w-[300px]"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">KOT Sent to Kitchen</h3>
                <p className="text-xs text-muted-foreground">Printing receipt from local printer...</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>);
}