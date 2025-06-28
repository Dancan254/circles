// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    error TokenNotYetDeployedOn(uint256 chainId);

    NetworkConfig public activeNetworkConfig;

    struct NetworkConfig {
        uint64 chainSelector;
        address router;
        address rmnProxy;
        address tokenAdminRegistry;
        address registryModuleOwnerCustom;
        address link;
        uint256 confirmations;
        string nativeCurrencySymbol;
    }

    struct NetworkConfigDeployed {
        address tokenAddress;
        address tokenAdminAddress;
        address deployedTokenPoolAddress;
    }

    address public ERC4626VaultSepolia = 0xB96C5d0a79B7901A49DB43782CdD8E35720971Be;
    address public ERC4626VaultFuji = 0xFfabAdA8EDfdF406a95Beb95ef456ED9287b272D;
    address public FUJIDispatcher = 0xa3e73B9E6261A950616881a8A084842efB9bdC49;
    address public SEPOLIAExecutor = 0x35b8C50ae752414C0e1Ff49Ed774763124E4BfF2;
    address public VRFCoordinatorFuji = 0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE;
    address public FujiCircleAddress = 0x57a867C0410c98C1BF637D933B46367E489088DF;

    constructor() {
        if (block.chainid == 11155111) {
            activeNetworkConfig = getEthereumSepoliaConfig();
        } else if (block.chainid == 421614) {
            activeNetworkConfig = getArbitrumSepolia();
        } else if (block.chainid == 43113) {
            activeNetworkConfig = getAvalancheFujiConfig();
        } else if (block.chainid == 84532) {
            activeNetworkConfig = getBaseSepoliaConfig();
        }
    }

    function getTokenAddress() public view returns (address) {
        if (block.chainid == 11155111) {
            return 0x60A15CA6b63508562d0Cdc9Cf896A9e3bBF79463;
        } else if (block.chainid == 43113) {
            return 0x60A15CA6b63508562d0Cdc9Cf896A9e3bBF79463;
        } else {
            revert TokenNotYetDeployedOn(block.chainid);
        }
    }

    function getConfigsForNetwork(uint256 chainId) public pure returns (NetworkConfigDeployed memory) {
        if (chainId == 11155111) {
            return NetworkConfigDeployed({
                tokenAddress: 0x60A15CA6b63508562d0Cdc9Cf896A9e3bBF79463,
                tokenAdminAddress: getTokenAdminAddress(),
                deployedTokenPoolAddress: 0x7c84f757F4DB3a80be60B269e6B993740F24E5e9
            });
        } else if (chainId == 43113) {
            return NetworkConfigDeployed({
                tokenAddress: 0x60A15CA6b63508562d0Cdc9Cf896A9e3bBF79463,
                tokenAdminAddress: getTokenAdminAddress(),
                deployedTokenPoolAddress: 0x2D9bf08C367fe7CF2d5d76E43fCFE46cE7660691
            });
        } else {
            revert TokenNotYetDeployedOn(chainId);
        }
    }

    function getTokenAdminAddress() public pure returns (address) {
        return 0x0bd7dd9A885d9526Ff82813829ef5c7D8AfdB8c4;
    }

    function getNetworkConfigByChainId(uint256 chainId) public pure returns (NetworkConfig memory) {
        if (chainId == 11155111) {
            return getEthereumSepoliaConfig();
        } else if (chainId == 43113) {
            return getAvalancheFujiConfig();
        } else if (chainId == 421614) {
            return getArbitrumSepolia();
        } else if (chainId == 84532) {
            return getBaseSepoliaConfig();
        } else {
            revert("Unsupported chain ID");
        }
    }

    // function

    function getEthereumSepoliaConfig() public pure returns (NetworkConfig memory) {
        NetworkConfig memory ethereumSepoliaConfig = NetworkConfig({
            chainSelector: 16015286601757825753,
            router: 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59,
            rmnProxy: 0xba3f6251de62dED61Ff98590cB2fDf6871FbB991,
            tokenAdminRegistry: 0x95F29FEE11c5C55d26cCcf1DB6772DE953B37B82,
            registryModuleOwnerCustom: 0x62e731218d0D47305aba2BE3751E7EE9E5520790,
            link: 0x779877A7B0D9E8603169DdbD7836e478b4624789,
            confirmations: 2,
            nativeCurrencySymbol: "ETH"
        });
        return ethereumSepoliaConfig;
    }

    function getArbitrumSepolia() public pure returns (NetworkConfig memory) {
        NetworkConfig memory arbitrumSepoliaConfig = NetworkConfig({
            chainSelector: 3478487238524512106,
            router: 0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165,
            rmnProxy: 0x9527E2d01A3064ef6b50c1Da1C0cC523803BCFF2,
            tokenAdminRegistry: 0x8126bE56454B628a88C17849B9ED99dd5a11Bd2f,
            registryModuleOwnerCustom: 0xE625f0b8b0Ac86946035a7729Aba124c8A64cf69,
            link: 0xb1D4538B4571d411F07960EF2838Ce337FE1E80E,
            confirmations: 2,
            nativeCurrencySymbol: "ETH"
        });
        return arbitrumSepoliaConfig;
    }

    function getAvalancheFujiConfig() public pure returns (NetworkConfig memory) {
        NetworkConfig memory avalancheFujiConfig = NetworkConfig({
            chainSelector: 14767482510784806043,
            router: 0xF694E193200268f9a4868e4Aa017A0118C9a8177,
            rmnProxy: 0xAc8CFc3762a979628334a0E4C1026244498E821b,
            tokenAdminRegistry: 0xA92053a4a3922084d992fD2835bdBa4caC6877e6,
            registryModuleOwnerCustom: 0x97300785aF1edE1343DB6d90706A35CF14aA3d81,
            link: 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846,
            confirmations: 2,
            nativeCurrencySymbol: "AVAX"
        });
        return avalancheFujiConfig;
    }

    function getBaseSepoliaConfig() public pure returns (NetworkConfig memory) {
        NetworkConfig memory baseSepoliaConfig = NetworkConfig({
            chainSelector: 10344971235874465080,
            router: 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93,
            rmnProxy: 0x99360767a4705f68CcCb9533195B761648d6d807,
            tokenAdminRegistry: 0x736D0bBb318c1B27Ff686cd19804094E66250e17,
            registryModuleOwnerCustom: 0x8A55C61227f26a3e2f217842eCF20b52007bAaBe,
            link: 0xE4aB69C077896252FAFBD49EFD26B5D171A32410,
            confirmations: 2,
            nativeCurrencySymbol: "ETH"
        });
        return baseSepoliaConfig;
    }
}
