-include .env

.PHONY: all test clean build deploy-sepolia deploy-fuji deploy-all predict setup help \
        deploy-pool-sepolia deploy-pool-fuji deploy-pools configure-pool-sepolia \
        configure-pool-fuji configure-pools configure-cross-chain-sepolia \
        configure-cross-chain-fuji configure-cross-chain full-deploy-sepolia \
        full-deploy-fuji full-deploy-all claim-admin-sepolia claim-admin-fuji claim-admin \
        transfer-tokens-sepolia transfer-tokens-fuji deploy-vault-sepolia deploy-vault-fuji \
        deploy-yield-sepolia deploy-yield-fuji deploy-yield-all configure-yield-all \
        deposit-funds deposit-funds-amount check-deposit-status \
        withdraw-funds withdraw-funds-amount check-withdraw-status \
        withdraw-funds withdraw-funds-amount check-withdraw-status

all: clean build test

# Clean the repo
clean :; forge clean

# Build
build :; forge build

# Test
test :; forge test

# Setup environment
setup :; cp .env.example .env

# Predict deployment address
predict :; forge script script/deployments/DeployTestUsdcCreate2.s.sol --sig "getDeploymentAddress()" --rpc-url $(ETH_SEPOLIA_RPC_URL)

# Deploy USDC token to Sepolia
deploy-sepolia :; forge script script/deployments/DeployTestUsdcCreate2.s.sol --account dev --rpc-url $(ETH_SEPOLIA_RPC_URL) --broadcast

# Deploy USDC token to Avalanche Fuji
deploy-fuji :; forge script script/deployments/DeployTestUsdcCreate2.s.sol --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Deploy USDC token to both chains
deploy-all: deploy-sepolia deploy-fuji

# Deploy pool to Sepolia
deploy-pool-sepolia :; forge script script/deployments/DeployTokenPool.s.sol --account dev --rpc-url $(ETH_SEPOLIA_RPC_URL) --broadcast

# Deploy pool to Avalanche Fuji
deploy-pool-fuji :; forge script script/deployments/DeployTokenPool.s.sol --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Deploy pools to both chains
deploy-pools: deploy-pool-sepolia deploy-pool-fuji

# Deploy mock vault to Sepolia
deploy-vault-sepolia :; forge script script/deployments/DeployMockVault.s.sol --account dev --rpc-url $(ETH_SEPOLIA_RPC_URL) --broadcast

# Deploy mock vault to Avalanche Fuji
deploy-vault-fuji :; forge script script/deployments/DeployMockVault.s.sol --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Deploy mock vaults to both chains
deploy-vaults: deploy-vault-sepolia deploy-vault-fuji

# Deploy and configure yield system on Fuji (YieldDispatcher)
deploy-yield-fuji :; forge script script/deployments/DeployYieldSystem.s.sol --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Deploy and configure yield system on Sepolia (YieldExecutor)
deploy-yield-sepolia :; forge script script/deployments/DeployYieldSystem.s.sol --account dev --rpc-url $(ETH_SEPOLIA_RPC_URL) --broadcast

# Deploy yield system to both chains
deploy-yield-all :; make deploy-yield-fuji && make deploy-yield-sepolia

# Configure cross-chain connectivity (simplified - no env vars needed)
configure-yield-fuji :; forge script script/deployments/DeployYieldSystem.s.sol --sig "configureCrossChainConnectivity()" --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

configure-yield-sepolia :; forge script script/deployments/DeployYieldSystem.s.sol --sig "configureCrossChainConnectivity()" --account dev --rpc-url $(ETH_SEPOLIA_RPC_URL) --broadcast

# Configure cross-chain connectivity for both chains
configure-yield-all :; make configure-yield-fuji && make configure-yield-sepolia

# Deposit funds from Fuji YieldDispatcher to Sepolia YieldExecutor (default 10 USDC)
deposit-funds :; forge script script/DepositYieldFunds.s.sol --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Deposit custom amount of funds (e.g., make deposit-funds-amount AMOUNT=25 for 25 USDC)
deposit-funds-amount :; forge script script/DepositYieldFunds.s.sol --sig "depositFundsWithAmount(uint256)" $(AMOUNT) --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Check if you're authorized and your USDC balance on Fuji
check-deposit-status :; forge script script/DepositYieldFunds.s.sol --sig "checkAuthorization()" --rpc-url $(AVALANCHE_FUJI_RPC_URL) && forge script script/DepositYieldFunds.s.sol --sig "checkBalance()" --rpc-url $(AVALANCHE_FUJI_RPC_URL)

# Withdraw funds from Sepolia YieldExecutor back to Fuji (default 5 USDC to caller)
withdraw-funds :; forge script script/WithdrawYieldFunds.s.sol --account dev --rpc-url $(ETH_SEPOLIA_RPC_URL) --broadcast

# Withdraw custom amount to specific recipient (e.g., make withdraw-funds-amount AMOUNT=10 RECIPIENT=0x123...)
withdraw-funds-amount :; forge script script/WithdrawYieldFunds.s.sol --sig "withdrawFundsWithAmount(uint256)" $(AMOUNT) $(RECIPIENT) --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Check deployed capital on Sepolia and balance on Fuji
check-withdraw-status :; forge script script/WithdrawYieldFunds.s.sol --sig "checkDeployedCapital()" --rpc-url $(AVALANCHE_FUJI_RPC_URL) && forge script script/WithdrawYieldFunds.s.sol --sig "checkBalance(address)" $(shell cast wallet address --account dev) --rpc-url $(AVALANCHE_FUJI_RPC_URL)

