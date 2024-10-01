import React, { useState, useEffect, useCallback } from "react";

// Interfaces
interface Achievement {
  id: string;
  name: string;
  description: string;
  threshold: number;
  achieved: boolean;
  icon: React.ReactNode;
}

interface SpecialItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: (state: GameState) => Partial<GameState>;
  icon: React.ReactNode;
  duration: number;
}

interface GameState {
  donations: number;
  clickPower: number;
  autoClickerCount: number;
  autoClickerCost: number;
  upgradeCost: number;
  autoClickerby: number;
  clickPowerby: number;
  achievements: Achievement[];
  upgradeLevel: number;
  autoClickerLevel: number;
  specialItems: SpecialItem[];
  luckyCharmActive: boolean;
  donationMultiplierClicks: number;
  frostBonusActive: boolean;
  timeWarpActive: boolean;
  rainbowBoostActive: boolean;
  superNovaActive: boolean;
  specialItemBonus: {
    clickPower: number;
    autoClickerPower: number;
  };
}

interface TaxAlertProps {
  isOpen: boolean;
  onClose: () => void;
  taxAmount: number;
  taxRate: number;
  requiredClicks: number;
  currentClicks: number;
  onPreventClick: () => void;
  initialTimeLeft: number;
}

// Utility function
const formatLargeNumber = (num: number): string => {
  if (num >= 1e33) return (num / 1e33).toFixed(2) + "D";
  if (num >= 1e30) return (num / 1e30).toFixed(2) + "N";
  if (num >= 1e27) return (num / 1e27).toFixed(2) + "O";
  if (num >= 1e24) return (num / 1e24).toFixed(2) + "S";
  if (num >= 1e21) return (num / 1e21).toFixed(2) + "S";
  if (num >= 1e18) return (num / 1e18).toFixed(2) + "Q";
  if (num >= 1e15) return (num / 1e15).toFixed(2) + "q";
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(0);
};

const TaxAlert: React.FC<TaxAlertProps> = ({
  isOpen,
  onClose,
  taxAmount,
  taxRate,
  requiredClicks,
  currentClicks,
  onPreventClick,
  initialTimeLeft,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [outcomeMessage, setOutcomeMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isOpen && timeLeft > 0 && isActive) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1000) {
            if (timer) clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, timeLeft, isActive]);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(initialTimeLeft);
      setOutcomeMessage("");
      setIsActive(true);
    }
  }, [isOpen, initialTimeLeft]);

  const handleTimeUp = () => {
    setIsActive(false);
    if (currentClicks >= requiredClicks) {
      setOutcomeMessage("You avoided paying taxes!");
    } else {
      setOutcomeMessage(
        `You lost in the court! Paid ${formatLargeNumber(
          taxAmount
        )} coins in taxes.`
      );
    }
  };

  const handleClick = () => {
    if (timeLeft > 0 && isActive) {
      onPreventClick();
      if (currentClicks + 1 >= requiredClicks) {
        setOutcomeMessage("You avoided paying taxes!");
        setIsActive(false);
      }
    }
  };
  const handleCloseAlert = () => {
    onClose();
    setIsButtonDisabled(true); // Disable button
    setTimeout(() => {
      setIsButtonDisabled(false); // Re-enable button after 3 seconds
    }, 10000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 select-none bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div
        className={`bg-red-600 p-8 rounded-lg text-white text-center ${
          isActive ? "cursor-pointer" : ""
        }`}
        onClick={isActive ? handleClick : undefined}
      >
        <h2 className="text-3xl font-bold mb-4">Tax Alert!</h2>
        {isActive ? (
          <>
            <p className="text-xl mb-4">
              {taxRate.toFixed(1)}% tax incoming! Click anywhere to prevent!
            </p>
            <p className="text-2xl font-bold mb-6">
              Potential loss: {formatLargeNumber(taxAmount)} coins
            </p>
            <button className="mb-4 bg-white text-red-600 p-[5%] rounded-lg font-bold text-3xl ">
              Clicks to prevent: {currentClicks} / {requiredClicks}
            </button>

            <p className="mb-4 text-lg">
              Time left: {Math.max(Math.ceil(timeLeft / 1000), 0)} seconds
            </p>
          </>
        ) : (
          <div className="my-8">
            <p className="text-2xl font-bold mb-4">{outcomeMessage}</p>
          </div>
        )}
        {!isActive && (
          <button
            onClick={handleCloseAlert}
            className={`bg-white text-red-600 px-6 py-2 rounded-lg font-bold text-xl mt-16 ${
              isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isButtonDisabled} // Disable button when the state is true
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

const useTaxAlert = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  const [showTaxAlert, setShowTaxAlert] = useState<boolean>(false);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [requiredClicks, setRequiredClicks] = useState<number>(0);
  const [currentClicks, setCurrentClicks] = useState<number>(0);
  const [initialTimeLeft, setInitialTimeLeft] = useState<number>(0);

  const getTimeLimit = (rate: number) => {
    // Adjusted base time and minimum time
    const baseTime = 11000; // Increased from 10000 to 15000 milliseconds
    const minTime = 5000; // Increased from 3000 to 5000 milliseconds

    // Adjusted calculation to make it a bit easier
    const calculatedTime = baseTime - rate * 90; // Reduced factor from 100 to 75

    // Ensure the time doesn't go below the minimum
    return Math.max(calculatedTime, minTime);
  };

  const applyTax = useCallback(() => {
    setGameState((prev) => {
      const randomFactor = Math.pow(Math.random(), 0.7);
      const newTaxRate = 40 + randomFactor * 40; // Adjusted range from 40-80 to 30-70
      const actualTaxRate = newTaxRate / 100;
      const newTaxAmount = Math.floor(prev.donations * actualTaxRate);

      setTaxAmount(newTaxAmount);
      setTaxRate(newTaxRate);

      const newRequiredClicks = Math.ceil(newTaxRate / 2.2); // Adjusted from 2 to 2.5 to reduce required clicks
      setRequiredClicks(newRequiredClicks);
      setCurrentClicks(0);

      const timeLimit = getTimeLimit(newTaxRate);
      setInitialTimeLeft(timeLimit);

      setShowTaxAlert(true);

      return prev;
    });
  }, [setGameState]);

  const preventTaxClick = useCallback(() => {
    setCurrentClicks((prev) => {
      const newClicks = prev + 1;
      if (newClicks >= requiredClicks) {
        return requiredClicks;
      }
      return newClicks;
    });
  }, [requiredClicks]);

  const closeTaxAlert = useCallback(() => {
    setShowTaxAlert(false);
    if (currentClicks < requiredClicks) {
      setGameState((prev) => ({
        ...prev,
        donations: prev.donations - taxAmount,
      }));
    }
    setCurrentClicks(0);
  }, [currentClicks, requiredClicks, taxAmount, setGameState]);

  const scheduleTax = useCallback(() => {
    const delay = Math.random() * (300000 - 30000) + 60000;
    setTimeout(() => {
      applyTax();
      scheduleTax();
    }, delay);
  }, [applyTax]);

  useEffect(() => {
    scheduleTax();
    return () => {};
  }, [scheduleTax]);

  return {
    TaxAlert,
    showTaxAlert,
    taxAmount,
    taxRate,
    requiredClicks,
    currentClicks,
    closeTaxAlert,
    preventTaxClick,
    debugTriggerTaxAlert: applyTax,
    initialTimeLeft,
  };
};

export default useTaxAlert;
