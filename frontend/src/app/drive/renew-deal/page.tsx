"use client";
import React from "react";
import classes from "@/styles/shopping-cart/ShoppingCart.module.css";
import RenewList from "@/components/shopping-cart/RenewList";
import { useBuyAllNew } from "@/hooks/useBuyAllNew";
const RenewDealPage: React.FC = () => {
  const { handleRenewDeal, renewLength, isLoading } = useBuyAllNew();

  return (
    <div className={classes["shopping-cart"]}>
      <div className={classes.top}>
        <h1>Renew Deals</h1>
      </div>
      <p className={classes["total-items"]}>
        Total Items: <span>{renewLength}</span>
      </p>
      <RenewList />
      {renewLength > 0 &&
        (isLoading ? (
          <div className={classes["spin-wrapper"]}>
            <div className="spin"></div>
          </div>
        ) : (
          <button
            className={classes["buy-all-btn"]}
            onClick={handleRenewDeal}
            disabled={isLoading}
          >
            Buy All
          </button>
        ))}
    </div>
  );
};

export default RenewDealPage;
