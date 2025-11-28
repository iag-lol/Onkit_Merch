import { PropsWithChildren } from "react";
import { CartProvider } from "@/context/cart";

// Centralized providers to keep app/layout clean.
export const Providers = ({ children }: PropsWithChildren) => {
  return <CartProvider>{children}</CartProvider>;
};
