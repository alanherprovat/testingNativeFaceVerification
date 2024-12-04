import React from 'react';
import {ClipOp, Skia, TileMode} from '@shopify/react-native-skia';

const DrawBoundingBox = ({ frame,face }) => {

  const blurRadius = 25;
  const blurFilter = Skia.ImageFilter.MakeBlur(
    blurRadius,
    blurRadius,
    TileMode.Repeat,
    null,
  );

  if (!face||!frame ) return null;

  if (face.contours) {
    // This is a foreground face; draw precise mask with edges
    const path = Skia.Path.Make();

    const necessaryContours = ['FACE', 'LEFT_CHEEK', 'RIGHT_CHEEK'];
    necessaryContours.forEach((key) => {
      const points = face.contours[key];
      points.forEach((point, index) => {
        if (index === 0) {
          // Starting point
          path.moveTo(point.x, point.y);
        } else {
          // Continuation
          path.lineTo(point.x, point.y);
        }
      });
      path.close();
    });

    frame.save();
    frame.clipPath(path, Skia.ClipOp.Intersect, true);
    frame.render(paint);
    frame.restore();
  } else {
    // This is a background face; use a simple blur circle
    const path = Skia.Path.Make();
    console.log(`Face at ${face.bounds.x}, ${face.bounds.y}`);

    const rect = Skia.XYWHRect(
      face.bounds.x,
      face.bounds.y,
      face.bounds.width,
      face.bounds.height
    );
    path.addOval(rect);

    frame.save();
    frame.clipPath(path, Skia.ClipOp.Intersect, true);
    frame.render(paint);
    frame.restore();
  }

  return null;
};

export default DrawBoundingBox;
