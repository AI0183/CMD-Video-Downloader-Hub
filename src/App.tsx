import { useState, useMemo } from 'react';
import { 
  Terminal as TerminalIcon, 
  Settings, 
  HelpCircle, 
  Copy, 
  Check, 
  Download, 
  Cpu, 
  BookOpen, 
  Youtube, 
  Instagram, 
  Twitter, 
  Video, 
  Layers, 
  Folder, 
  FileVideo, 
  ArrowRight, 
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Info,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DownloadSettings, PlatformMetadata } from './types';

export default function App() {
  // Preset social platforms
  const platforms: PlatformMetadata[] = [
    {
      id: 'youtube',
      name: 'YouTube & Shorts',
      icon: 'youtube',
      defaultUrlPlaceholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tips: [
        'Supports high-definition video formats up to 4K or 8K resolution.',
        'Extracts audio directly into highest pristine-grade MP3/M4A formatting.',
        'Use the `--cookies-from-browser` flag if downloading age-restricted content.'
      ],
      recommendedFlags: ['--embed-metadata', '--embed-thumbnail']
    },
    {
      id: 'instagram',
      name: 'Instagram Reels',
      icon: 'instagram',
      defaultUrlPlaceholder: 'https://www.instagram.com/reel/C3_abcD123/',
      tips: [
        'Requires standard public URLs of Instagram Reels or Feed Video Posts.',
        'Uses direct stream extractors to fetch original MP4s with matched feed bitrate.',
        'If you hit download rate-limits, you can pass custom cookies.'
      ],
      recommendedFlags: ['--no-playlist']
    },
    {
      id: 'tiktok',
      name: 'TikTok Video',
      icon: 'video',
      defaultUrlPlaceholder: 'https://www.tiktok.com/@username/video/7310000000',
      tips: [
        'Downloads original crystal-clear HD formats with zero visual platform watermarks.',
        'Excellent option to parse entire creator profiles and download batch archives.',
        'Embeds author description details and timestamps directly inside file container tag records.'
      ],
      recommendedFlags: ['--no-playlist']
    },
    {
      id: 'twitter',
      name: 'X / Twitter Media',
      icon: 'twitter',
      defaultUrlPlaceholder: 'https://x.com/username/status/1750000000000',
      tips: [
        'Pulls down the absolute maximum resolution stream served by the video player configs.',
        'Make sure status segments are fully written out inside the url query line.'
      ],
      recommendedFlags: []
    },
    {
      id: 'generic',
      name: 'Universal URL',
      icon: 'layers',
      defaultUrlPlaceholder: 'https://vimeo.com/... or https://facebook.com/...',
      tips: [
        'yt-dlp integrates native parsing architectures for over 1,500 streaming web portals.',
        'FFmpeg dynamically muxes split video and audio chunks automatically in the background.',
        'Define a custom user agent to avoid common scraping request rejections.'
      ],
      recommendedFlags: ['--user-agent "Mozilla/5.0"']
    }
  ];

  // User configured settings
  const [settings, setSettings] = useState<DownloadSettings>({
    url: '',
    platform: 'youtube',
    quality: 'best',
    audioFormat: 'mp3',
    savePath: '~/Downloads/Videos',
    useCustomFilename: false,
    filenameTemplate: '%(uploader)s - %(title)s (%(id)s).%(ext)s',
    embedSubtitles: true,
    embedThumbnail: true,
    keepVideo: true,
    playlistOption: 'none',
    customArgs: ''
  });

  // UI state variables
  const [activeTab, setActiveTab] = useState<'generator' | 'installation' | 'troubleshooting'>('generator');
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const [os, setOs] = useState<'windows' | 'macos' | 'linux'>('windows');

  // Simulated queue and logs based on requested design style
  const [activeThreads] = useState([
    { id: 1, name: 'TikTok Reel #72', progress: 42, speed: '6.4 MB/s', eta: '8.2s left' },
    { id: 2, name: 'Insta_Post_44', progress: 0, speed: 'Waiting...', eta: '-' }
  ]);

  const [historyLog] = useState([
    { id: 1, file: 'beach_sunset.mp4', platform: 'Instagram', status: 'success', path: '/Downloads/Instagram' },
    { id: 2, file: 'crypto_interview.mp4', platform: 'Twitter', status: 'success', path: '/Downloads/Twitter' },
    { id: 3, file: 'deleted_vlog.mp4', platform: 'YouTube', status: 'error', path: 'Error: Private Video' }
  ]);

  // Get active platform
  const activePlatformInfo = useMemo(() => {
    return platforms.find(p => p.id === settings.platform) || platforms[0];
  }, [settings.platform]);

  // Set selected platform preset and default placeholder URL if blank
  const handlePlatformChange = (platformId: string) => {
    const nextPlatform = platforms.find(p => p.id === platformId);
    setSettings(prev => ({
      ...prev,
      platform: platformId,
      url: prev.url ? prev.url : (nextPlatform?.defaultUrlPlaceholder || '')
    }));
  };

  // Helper code to handle copy state feedback
  const handleCopy = (text: string, blockId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(blockId);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  // Build the executable yt-dlp command dynamically
  const generatedCommand = useMemo(() => {
    let parts = ['yt-dlp'];

    // Target URL
    const targetUrl = settings.url.trim() || activePlatformInfo.defaultUrlPlaceholder;
    
    // Video quality/Format selection
    if (settings.quality === 'best') {
      parts.push('-f "bestvideo+bestaudio/best"');
    } else if (settings.quality === '1080p') {
      parts.push('-f "bestvideo[height<=1080]+bestaudio/best[height<=1080]"');
    } else if (settings.quality === '720p') {
      parts.push('-f "bestvideo[height<=720]+bestaudio/best[height<=720]"');
    } else if (settings.quality === '480p') {
      parts.push('-f "bestvideo[height<=480]+bestaudio/best[height<=480]"');
    } else if (settings.quality === 'audio') {
      const audioFlag = settings.audioFormat === 'mp3' ? 'mp3' : settings.audioFormat === 'm4a' ? 'm4a' : 'wav';
      parts.push('-x');
      parts.push(`--audio-format ${audioFlag}`);
      parts.push('--audio-quality 0'); // best quality variable
    }

    // Embed Subtitles (Merge standard default tracks)
    if (settings.quality !== 'audio' && settings.embedSubtitles) {
      parts.push('--write-subs');
      parts.push('--write-auto-subs');
      parts.push('--embed-subs');
    }

    // Attach high-res Thumbnail Artwork in the file stream container metadata
    if (settings.embedThumbnail) {
      parts.push('--embed-thumbnail');
    }

    // Merge system metadata details (uploader name, dynamic descriptions)
    parts.push('--embed-metadata');

    // Platform-specific defaults / recommendations
    if (activePlatformInfo.recommendedFlags.length > 0) {
      parts.push(...activePlatformInfo.recommendedFlags);
    }

    // Target Output path and custom file nomenclature setting
    const pathDelimiter = os === 'windows' ? '\\' : '/';
    let pathSnippet = settings.savePath.trim();
    if (pathSnippet.endsWith(pathDelimiter)) {
      pathSnippet = pathSnippet.slice(0, -1);
    }

    if (settings.useCustomFilename && settings.filenameTemplate) {
      parts.push(`-o "${pathSnippet}${pathDelimiter}${settings.filenameTemplate}"`);
    } else {
      // Default clean naming system
      parts.push(`-o "${pathSnippet}${pathDelimiter}%(title)s.%(ext)s"`);
    }

    // Limit download logic to single items / playlists
    if (settings.playlistOption === 'none') {
      parts.push('--no-playlist');
    }

    // Merge FFmpeg path settings automatically for windows or fallback systems
    if (settings.quality !== 'audio') {
      parts.push('--merge-output-format mp4');
    }

    // Custom user flags if specified
    if (settings.customArgs.trim()) {
      parts.push(settings.customArgs.trim());
    }

    // Finally append target URL at the end of the command call
    parts.push(`"${targetUrl}"`);

    return parts.join(' ');
  }, [settings, activePlatformInfo, os]);

  const selectPlatformIcon = (iconName: string) => {
    switch (iconName) {
      case 'youtube':
        return <Youtube className="w-5 h-5 text-rose-500" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-blue-400" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-indigo-400" />;
      default:
        return <Video className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-200 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-100">
      
      {/* Top Navigation / Status Bar (Direct Professional Polish Style) */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#16191E] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
            DL
          </div>
          <div>
            <span className="font-semibold tracking-tight text-base text-white flex items-center gap-2">
              VeloDL CLI Studio
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10 text-slate-400 font-mono">v2.4.1-stable</span>
            </span>
            <p className="text-[11px] text-slate-400">Social video cmd utility generator & local storage hub</p>
          </div>
        </div>

        {/* Dynamic Navigation Tabs inside modern header wrapper */}
        <div className="flex bg-[#111418] p-1 rounded-xl border border-white/5">
          <button 
            id="tab-generator"
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'generator' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Command Builder
          </button>
          <button 
            id="tab-installation"
            onClick={() => setActiveTab('installation')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'installation' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            1-Min Setup Guide
          </button>
          <button 
            id="tab-troubleshooting"
            onClick={() => setActiveTab('troubleshooting')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'troubleshooting' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            CLI Expert Tips
          </button>
        </div>

        {/* Storage stats alignment as requested by theme */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Storage Path</span>
            <span className="text-xs font-mono text-blue-400 max-w-[200px] truncate">{settings.savePath}</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10"></div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Free Space</span>
            <span className="text-xs text-slate-300">412.8 GB / 1 TB</span>
          </div>
        </div>
      </header>

      {/* Main Grid Wrapper */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
        
        {/* TAB 1: GENERATOR & CONFIG WORKSTATION */}
        {activeTab === 'generator' && (
          <>
            {/* Options Dashboard Panel (Left Column) */}
            <div className="lg:col-span-5 flex flex-col space-y-5" id="settings-panel">
              
              {/* Option block 1: Input URL */}
              <div className="bg-[#16191E] rounded-2xl border border-white/5 p-5 flex flex-col space-y-4">
                
                {/* Section Title */}
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-3.5 bg-blue-500 rounded-sm inline-block"></span>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">1. Target Feed & Platform</h2>
                  </div>
                  <span className="text-[10px] text-blue-400/80 font-mono font-medium">Step A</span>
                </div>

                {/* Platforms Picker */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[11px] font-semibold text-slate-400">Social Scraper Engine</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {platforms.map((plat) => (
                      <button
                        key={plat.id}
                        id={`btn-platform-${plat.id}`}
                        onClick={() => handlePlatformChange(plat.id)}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                          settings.platform === plat.id 
                            ? 'bg-blue-600/10 border-blue-500/50 text-white font-medium ring-1 ring-blue-500/15' 
                            : 'bg-[#111418] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-[#111418]/80'
                        }`}
                      >
                        {selectPlatformIcon(plat.icon)}
                        <span className="text-[10px] truncate w-full">{plat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* URL input field */}
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="video-url" className="text-[11px] font-semibold text-slate-400">Media URL</label>
                    <span className="text-[9px] text-slate-500 font-mono">Auto-detect format</span>
                  </div>
                  <input
                    id="video-url"
                    type="url"
                    value={settings.url}
                    onChange={(e) => setSettings(prev => ({ ...prev, url: e.target.value }))}
                    placeholder={activePlatformInfo.defaultUrlPlaceholder}
                    className="w-full bg-[#111418] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                  />
                </div>

              </div>

              {/* Option block 2: Parameters & Output Path details */}
              <div className="bg-[#16191E] rounded-2xl border border-white/5 p-5 flex flex-col space-y-4">
                
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-3.5 bg-blue-500 rounded-sm inline-block"></span>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">2. Device Target Storage</h2>
                  </div>
                  <span className="text-[10px] text-blue-400/80 font-mono font-medium">Step B</span>
                </div>

                {/* Target computer OS selection */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">Terminal Shell Profile</label>
                  <div className="grid grid-cols-3 gap-1 bg-[#111418] p-1 rounded-xl border border-white/5">
                    {(['windows', 'macos', 'linux'] as const).map((osType) => (
                      <button
                        key={osType}
                        id={`btn-os-${osType}`}
                        onClick={() => {
                          setOs(osType);
                          if (osType === 'windows' && settings.savePath.startsWith('~/')) {
                            setSettings(prev => ({ ...prev, savePath: 'C:\\Users\\YourUsername\\Videos' }));
                          } else if (osType !== 'windows' && settings.savePath.includes('C:\\')) {
                            setSettings(prev => ({ ...prev, savePath: '~/Downloads/Videos' }));
                          }
                        }}
                        className={`py-1 text-[11px] rounded-lg font-medium capitalize transition-all ${
                          os === osType 
                            ? 'bg-blue-600 text-white font-semibold' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {osType}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Physical Location */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="save-path" className="text-[11px] font-semibold text-slate-400">Save Directory Path</label>
                  <div className="relative">
                    <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      id="save-path"
                      type="text"
                      value={settings.savePath}
                      onChange={(e) => setSettings(prev => ({ ...prev, savePath: e.target.value }))}
                      placeholder={os === 'windows' ? 'C:\\Users\\YourUsername\\Videos' : '~/Downloads/Videos'}
                      className="w-full bg-[#111418] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    All downloaded streams will merge and write directly to this device storage coordinate.
                  </p>
                </div>

                {/* Format selection */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[11px] font-semibold text-slate-400">Download Resolution / Quality</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {(['best', '1080p', '720p', '480p', 'audio'] as const).map((q) => (
                      <button
                        key={q}
                        id={`btn-quality-${q}`}
                        onClick={() => setSettings(prev => ({ ...prev, quality: q }))}
                        className={`py-1.5 rounded-lg text-center border text-[11px] font-medium transition-all ${
                          settings.quality === q 
                            ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' 
                            : 'bg-[#111418] border-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {q === 'best' && 'Max HD'}
                        {q === '1080p' && '1080p'}
                        {q === '720p' && '720p'}
                        {q === '480p' && '480p'}
                        {q === 'audio' && 'MP3 Audio'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio configuration panel if necessary */}
                {settings.quality === 'audio' && (
                  <div className="p-3 bg-[#111418] rounded-xl border border-white/5 flex flex-col space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400">Encoder</span>
                      <div className="flex bg-[#16191E] p-0.5 rounded-lg border border-white/5">
                        {['mp3', 'm4a', 'wav'].map((formatOpt) => (
                          <button
                            key={formatOpt}
                            onClick={() => setSettings(prev => ({ ...prev, audioFormat: formatOpt as any }))}
                            className={`px-2 py-0.5 text-[10px] rounded uppercase font-mono ${
                              settings.audioFormat === formatOpt ? 'bg-blue-600 text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {formatOpt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Advanced parameters selectors */}
                <div className="flex flex-col space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2 bg-[#111418] p-2.5 rounded-xl border border-white/5 cursor-pointer selection:bg-transparent">
                      <input
                        type="checkbox"
                        checked={settings.embedSubtitles}
                        onChange={(e) => setSettings(prev => ({ ...prev, embedSubtitles: e.target.checked }))}
                        className="rounded bg-[#16191E] border-white/10 text-blue-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                      />
                      <span className="text-[11px] text-slate-300">Embed Subtitles</span>
                    </label>

                    <label className="flex items-center space-x-2 bg-[#111418] p-2.5 rounded-xl border border-white/5 cursor-pointer selection:bg-transparent">
                      <input
                        type="checkbox"
                        checked={settings.embedThumbnail}
                        onChange={(e) => setSettings(prev => ({ ...prev, embedThumbnail: e.target.checked }))}
                        className="rounded bg-[#16191E] border-white/10 text-blue-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                      />
                      <span className="text-[11px] text-slate-300">Add Thumbnail</span>
                    </label>
                  </div>

                  {/* Filename builder */}
                  <div className="flex flex-col space-y-1.5 pt-1">
                    <label className="flex items-center justify-between cursor-pointer select-none">
                      <span className="text-[11px] font-semibold text-slate-400">Custom Filename Syntax</span>
                      <input
                        type="checkbox"
                        checked={settings.useCustomFilename}
                        onChange={(e) => setSettings(prev => ({ ...prev, useCustomFilename: e.target.checked }))}
                        className="rounded bg-[#16191E] border-white/10 text-blue-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                      />
                    </label>
                    {settings.useCustomFilename && (
                      <input
                        type="text"
                        value={settings.filenameTemplate}
                        onChange={(e) => setSettings(prev => ({ ...prev, filenameTemplate: e.target.value }))}
                        className="w-full bg-[#111418] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono"
                      />
                    )}
                  </div>
                </div>

              </div>

              {/* Active Threads Queue Widget (Extracted from requested Design HTML) */}
              <div className="bg-[#16191E] rounded-2xl border border-white/5 p-4 flex flex-col space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active CLI Threads</span>
                  <span className="text-[10px] text-blue-400 font-mono">MOCK MONITOR</span>
                </div>
                
                <div className="space-y-2.5">
                  {activeThreads.map((thread) => (
                    <div key={thread.id} className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-xs font-medium text-slate-200">{thread.name}</span>
                        <span className="text-[10px] font-mono text-blue-400">{thread.progress > 0 ? `${thread.progress}%` : 'QUEUED'}</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${thread.progress}%` }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-[9px] text-slate-500">
                        <span>{thread.speed}</span>
                        <span>{thread.eta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Generated Command Terminal Workspace (Right Column) */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              
              {/* Terminal Display Block */}
              <div className="bg-black rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-full min-h-[460px]">
                
                {/* Visual Terminal Header bar */}
                <div className="h-9 bg-[#1E1E1E] border-b border-white/5 flex items-center px-4 justify-between shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">session: default-zsh (80x24)</div>
                  <div className="w-12"></div>
                </div>

                {/* CLI Preview Box & Command Box */}
                <div className="flex-1 p-5 font-mono text-xs leading-relaxed overflow-y-auto flex flex-col justify-between">
                  
                  <div className="space-y-4">
                    {/* Simulated download steps to provide terminal context */}
                    <div>
                      <p className="text-green-400 mb-1">
                        <span className="opacity-60">admin@vdl-studio ~ %</span> yt-dlp --check-updates
                      </p>
                      <p className="text-slate-500 mb-2">Checking manifest versions... yt-dlp is up-to-date (2026.04.12)</p>
                      
                      <p className="text-green-400 mb-1">
                        <span className="opacity-60">admin@vdl-studio ~ %</span> {`velodl config --set save_path "${settings.savePath}"`}
                      </p>
                      <p className="text-blue-400 mb-4">[INFO] Output path configured successfully to client storage.</p>
                    </div>

                    <div className="border-t border-white/5 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Dynamic Executable Script</span>
                        <span className="text-[9px] bg-blue-500/15 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-500/25">READY</span>
                      </div>

                      {/* Display the executable code block */}
                      <div className="relative group bg-white/5 rounded-xl border border-white/5 p-4 flex items-center min-h-[140px]">
                        <code className="text-blue-300 font-mono text-xs sm:text-sm leading-relaxed block break-all whitespace-pre-wrap pr-12 w-full">
                          {generatedCommand}
                        </code>

                        {/* Direct Copy Button inside absolute grid coordinates */}
                        <button
                          onClick={() => handleCopy(generatedCommand, 'terminal-copier')}
                          className="absolute right-3.5 top-3.5 p-2 rounded-lg bg-black/80 border border-white/10 text-slate-400 hover:text-white hover:bg-black transition-all"
                          title="Copy command to clipboard"
                          id="btn-copy-terminal"
                        >
                          {copiedBlock === 'terminal-copier' ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Quick Command Execution guidelines */}
                    <div className="mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
                        <HardDrive className="w-3 h-3 text-blue-400" /> Storage Destination Details:
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Output Destination: {settings.savePath}<br />
                        Muxer Requirement: FFmpeg (needed to auto-combine high-bitrate video streams)<br />
                        File output naming template code: <span className="text-slate-400">{settings.useCustomFilename ? settings.filenameTemplate : '%(title)s.%(ext)s'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions & Copy buttons */}
                  <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Press enter inside your cmd shell to initialize.
                    </span>

                    <button
                      id="btn-trigger-copy"
                      onClick={() => handleCopy(generatedCommand, 'terminal-copier')}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      {copiedBlock === 'terminal-copier' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-300" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Shell script
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
              
              {/* Active Platform Tips Card (Formatted cleanly) */}
              <div className="bg-[#16191E] border border-white/5 rounded-xl p-4 flex flex-col space-y-3">
                <div className="flex items-center gap-2">
                  {selectPlatformIcon(activePlatformInfo.icon)}
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{activePlatformInfo.name} Extracted Specifications</h3>
                </div>
                <ul className="space-y-1.5">
                  {activePlatformInfo.tips.map((tip, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start space-x-2">
                      <span className="text-blue-500 text-xs font-bold">•</span>
                      <span className="leading-normal">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* History log segment (from design HTML layout) */}
              <div className="bg-[#16191E] border border-white/5 rounded-xl p-4 flex flex-col space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">History Log</h3>
                <div className="space-y-2">
                  {historyLog.map((log) => (
                    <div key={log.id} className="flex gap-3 text-xs">
                      <div className={`mt-1 w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500/50'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <span className="text-slate-300 font-medium truncate">{log.file}</span>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">{log.platform}</span>
                        </div>
                        <p className={`text-[10px] ${log.status === 'success' ? 'text-slate-500' : 'text-red-400'}`}>{log.path}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}

        {/* TAB 2: 1-MINUTE INSTALLATION SETUP GUIDE */}
        {activeTab === 'installation' && (
          <div className="lg:col-span-12 flex flex-col space-y-6 max-w-4xl mx-auto w-full" id="install-guide-container">
            
            <div className="bg-[#16191E] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col space-y-6">
              
              {/* Installation Title intro */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-blue-400">
                  <Download className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Fast CLI Configuration</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Configure yt-dlp & FFmpeg onto your Device</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  To download HD social media videos from custom CMD prompts directly to your physical file system, your computer needs two open-source terminal utilities. Both are lightweight, safe, and completely free.
                </p>
              </div>

              {/* Steps Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Utility 1 */}
                <div className="bg-[#111418] p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-550/20">
                        STEP 1 — DOWNLOAD ENGINE
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">yt-dlp</span>
                    </div>

                    <h3 className="text-base font-bold text-white">The Media Downloader Engine</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This single-binary command line executable intercepts media URLs, translates backend playlist sequences, and handles media retrieval on over 1,500 platforms.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col space-y-2">
                    <span className="text-[11px] font-bold text-slate-350">Fast Package Manager Command:</span>
                    
                    {/* OS specific instructions */}
                    <div className="bg-black p-3 rounded-xl border border-white/5 flex items-center justify-between">
                      <code className="text-xs text-blue-400 font-mono">
                        {os === 'windows' && 'winget install yt-dlp'}
                        {os === 'macos' && 'brew install yt-dlp'}
                        {os === 'linux' && 'sudo apt install yt-dlp'}
                      </code>
                      <button
                        onClick={() => handleCopy(
                          os === 'windows' ? 'winget install yt-dlp' : os === 'macos' ? 'brew install yt-dlp' : 'sudo apt install yt-dlp',
                          'ytdlp-install'
                        )}
                        className="text-slate-500 hover:text-white p-1 transition-all"
                        id="btn-copy-install-dl"
                      >
                        {copiedBlock === 'ytdlp-install' ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Utility 2 */}
                <div className="bg-[#111418] p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-550/20">
                        STEP 2 — MERGING TOOL
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">ffmpeg</span>
                    </div>

                    <h3 className="text-base font-bold text-white">FFmpeg (Highly Recommended)</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Social networks host video and high-quality audio streams separately to save bandwidth. FFmpeg dynamically combines them upon download into a single cohesive MP4.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col space-y-2">
                    <span className="text-[11px] font-bold text-slate-350">Fast Package Manager Command:</span>
                    
                    <div className="bg-black p-3 rounded-xl border border-white/5 flex items-center justify-between">
                      <code className="text-xs text-indigo-400 font-mono">
                        {os === 'windows' && 'winget install FFmpeg'}
                        {os === 'macos' && 'brew install ffmpeg'}
                        {os === 'linux' && 'sudo apt install ffmpeg'}
                      </code>
                      <button
                        onClick={() => handleCopy(
                          os === 'windows' ? 'winget install FFmpeg' : os === 'macos' ? 'brew install ffmpeg' : 'sudo apt install ffmpeg',
                          'ffmpeg-install'
                        )}
                        className="text-slate-500 hover:text-white p-1 transition-all"
                        id="btn-copy-install-ff"
                      >
                        {copiedBlock === 'ffmpeg-install' ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Comprehensive Manual Instructions */}
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Manual Binary configuration (No Installer Option)</h3>
                
                <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
                  <p>
                    <strong>Don't want to use package managers?</strong> Read this manual checklist:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-slate-400">
                    <li>Download the latest prebuilt Windows binary executable file container (<code className="text-blue-400 font-mono">yt-dlp.exe</code>) directly from the official GitHub releases repository page.</li>
                    <li>Download preconfigured static FFmpeg binaries from the official <a href="https://ffmpeg.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">FFmpeg Web Portal <ExternalLink className="w-3 h-3" /></a>.</li>
                    <li>Move both of the executable binaries (<code className="text-white font-mono">yt-dlp.exe</code> and <code className="text-white font-mono">ffmpeg.exe</code>) inside a unified storage directory, e.g., <code className="text-blue-400 font-mono">C:\cli-tools\</code></li>
                    <li>Add the path <code className="text-white font-mono">C:\cli-tools\</code> to your system's environmental variable Path parameters list so your console can run the command from any filesystem directory location.</li>
                  </ol>
                </div>
              </div>

              {/* Ready button section */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTab('generator')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  Configure My Command Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: CLI TROUBLESHOOTING & CUSTOM TRICKS */}
        {activeTab === 'troubleshooting' && (
          <div className="lg:col-span-12 flex flex-col space-y-6 max-w-4xl mx-auto w-full" id="trouble-guide-container">
            
            <div className="bg-[#16191E] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Expert Mode Guide</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Pro CMD Tricks & Command Customization</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Supercharge your terminal utility commands to handle complicated scenarios, batch parsing, metadata injection, and secure access bypasses.
                </p>
              </div>

              {/* Grid of issues */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                
                {/* Tip 1 */}
                <div className="p-5 bg-[#111418] rounded-2xl border border-white/5 space-y-2.5">
                  <div className="text-xs font-bold text-blue-400 font-mono">01 — FULL CHANNEL/PLAYLIST DOWNLOAD</div>
                  <h4 className="text-sm font-semibold text-white">How do I download whole folders or arrays of videos?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Simply supply the channel media page URL or complete public collection playlist URL in place of the single video link format.
                  </p>
                  <div className="bg-black p-2 text-xs font-mono rounded text-slate-300 break-all select-all">
                    yt-dlp --yes-playlist "https://www.youtube.com/playlist?list=PL..."
                  </div>
                </div>

                {/* Tip 2 */}
                <div className="p-5 bg-[#111418] rounded-2xl border border-white/5 space-y-2.5">
                  <div className="text-xs font-bold text-blue-400 font-mono">02 — RESTRICTED / PRIVATE VIDEO BYPASS</div>
                  <h4 className="text-sm font-semibold text-white">Protected/Age-restricted feeds block download</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Instruct yt-dlp to read active session authentication tokens from your local desktop browser to authenticate safe access.
                  </p>
                  <div className="bg-black p-2 text-xs font-mono rounded text-slate-300 break-all select-all">
                    yt-dlp --cookies-from-browser chrome "https://platform.com/video"
                  </div>
                </div>

                {/* Tip 3 */}
                <div className="p-5 bg-[#111418] rounded-2xl border border-white/5 space-y-2.5">
                  <div className="text-xs font-bold text-blue-400 font-mono">03 — ONLY EXTRACT HIGHEST MP3 AUDIO</div>
                  <h4 className="text-sm font-semibold text-white">Create direct local MP3 albums seamlessly</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Extract absolute highest-grade audio formats, embed catalog tags, inject artist metadata, and insert cover-art from the thumbnail.
                  </p>
                  <div className="bg-black p-2 text-xs font-mono rounded text-slate-300 break-all select-all">
                    yt-dlp -x --audio-format mp3 --audio-quality 0 --embed-thumbnail "https://..."
                  </div>
                </div>

                {/* Tip 4 */}
                <div className="p-5 bg-[#111418] rounded-2xl border border-white/5 space-y-2.5">
                  <div className="text-xs font-bold text-blue-400 font-mono">04 — BULK DOWNLOAD TXT LIST</div>
                  <h4 className="text-sm font-semibold text-white">Download list files overnight automatically</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Keep a text file with one target URL listed on each line, and pass the file container argument path to yt-dlp.
                  </p>
                  <div className="bg-black p-2 text-xs font-mono rounded text-slate-300 break-all select-all">
                    yt-dlp -a "C:\Users\YourUsername\Downloads\urls.txt"
                  </div>
                </div>

              </div>

              {/* Troubleshooting QA */}
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Frequently Asked CMD Errors</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-rose-400">Error: 'ffmpeg' or 'ffprobe' not found. Correcting output...</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This occurs when attempting to compile separate visual & audio streams without installing the FFmpeg program on your machine, or if command-prompt is not configured to read its executable file directory. Refer back to the Setup Guide to install FFmpeg natively.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-rose-400">Error: HTTP Error 403 / Forbidden Access</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Social platforms periodically revise security parameters to discourage scrapers. Ensure you stay updated by running the updater argument in command-line: <code className="bg-slate-900 text-blue-400 px-1 font-mono">yt-dlp -U</code>. This keeps extraction patches operational.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Styled Footer (Professional Polish layout compatible) */}
      <footer className="h-10 bg-[#0C0E11] border-t border-white/5 flex items-center justify-between px-6 text-[10px] font-mono text-slate-600 shrink-0 mt-6 select-none">
        <div className="flex gap-4">
          <span>SSH: Localhost</span>
          <span>Port: 3000</span>
          <span>Target-OS: <strong className="text-blue-500 font-bold uppercase">{os}</strong></span>
        </div>
        <div className="flex gap-4">
          <span>Auto-Update Engine: ON</span>
          <span className="text-blue-500 font-bold">System Ready</span>
        </div>
      </footer>

    </div>
  );
}
