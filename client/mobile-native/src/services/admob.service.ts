
import { AdMobBanner, AdMobInterstitial, AdMobRewarded } from 'expo-ads-admob';

export class AdMobService {
  private bannerAdUnitId = process.env.EXPO_PUBLIC_ADMOB_BANNER_ID!;
  private interstitialAdUnitId = process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID!;
  private rewardedAdUnitId = process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID!;

  // Show banner ad (for free users)
  renderBannerAd() {
    return (
      <AdMobBanner
        bannerSize="fullBanner"
        adUnitID={this.bannerAdUnitId}
        servePersonalizedAds={false}
        onDidFailToReceiveAdWithError={(error) =>
          console.error('Banner ad error:', error)
        }
      />
    );
  }

  // Show interstitial ad
  async showInterstitialAd() {
    try {
      await AdMobInterstitial.setAdUnitID(this.interstitialAdUnitId);
      await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: false });
      await AdMobInterstitial.showAdAsync();
    } catch (error) {
      console.error('Interstitial ad error:', error);
    }
  }

  // Show rewarded ad (earn free features)
  async showRewardedAd(): Promise {
    try {
      await AdMobRewarded.setAdUnitID(this.rewardedAdUnitId);
      await AdMobRewarded.requestAdAsync({ servePersonalizedAds: false });
      await AdMobRewarded.showAdAsync();
      
      return new Promise((resolve) => {
        AdMobRewarded.addEventListener('rewardedVideoUserDidEarnReward', () => {
          resolve(true);
        });
        
        AdMobRewarded.addEventListener('rewardedVideoDidDismiss', () => {
          resolve(false);
        });
      });
    } catch (error) {
      console.error('Rewarded ad error:', error);
      return false;
    }
  }

  // Check if user should see ads
  shouldShowAds(user: any): boolean {
    return !user.isPremium && user.planType === 'FREE';
  }
}