# Configure pool on Sepolia (set pool in registry and configure cross-chain)
configure-pool-sepolia :; forge script script/SetAndConfigureTokenPool.s.sol --sig "setPool()" --account dev --rpc-url $(ETH_SEPOLIA_RPC_URL) --broadcast

# Configure pool on Fuji (set pool in registry and configure cross-chain)
configure-pool-fuji :; forge script script/SetAndConfigureTokenPool.s.sol --sig "setPool()" --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Configure pools on both chains
configure-pools: configure-pool-sepolia configure-pool-fuji

# Configure cross-chain connectivity between Sepolia and Fuji pools
configure-cross-chain-sepolia :; forge script script/SetAndConfigureTokenPool.s.sol --sig "configurePools()" --account dev --rpc-url $(ETH_SEPOLIA_RPC_URL) --broadcast

# Configure cross-chain connectivity between Fuji and Sepolia pools  
configure-cross-chain-fuji :; forge script script/SetAndConfigureTokenPool.s.sol --sig "configurePools()" --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Configure complete cross-chain connectivity
configure-cross-chain: configure-cross-chain-sepolia configure-cross-chain-fuji

# Claim and accept admin role on Sepolia
claim-admin-sepolia :; forge script script/ClaimAndAcceptAdminRole.s.sol --account dev --rpc-url $(ETH_SEPOLIA_RPC_URL) --broadcast

# Claim and accept admin role on Fuji
claim-admin-fuji :; forge script script/ClaimAndAcceptAdminRole.s.sol --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Claim and accept admin role on both chains
claim-admin: claim-admin-sepolia claim-admin-fuji

# Transfer tokens from Sepolia to Fuji
transfer-tokens-sepolia :; forge script script/TokenTransfer.s.sol --account dev --rpc-url $(ETH_SEPOLIA_RPC_URL) --broadcast

# Transfer tokens from Fuji to Sepolia
transfer-tokens-fuji :; forge script script/TokenTransfer.s.sol --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Deploy Circle contract to Avalanche Fuji
deploy-circle-fuji :; forge script script/deployments/DeployCircle.s.sol --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Full deployment: token + pool + configuration for Sepolia
full-deploy-sepolia: deploy-sepolia deploy-pool-sepolia configure-pool-sepolia
	@echo "✅ Full deployment completed on Sepolia"

# Full deployment: token + pool + configuration for Fuji
full-deploy-fuji: deploy-fuji deploy-pool-fuji configure-pool-fuji
	@echo "✅ Full deployment completed on Fuji"

# Full deployment on both chains with cross-chain configuration
full-deploy-all: full-deploy-sepolia full-deploy-fuji configure-cross-chain
	@echo "✅ Full deployment completed on both Sepolia and Fuji with cross-chain connectivity"

help:
	@echo "Available commands:"
	@echo ""
	@echo "Basic setup:"
	@echo "  setup                  - Copy .env.example to .env"
	@echo "  build                  - Build contracts"
	@echo "  test                   - Run tests"
	@echo "  clean                  - Clean build artifacts"
	@echo "  predict                - Show predicted deployment address"
	@echo ""
	@echo "Token deployment:"
	@echo "  deploy-sepolia         - Deploy USDC token to Ethereum Sepolia"
	@echo "  deploy-fuji            - Deploy USDC token to Avalanche Fuji"
	@echo "  deploy-all             - Deploy USDC token to both chains"
	@echo ""
	@echo "Pool deployment:"
	@echo "  deploy-pool-sepolia    - Deploy token pool to Sepolia"
	@echo "  deploy-pool-fuji       - Deploy token pool to Fuji"
	@echo "  deploy-pools           - Deploy token pools to both chains"
	@echo ""
	@echo "Vault deployment:"
	@echo "  deploy-vault-sepolia   - Deploy mock vault to Sepolia"
	@echo "  deploy-vault-fuji      - Deploy mock vault to Fuji"
	@echo "  deploy-vaults          - Deploy mock vaults to both chains"
	@echo ""
	@echo "Yield system deployment:"
	@echo "  deploy-yield-sepolia   - Deploy yield system to Sepolia"
	@echo "  deploy-yield-fuji      - Deploy yield system to Fuji"
	@echo "  deploy-yield-all       - Deploy yield system to both chains"
	@echo ""
	@echo "Pool configuration:"
	@echo "  configure-pool-sepolia - Configure pool on Sepolia"
	@echo "  configure-pool-fuji    - Configure pool on Fuji"
	@echo "  configure-pools        - Configure pools on both chains"
	@echo ""
	@echo "Cross-chain configuration:"
	@echo "  configure-cross-chain-sepolia - Configure Sepolia→Fuji connectivity"
	@echo "  configure-cross-chain-fuji    - Configure Fuji→Sepolia connectivity"
	@echo "  configure-cross-chain         - Configure bidirectional connectivity"
	@echo ""
	@echo "Admin role management:"
	@echo "  claim-admin-sepolia    - Claim and accept admin role on Sepolia"
	@echo "  claim-admin-fuji       - Claim and accept admin role on Fuji"
	@echo "  claim-admin            - Claim and accept admin role on both chains"
	@echo ""
	@echo "Token transfer:"
	@echo "  transfer-tokens-sepolia - Transfer tokens from Sepolia to Fuji"
	@echo "  transfer-tokens-fuji    - Transfer tokens from Fuji to Sepolia"
	@echo ""
	@echo "Complete deployment:"
	@echo "  full-deploy-sepolia    - Deploy & configure everything on Sepolia"
	@echo "  full-deploy-fuji       - Deploy & configure everything on Fuji"
	@echo "  full-deploy-all        - Deploy & configure everything with cross-chain connectivity"
