package com.weguarentee;

import android.app.Application;

import com.facebook.react.ReactApplication;
//import com.paymentgateway.MidtransPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
//import com.reactnativenavigation.NavigationReactPackage;
//import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.remobile.splashscreen.RCTSplashScreenPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;
import com.remobile.splashscreen.RCTSplashScreenPackage;  // <--- import
import com.evollu.react.fcm.FIRMessagingPackage;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }


    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new RCTSplashScreenPackage(MainActivity.activity, true),
          new MainReactPackage(),
            //new MidtransPackage(),
            new FBSDKPackage(mCallbackManager),
            //new NavigationReactPackage(),
            //new RNGoogleSigninPackage(),
          new FIRMessagingPackage(),
          new VectorIconsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
     AppEventsLogger.activateApp(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
