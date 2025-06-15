import { cn } from "../utils/cn";
import aloha from "./aloha.svg";

export const Logo = ({ className }: { className?: string }) => {
  return <img src={aloha} alt="Aloha" className={cn("w-6 h-6", className)} />;
};
