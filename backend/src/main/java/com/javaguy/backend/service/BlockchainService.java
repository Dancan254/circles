package com.javaguy.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Convert;
import org.web3j.utils.Numeric;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
@Slf4j
public class BlockchainService {

    // The address of your smart contract on Avalanche C-Chain
    private final String contractAddress = "0x964A2c9313A294360589dCCd9A19c4c1B60e40aF";

    private final String usdcTokenAddress = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E";
    private final long chainId = 43113;

    @Value("${crypto.exchange-rate}")
    private Double exchangeRate;

    private Web3j web3j;
    private Credentials credentials;
    private BigInteger gasPrice;
    private BigInteger gasLimit;

    @PostConstruct
    public void init() {
        try {
            // Connect to Avalanche Fuji testnet
            String rpcUrl = "https://api.avax-test.network/ext/bc/C/rpc";
            web3j = Web3j.build(new HttpService(rpcUrl));

            // Load credentials from private key
            String privateKey = "xxxxxx";
            credentials = Credentials.create(privateKey);

            // Log wallet address for funding and verification
            String walletAddress = credentials.getAddress();
            log.info("Blockchain service initialized with wallet: {}", walletAddress);

            // Set gas parameters - reduced for testnet
            gasPrice = BigInteger.valueOf(30_000_000_000L); // 30 Gwei
            gasLimit = BigInteger.valueOf(500_000L); // 500,000 gas units

            // Check AVAX balance
            EthGetBalance ethGetBalance = web3j.ethGetBalance(walletAddress,
                    DefaultBlockParameterName.LATEST).send();
            BigDecimal avaxBalance = Convert.fromWei(
                    new BigDecimal(ethGetBalance.getBalance()), Convert.Unit.ETHER);
            log.info("Wallet AVAX balance: {} AVAX", avaxBalance.toPlainString());

            // If balance is zero, log a warning
            if (ethGetBalance.getBalance().compareTo(BigInteger.ZERO) == 0) {
                log.warn("⚠️ WALLET HAS ZERO BALANCE! Please fund this address with AVAX: {}", walletAddress);
               // log.warn("Get test AVAX from: https://faucet.avax.network/");
            }

            // Check if we can connect to the contract
            boolean contractAccessible = checkContractAccessible();
            if (contractAccessible) {
                log.info("✅ Successfully connected to contract at: {}", contractAddress);
            } else {
                log.error("❌ Could not access contract at: {}", contractAddress);
            }

        } catch (Exception e) {
            log.error("Failed to initialize blockchain service: {}", e.getMessage(), e);
        }
    }

