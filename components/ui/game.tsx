"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  // useMemo,
  useRef,
} from "react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import useTaxAlert from "@/components/ui/taxxed";
type Achievement = {
  id: string;
  name: string;
  description: string;
  threshold: number;
  achieved: boolean;
  icon: React.ReactNode;
};

type SpecialItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: (state: GameState) => Partial<GameState>;
  icon: React.ReactNode;
  duration: number;
};
type GameState = {
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
};

const initialAchievements: Achievement[] = [
  {
    id: "donations10",
    name: "Novice Donor",
    description: "Reach 100 donations",
    threshold: 100,
    achieved: false,
    icon: <LucideIcons.Heart />,
  },
  {
    id: "donations100",
    name: "Generous Soul",
    description: "Reach 10000 donations",
    threshold: 10000,
    achieved: false,
    icon: <LucideIcons.Heart />,
  },
  {
    id: "donations1000",
    name: "Philanthropist",
    description: "Reach 100,000 donations",
    threshold: 100000,
    achieved: false,
    icon: <LucideIcons.Heart />,
  },
  {
    id: "donations10000",
    name: "Benefactor",
    description: "Reach 10,000,000 donations",
    threshold: 10000000,
    achieved: false,
    icon: <LucideIcons.Heart />,
  },
  {
    id: "donations100000",
    name: "Humanitarian",
    description: "Reach 1,000,000,000 donations",
    threshold: 1000000000,
    achieved: false,
    icon: <LucideIcons.Heart />,
  },
  {
    id: "autoclickers1",
    name: "Automation Beginner",
    description: "Have 1 auto-clicker",
    threshold: 1,
    achieved: false,
    icon: <LucideIcons.Clock />,
  },
  {
    id: "autoclickers5",
    name: "Booming Business",
    description: "Have 5 auto-clickers",
    threshold: 5,
    achieved: false,
    icon: <LucideIcons.Clock />,
  },
  {
    id: "autoclickers25",
    name: "Automation Expert",
    description: "Have 25 auto-clickers",
    threshold: 25,
    achieved: false,
    icon: <LucideIcons.Clock />,
  },
  {
    id: "autoclickers100",
    name: "Automation Tycoon",
    description: "Have 100 auto-clickers",
    threshold: 100,
    achieved: false,
    icon: <LucideIcons.Clock />,
  },
  {
    id: "clickpower5",
    name: "Power Donor",
    description: "Reach click power of 5",
    threshold: 5,
    achieved: false,
    icon: <LucideIcons.Zap />,
  },
  {
    id: "clickpower25",
    name: "Super Donor",
    description: "Reach click power of 25",
    threshold: 25,
    achieved: false,
    icon: <LucideIcons.Zap />,
  },
  {
    id: "clickpower100",
    name: "Mega Donor",
    description: "Reach click power of 100",
    threshold: 100,
    achieved: false,
    icon: <LucideIcons.Zap />,
  },
  {
    id: "specialitems1",
    name: "Treasure Hunter",
    description: "Acquire 1 special item",
    threshold: 1,
    achieved: false,
    icon: <LucideIcons.Gift />,
  },
  {
    id: "specialitems5",
    name: "Collector",
    description: "Acquire 5 special items",
    threshold: 5,
    achieved: false,
    icon: <LucideIcons.Gift />,
  },
];
const specialItems: SpecialItem[] = [
  {
    id: "goldenHeart",
    name: "Golden Heart",
    description: "Doubles your click power for 30 seconds",
    cost: 10000,
    effect: (state) => ({ clickPower: state.clickPower * 2 }),
    icon: <LucideIcons.Heart color="gold" />,
    duration: 30000,
  },
  {
    id: "luckyCharm",
    name: "Lucky Charm",
    description: "20% chance to get double donations for 1 minute",
    cost: 1000,
    effect: (state) => ({ luckyCharmActive: true }),
    icon: <LucideIcons.Sparkles color="green" />,
    duration: 60000,
  },
  {
    id: "timeWarp",
    name: "Time Warp",
    description: "Doubles auto-clicker power for 30 seconds",
    cost: 100000,
    effect: (state) => ({ timeWarpActive: true }),
    icon: <LucideIcons.Clock color="blue" />,
    duration: 30000,
  },
  {
    id: "donationMultiplier",
    name: "Donation Multiplier",
    description: "Triples your donations for the next 20 clicks",
    cost: 70000,
    effect: (state) => ({ donationMultiplierClicks: 20 }),
    icon: <LucideIcons.Target color="purple" />,
    duration: 30000,
  },
  {
    id: "frostBonus",
    name: "Frost Bonus",
    description: "Freezes auto-clicker cost increase for 5 seconds",
    cost: 500000,
    effect: (state) => ({ frostBonusActive: true }),
    icon: <LucideIcons.Snowflake color="cyan" />,
    duration: 5000,
  },
  {
    id: "powerSurge",
    name: "Power Surge",
    description: "Doubles the click power for 45 seconds",
    cost: 180000,
    effect: (state) => ({ clickPower: state.clickPower * 2 }),
    icon: <LucideIcons.Zap color="yellow" />,
    duration: 30000,
  },
  {
    id: "autoBoost",
    name: "Auto Boost",
    description: "Increases auto-clicker efficiency by 25% for 20 seconds",
    cost: 5000000,
    effect: (state) => ({
      autoClickerBoostActive: true, // Keep this property
      // Add other properties from GameState here, even if they are not modified
      donations: state.donations,
      clickPower: state.clickPower,
      autoClickerCount: state.autoClickerCount * 3,
      // ... and so on for all properties in GameState
    }),
    icon: <LucideIcons.Cpu color="orange" />,
    duration: 20000,
  },
];

