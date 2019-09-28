package io.github.rohitrp.portfolio;

import android.app.Activity;
import android.graphics.Typeface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;

/**
 * Created by Rohit on 10-02-2016.
 */
public class customAdapter extends ArrayAdapter<String> {

    private final Activity Context;
    private final String[] appsName;
    private final Integer[] imgIds;

    public CustomAdapter(Activity context, String[] appsName, Integer[] imgIds) {
        super(context, R.layout.app_list, appsName);

        this.context = context;
        this.appsName = appsName;
        this.imgIds = imgIds;
    }

    @Override
    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView;

        if (view == null) {
            rowView  = inflater.inflate(R.layout.app_list, null, true);
        } else {
            rowView = view;
        }

        TextView textView = (TextView) rowView.findViewById(R.id.app_textview);
        textView.setText(appsName[position]);

        Typeface openSansCondensed = Typeface.createFromAsset(
                context.getAssets(), "font/OpenSans-CondLight.ttf");

        textView.setTypeface(openSansCondensed);

        ImageView imageButton = (ImageView) rowView.findViewById(R.id.app_imageview);

        Glide
                .with(getContext())
                .load(imgIds[position])
                .centerCrop()
                .crossFade()
                .into(imageButton);

        return rowView;
    }
}