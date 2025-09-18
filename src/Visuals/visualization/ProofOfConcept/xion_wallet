import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  Coins, 
  TrendingUp, 
  Send, 
  Download,
  Shield,
  Zap,
  Volume2
} from 'lucide-react';
import toast from 'react-hot-toast';
import XionService from '../services/XionService';
import SonificationEngine from '../services/SonificationEngine';

const XionWallet = () => {
  const [xionService] = useState(new XionService());
  const [sonificationEngine] = useState(new SonificationEngine());
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletData, setWalletData] = useState({
    address: '',
    balance: [],
    rewards: [],
    delegations: [],
    transactions: []
  });
  const [networkStats, setNetworkStats] = useState(null);
  const [validators, setValidators] = useState([]);
  const [sendForm, setSendForm] = useState({
    recipient: '',
    amount: '',
    denom: 'uxion'
  });

  useEffect(() => {
    // Initialize sonification engine
    sonificationEngine.initialize();
    
    return () => {
      sonificationEngine.dispose();
    };
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const mnemonic = import.meta.env.VITE_COSMOSTATION_MNEMONIC;
      if (!mnemonic) {
        throw new Error('Mnemonic not found in environment variables');
      }

      const result = await xionService.initializeWallet(mnemonic);
      
      if (result.success) {
        setIsConnected(true);
        setWalletData(prev => ({ ...prev, address: result.address }));
        
        // Play connection success sound
        await sonificationEngine.playTone(432, 1000, 0.1);
        
        toast.success(`Connected to XION wallet: ${result.address.slice(0, 10)}...`);
        
        // Load wallet data
        await loadWalletData();
        await loadNetworkData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Connection failed:', error);
      toast.error(`Connection failed: ${error.message}`);
      
      // Play error sound
      await sonificationEngine.playChord([400, 420], 500, 0.05);
    } finally {
      setIsConnecting(false);
    }
  };

  const loadWalletData = async () => {
    try {
      // Get balance
      const balanceResult = await xionService.getBalance();
      if (balanceResult.success) {
        setWalletData(prev => ({ ...prev, balance: balanceResult.balance }));
      }

      // Get staking rewards
      const rewardsResult = await xionService.getStakingRewards();
      if (rewardsResult.success) {
        setWalletData(prev => ({ ...prev, rewards: rewardsResult.rewards }));
        
        // Sonify rewards if any
        if (rewardsResult.total > 0) {
          await sonificationEngine.sonifyRewards(rewardsResult.total);
        }
      }

      // Get delegations
      const delegationsResult = await xionService.getDelegations();
      if (delegationsResult.success) {
        setWalletData(prev => ({ ...prev, delegations: delegationsResult.delegations }));
      }

      // Get transaction history
      const txResult = await xionService.getTransactionHistory();
      if (txResult.success) {
        setWalletData(prev => ({ ...prev, transactions: txResult.transactions }));
      }
    } catch (error) {
      console.error('Failed to load wallet data:', error);
      toast.error('Failed to load wallet data');
    }
  };

  const loadNetworkData = async () => {
    try {
      // Get network stats
      const statsResult = await xionService.getNetworkStats();
      if (statsResult.success) {
        setNetworkStats(statsResult.stats);
        
        // Sonify network activity
        await sonificationEngine.sonifyNetworkStats(statsResult.stats);
      }

      // Get validators
      const validatorsResult = await xionService.getValidators();
      if (validatorsResult.success) {
        setValidators(validatorsResult.validators);
      }
    } catch (error) {
      console.error('Failed to load network data:', error);
    }
  };

  const sendTokens = async () => {
    try {
      if (!sendForm.recipient || !sendForm.amount) {
        toast.error('Please fill in all fields');
        return;
      }

      const result = await xionService.sendTokens(
        sendForm.recipient,
        sendForm.amount,
        sendForm.denom
      );

      if (result.success) {
        toast.success(`Transaction sent: ${result.transactionHash}`);
        
        // Sonify successful transaction
        await sonificationEngine.sonifyTransaction('send', sendForm.amount, true);
        
        // Reset form
        setSendForm({ recipient: '', amount: '', denom: 'uxion' });
        
        // Reload wallet data
        await loadWalletData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Send failed:', error);
      toast.error(`Send failed: ${error.message}`);
      
      // Sonify failed transaction
      await sonificationEngine.sonifyTransaction('send', sendForm.amount, false);
    }
  };

  const claimRewards = async () => {
    try {
      const validatorAddresses = walletData.delegations.map(d => d.validator_address);
      
      if (validatorAddresses.length === 0) {
        toast.error('No delegations found');
        return;
      }

      const result = await xionService.claimRewards(validatorAddresses);

      if (result.success) {
        toast.success(`Rewards claimed: ${result.transactionHash}`);
        
        // Sonify reward claim
        const totalRewards = walletData.rewards.reduce((sum, r) => sum + parseFloat(r.amount), 0);
        await sonificationEngine.sonifyRewards(totalRewards);
        
        // Reload wallet data
        await loadWalletData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Claim failed:', error);
      toast.error(`Claim failed: ${error.message}`);
    }
  };

  const playReturnFrequency = async () => {
    await sonificationEngine.playReturnFrequency(3000);
    toast.success('Playing 111.11 Hz Return to Sender frequency');
  };

  const playBinauralBeats = async () => {
    await sonificationEngine.playBinauralBeats(432, 8, 10000);
    toast.success('Playing binaural beats for focus');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const formatAmount = (amount, denom) => {
    const value = parseFloat(amount) / 1000000; // Convert from micro units
    return `${value.toFixed(6)} ${denom.replace('u', '').toUpperCase()}`;
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 10)}...${address.slice(-6)}`;
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-6 w-6" />
            XION Wallet
          </CardTitle>
          <CardDescription>
            Connect to XION testnet using Cosmostation wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={connectWallet} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              XION Wallet Connected
            </div>
            <Badge variant="outline" className="text-green-600">
              <Zap className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span>{formatAddress(walletData.address)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(walletData.address)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={playReturnFrequency}
              className="flex items-center gap-2"
            >
              <Volume2 className="h-4 w-4" />
              111.11 Hz
            </Button>
            <Button
              variant="outline"
              onClick={playBinauralBeats}
              className="flex items-center gap-2"
            >
              <Volume2 className="h-4 w-4" />
              Binaural
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="balance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Account Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {walletData.balance.length > 0 ? (
                <div className="space-y-2">
                  {walletData.balance.map((coin, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">{coin.denom.replace('u', '').toUpperCase()}</span>
                      <span className="text-lg font-bold">
                        {formatAmount(coin.amount, coin.denom)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No balance found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Staking Rewards
                </div>
                {walletData.rewards.length > 0 && (
                  <Button onClick={claimRewards} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Claim All
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {walletData.rewards.length > 0 ? (
                <div className="space-y-2">
                  {walletData.rewards.map((reward, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">{formatAddress(reward.validator_address)}</span>
                      <span className="font-medium text-green-600">
                        +{formatAmount(reward.amount, reward.denom)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No rewards available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delegations</CardTitle>
            </CardHeader>
            <CardContent>
              {walletData.delegations.length > 0 ? (
                <div className="space-y-2">
                  {walletData.delegations.map((delegation, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">{formatAddress(delegation.validator_address)}</span>
                      <span className="font-medium">
                        {formatAmount(delegation.balance.amount, delegation.balance.denom)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No delegations found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  placeholder="xion1..."
                  value={sendForm.recipient}
                  onChange={(e) => setSendForm(prev => ({ ...prev, recipient: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (in micro units)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000000"
                  value={sendForm.amount}
                  onChange={(e) => setSendForm(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              
              <Button onClick={sendTokens} className="w-full">
                Send Tokens
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Network Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {networkStats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Block Height</p>
                    <p className="text-lg font-bold">{networkStats.latest_block_height}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Chain ID</p>
                    <p className="text-lg font-bold">{networkStats.node_info?.network}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Voting Power</p>
                    <p className="text-lg font-bold">{networkStats.validator_info?.voting_power}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Peers</p>
                    <p className="text-lg font-bold">{networkStats.sync_info?.peers || 'N/A'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Loading network stats...</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Validators</CardTitle>
            </CardHeader>
            <CardContent>
              {validators.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {validators.slice(0, 10).map((validator, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">{validator.description?.moniker || 'Unknown'}</span>
                      <Badge variant="outline">
                        {(parseFloat(validator.commission?.commission_rates?.rate) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Loading validators...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {walletData.transactions.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {walletData.transactions.map((tx, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{tx.tx?.body?.messages?.[0]?.['@type']?.split('.').pop() || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</p>
                      </div>
                      <Badge variant={tx.tx_response?.code === 0 ? 'default' : 'destructive'}>
                        {tx.tx_response?.code === 0 ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No transactions found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default XionWallet;

