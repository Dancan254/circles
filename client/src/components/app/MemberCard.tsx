import useUserContributed from "@/hooks/useUserContributed";
import { client } from "@/lib/client";
import { convertBalance } from "@/lib/utils";
import { avalanche, images, TOKEN_ADDRESS } from "@/mock";
import { ExternalLink, Loader2 } from "lucide-react";
import { avalancheFuji } from "thirdweb/chains";
import { useWalletBalance } from "thirdweb/react";

function MemberCard({ address }: { address: string }) {
  const { data: userContributed, isLoading: userContributedLoading } =
    useUserContributed(address);
  function getImage(): string {
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  }

  const { data, isLoading } = useWalletBalance({
    chain: avalancheFuji,
    address: address,
    client,
    tokenAddress: TOKEN_ADDRESS,
  });
  return (
    <div
      className="rounded-2xl shadow-lg bg-card overflow-hidden md:w-[350px]"
      key={address}
    >
      {/* Image section */}
      <div className="relative h-64 w-full">
        <img
          src={getImage()}
          alt={address}
          className="object-cover w-full h-full"
        />
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[var(--card)] to-transparent pointer-events-none" />
      </div>
      {/* Text section */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Member Address</h1>
            <p
              className="text-primary text-lg flex items-center gap-1"
              onClick={() => {
                window.open(
                  `https://testnet.snowtrace.io/address/${address}`,
                  "_blank"
                );
              }}
            >
              {address.slice(0, 6)}...{address.slice(-4)}
              <ExternalLink className="w-4 h-4" />
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">On: </p>
            <div className="flex items-center gap-1">
              <img
                src={avalanche.icon}
                alt={avalanche.name}
                className="w-4 h-4"
              />
              <p className="text-muted-foreground text-sm">{avalanche.name}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-muted-foreground text-md">
            <span className="text-primary">
              {userContributedLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                convertBalance(userContributed).toFixed(0)
              )}{" "}
              USDC{" "}
            </span>
            Contributed
          </p>
          <p className="text-muted-foreground text-sm">
            Balance:{" "}
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              convertBalance(data?.value).toFixed(4)
            )}{" "}
            USDC
          </p>
        </div>
      </div>
    </div>
  );
}

export default MemberCard;
