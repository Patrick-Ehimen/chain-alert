import { WalletModel } from '../../models/wallet-model';
import { addWallet, removeWallet, listWallets } from '../../controllers/walletController';

// Mock the WalletModel
jest.mock('../../models/wallet-model', () => ({
  WalletModel: {
    prototype: {
      save: jest.fn(),
    },
    deleteOne: jest.fn(),
    find: jest.fn(),
  },
}));

describe('Wallet Controller Unit Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('addWallet', () => {
    it('should create and save a new wallet', async () => {
      const mockWallet = {
        userId: 'testUser',
        walletAddress: '0x123',
        chainType: 'ethereum',
      };

      const saveMock = jest.fn().mockResolvedValue(mockWallet);
      (WalletModel as any).prototype.save = saveMock;

      const result = await addWallet(
        mockWallet.userId,
        mockWallet.walletAddress,
        mockWallet.chainType
      );

      expect(result).toEqual(mockWallet);
      expect(saveMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if save fails', async () => {
      const error = new Error('Save failed');
      (WalletModel as any).prototype.save = jest.fn().mockRejectedValue(error);

      await expect(addWallet('user1', '0x123', 'ethereum')).rejects.toThrow('Save failed');
    });
  });

  describe('removeWallet', () => {
    it('should remove a wallet successfully', async () => {
      const mockResult = { deletedCount: 1 };
      (WalletModel.deleteOne as jest.Mock).mockResolvedValue(mockResult);

      const result = await removeWallet('testUser', '0x123');

      expect(result).toEqual(mockResult);
      expect(WalletModel.deleteOne).toHaveBeenCalledWith({
        userId: 'testUser',
        walletAddress: '0x123',
      });
    });

    it('should return null if wallet not found', async () => {
      const mockResult = { deletedCount: 0 };
      (WalletModel.deleteOne as jest.Mock).mockResolvedValue(mockResult);

      const result = await removeWallet('testUser', '0x123');

      expect(result).toEqual(mockResult);
    });
  });

  describe('listWallets', () => {
    it('should return list of wallets for a user', async () => {
      const mockWallets = [
        { userId: 'testUser', walletAddress: '0x123', chainType: 'ethereum' },
        { userId: 'testUser', walletAddress: '0x456', chainType: 'bitcoin' },
      ];
      (WalletModel.find as jest.Mock).mockResolvedValue(mockWallets);

      const result = await listWallets('testUser');

      expect(result).toEqual(mockWallets);
      expect(WalletModel.find).toHaveBeenCalledWith({ userId: 'testUser' });
    });

    it('should return empty array if no wallets found', async () => {
      (WalletModel.find as jest.Mock).mockResolvedValue([]);

      const result = await listWallets('testUser');

      expect(result).toEqual([]);
    });
  });
});
