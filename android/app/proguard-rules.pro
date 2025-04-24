# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# For fresco libraries
-keep class com.facebook.imagepipeline.** { *; }
-keep class com.facebook.imagepipeline.nativecode.** { *; }

# realm https://www.mongodb.com/docs/atlas/device-sdks/sdk/react-native/install/#extend-android-proguard-configuration
-keep class io.realm.react.**

# react-native-reanimated https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# react-native-device-info https://www.npmjs.com/package/react-native-device-info#proguard
-keepclassmembers class com.android.installreferrer.api.** {
  *;
}

# react-native-date-picker https://github.com/henninghall/react-native-date-picker#why-does-the-android-app-crash-in-production
-keep public class net.time4j.android.ApplicationStarter
-keep public class net.time4j.PrettyTime

# react-native-inappbrowser-reborn https://github.com/proyecto26/react-native-inappbrowser#android
-keepattributes *Annotation*
-keepclassmembers class ** {
  @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }

# react-native-config https://github.com/luggit/react-native-config#problems-with-proguard
-keep class com.flyawaygolf.BuildConfig { *; }

# https://github.com/stripe/stripe-react-native/issues/1489
-dontwarn com.stripe.android.pushProvisioning.PushProvisioningActivity$g
-dontwarn com.stripe.android.pushProvisioning.PushProvisioningActivityStarter$Args
-dontwarn com.stripe.android.pushProvisioning.PushProvisioningActivityStarter$Error
-dontwarn com.stripe.android.pushProvisioning.PushProvisioningActivityStarter
-dontwarn com.stripe.android.pushProvisioning.PushProvisioningEphemeralKeyProvider


# https://github.com/dream-sports-labs/react-native-fast-image?tab=readme-ov-file#%EF%B8%8F-proguard-config
-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}