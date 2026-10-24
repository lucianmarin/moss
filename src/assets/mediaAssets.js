// Direct Vite asset imports from /design directory + live Chilltrax radio stream
import v2DockImg from '../../design/moss-v2-dock.jpg';
import v2SwitcherImg from '../../design/moss-v2-switcher.png';
import v1BrowserImg from '../../design/moss-v1-browser.jpg';
import v1CodeImg from '../../design/moss-v1-code.jpg';
import v1LaptopImg from '../../design/moss-v1-laptop.jpg';
import v1PlayerImg from '../../design/moss-v1-player.jpg';
import v1TwitterImg from '../../design/moss-v1-twitter.jpg';

export const CHILLTRAX_STREAM_URL = 'https://streamssleu.chilltrax.com/stream?sid=1';

export const AUDIO_TRACKS = [
  {
    id: 'castanets-no-voice',
    artist: 'Castanets',
    title: 'No Voice Was Raised',
    album: 'Chilltrax Live Stream',
    trackNum: 9,
    totalTracks: 13,
    durationFormatted: '2:13',
    src: CHILLTRAX_STREAM_URL,
    isLiveStream: true,
    starred: true,
    theme: {
      bg: '#4d2608',
      progressFill: '#a88c76',
      progressTrack: '#755238',
      badgeBg: '#b9dcf2',
      badgeText: '#1c242b',
      badgeMuted: '#5b7285',
      titleColor: '#ffffff',
      subtitleColor: '#d7bfb0',
      starColor: '#b9dcf2',
      artType: 'castanets'
    }
  },
  {
    id: 'caribou-jamelia',
    artist: 'Caribou',
    title: 'Jamelia',
    album: 'Chilltrax Live Stream',
    trackNum: 9,
    totalTracks: 9,
    durationFormatted: '1:23',
    src: CHILLTRAX_STREAM_URL,
    isLiveStream: true,
    starred: false,
    theme: {
      bg: '#0d131a',
      progressFill: '#d19922',
      progressTrack: '#54585c',
      badgeBg: '#ecc118',
      badgeText: '#ffffff',
      badgeMuted: '#f7e38d',
      titleColor: '#d6782a',
      subtitleColor: '#8ba352',
      starColor: '#d6782a',
      artType: 'caribou'
    }
  },
  {
    id: 'chilltrax-radio',
    artist: 'Chilltrax',
    title: 'Ambient Radio Stream',
    album: 'streamssleu.chilltrax.com',
    trackNum: 1,
    totalTracks: 3,
    durationFormatted: 'LIVE',
    src: CHILLTRAX_STREAM_URL,
    isLiveStream: true,
    starred: true,
    theme: {
      bg: '#4d2608',
      progressFill: '#a88c76',
      progressTrack: '#755238',
      badgeBg: '#b9dcf2',
      badgeText: '#1c242b',
      badgeMuted: '#5b7285',
      titleColor: '#ffffff',
      subtitleColor: '#d7bfb0',
      starColor: '#b9dcf2',
      artType: 'castanets'
    }
  }
];

