
import { Character, getCharacters } from "./localStorage";

interface Stat {
  resets: number;
  soul: number;
  mr: number;
}

interface Stats {
  hourly: Stat;
  daily: Stat;
  weekly: Stat;
  total: Stat; // Added total stats
}

export const calculateStats = (): Stats => {
  const characters = getCharacters();
  
  if (characters.length === 0) {
    return {
      hourly: { resets: 0, soul: 0, mr: 0 },
      daily: { resets: 0, soul: 0, mr: 0 },
      weekly: { resets: 0, soul: 0, mr: 0 },
      total: { resets: 0, soul: 0, mr: 0 }
    };
  }

  // Calculate total stats
  const totalStats = characters.reduce(
    (acc, character) => {
      return {
        resets: acc.resets + character.resets,
        soul: acc.soul + character.soul,
        mr: acc.mr + character.mr
      };
    },
    { resets: 0, soul: 0, mr: 0 }
  );
  
  // Sort characters by timestamp
  const sortedCharacters = [...characters].sort((a, b) => a.timestamp - b.timestamp);
  
  // Get the first and last timestamp
  const firstTimestamp = sortedCharacters[0].timestamp;
  const lastTimestamp = sortedCharacters[sortedCharacters.length - 1].timestamp;
  
  // Calculate the time difference
  const timeDiff = Math.max(lastTimestamp - firstTimestamp, 1); // At least 1ms to avoid division by zero
  
  // Time constants in milliseconds
  const HOUR = 3600000;
  const DAY = 86400000;
  const WEEK = 604800000;
  
  // Calculate average stats per time period
  const hourlyStats = {
    resets: (totalStats.resets / timeDiff) * HOUR,
    soul: (totalStats.soul / timeDiff) * HOUR,
    mr: (totalStats.mr / timeDiff) * HOUR
  };
  
  const dailyStats = {
    resets: (totalStats.resets / timeDiff) * DAY,
    soul: (totalStats.soul / timeDiff) * DAY,
    mr: (totalStats.mr / timeDiff) * DAY
  };
  
  const weeklyStats = {
    resets: (totalStats.resets / timeDiff) * WEEK,
    soul: (totalStats.soul / timeDiff) * WEEK,
    mr: (totalStats.mr / timeDiff) * WEEK
  };
  
  return {
    hourly: hourlyStats,
    daily: dailyStats,
    weekly: weeklyStats,
    total: totalStats
  };
};

export const formatNumber = (value: number): string => {
  // Improved formatting with better rounding for readability
  if (value >= 1000000) {
    return (Math.round(value / 10000) / 100).toFixed(2) + 'M';
  } else if (value >= 1000) {
    return (Math.round(value / 10) / 100).toFixed(2) + 'K';
  } else {
    return value.toFixed(0);
  }
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};
