package com.weguarentee;
import android.content.Intent;
import com.facebook.react.ReactActivity;
import android.app.Activity;

public class MainActivity extends ReactActivity {
    public static Activity activity;
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        activity = this;
        return "weguarentee";
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
}
