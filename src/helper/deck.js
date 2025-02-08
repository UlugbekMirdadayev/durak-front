import ACImage from "../assets/cards/AC.svg";
import C2Image from "../assets/cards/2C.svg";
import C3Image from "../assets/cards/3C.svg";
import C4Image from "../assets/cards/4C.svg";
import C5Image from "../assets/cards/5C.svg";
import C6Image from "../assets/cards/6C.svg";
import C7Image from "../assets/cards/7C.svg";
import C8Image from "../assets/cards/8C.svg";
import C9Image from "../assets/cards/9C.svg";
import C10Image from "../assets/cards/10C.svg";
import CJImage from "../assets/cards/JC.svg";
import CQImage from "../assets/cards/QC.svg";
import CKImage from "../assets/cards/KC.svg";
import AHimage from "../assets/cards/AH.svg";
import H2Image from "../assets/cards/2H.svg";
import H3Image from "../assets/cards/3H.svg";
import H4Image from "../assets/cards/4H.svg";
import H5Image from "../assets/cards/5H.svg";
import H6Image from "../assets/cards/6H.svg";
import H7Image from "../assets/cards/7H.svg";
import H8Image from "../assets/cards/8H.svg";
import H9Image from "../assets/cards/9H.svg";
import H10Image from "../assets/cards/10H.svg";
import HJImage from "../assets/cards/JH.svg";
import HQImage from "../assets/cards/QH.svg";
import HKImage from "../assets/cards/KH.svg";
import ADImage from "../assets/cards/AD.svg";
import D2Image from "../assets/cards/2D.svg";
import D3Image from "../assets/cards/3D.svg";
import D4Image from "../assets/cards/4D.svg";
import D5Image from "../assets/cards/5D.svg";
import D6Image from "../assets/cards/6D.svg";
import D7Image from "../assets/cards/7D.svg";
import D8Image from "../assets/cards/8D.svg";
import D9Image from "../assets/cards/9D.svg";
import D10Image from "../assets/cards/10D.svg";
import DJImage from "../assets/cards/JD.svg";
import DQImage from "../assets/cards/QD.svg";
import DKImage from "../assets/cards/KD.svg";
import ASImage from "../assets/cards/AS.svg";
import S2Image from "../assets/cards/2S.svg";
import S3Image from "../assets/cards/3S.svg";
import S4Image from "../assets/cards/4S.svg";
import S5Image from "../assets/cards/5S.svg";
import S6Image from "../assets/cards/6S.svg";
import S7Image from "../assets/cards/7S.svg";
import S8Image from "../assets/cards/8S.svg";
import S9Image from "../assets/cards/9S.svg";
import S10Image from "../assets/cards/10S.svg";
import SJImage from "../assets/cards/JS.svg";
import SQImage from "../assets/cards/QS.svg";
import SKImage from "../assets/cards/KS.svg";
import BackImage from "../assets/cards/back.svg";

// clubs, hearts, diamonds, spades
const deck = [
  {
    suit: "clubs", // clubs
    rank: "A",
    image: ACImage,
  },

  {
    suit: "clubs", // clubs
    rank: "2",
    image: C2Image,
  },
  {
    suit: "clubs",
    rank: "3",
    image: C3Image,
  },
  {
    suit: "clubs",
    rank: "4",
    image: C4Image,
  },
  {
    suit: "clubs",
    rank: "5",
    image: C5Image,
  },
  {
    suit: "clubs",
    rank: "6",
    image: C6Image,
  },
  {
    suit: "clubs",
    rank: "7",
    image: C7Image,
  },
  {
    suit: "clubs",
    rank: "8",
    image: C8Image,
  },
  {
    suit: "clubs",
    rank: "9",
    image: C9Image,
  },
  {
    suit: "clubs",
    rank: "10",
    image: C10Image,
  },
  {
    suit: "clubs",
    rank: "J",
    image: CJImage,
  },
  {
    suit: "clubs",
    rank: "Q",
    image: CQImage,
  },
  {
    suit: "clubs",
    rank: "K",
    image: CKImage,
  },
  // clubs cards end
  // hearts cards start
  {
    suit: "hearts",
    rank: "A",
    image: AHimage,
  },
  {
    suit: "hearts",
    rank: "2",
    image: H2Image,
  },
  {
    suit: "hearts",
    rank: "3",
    image: H3Image,
  },
  {
    suit: "hearts",
    rank: "4",
    image: H4Image,
  },
  {
    suit: "hearts",
    rank: "5",
    image: H5Image,
  },
  {
    suit: "hearts",
    rank: "6",
    image: H6Image,
  },
  {
    suit: "hearts",
    rank: "7",
    image: H7Image,
  },
  {
    suit: "hearts",
    rank: "8",
    image: H8Image,
  },
  {
    suit: "hearts",
    rank: "9",
    image: H9Image,
  },
  {
    suit: "hearts",
    rank: "10",
    image: H10Image,
  },
  {
    suit: "hearts",
    rank: "J",
    image: HJImage,
  },
  {
    suit: "hearts",
    rank: "Q",
    image: HQImage,
  },
  {
    suit: "hearts",
    rank: "K",
    image: HKImage,
  },
  // hearts cards end
  // diamonds cards start
  {
    suit: "diamonds",
    rank: "A",
    image: ADImage,
  },
  {
    suit: "diamonds",
    rank: "2",
    image: D2Image,
  },
  {
    suit: "diamonds",
    rank: "3",
    image: D3Image,
  },
  {
    suit: "diamonds",
    rank: "4",
    image: D4Image,
  },
  {
    suit: "diamonds",
    rank: "5",
    image: D5Image,
  },
  {
    suit: "diamonds",
    rank: "6",
    image: D6Image,
  },
  {
    suit: "diamonds",
    rank: "7",
    image: D7Image,
  },
  {
    suit: "diamonds",
    rank: "8",
    image: D8Image,
  },
  {
    suit: "diamonds",
    rank: "9",
    image: D9Image,
  },
  {
    suit: "diamonds",
    rank: "10",
    image: D10Image,
  },
  {
    suit: "diamonds",
    rank: "J",
    image: DJImage,
  },
  {
    suit: "diamonds",
    rank: "Q",
    image: DQImage,
  },
  {
    suit: "diamonds",
    rank: "K",
    image: DKImage,
  },
  // diamonds cards end
  // clubs cards start
  {
    suit: "spades",
    rank: "A",
    image: ASImage,
  },
  {
    suit: "spades",
    rank: "2",
    image: S2Image,
  },
  {
    suit: "spades",
    rank: "3",
    image: S3Image,
  },
  {
    suit: "spades",
    rank: "4",
    image: S4Image,
  },
  {
    suit: "spades",
    rank: "5",
    image: S5Image,
  },
  {
    suit: "spades",
    rank: "6",
    image: S6Image,
  },
  {
    suit: "spades",
    rank: "7",
    image: S7Image,
  },
  {
    suit: "spades",
    rank: "8",
    image: S8Image,
  },
  {
    suit: "spades",
    rank: "9",
    image: S9Image,
  },
  {
    suit: "spades",
    rank: "10",
    image: S10Image,
  },
  {
    suit: "spades",
    rank: "J",
    image: SJImage,
  },
  {
    suit: "spades",
    rank: "Q",
    image: SQImage,
  },
  {
    suit: "spades",
    rank: "K",
    image: SKImage,
  },
  // spades cards end
];

export { deck, BackImage };
