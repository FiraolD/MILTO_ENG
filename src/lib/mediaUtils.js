/** Decide whether an asset URL points to a video */
export function isVideoUrl(url) {
  return (
    isDirectVideoFile(url) ||
    /youtube\.com|youtu\.be|vimeo\.com/i.test(url)
  );
}

/** True for directly uploaded video files (needs a <video> tag, not iframe) */
export function isDirectVideoFile(url) {
  return /\.(mp4|webm|mov|m3u8)(\?|$)/i.test(url);
}
