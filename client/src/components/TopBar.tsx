import { Link } from "wouter";
import { DollarSign, User, MessageSquare } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-[#1a5d2e] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-10 items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">US Dollar</span>
            <span className="sm:hidden">USD</span>
          </div>
          
          <div className="hidden md:block">
            <span className="font-medium">FREE DOMESTIC SHIPPING ON ORDERS OVER $150</span>
          </div>
          <div className="md:hidden text-center">
            <span className="font-medium">FREE SHIPPING +$150</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/account" className="flex items-center gap-1 hover:underline">
              <User className="h-3 w-3" />
              <span className="hidden sm:inline">MY ACCOUNT</span>
            </Link>
            <Link href="/sell" className="hidden sm:flex items-center gap-1 hover:underline">
              <span>SELL SHIRTS</span>
            </Link>
            <Link href="/contact" className="flex items-center gap-1 hover:underline">
              <MessageSquare className="h-3 w-3" />
              <span className="hidden sm:inline">CONTACT US</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

