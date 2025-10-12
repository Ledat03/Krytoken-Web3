"use client";

import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import NFTCard from "./NFTCard";

const fakeNFTs = [
  {
    id: 1,
    name: "Cosmic Warrior #001",
    image: "/futuristic-cosmic-warrior-nft.jpg",
    price: "2.5 ETH",
    priceUSD: "$4,250",
  },
  {
    id: 2,
    name: "Digital Dragon #042",
    image: "/digital-dragon-nft-art.jpg",
    price: "1.8 ETH",
    priceUSD: "$3,060",
  },
  {
    id: 3,
    name: "Cyber Punk #156",
    image: "/cyberpunk-character-nft.jpg",
    price: "3.2 ETH",
    priceUSD: "$5,440",
  },
  {
    id: 4,
    name: "Neon City #089",
    image: "/neon-city-landscape-nft.jpg",
    price: "2.0 ETH",
    priceUSD: "$3,400",
  },
  {
    id: 5,
    name: "Space Explorer #234",
    image: "/space-explorer-astronaut-nft.jpg",
    price: "4.5 ETH",
    priceUSD: "$7,650",
  },
  {
    id: 6,
    name: "Abstract Mind #567",
    image: "/abstract-mind-art-nft.jpg",
    price: "1.5 ETH",
    priceUSD: "$2,550",
  },
  {
    id: 7,
    name: "Quantum Beast #012",
    image: "/quantum-beast-creature-nft.jpg",
    price: "5.0 ETH",
    priceUSD: "$8,500",
  },
  {
    id: 8,
    name: "Pixel Legend #789",
    image: "/pixel-art-legend-nft.jpg",
    price: "2.8 ETH",
    priceUSD: "$4,760",
  },
];

export default function NFTManager() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">NFT Smart Contract Manager</h1>
            <p className="text-muted-foreground text-lg">Manage Your NFT Collection </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              <a href="/nft/new">Add NFT</a>
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-accent/10 bg-transparent">
              <Settings className="mr-2 h-5 w-5" />
              Cài đặt Contract
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Tổng NFT</p>
            <p className="text-2xl font-bold text-foreground">{fakeNFTs.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Tổng giá trị</p>
            <p className="text-2xl font-bold text-foreground">23.3 ETH</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Giá trung bình</p>
            <p className="text-2xl font-bold text-foreground">2.9 ETH</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Contract Status</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-lg font-semibold text-foreground">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fakeNFTs.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  );
}
