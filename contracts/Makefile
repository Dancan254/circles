-include .env

.PHONY: all test clean build deploy-sepolia deploy-fuji deploy-all predict setup help \
        deploy-pool-sepolia deploy-pool-fuji deploy-pools configure-pool-sepolia \
        configure-pool-fuji configure-pools configure-cross-chain-sepolia \
        configure-cross-chain-fuji configure-cross-chain full-deploy-sepolia \
        full-deploy-fuji full-deploy-all claim-admin-sepolia claim-admin-fuji claim-admin \
        transfer-tokens-sepolia

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
predict :; forge script script/DeployTestUsdcCreate2.s.sol --sig "getDeploymentAddress()" --rpc-url $(ETH_SEPOLIA_RPC_URL)

# Deploy USDC token to Sepolia
deploy-sepolia :; forge script script/DeployTestUsdcCreate2.s.sol --account dev --rpc-url $(ETH_SEPOLIA_RPC_URL) --broadcast

# Deploy USDC token to Avalanche Fuji
deploy-fuji :; forge script script/DeployTestUsdcCreate2.s.sol --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Deploy USDC token to both chains
deploy-all: deploy-sepolia deploy-fuji

# Deploy pool to Sepolia
deploy-pool-sepolia :; forge script script/DeployTokenPool.s.sol --account dev --rpc-url $(ETH_SEPOLIA_RPC_URL) --broadcast

# Deploy pool to Avalanche Fuji
deploy-pool-fuji :; forge script script/DeployTokenPool.s.sol --account dev --rpc-url $(AVALANCHE_FUJI_RPC_URL) --broadcast

# Deploy pools to both chains
deploy-pools: deploy-pool-sepolia deploy-pool-fuji

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
	@echo ""
	@echo "Complete deployment:"
	@echo "  full-deploy-sepolia    - Deploy & configure everything on Sepolia"
	@echo "  full-deploy-fuji       - Deploy & configure everything on Fuji"
	@echo "  full-deploy-all        - Deploy & configure everything with cross-chain connectivity"
