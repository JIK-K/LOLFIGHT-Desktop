import React, { useEffect, useState } from "react";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  request,
} from "../../utils/ipcBridge";
import { useLcuData } from "../../components/LcuContext";
import { Button, Textbox, SummonerIcon, Select, Blur } from "../../components";
import { toast } from "react-hot-toast";
import "./Status.scss";

const ENDPOINT = "/lol-chat/v1/me";

type Availability = "chat" | "away" | "dnd" | "mobile" | "offline";

const ITEMS: { name: string; value: Availability }[] = [
  { name: "Online", value: "chat" },
  { name: "Away", value: "away" },
  { name: "Playing", value: "dnd" },
  { name: "Mobile", value: "mobile" },
  { name: "Offline", value: "offline" },
];

type Queue =
  | "RANKED_SOLO_5x5"
  | "RANKED_FLEX_SR"
  | "RANKED_FLEX_TT"
  | "RANKED_TFT"
  | "RANKED_TFT_TURBO"
  | "RANKED_TFT_PAIRS"
  | "RANKED_TFT_DOUBLE_UP";

const QUEUES: { name: string; value: Queue }[] = [
  { name: "Solo/Duo", value: "RANKED_SOLO_5x5" },
  { name: "Flex 5v5", value: "RANKED_FLEX_SR" },
  { name: "Flex 3v3", value: "RANKED_FLEX_TT" },
  { name: "TFT", value: "RANKED_TFT" },
  { name: "TFT Hyper Roll", value: "RANKED_TFT_TURBO" },
  { name: "TFT Pairs", value: "RANKED_TFT_PAIRS" },
  { name: "TFT Double Up", value: "RANKED_TFT_DOUBLE_UP" },
];

type Tier =
  | "UNRANKED"
  | "IRON"
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "EMERALD"
  | "DIAMOND"
  | "MASTER"
  | "GRANDMASTER"
  | "CHALLENGER";

const TIERS: { name: string; value: Tier }[] = [
  { name: "Unranked", value: "UNRANKED" },
  { name: "Iron", value: "IRON" },
  { name: "Bronze", value: "BRONZE" },
  { name: "Silver", value: "SILVER" },
  { name: "Gold", value: "GOLD" },
  { name: "Platinum", value: "PLATINUM" },
  { name: "Emerald", value: "EMERALD" },
  { name: "Diamond", value: "DIAMOND" },
  { name: "Master", value: "MASTER" },
  { name: "Grandmaster", value: "GRANDMASTER" },
  { name: "Challenger", value: "CHALLENGER" },
];

type Division = "NA" | "I" | "II" | "III" | "IV";

const DIVISIONS: { name: string; value: Division }[] = [
  { name: "None", value: "NA" },
  { name: "I", value: "I" },
  { name: "II", value: "II" },
  { name: "III", value: "III" },
  { name: "IV", value: "IV" },
];

