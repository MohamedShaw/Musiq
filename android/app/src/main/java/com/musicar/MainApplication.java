package com.musicar;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;


import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.marianhello.bgloc.react.BackgroundGeolocationPackage;
import com.opensettings.OpenSettingsPackage;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;

import android.support.multidex.MultiDex;
import android.content.Context;
import com.BV.LinearGradient.LinearGradientPackage;
import com.zmxv.RNSound.RNSoundPackage; 
import com.react.rnspinkit.RNSpinkitPackage;

public class MainApplication extends NavigationApplication {

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }


    @Override
    public void onCreate() {
        super.onCreate();
       
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new RNFirebasePackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new RNGestureHandlerPackage(),
            new VectorIconsPackage(),
            new FastImageViewPackage(),
            new SnackbarPackage(),
            new RNI18nPackage(),
            new LinearGradientPackage(),
            new RNSoundPackage(),
            new RNSpinkitPackage(),
            new MapsPackage(),
            new BackgroundGeolocationPackage(),
            new OpenSettingsPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}
