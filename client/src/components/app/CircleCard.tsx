import type { Circle } from "@/mock";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CircleCard({ circle }: { circle: Circle }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl shadow-lg bg-card overflow-hidden md:w-[350px]">
      {/* Image section */}
      <div className="relative h-48 w-full">
        <img
          src={circle.icon}
          alt={circle.address}
          className="object-cover w-full h-full"
        />
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[var(--card)] to-transparent pointer-events-none" />
      </div>
      {/* Text section */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Pool Address</h1>
            <p className="text-primary text-lg">
              {circle.address.slice(0, 6)}...{circle.address.slice(-4)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">On: </p>
            <div className="flex items-center gap-1">
              <img
                src={circle.onChain.icon}
                alt={circle.onChain.name}
                className="w-4 h-4"
              />
              <p className="text-muted-foreground text-sm">
                {circle.onChain.name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-muted-foreground text-md">
            <span className="text-primary">{circle.members}</span> members
          </p>
          <p className="text-muted-foreground text-sm">
            Balance: {circle.balance.toLocaleString()} USDC
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">Invested In:</p>
            <div className="flex items-center">
              {circle.investedChain.map((chain) => (
                <img
                  src={chain.icon}
                  alt={chain.name}
                  className="w-5 h-5 rounded-full"
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">APY: {circle.apy}%</p>
          </div>
        </div>
        <div className="flex items-center justify-center md:justify-end mt-4">
          <button
            className="bg-card flex items-center justify-center gap-2 border border-primary text-primary px-4 py-2 rounded-2xl w-full md:w-1/2 hover:bg-primary hover:text-white transition-all duration-300"
            onClick={() => navigate(`/circle/${circle.address}`)}
          >
            View Pool
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CircleCard;