const initialGameState: GameState = {
  donations: 0,
  clickPower: 1,
  autoClickerCount: 0,
  autoClickerCost: 10,
  upgradeCost: 50,
  autoClickerby: 0,
  clickPowerby: 1,
  achievements: initialAchievements,
  upgradeLevel: 0,
  autoClickerLevel: 0,
  specialItems: specialItems,
  luckyCharmActive: false,
  donationMultiplierClicks: 0,
  frostBonusActive: false,
  timeWarpActive: false,
  rainbowBoostActive: false,
  superNovaActive: false,
  specialItemBonus: {
    clickPower: 0,
    autoClickerPower: 0,
  },
};
// Custom hook that handles input logic and button visibility

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
const DonationClicker: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("donationClickerState7");
      return savedState ? JSON.parse(savedState) : initialGameState;
    } else {
      return initialGameState;
    }
  });
  const [showResetButton, setShowResetButton] = useState(false);

  // Modify the useRevealButtons hook
  const useRevealButtons = (keywords: string[]) => {
    const [inputValue, setInputValue] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const shouldShowButtons =
      isSubmitted &&
      keywords.some((keyword) => inputValue.toLowerCase().includes(keyword)) &&
      !inputValue.toLowerCase().includes("reset");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitted(true);
      setShowResetButton(inputValue.toLowerCase().includes("reset"));
    };

    return {
      inputValue,
      setInputValue,
      shouldShowButtons,
      handleSubmit,
    };
  };
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(
    null
  );
  const [saveIndicator, setSaveIndicator] = useState<boolean>(false);
  const [activeItems, setActiveItems] = useState<{ [key: string]: number }>({});

  const saveButtonRef = useRef<HTMLButtonElement>(null);

  const saveProgress = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("donationClickerState7", JSON.stringify(gameState));
      setSaveIndicator(true);
      setTimeout(() => setSaveIndicator(false), 1000);
    }
  }, [gameState]);
  const {
    TaxAlert,
    showTaxAlert,
    taxAmount,
    taxRate,
    requiredClicks,
    currentClicks,
    closeTaxAlert,
    preventTaxClick,
    debugTriggerTaxAlert,
    initialTimeLeft,
  } = useTaxAlert(gameState, setGameState);

  // const [showResetButton, setShowResetButton] = useState(false);
  useEffect(() => {
    const autoClickSave = () => {
      if (saveButtonRef.current) {
        saveButtonRef.current.click();
      }
    };
    const autoClickInterval = setInterval(autoClickSave, 1000);
    return () => clearInterval(autoClickInterval);
  }, []);
  useEffect(() => {
    const autoClickSave = () => {
      if (saveButtonRef.current) {
        saveButtonRef.current.click();
      }
    };
    const autoClickInterval = setInterval(autoClickSave, 1000);
    return () => clearInterval(autoClickInterval);
  }, []);

  const handleClick = useCallback(() => {
    setGameState((prev) => {
      let donationIncrease = prev.clickPower;
      let multiplier = 1;

      // Apply Lucky Charm effect
      if (prev.luckyCharmActive && Math.random() < 0.2) {
        multiplier *= 2;
      }

      // Apply Donation Multiplier effect
      if (prev.donationMultiplierClicks > 0) {
        multiplier *= 3;
      }

      // Apply Rainbow Boost effect
      if (prev.rainbowBoostActive) {
        multiplier *= 1.5;
      }

      // Apply the multiplier
      donationIncrease *= multiplier;

      // Apply random 60% tax
      // let taxApplied = false;
      // if (Math.random() < 0.1) {  // 10% chance of tax occurring
      //   donationIncrease *= 0.4;  // 60% tax
      //   taxApplied = true;
      // }

      // Update the game state
      const newState = {
        ...prev,
        donations: prev.donations + donationIncrease,
        donationMultiplierClicks: Math.max(
          0,
          prev.donationMultiplierClicks - 1
        ),
      };

      // // Show tax notification if applied
      // if (taxApplied) {
      //   toast.error("60% Tax Applied!", {
      //     description: "The government took their share.",
      //   });
      // }

      return newState;
    });
  }, []);
  const buyAutoClicker = useCallback(() => {
    setGameState((prev) => {
      if (prev.donations >= prev.autoClickerCost) {
        const newAutoClickerCost = prev.frostBonusActive
          ? prev.autoClickerCost
          : Math.ceil(prev.autoClickerCost * 2.2); // Increased by 90%

        return {
          ...prev,
          donations: prev.donations - prev.autoClickerCost,
          autoClickerCount: prev.autoClickerCount + 0.5,
          autoClickerCost: newAutoClickerCost,
          autoClickerby: prev.autoClickerLevel + 1, // Updated this line
          autoClickerLevel: prev.autoClickerLevel + 1,
        };
      }
      return prev;
    });
  }, []);
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const buyUpgrade = useCallback(() => {
    setGameState((prev) => {
      if (prev.donations >= prev.upgradeCost) {
        return {
          ...prev,
          donations: prev.donations - prev.upgradeCost,
          clickPower: prev.clickPower + 1,
          upgradeCost: Math.ceil(prev.upgradeCost * 2.3),
          upgradeLevel: prev.upgradeLevel + 1,
          clickPowerby: prev.clickPower * 1.7,
        };
      }
      return prev;
    });
  }, []);
  const buySpecialItem = useCallback((item: SpecialItem) => {
    setGameState((prev: GameState) => {
      const currentItem = prev.specialItems.find((si) => si.id === item.id);
      if (!currentItem) return prev;

      if (prev.donations >= currentItem.cost) {
        const newCost = Math.ceil(currentItem.cost * 2.05); // Increase by 105% (60% more than before)
        const newSpecialItems = prev.specialItems.map((si) =>
          si.id === item.id ? { ...si, cost: newCost } : si
        );

        const newState: GameState = {
          ...prev,
          donations: prev.donations - currentItem.cost,
          specialItems: newSpecialItems, // Update items in the game state
          specialItemBonus: {
            clickPower: prev.specialItemBonus?.clickPower || 0,
            autoClickerPower: prev.specialItemBonus?.autoClickerPower || 0,
          },
        };

        if (item.duration > 0) {
          setActiveItems((prevItems) => ({
            ...prevItems,
            [item.id]: Date.now() + item.duration,
          }));
        }

        // Apply item effects
        const effectResult = item.effect(newState);
        Object.assign(newState, effectResult);

        // Update specialItemBonus based on the item's effect
        if (item.id === "goldenHeart") {
          newState.specialItemBonus.clickPower += prev.clickPower;
        } else if (item.id === "timeWarp") {
          newState.specialItemBonus.autoClickerPower +=
            prev.autoClickerCount * 2;
        }

        toast.success(`Activated: ${item.name}`, {
          description: item.description,
          icon: item.icon,
        });

        return newState;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const autoClickerIncrease =
          prev.autoClickerCount * (prev.timeWarpActive ? 3 : 1);
        return {
          ...prev,
          donations: prev.donations + autoClickerIncrease,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = gameState.achievements.map((achievement) => {
        if (!achievement.achieved) {
          let achieved = false;
          switch (achievement.id) {
            case "donations10":
            case "donations100":
            case "donations1000":
            case "donations10000":
            case "donations100000":
              achieved = gameState.donations >= achievement.threshold;
              break;
            case "autoclickers1":
            case "autoclickers5":
            case "autoclickers25":
            case "autoclickers100":
              achieved = gameState.autoClickerCount >= achievement.threshold;
              break;
            case "clickpower5":
            case "clickpower25":
            case "clickpower100":
              achieved = gameState.clickPower >= achievement.threshold;
              break;
            case "specialitems1":
            case "specialitems5":
              achieved =
                Object.keys(activeItems).length >= achievement.threshold;
              break;
          }
          if (achieved) {
            setShowAchievement(achievement);
            // Add toast notification for achievement
            toast.success(`Achievement Unlocked: ${achievement.name}`, {
              description: achievement.description,
              icon: <LucideIcons.Medal />, // Ensure this is a valid React component or an image URL
            });
            setTimeout(() => setShowAchievement(null), 3000);
            return { ...achievement, achieved: true };
          }
        }
        return achievement;
      });

      if (
        JSON.stringify(newAchievements) !==
        JSON.stringify(gameState.achievements)
      ) {
        setGameState((prev) => ({ ...prev, achievements: newAchievements }));
      }
    };
    checkAchievements();
  }, [gameState, activeItems]);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItems((prevItems) => {
        const newItems = { ...prevItems };
        Object.entries(newItems).forEach(([id, endTime]) => {
          if (Date.now() > endTime) {
            delete newItems[id];
            setGameState((prev: GameState) => {
              const item = specialItems.find((i) => i.id === id);
              if (item) {
                const newState: GameState = { ...prev };
                switch (id) {
                  case "goldenHeart":
                    newState.specialItemBonus.clickPower = Math.max(
                      0,
                      prev.specialItemBonus.clickPower - prev.clickPower
                    );
                    break;
                  case "timeWarp":
                    newState.specialItemBonus.autoClickerPower = Math.max(
                      0,
                      prev.specialItemBonus.autoClickerPower -
                        prev.autoClickerCount * 2
                    );
                    break;
                  case "frostBonus":
                    return { ...prev, frostBonusActive: false };
                  case "rainbowBoost":
                    return { ...prev, rainbowBoostActive: false };
                }
              }
              return prev;
            });
          }
        });
        return newItems;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addaura = useCallback(() => {
    setGameState((prev) => {
      let donationIncrease = prev.clickPower;
      if (prev.luckyCharmActive && Math.random() < 0.2) {
        donationIncrease *= 10000000;
      }
      if (prev.donationMultiplierClicks > 0) {
        donationIncrease *= 10000000;
      }
      return {
        ...prev,
        donations: prev.donations * 100,
        donationMultiplierClicks: Math.max(
          0,
          prev.donationMultiplierClicks - 100
        ),
      };
    });
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const autoClickerIncrease =
          (prev.autoClickerCount +
            (prev.specialItemBonus?.autoClickerPower || 0)) *
          (prev.timeWarpActive ? 3 : 1) *
          (prev.rainbowBoostActive ? 1.5 : 1);

        return {
          ...prev,
          donations: prev.donations + autoClickerIncrease,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const minusaura = useCallback(() => {
    setGameState((prev) => {
      let donationIncrease = prev.clickPower;
      if (prev.luckyCharmActive && Math.random() < 0.2) {
        donationIncrease *= 10000000;
      }
      if (prev.donationMultiplierClicks > 0) {
        donationIncrease *= 10000000;
      }
      return {
        ...prev,
        donations: prev.donations / 100,
        donationMultiplierClicks: Math.max(
          0,
          prev.donationMultiplierClicks - 100
        ),
      };
    });
  }, []);
  const { inputValue, setInputValue, shouldShowButtons, handleSubmit } =
    useRevealButtons(["jojo", "imthedeveloper", "imthedevsgf"]);

  const resetGame = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to reset everything? This action cannot be undone."
      )
    ) {
      setGameState(initialGameState);
      setActiveItems({});
      localStorage.removeItem("donationClickerState7");

      if (saveButtonRef.current) {
        saveButtonRef.current.click();
      }

      toast.success("Game Reset", {
        description: "All progress has been reset.",
      });
    }
  }, []);

  return (
    <div className="flex select-none flex-col justify-center items-center text-center p-4 min-h-screen bg-gray-900">
      <h1 className="text-2xl md:text-4xl font-mono w-full md:w-6/12 justify-center items-center flex flex-col mb-6 md:mb-12 font-bold text-white">
        Beat the high score of
        <span className="text-yellow-400 flex items-center">
          <LucideIcons.Coins className="text-yellow-400" />
          9.5D
        </span>
        to get free lunch
      </h1>
      <div className="bg-black p-4 rounded-lg shadow-lg w-full  text-white mx-auto border-2 border-accenth">
        {/* Top Section with Coins and Donations */}
        <div className="flex justify-center text-center mb-4">
          <div className="mr-4 flex items-center space-x-2">
            <LucideIcons.Coins className="text-yellow-400" />
            <p className="text-3xl md:text-5xl font-mono font-bold">
              {formatLargeNumber(gameState.donations)}
            </p>
          </div>
        </div>

        {/* Donate Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleClick}
            className="bg-[#0e8a4c] hover:bg-[hsl(150,82%,20%)] text-white py-2 md:py-3 px-4 md:px-6 rounded-lg shadow-md w-full text-base md:text-lg font-bold"
          >
            Donate!
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={buyAutoClicker}
            disabled={gameState.donations < gameState.autoClickerCost}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-sm md:text-base"
          >
            <LucideIcons.Clock className="inline mr-2" />{" "}
            {formatLargeNumber(gameState.autoClickerCost)}
          </button>

          <button
            onClick={buyUpgrade}
            disabled={gameState.donations < gameState.upgradeCost}
            className="py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 text-sm md:text-base"
          >
            <LucideIcons.Zap className="inline mr-2" />{" "}
            {formatLargeNumber(gameState.upgradeCost)}
          </button>
        </div>

        {/* Stats */}
        <div className="text-base md:text-xl mb-4 flex justify-around">
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center">
              <LucideIcons.Clock className="inline mr-2 text-orange-500" />
              {gameState.autoClickerLevel}
            </div>
            <div>
              {formatLargeNumber(gameState.autoClickerby)} Coins/sec
              {gameState.specialItemBonus?.autoClickerPower > 0 && (
                <span className="text-green-400">
                  +
                  {formatLargeNumber(
                    gameState.specialItemBonus.autoClickerPower
                  )}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center">
              <LucideIcons.Zap className="inline mr-2 text-orange-500" />
              {gameState.upgradeLevel}
            </div>
            <div>
              {formatLargeNumber(gameState.clickPowerby)} Coins/click
              {gameState.specialItemBonus?.clickPower > 0 && (
                <span className="text-green-400 ml-1">
                  +{formatLargeNumber(gameState.specialItemBonus.clickPower)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Special Items */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 mb-4">
          {specialItems.map((item) => {
            const isActive =
              activeItems[item.id] && activeItems[item.id] > Date.now();
            const remainingTime = isActive
              ? activeItems[item.id] - Date.now()
              : 0;
            const itemCost =
              gameState.specialItems.find((si) => si.id === item.id)?.cost ||
              item.cost;

            return (
              <button
                title={item.description}
                key={item.id}
                onClick={() => buySpecialItem(item)}
                disabled={
                  gameState.donations < itemCost || isActive ? true : undefined
                }
                className={`py-2 px-2 md:px-4 rounded-lg flex flex-col items-center justify-center gap-1 text-xs md:text-sm ${
                  gameState.donations < itemCost || isActive
                    ? "opacity-100 bg-slate-900 cursor-not-allowed"
                    : "bg-gray-600 hover:bg-gray-700"
                } ${
                  isActive
                    ? "bg-neutral-600 border-2 border-yellow-400 text-white"
                    : ""
                } text-white`}
              >
                <div className="flex flex-col justify-center items-center">
                  <div className="flex flex-row gap-1 justify-center items-center">
                    <span>{item.name}</span>
                    {item.icon}
                  </div>
                  <span className="text-yellow-400">
                    {formatLargeNumber(itemCost)} coins
                  </span>
                  {isActive && item.duration > 0 && (
                    <span className="text-green-400">
                      {formatTime(remainingTime)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Achievements */}
        <h2 className="text-center text-lg font-bold mt-6 mb-4">
          Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {gameState.achievements.map((achievement) => (
            <button
              onClick={() =>
                toast(
                  `${achievement.name}: ${
                    achievement.description
                  }\nRequirement: ${formatLargeNumber(achievement.threshold)}`
                )
              }
              key={achievement.id}
              className={`bg-transparent border ${
                achievement.achieved ? "border-yellow-400" : "border-gray-400"
              } hover:border-white text-white py-2 px-4 rounded-lg text-xs flex items-center justify-center`}
            >
              <span>
                <LucideIcons.Medal
                  className={`inline mr-2 ${
                    achievement.achieved ? "text-yellow-400" : "text-yellow-600"
                  }`}
                />
              </span>
              <span className="text-md">{achievement.name}</span>
            </button>
          ))}
        </div>

        <TaxAlert
          isOpen={showTaxAlert}
          onClose={closeTaxAlert}
          taxAmount={taxAmount}
          taxRate={taxRate}
          requiredClicks={requiredClicks}
          currentClicks={currentClicks}
          onPreventClick={preventTaxClick}
          initialTimeLeft={initialTimeLeft}
        />
        <div className="text-center mt-4 flex justify-center gap-2">
          <button
            ref={saveButtonRef}
            onClick={saveProgress}
            className={`bg-gray-600 hidden text-white py-1 px-3 rounded-md text-sm ${
              saveIndicator ? "opacity-100" : "opacity-50"
            }`}
          >
            {saveIndicator ? "Progress Saved!" : "Save Progress"}
          </button>
        </div>
        <div className="text-center mt-4 flex justify-center gap-2">
          <button
            ref={saveButtonRef}
            onClick={saveProgress}
            className={`bg-gray-600 hidden text-white py-1 px-3 rounded-md text-sm ${
              saveIndicator ? "opacity-100" : "opacity-50"
            }`}
          >
            {saveIndicator ? "Progress Saved!" : "Save Progress"}
          </button>
        </div>

        <button
          onClick={debugTriggerTaxAlert}
          className="bg-gray-500 hidden text-white px-4 py-2 rounded"
        >
          Debug: Trigger Tax Alert
        </button>

        {/* Secret Code Input */}
        <div className="mt-4">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row items-center justify-center gap-2"
          >
            <input
              type="text"
              placeholder="Type reset to reset the game"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="px-4 py-2 border rounded-lg text-white bg-slate-950 w-full md:w-auto"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg w-full md:w-auto"
            >
              ✓
            </button>
          </form>
        </div>

        {/* Conditionally render buttons */}
        {shouldShowButtons && (
          <div className="mt-4 flex gap-2 justify-center">
            <button
              id="aura"
              onClick={addaura}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              *100
            </button>
            <button
              onClick={minusaura}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              /100
            </button>
          </div>
        )}

        {/* Conditionally render the Reset button */}
        {showResetButton && (
          <div className="mt-4">
            <button
              onClick={resetGame}
              className="bg-red-600 text-white py-2 px-4 rounded-lg text-sm"
            >
              Reset Everything
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationClicker;
