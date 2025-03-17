
import React, { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import AccountButton from "@/components/AccountButton";
import { useAuth } from "@/context/AuthContext";

const NavbarAccountSection = () => {
  const { isLoggedIn } = useAuth();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      // Load sustainability points from localStorage
      const savedPoints = localStorage.getItem('sustainabilityPoints');
      if (savedPoints) {
        setPoints(parseInt(savedPoints, 10));
      }
    }
  }, [isLoggedIn]);

  return (
    <div className="flex items-center space-x-4">
      {isLoggedIn && points > 0 && (
        <div className="hidden md:flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
          <Trophy className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">{points} points</span>
        </div>
      )}
      <AccountButton />
    </div>
  );
};

export default NavbarAccountSection;