const Status: React.FC = () => {
  const lcuData = useLcuData();
  const [availability, setAvailabilty] = useState<Availability>(
    lcuData.me.availability
  );
  const statusBox = React.createRef<HTMLInputElement>();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedFavorite, setSelectedFavorite] = useState<string>(null);

  useEffect(() => {
    getFavorites().then((res) => {
      setFavorites(res.statuses);
      console.log(
        "Found %d favorite statuses:",
        res.statuses.length,
        res.statuses
      );
    });
  }, []);

  function saveCurrent() {
    const value = lcuData.me.statusMessage;

    if (value === "") {
      return;
    }

    if (favorites.includes(value)) {
      toast.error("Status already exists");
      return;
    }

    addFavorite("status", value);
    setFavorites((prev) => prev.concat(value));
    toast.success("Saved as favorite");
    console.log("Added favorite status", value);
    setSelectedFavorite(value);
  }

  function deleteCurrent() {
    if (selectedFavorite === null) {
      toast.error("No favorite selected");
      return;
    }

    removeFavorite("status", selectedFavorite);
    setFavorites((prev) => prev.filter((x) => x !== selectedFavorite));
    toast.success("Deleted favorite");
    console.log("Deleted favorite status", selectedFavorite);
    setSelectedFavorite(null);
  }

  function insertCurrent() {
    if (selectedFavorite === null) {
      toast.error("No favorite selected");
      return;
    }

    statusBox.current.value = selectedFavorite;
  }

  const apply = () => {
    const updateStatus = async () => {
      const status = statusBox.current.value;

      if (status === "" || status === lcuData.me.statusMessage) return;

      statusBox.current.value = "";
      return request("PUT", ENDPOINT, { statusMessage: status });
    };

    const updateAvailability = async () => {
      if (availability === lcuData.me.availability) return;

      return request("PUT", ENDPOINT, { availability: availability });
    };

    updateStatus().then((data) => {
      if (!data) return;

      toast.success("Updated status");
      console.log("Set status to", data.statusMessage);
    });

    updateAvailability().then((data) => {
      if (!data) return;

      toast.success("Updated availability");
      console.log("Set availability to", data.availability);
    });
  };

  const clear = () => {
    request("PUT", ENDPOINT, { statusMessage: "" }).then(() => {
      toast.success("Cleared status");
      console.log("Cleared status");
    });
  };

  const [queue, setQueue] = useState<Queue>(lcuData.me.lol.rankedLeagueQueue);
  const [rankedTier, setRankedTier] = useState<Tier>(
    lcuData.me.lol.rankedLeagueTier
  );
  const [divisison, setDivision] = useState<Division>(
    lcuData.me.lol.rankedLeagueDivision
  );

  const [challengesTier, setChallengesTier] = useState<Tier>(
    lcuData.me.lol.challengeCrystalLevel
  );
  const points = React.createRef<HTMLInputElement>();

  const updateRank = (queue: Queue, tier: Tier, division: Division) => {
    request("PUT", ENDPOINT, {
      lol: {
        rankedLeagueQueue: queue,
        rankedLeagueTier: tier,
        rankedLeagueDivision: division,
      },
    }).then(() => {
      toast.success("Updated chat rank");
      console.log("Set chat rank to", {
        queue: queue,
        tier: tier,
        division: division,
      });
    });
  };

  const updateChallengesRank = (tier: Tier, points: string) => {
    request("PUT", ENDPOINT, {
      lol: {
        challengeCrystalLevel: tier,
        challengePoints: points,
      },
    }).then(() => {
      toast.success("Updated challenges rank");
      console.log("Set challenges rank to", { tier: tier, points: points });
    });
  };
  return (
    <div className="max-w-3xl mx-auto grid gap-8 px-4 md:px-6 py-8 md:py-12">
      <div className="grid gap-2">
        <div className="flex flex-col items-center rounded-lg border text-card-foreground shadow-sm bg-gray-800 border-gray-700">
          <div className="flex w-full bg-gray-900 rounded-t-lg space-y-1.5 p-6 border-b border-gray-700 px-6 py-4">
            상태 변경
          </div>
          <div className="flex items-center gap-2 p-4">
            <SummonerIcon
              iconId={lcuData.me.icon}
              availability={lcuData.me.availability}
              size={50}
            />
            <Textbox
              ref={statusBox}
              placeholder={
                lcuData.me.statusMessage === ""
                  ? "Empty status"
                  : lcuData.me.statusMessage
              }
            />
            <Select
              items={ITEMS}
              initialItem={ITEMS.find(({ value }) => value === availability)}
              onValueChange={(value: Availability) => setAvailabilty(value)}
            />
            <Button title="적용" onClick={apply} />
            <Button title="초기화" onClick={clear} />
          </div>
        </div>

        <div className="flex flex-col items-center rounded-lg border text-card-foreground shadow-sm bg-gray-800 border-gray-700">
          <div className="flex w-full bg-gray-900 rounded-t-lg space-y-1.5 p-6 border-b border-gray-700 px-6 py-4">
            랭크 티어 변경
          </div>
          <div className="relative w-full justify-center flex items-center gap-2 p-4">
            <Select
              items={QUEUES}
              initialItem={QUEUES.find(({ value }) => value === queue)}
              onValueChange={(value: Queue) => setQueue(value)}
            />
            <Select
              items={TIERS}
              initialItem={TIERS.find(({ value }) => value === rankedTier)}
              onValueChange={(value: Tier) => setRankedTier(value)}
            />
            <Select
              items={DIVISIONS}
              initialItem={DIVISIONS.find(({ value }) => divisison === value)}
              onValueChange={(value: Division) => setDivision(value)}
            />
            <Button
              title="적용"
              onClick={() => {
                updateRank(queue, rankedTier, divisison);
              }}
            />
            <Blur />
          </div>
        </div>
        <div className="flex flex-col items-center rounded-lg border text-card-foreground shadow-sm bg-gray-800 border-gray-700">
          <div className="flex w-full bg-gray-900 rounded-t-lg space-y-1.5 p-6 border-b border-gray-700 px-6 py-4">
            챌린지 변경
          </div>
          <div className="relative w-full justify-center flex items-center gap-2 p-4">
            <Select
              items={TIERS}
              initialItem={TIERS.find(({ value }) => value === challengesTier)}
              onValueChange={(value: Tier) => setChallengesTier(value)}
            />
            <Textbox
              defaultValue={lcuData.me.lol.challengePoints.toString()}
              ref={points}
            />
            <Button
              title="적용"
              onClick={() =>
                updateChallengesRank(challengesTier, points.current.value)
              }
            />
            <Blur />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
