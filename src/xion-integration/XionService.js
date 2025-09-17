import { SigningStargateClient, GasPrice } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { stringToPath } from '@cosmjs/crypto';
import axios from 'axios';

class XionService {
  constructor() {
    this.rpcUrl = import.meta.env.VITE_XION_RPC_URL || 'https://rpc.xion-testnet-1.burnt.com';
    this.chainId = import.meta.env.VITE_XION_CHAIN_ID || 'xion-testnet-1';
    this.mintScanApiKey = import.meta.env.VITE_MINTSCAN_API_KEY;
    this.mintScanApiBase = import.meta.env.VITE_MINTSCAN_API_BASE || 'https://api.mintscan.io';
    this.client = null;
    this.wallet = null;
    this.address = null;
  }

  // Initialize wallet from mnemonic
  async initializeWallet(mnemonic) {
    try {
      if (!mnemonic) {
        throw new Error('Mnemonic is required for XION wallet initialization');
      }

      console.log('🔗 Initializing XION wallet...');
      
      // Create wallet from mnemonic with proper options
      this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: 'xion',
        hdPaths: [stringToPath("m/44'/118'/0'/0/0")]
      });
      
      // Get accounts
      const accounts = await this.wallet.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in wallet');
      }
      
      this.address = accounts[0].address;
      console.log('📍 XION address:', this.address);
      
      // Create signing client with proper configuration
      this.client = await SigningStargateClient.connectWithSigner(
        this.rpcUrl,
        this.wallet,
        {
          gasPrice: GasPrice.fromString('0.025uxion')
        }
      );
      
      // Test connection by getting chain ID
      const chainId = await this.client.getChainId();
      console.log('⛓️ Connected to chain:', chainId);
      
      return {
        success: true,
        address: this.address,
        accounts,
        chainId
      };
    } catch (error) {
      console.error('❌ XION wallet initialization failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get account balance
  async getBalance(address = this.address) {
    try {
      if (!this.client) {
        throw new Error('Client not initialized');
      }
      
      const balance = await this.client.getAllBalances(address);
      return {
        success: true,
        balance
      };
    } catch (error) {
      console.error('Failed to get balance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get account info
  async getAccountInfo(address = this.address) {
    try {
      if (!this.client) {
        throw new Error('Client not initialized');
      }
      
      const account = await this.client.getAccount(address);
      return {
        success: true,
        account
      };
    } catch (error) {
      console.error('Failed to get account info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // MintScan API integration
  async fetchMintScanData(endpoint) {
    try {
      const response = await axios.get(`${this.mintScanApiBase}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.mintScanApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('MintScan API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get staking rewards
  async getStakingRewards(address = this.address) {
    try {
      const response = await this.fetchMintScanData(`/v1/account/${address}/rewards`);
      if (response.success) {
        return {
          success: true,
          rewards: response.data.rewards || [],
          total: response.data.total || 0
        };
      }
      return response;
    } catch (error) {
      console.error('Failed to get staking rewards:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get delegation info
  async getDelegations(address = this.address) {
    try {
      const response = await this.fetchMintScanData(`/v1/account/${address}/delegations`);
      if (response.success) {
        return {
          success: true,
          delegations: response.data.delegations || [],
          total: response.data.total || 0
        };
      }
      return response;
    } catch (error) {
      console.error('Failed to get delegations:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get validator info
  async getValidators() {
    try {
      const response = await this.fetchMintScanData('/v1/validators');
      if (response.success) {
        return {
          success: true,
          validators: response.data.validators || []
        };
      }
      return response;
    } catch (error) {
      console.error('Failed to get validators:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get network stats
  async getNetworkStats() {
    try {
      const response = await this.fetchMintScanData('/v1/status');
      if (response.success) {
        return {
          success: true,
          stats: response.data
        };
      }
      return response;
    } catch (error) {
      console.error('Failed to get network stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get transaction history
  async getTransactionHistory(address = this.address, limit = 50) {
    try {
      const response = await this.fetchMintScanData(`/v1/account/${address}/txs?limit=${limit}`);
      if (response.success) {
        return {
          success: true,
          transactions: response.data.txs || []
        };
      }
      return response;
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send transaction
  async sendTokens(recipientAddress, amount, denom = 'uxion') {
    try {
      if (!this.client || !this.address) {
        throw new Error('Wallet not initialized');
      }

      const fee = {
        amount: [{ denom: 'uxion', amount: '5000' }],
        gas: '200000',
      };

      const result = await this.client.sendTokens(
        this.address,
        recipientAddress,
        [{ denom, amount }],
        fee,
        'Sent via Rangi\'s Heartbeat XION PoC'
      );

      return {
        success: true,
        transactionHash: result.transactionHash,
        result
      };
    } catch (error) {
      console.error('Failed to send tokens:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delegate tokens
  async delegateTokens(validatorAddress, amount, denom = 'uxion') {
    try {
      if (!this.client || !this.address) {
        throw new Error('Wallet not initialized');
      }

      const fee = {
        amount: [{ denom: 'uxion', amount: '5000' }],
        gas: '200000',
      };

      const msg = {
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: {
          delegatorAddress: this.address,
          validatorAddress,
          amount: { denom, amount }
        }
      };

      const result = await this.client.signAndBroadcast(this.address, [msg], fee);

      return {
        success: true,
        transactionHash: result.transactionHash,
        result
      };
    } catch (error) {
      console.error('Failed to delegate tokens:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Claim rewards
  async claimRewards(validatorAddresses) {
    try {
      if (!this.client || !this.address) {
        throw new Error('Wallet not initialized');
      }

      const fee = {
        amount: [{ denom: 'uxion', amount: '5000' }],
        gas: '200000',
      };

      const msgs = validatorAddresses.map(validatorAddress => ({
        typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
        value: {
          delegatorAddress: this.address,
          validatorAddress
        }
      }));

      const result = await this.client.signAndBroadcast(this.address, msgs, fee);

      return {
        success: true,
        transactionHash: result.transactionHash,
        result
      };
    } catch (error) {
      console.error('Failed to claim rewards:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get current block height
  async getBlockHeight() {
    try {
      if (!this.client) {
        throw new Error('Client not initialized');
      }
      
      const height = await this.client.getHeight();
      return {
        success: true,
        height
      };
    } catch (error) {
      console.error('Failed to get block height:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Disconnect wallet
  disconnect() {
    this.client = null;
    this.wallet = null;
    this.address = null;
  }
}

export default XionService;