export const DESIGN_GALLERY = [
  {
    id: 'moss-v2-switcher',
    name: 'moss-v2-switcher.png',
    era: 'V2',
    title: 'Moss V2 — Top Bar & App Switcher Stack',
    size: '234 KB',
    dimensions: '1600 × 1200',
    src: v2SwitcherImg,
    description: 'V2 system top bar with lightning launcher, stacked top-left minimized app switcher (WhatsApp, Settings, Finder), Chrome and WhatsApp windows.'
  },
  {
    id: 'moss-v2-dock',
    name: 'moss-v2-dock.jpg',
    era: 'V2',
    title: 'Moss V2 — Floating Vertical Dock',
    size: '148 KB',
    dimensions: '1600 × 1200',
    src: v2DockImg,
    description: 'Floating left dock with active/dormant line icons, workspace cursor & layer toggles, and stacked 19:20 vertical clock.'
  },
  {
    id: 'moss-v1-laptop',
    name: 'moss-v1-laptop.jpg',
    era: 'V1',
    title: 'Moss V1 — Full Desktop Overview',
    size: '210 KB',
    dimensions: '1920 × 1080',
    src: v1LaptopImg,
    description: 'Complete V1 environment showing Code Editor, Browser (Journal — Design the Flying Car), Twitter client, and bottom notification ticker.'
  },
  {
    id: 'moss-v1-browser',
    name: 'moss-v1-browser.jpg',
    era: 'V1',
    title: 'Moss V1 — Browser & Journal',
    size: '96 KB',
    dimensions: '800 × 600',
    src: v1BrowserImg,
    description: 'V1 Browser with YouTube, Facebook, Reddit tabs, green HTTPS protocol indicator, and Lucian Marin Journal layout.'
  },
  {
    id: 'moss-v1-code',
    name: 'moss-v1-code.jpg',
    era: 'V1',
    title: 'Moss V1 — Code Editor & Right Volume HUD',
    size: '84 KB',
    dimensions: '800 × 600',
    src: v1CodeImg,
    description: 'Multi-tab code editor (ctnr.html, machn.py, rss.xml) and right-edge quick action HUD with slide-out horizontal volume control.'
  },
  {
    id: 'moss-v1-player',
    name: 'moss-v1-player.jpg',
    era: 'V1',
    title: 'Moss V1 — Ambient Media Player Bars',
    size: '78 KB',
    dimensions: '800 × 600',
    src: v1PlayerImg,
    description: 'Dual color-adaptive horizontal player widgets for Castanets (No Voice Was Raised) and Caribou (Jamelia).'
  },
  {
    id: 'moss-v1-twitter',
    name: 'moss-v1-twitter.jpg',
    era: 'V1',
    title: 'Moss V1 — Twitter Client & App Menu',
    size: '92 KB',
    dimensions: '800 × 600',
    src: v1TwitterImg,
    description: 'Code editor dropdown menu (New, Share, Settings, Quit), compact Twitter timeline, and desktop watermark clock.'
  }
];

export const INITIAL_CODE_FILES = [
  {
    id: 'count.html',
    name: 'count.html',
    shortName: 'ctnr.html',
    language: 'html',
    content: `<!-- character count -->
<script type="text/javascript" src="charCount.js">
</script>
<script type="text/javascript">
    $(document).ready(function(){
        $("#link-description").charCount();
    });
</script>
<style type="text/css">
.counter { position: absolute; }
.counter.warning { color: #e40; }
</style>
<!-- count the end too -->`
  },
  {
    id: 'machine.py',
    name: 'machine.py',
    shortName: 'machn.py',
    language: 'python',
    content: `# Moss OS State Machine & Window Spatial Engine
class MossMachine:
    def __init__(self, mode="v2-hybrid"):
        self.mode = mode
        self.windows = ["chrome", "whatsapp", "player", "code", "twitter"]
        self.spring = {"stiffness": 340, "damping": 26}

    def focus(self, app_id):
        if app_id in self.windows:
            self.windows.remove(app_id)
        self.windows.append(app_id)
        return {"focused": app_id, "z_index": len(self.windows)}

    def compute_velocity_tilt(self, vx, vy):
        return round(vx * 0.35, 2), round(-vy * 0.25, 2)

if __name__ == "__main__":
    os = MossMachine()
    print(os.focus("chrome"))`
  },
  {
    id: 'rss.xml',
    name: 'rss.xml',
    shortName: 'rss.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Lucian Marin — Journal</title>
    <link>https://lucianmarin.com/</link>
    <description>Experimental OS UI/UX design &amp; minimalism</description>
    <item>
      <title>Design the Flying Car</title>
      <pubDate>Thu, 01 Nov 2012 17:00:00 GMT</pubDate>
      <guid>https://lucianmarin.com/archive/design-the-flying-car</guid>
    </item>
    <item>
      <title>Moss V2: Chromeless Brand Headers</title>
      <pubDate>Mon, 24 Oct 2022 19:42:00 GMT</pubDate>
      <guid>https://lucianmarin.com/archive/moss-v2</guid>
    </item>
  </channel>
</rss>`
  }
];