    /**
     * Calls the smart contract to credit the user's wallet with USDC tokens
     * @param walletAddress The user's wallet address
     * @param amountKES The amount in KES to convert to USDC
     * @return true if successful, false otherwise
     */
    public boolean creditWallet(String walletAddress, Double amountKES) {
        try {
            // Validate inputs
            if (!isValidAddress(walletAddress)) {
                log.error("Invalid wallet address format: {}", walletAddress);
                return false;
            }

            if (amountKES <= 0) {
                log.error("Amount must be positive: {}", amountKES);
                return false;
            }

            // Convert KES to USDC (assuming 1:1 with USD and using the exchange rate)
            double amountUSDC = amountKES / exchangeRate;
            log.info("Converting {} KES to {} USDC (rate: {})",
                    amountKES, amountUSDC, exchangeRate);

            // USDC uses 6 decimal places
            BigInteger tokenAmount = BigDecimal.valueOf(amountUSDC)
                    .multiply(BigDecimal.valueOf(1_000_000_000_000_000_000L))
                    .toBigInteger();

            // Get the current nonce for our wallet
            EthGetTransactionCount ethGetTransactionCount = web3j
                    .ethGetTransactionCount(credentials.getAddress(), DefaultBlockParameterName.LATEST)
                    .send();
            BigInteger nonce = ethGetTransactionCount.getTransactionCount();

            // Create the function call to credit wallet
            Function function = createCreditUserWalletFunction(walletAddress, tokenAmount);
            String encodedFunction = FunctionEncoder.encode(function);

            // Create and sign the raw transaction with the chain ID
            RawTransaction rawTransaction = RawTransaction.createTransaction(
                    nonce,
                    gasPrice,
                    gasLimit,
                    contractAddress,
                    BigInteger.ZERO,
                    encodedFunction
            );

            byte[] signedMessage = TransactionEncoder.signMessage(rawTransaction, chainId, credentials);
            String hexValue = Numeric.toHexString(signedMessage);

            // Send the transaction
            EthSendTransaction ethSendTransaction = web3j.ethSendRawTransaction(hexValue).send();

            if (ethSendTransaction.hasError()) {
                String errorMessage = ethSendTransaction.getError().getMessage();
                log.error("Transaction error: {}", errorMessage);

                if (errorMessage.contains("insufficient funds")) {
                    log.error("⚠️ WALLET NEEDS FUNDING! Please send AVAX to: {}", credentials.getAddress());
                }

                return false;
            }

            String transactionHash = ethSendTransaction.getTransactionHash();
            log.info("✅ Transaction sent successfully! Hash: {}", transactionHash);
            log.info("View on explorer: https://testnet.snowtrace.io/tx/{}", transactionHash);

            return true;
        } catch (Exception e) {
            log.error("Failed to credit wallet: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Creates the function call for crediting a user wallet
     */
    private Function createCreditUserWalletFunction(String walletAddress, BigInteger amount) {
        return new Function(
                "concludeOnRampTransfer",
                Arrays.asList(
                        new Address(walletAddress),
                        new Uint256(amount)
                ),
                Collections.emptyList()
        );
    }

    /**
     * Checks if the contract is accessible and has the expected function
     */
    private boolean checkContractAccessible() {
        try {
            Function function = new Function(
                    "owner",
                    Collections.emptyList(),
                    Collections.singletonList(new TypeReference<Address>() {})
            );

            String encodedFunction = FunctionEncoder.encode(function);

            EthCall ethCall = web3j.ethCall(
                    Transaction.createEthCallTransaction(
                            credentials.getAddress(),
                            contractAddress,
                            encodedFunction
                    ),
                    DefaultBlockParameterName.LATEST
            ).send();

            // If there's no error, the contract is accessible
            return !ethCall.hasError();
        } catch (Exception e) {
            log.warn("Contract accessibility check failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Gets the balance of USDC for the given wallet address
     */
    public BigDecimal getUSDCBalance(String walletAddress) throws IOException, ExecutionException, InterruptedException {
        // Create function to call balanceOf on USDC token contract
        Function function = new Function(
                "balanceOf",
                Collections.singletonList(new Address(walletAddress)),
                Collections.singletonList(new TypeReference<Uint256>() {})
        );

        String encodedFunction = FunctionEncoder.encode(function);

        EthCall ethCall = web3j.ethCall(
                Transaction.createEthCallTransaction(
                        credentials.getAddress(),
                        usdcTokenAddress,
                        encodedFunction
                ),
                DefaultBlockParameterName.LATEST
        ).send();

        List<Type> decode = FunctionReturnDecoder.decode(ethCall.getValue(), function.getOutputParameters());

        if (decode.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigInteger balanceInWei = (BigInteger) decode.get(0).getValue();

        // USDC has 6 decimal places
        return new BigDecimal(balanceInWei).divide(BigDecimal.valueOf(1_000_000));
    }

    /**
     * Validates an Ethereum address format
     */
    private boolean isValidAddress(String address) {
        if (address == null || address.isEmpty()) {
            return false;
        }

        // Normalize the address (add 0x prefix if missing)
        if (!address.startsWith("0x")) {
            address = "0x" + address;
        }

        // Check length (42 characters including 0x prefix)
        if (address.length() != 42) {
            return false;
        }

        // Check hex format
        return address.matches("0x[0-9a-fA-F]{40}");
    }
}