"use client";
import React from "react";
import classes from "@/styles/shopping-cart/ShoppingCart.module.css";
import ShoppingList from "@/components/shopping-cart/ShoppingList";
import { useBuyAllNew } from "@/hooks/useBuyAllNew";
import RenewList from "@/components/shopping-cart/RenewList";
import { useRenewDeals } from "@/hooks/useRenewDeals";
const ShoppingCartPage: React.FC = () => {
  const { handleBuy, length, isLoading } = useBuyAllNew();
  useRenewDeals();

  return (
    <div className={classes["shopping-cart"]}>
      <div className={classes.top}>
        <h1>Shopping Cart</h1>
      </div>
      {/* <p className={classes["total-items"]}>
        Total Items: <span>{length}</span>
      </p> */}
      <div className={classes["all-deals-list"]}>
        <RenewList />
        <ShoppingList />
      </div>

      {length > 0 &&
        (isLoading ? (
          <div className={classes["spin-wrapper"]}>
            <div className="spin"></div>
          </div>
        ) : (
          <button
            className={classes["buy-all-btn"]}
            onClick={handleBuy}
            disabled={isLoading}
          >
            {length > 1 ? "Make Deals" : "Make Deal"}
          </button>
        ))}
    </div>
  );
};

export default ShoppingCartPage;
