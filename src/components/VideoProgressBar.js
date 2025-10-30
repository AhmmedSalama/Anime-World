import React from "react";

function VideoProgressBar({ currentTime, totalTime, progress }) {
  return (
    <div className="flex items-center justify-between w-full max-w-xl  text-sm text-gray-300">
      {/* الوقت الحالي */}
      <span>{currentTime}</span>

      {/* شريط التقدم */}
      <div className="flex-1 mx-3 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* الوقت الكلي */}
      <span>{totalTime}</span>
    </div>
  );
}

export default VideoProgressBar;
