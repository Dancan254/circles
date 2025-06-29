package com.javaguy.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class BlockchainService {
    @Value("${crypto.exchange-rate}")
    private Double exchangeRate;

    /**
     * Calls the smart contract to credit the user's wallet
     * @param walletAddress The user's wallet address
     * @param amountKES The amount in KES to convert to crypto
     * @return true if successful, false otherwise
     */
    public boolean creditWallet(String walletAddress, Double amountKES){
        try{
            //conversion
            double amountCrypto = amountKES / exchangeRate;

            log.info("Crediting wallet {} with {} USDT (converted from {} KES)",
                    walletAddress, amountCrypto, amountKES);

            //todo: implement the smart contract call to credit the user wallet address
            return true;
        }catch (Exception e){
            log.error("Failed to credit wallet {} with {} USDT (converted from {} KES)",
                    walletAddress, amountKES, exchangeRate, e);
            return false;
        }
    }
}
