export function BlinkAndExpression(face,leftEyeClosedFrames,rightEyeClosedFrames,CONSEC_FRAMES,blinkInProgress,setBlinkCount,setFaceExpression){

    const isLeftEyeClosed = face?.leftEyeOpenProbability < 0.10 && face?.leftEyeOpenProbability!==-1;
    const isRightEyeClosed = face?.rightEyeOpenProbability < 0.10 && face?.rightEyeOpenProbability!==-1;

    console.log({"leftEye Closed!!!":isLeftEyeClosed,"RightEye Closed!! ":isRightEyeClosed})

    // Increment closed frames count if either eye is detected as closed
    if (isLeftEyeClosed) {
        leftEyeClosedFrames.current += 1;
    } else {
        leftEyeClosedFrames.current = 0;
    }

    if (isRightEyeClosed) {
        rightEyeClosedFrames.current += 1;
    } else {
        rightEyeClosedFrames.current = 0;
    }

    console.log({
        "Left Eye Closed Frames": leftEyeClosedFrames.current,
        "Right Eye Closed Frames": rightEyeClosedFrames.current,
      });

    // Detect a blink if either eye has been below the threshold for enough consecutive frames
    const isBlinkDetected =
    leftEyeClosedFrames.current >= CONSEC_FRAMES &&
    rightEyeClosedFrames.current >= CONSEC_FRAMES;

    if (isBlinkDetected && !blinkInProgress.current) {
        blinkInProgress.current = true;
        setBlinkCount((prev) => prev + 1);
    
        // Reset frame counters after a blink
        leftEyeClosedFrames.current = 0;
        rightEyeClosedFrames.current = 0;
      }
    
      // Reset the blink state only after both eyes are open
    //   if (!isLeftEyeClosed && !isRightEyeClosed) {
    //     blinkInProgress.current = false;
    //   }
      if ( face?.leftEyeOpenProbability>=0.98 && face?.rightEyeOpenProbability>=0.98) {
        blinkInProgress.current = false;
      }


}