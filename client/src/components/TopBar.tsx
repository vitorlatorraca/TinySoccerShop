import { Link } from "wouter";
import { ChevronDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  return (
    <div className="bg-[#0d2818] text-white border-b border-[#1a5d2e]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-9 items-center justify-between text-xs sm:text-sm">
          {/* Currency Selector */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:opacity-80 transition-opacity focus:outline-none">
                <span>$ US Dollar</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>$ US Dollar</DropdownMenuItem>
                <DropdownMenuItem>€ Euro</DropdownMenuItem>
                <DropdownMenuItem>£ British Pound</DropdownMenuItem>
                <DropdownMenuItem>R$ Brazilian Real</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Shipping Message */}
          <div className="hidden md:block text-center">
            <span className="font-medium">FREE DOMESTIC SHIPPING ON ORDERS OVER $150</span>
          </div>
          <div className="md:hidden text-center">
            <span className="font-medium text-[10px]">FREE SHIPPING +$150</span>
          </div>
          
          {/* Right Links */}
          <div className="flex items-center gap-4">
            <Link href="/account" className="hover:opacity-80 transition-opacity">
              <span className="text-xs sm:text-sm">MY ACCOUNT</span>
            </Link>
            <Link href="/sell" className="hidden sm:block hover:opacity-80 transition-opacity">
              <span className="text-xs sm:text-sm">SELL SHIRTS</span>
            </Link>
            <Link href="/contact" className="hover:opacity-80 transition-opacity">
              <span className="text-xs sm:text-sm">CONTACT US</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

