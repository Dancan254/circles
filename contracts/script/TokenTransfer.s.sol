// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {HelperUtils} from "./utils/HelperUtils.s.sol";
import {HelperConfig} from "./utils/HelperConfig.s.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";

/**
 * @title TransferTokens
 * @author Circle Protocol Team
 * @notice Script for transferring tokens between chains using Chainlink CCIP
 * @dev Handles cross-chain token transfers between Ethereum Sepolia and Avalanche Fuji
 */
contract TransferTokens is Script {
    enum Fee {
        Native,
        Link
    }

    function run() external {
        HelperConfig helperConfig = new HelperConfig();
        address tokenAddress = helperConfig.getConfigsForNetwork(block.chainid).tokenAddress;

        uint256 amount = 1e18;
        string memory feeType = "native";

        uint256 destinationChainId;
        if (block.chainid == 11155111) {
            destinationChainId = 43113;
        } else if (block.chainid == 43113) {
            destinationChainId = 11155111;
        } else {
            revert("Unsupported source chain for token transfer");
        }

        (, address router,,,, address link,,) = helperConfig.activeNetworkConfig();

        HelperConfig.NetworkConfig memory remoteNetworkConfig =
            HelperUtils.getNetworkConfig(helperConfig, destinationChainId);
        uint64 destinationChainSelector = remoteNetworkConfig.chainSelector;

        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Invalid amount to transfer");
        require(destinationChainSelector != 0, "Chain selector not defined for the destination chain");

        address feeTokenAddress;
        if (keccak256(bytes(feeType)) == keccak256(bytes("native"))) {
            feeTokenAddress = address(0);
        } else if (keccak256(bytes(feeType)) == keccak256(bytes("link"))) {
            feeTokenAddress = link;
        } else {
            console.log("Invalid fee token:", feeType);
            revert("Invalid fee token");
        }

        vm.startBroadcast();

        IRouterClient routerContract = IRouterClient(router);

        require(routerContract.isChainSupported(destinationChainSelector), "Destination chain not supported");

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(helperConfig.getConfigsForNetwork(block.chainid).tokenAdminAddress),
            data: abi.encode(),
            tokenAmounts: new Client.EVMTokenAmount[](1),
            feeToken: feeTokenAddress,
            extraArgs: abi.encodePacked(bytes4(keccak256("CCIP EVMExtraArgsV1")), abi.encode(uint256(0)))
        });

        message.tokenAmounts[0] = Client.EVMTokenAmount({token: tokenAddress, amount: amount});

        IERC20(tokenAddress).approve(router, amount);

        uint256 fees = routerContract.getFee(destinationChainSelector, message);
        console.log("Estimated fees:", fees);

        bytes32 messageId;
        if (feeTokenAddress == address(0)) {
            messageId = routerContract.ccipSend{value: fees}(destinationChainSelector, message);
        } else {
            IERC20(feeTokenAddress).approve(router, fees);
            messageId = routerContract.ccipSend(destinationChainSelector, message);
        }

        console.log("Message ID:");
        console.logBytes32(messageId);

        string memory messageUrl = string(
            abi.encodePacked(
                "Check status of the message at https://ccip.chain.link/msg/", HelperUtils.bytes32ToHexString(messageId)
            )
        );
        console.log(messageUrl);

        vm.stopBroadcast();
    }
}
