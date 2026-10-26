export interface ServerNode {
  id: string;
  name: string;
  region: string;
  host: string;
  status: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE';
  uptime: string;
  cpu: number;
  memory: number;
  gpuNvenc: number;
  activeIngests: number;
  activeEgressSubscribers: number;
  bitrateInMbps: number;
  bitrateOutMbps: number;
  packetLoss: string;
  rttMs: number;
}

export interface IngestSession {
  id: string;
  streamName: string;
  streamKey: string;
  publisherIp: string;
  codec: string;
  resolution: string;
  fps: number;
  bitrateKbps: number;
  watermarkAlpha: number;
  watermarkMode: 'imperceptible' | 'dual_track' | 'visible_hud' | 'spectral_reveal';
  subscriberId: string;
  subscriberEmail: string;
  sessionToken: string;
  geoRegion: string;
  startTime: string;
  bytesReceivedMb: number;
  isSecured: boolean;
}

export interface LeakIncident {
  id: string;
  title: string;
  sourceType: string;
  detectedPayload: {
    subscriberId: string;
    subscriberEmail: string;
    clientIp: string;
    sessionToken: string;
    geoRegion: string;
    timestamp: string;
  };
  ber: number;
  psnr: number;
  ssim: number;
  confidence: number;
  tamperApplied: {
    compressionCrf: number;
    cropPercent: number;
    rotationDeg: number;
    noiseAmount: number;
  };
}

export interface WatermarkOptimizationResult {
  recommendedAlpha: number;
  spatialTransform: string;
  temporalCadenceFrames: number;
  eccAlgorithm: string;
  estimatedPSNR: string;
  estimatedSSIM: string;
  collusionResistantCode: string;
  rationale: string;
}
