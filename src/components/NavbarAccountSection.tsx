
import React, { useEffect, useState } from "react";
import { Trophy, Leaf } from "lucide-react";
import AccountButton from "@/components/AccountButton";
import { useAuth } from "@/context/AuthContext";

const NavbarAccountSection = () => {
  const { isLoggedIn } = useAuth();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // Load sustainability points from localStorage
    const savedPoints = localStorage.getItem('sustainabilityPoints');
    if (savedPoints) {
      setPoints(parseInt(savedPoints, 10));
    }

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      const updatedPoints = localStorage.getItem('sustainabilityPoints');
      if (updatedPoints) {
        setPoints(parseInt(updatedPoints, 10));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check for points updates every 2 seconds
    const interval = setInterval(() => {
      const currentPoints = localStorage.getItem('sustainabilityPoints');
      if (currentPoints && parseInt(currentPoints, 10) !== points) {
        setPoints(parseInt(currentPoints, 10));
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [points]);

  return (
    <div className="flex items-center space-x-4">
      {points > 0 && (
        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
          <Leaf className="h-3.5 w-3.5 text-primary hidden sm:block" />
          <Trophy className="h-3.5 w-3.5 text-primary sm:hidden" />
          <span className="text-xs font-medium text-primary">{points} points</span>
        </div>
      )}
      <AccountButton />
    </div>
  );
};

export default NavbarAccountSection;
