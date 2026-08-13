import React, { useRef } from 'react';
import { Camera, Upload, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

interface PhotoUploaderProps {
  photoCloseUp: string;
  photoWideAngle: string;
  photoTeamOnSite: string;
  videoUrl: string;
  onChange: (field: any, value: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photoCloseUp,
  photoWideAngle,
  photoTeamOnSite,
  onChange
}) => {
  const closeUpInputRef = useRef<HTMLInputElement>(null);
  const wideAngleInputRef = useRef<HTMLInputElement>(null);
  const teamInputRef = useRef<HTMLInputElement>(null);

  // Client-side Canvas Image Compressor (Reduces 10MB phone camera photos to ~100KB JPEGs)
  const compressAndProcessPhoto = (file: File, fieldName: string) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1000; // Max dimension in px

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          onChange(fieldName, compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      compressAndProcessPhoto(file, fieldName);
    }
  };

  const isAllPhotosUploaded = Boolean(photoCloseUp && photoWideAngle && photoTeamOnSite);

  return (
    <div className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4AF37]/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#FFD700]" />
            <h4 className="text-lg font-bold text-white font-serif">
              Authenticity Evidence: 3 Mandatory Field Photos
            </h4>
          </div>
          <p className="text-xs text-amber-200/70 mt-1">
            Capture photos directly on location to verify physical observation and team authenticity.
          </p>
        </div>

        {/* Authenticity Badge Status */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
          isAllPhotosUploaded
            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
            : 'bg-amber-950 text-amber-300 border border-amber-500/50'
        }`}>
          {isAllPhotosUploaded ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>3/3 Photos Verified</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>
                {[photoCloseUp, photoWideAngle, photoTeamOnSite].filter(Boolean).length}/3 Uploaded
              </span>
            </>
          )}
        </div>
      </div>

      {/* Grid of 3 Photo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Photo 1: Close-up */}
        <div className="bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl p-4 flex flex-col justify-between space-y-3 relative group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider">
                Photo 1 (Mandatory)
              </span>
              {photoCloseUp && (
                <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  Uploaded
                </span>
              )}
            </div>
            <h5 className="text-sm font-bold text-white mb-1">Close-Up of Problem</h5>
            <p className="text-[11px] text-amber-100/70 leading-snug">
              Shows the specific issue clearly (e.g. rusted gate, pothole, plastic waste).
            </p>
          </div>

          <div className="mt-3">
            {photoCloseUp ? (
              <div className="relative rounded-lg overflow-hidden border border-[#D4AF37]/40">
                <img src={photoCloseUp} alt="Close up preview" className="w-full h-36 object-cover" />
                <button
                  type="button"
                  onClick={() => onChange('photoCloseUp', '')}
                  className="absolute top-2 right-2 bg-rose-900/90 text-rose-200 p-1.5 rounded-full hover:bg-rose-800 transition"
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => closeUpInputRef.current?.click()}
                className="w-full h-36 border-2 border-dashed border-[#D4AF37]/40 rounded-lg flex flex-col items-center justify-center space-y-2 text-amber-200/70 hover:text-[#FFD700] hover:border-[#FFD700] transition bg-[#2A0000]/50"
              >
                <Upload className="w-6 h-6" />
                <span className="text-xs font-bold">Upload Close-Up Photo</span>
              </button>
            )}
            <input
              ref={closeUpInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'photoCloseUp')}
            />
          </div>
        </div>

        {/* Photo 2: Wide-Angle */}
        <div className="bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl p-4 flex flex-col justify-between space-y-3 relative group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider">
                Photo 2 (Mandatory)
              </span>
              {photoWideAngle && (
                <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  Uploaded
                </span>
              )}
            </div>
            <h5 className="text-sm font-bold text-white mb-1">Wide-Angle Context</h5>
            <p className="text-[11px] text-amber-100/70 leading-snug">
              Shows surrounding environment (school yard, street, village landmark).
            </p>
          </div>

          <div className="mt-3">
            {photoWideAngle ? (
              <div className="relative rounded-lg overflow-hidden border border-[#D4AF37]/40">
                <img src={photoWideAngle} alt="Wide angle preview" className="w-full h-36 object-cover" />
                <button
                  type="button"
                  onClick={() => onChange('photoWideAngle', '')}
                  className="absolute top-2 right-2 bg-rose-900/90 text-rose-200 p-1.5 rounded-full hover:bg-rose-800 transition"
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => wideAngleInputRef.current?.click()}
                className="w-full h-36 border-2 border-dashed border-[#D4AF37]/40 rounded-lg flex flex-col items-center justify-center space-y-2 text-amber-200/70 hover:text-[#FFD700] hover:border-[#FFD700] transition bg-[#2A0000]/50"
              >
                <Upload className="w-6 h-6" />
                <span className="text-xs font-bold">Upload Wide-Angle Photo</span>
              </button>
            )}
            <input
              ref={wideAngleInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'photoWideAngle')}
            />
          </div>
        </div>

        {/* Photo 3: Team On-Site */}
        <div className="bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl p-4 flex flex-col justify-between space-y-3 relative group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider">
                Photo 3 (Mandatory)
              </span>
              {photoTeamOnSite && (
                <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  Uploaded
                </span>
              )}
            </div>
            <h5 className="text-sm font-bold text-white mb-1">Team On-Site Photo</h5>
            <p className="text-[11px] text-amber-100/70 leading-snug">
              Shows your team standing near the problem site observing the issue.
            </p>
          </div>

          <div className="mt-3">
            {photoTeamOnSite ? (
              <div className="relative rounded-lg overflow-hidden border border-[#D4AF37]/40">
                <img src={photoTeamOnSite} alt="Team on site preview" className="w-full h-36 object-cover" />
                <button
                  type="button"
                  onClick={() => onChange('photoTeamOnSite', '')}
                  className="absolute top-2 right-2 bg-rose-900/90 text-rose-200 p-1.5 rounded-full hover:bg-rose-800 transition"
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => teamInputRef.current?.click()}
                className="w-full h-36 border-2 border-dashed border-[#D4AF37]/40 rounded-lg flex flex-col items-center justify-center space-y-2 text-amber-200/70 hover:text-[#FFD700] hover:border-[#FFD700] transition bg-[#2A0000]/50"
              >
                <Upload className="w-6 h-6" />
                <span className="text-xs font-bold">Upload Team On-Site Photo</span>
              </button>
            )}
            <input
              ref={teamInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'photoTeamOnSite')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
