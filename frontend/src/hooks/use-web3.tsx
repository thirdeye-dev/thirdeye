import { Web3Context } from "@/context/Web3";
import { useContext } from "react";

export const useWeb3Context = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3Context must be used within a Web3ContextProvider");
  }
  return context;
};
