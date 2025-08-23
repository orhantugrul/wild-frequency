import { json, type RequestHandler } from "@sveltejs/kit";

export type Animal = {
  name: string;
  emoji: string;
  decibel: {
    min: number;
    max: number;
  };
  funFact: string;
};

const animals: Animal[] = [
  {
    name: "Mouse",
    emoji: "🐭",
    decibel: { min: 20, max: 30 },
    funFact: "Mice sing complex songs to attract mates, mostly above human hearing!",
  },
  {
    name: "Cat",
    emoji: "🐱",
    decibel: { min: 31, max: 45 },
    funFact: "Cats developed meowing specifically to communicate with humans!",
  },
  {
    name: "Elephant",
    emoji: "🐘",
    decibel: { min: 46, max: 60 },
    funFact: "Elephants can communicate through ground vibrations!",
  },
  {
    name: "Bat",
    emoji: "🦇",
    decibel: { min: 61, max: 70 },
    funFact: "Bats can distinguish objects as thin as human hair using sound!",
  },
  {
    name: "Parrot",
    emoji: "🦜",
    decibel: { min: 71, max: 80 },
    funFact: "Some parrots can learn over 800 words and use them contextually!",
  },
  {
    name: "Cricket",
    emoji: "🦗",
    decibel: { min: 81, max: 85 },
    funFact: "Cricket chirp frequency changes with temperature!",
  },
  {
    name: "Dog",
    emoji: "🐕",
    decibel: { min: 86, max: 90 },
    funFact: "Dogs can recognize over 150 words and emotional tones!",
  },
  {
    name: "Wolf",
    emoji: "🐺",
    decibel: { min: 91, max: 95 },
    funFact: "Wolf howls can carry information about pack identity and location!",
  },
  {
    name: "Tiger",
    emoji: "🐅",
    decibel: { min: 96, max: 100 },
    funFact: "Tigers can produce infrasonic calls below human hearing!",
  },
  {
    name: "Lion",
    emoji: "🦁",
    decibel: { min: 101, max: 105 },
    funFact: "A lion's roar can be heard up to 5 miles away!",
  },
  {
    name: "Seal",
    emoji: "🦭",
    decibel: { min: 106, max: 108 },
    funFact: "Seals can learn to mimic human speech patterns!",
  },
  {
    name: "Dolphin",
    emoji: "🐬",
    decibel: { min: 109, max: 110 },
    funFact: "Dolphins have signature whistles that work like names!",
  },
  {
    name: "Blue Whale",
    emoji: "🐋",
    decibel: { min: 111, max: 115 },
    funFact: "Blue whale calls can travel over 1,000 miles underwater!",
  },
];

export const GET: RequestHandler = () => {
  return json(animals);
};
