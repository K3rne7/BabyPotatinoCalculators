

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Icons
const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>);
const LoadingSpinner = () => (<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>);
const SourceIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>);
const CameraIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const GalleryIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);

interface Source { uri: string; title: string; }
interface ImageData { dataUrl: string; mimeType: string; }

// Helper to convert data URL to parts for Gemini API
const dataUrlToParts = (dataUrl: string) => {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1];
    const base64Data = parts[1];
    return { mimeType, base64Data };
};

const CameraModal: React.FC<{
    onClose: () => void;
    onCapture: (dataUrl: string) => void;
    onError: (error: Error) => void;
}> = ({ onClose, onCapture, onError }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                if (err instanceof Error) {
                    onError(err);
                }
                onClose();
            }
        };
        startCamera();
        return () => {
            streamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, [onClose, onError]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            onCapture(canvas.toDataURL('image/jpeg'));
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
            <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-[80vh] rounded-lg"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="flex gap-4 mt-4">
                <button onClick={handleCapture} className="px-6 py-2 bg-primary text-white rounded-lg font-semibold">Capture</button>
                <button onClick={onClose} className="px-6 py-2 bg-base-300 rounded-lg font-semibold">Cancel</button>
            </div>
        </div>
    );
};


const AICalculator: React.FC = () => {
    const [query, setQuery] = useState('');
    const [image, setImage] = useState<ImageData | null>(null);
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [sources, setSources] = useState<Source[]>([]);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [cameraError, setCameraError] = useState('');

    const handleCameraError = useCallback((err: Error) => {
        if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            setCameraError('No camera found. Please connect a camera and try again.');
        } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setCameraError('Camera access was denied. Please allow camera access in your browser settings.');
        } else {
            setCameraError('An error occurred while accessing the camera.');
        }
        window.setTimeout(() => setCameraError(''), 5000);
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage({
                    dataUrl: reader.result as string,
                    mimeType: file.type
                });
            };
            reader.readAsDataURL(file);
        }
        // Reset file input to allow selecting the same file again
        event.target.value = '';
    };

    const handleCameraClick = async () => {
        // Check if Permissions API is supported for better UX
        if (navigator.permissions && navigator.permissions.query) {
            try {
                const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });

                if (permissionStatus.state === 'denied') {
                    setCameraError('Camera access is denied. Please enable it in your browser or system settings to use this feature.');
                    window.setTimeout(() => setCameraError(''), 7000); // Show for longer
                    return; // Stop here if permission is denied
                }
                // If 'granted' or 'prompt', proceed
            } catch (err) {
                console.warn("Could not query camera permission status. Proceeding directly.", err);
                // Fallback for browsers that don't support this query (e.g., older Safari).
            }
        }
        // Proceed to open the camera modal
        setIsCameraOpen(true);
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || (!query.trim() && !image)) return;

        setIsLoading(true);
        setError('');
        setResponse('');
        setSources([]);

        try {
            if (!process.env.API_KEY) throw new Error("API_KEY environment variable not set.");
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const parts: any[] = [{ text: query }];
            
            if (image) {
                const { mimeType, base64Data } = dataUrlToParts(image.dataUrl);
                if (mimeType && base64Data) {
                    parts.push({ inlineData: { mimeType, data: base64Data } });
                }
            }

            const genAIResponse: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts },
                config: {
                    tools: [{ googleSearch: {} }],
                    systemInstruction: `You are a helpful AI-powered calculator assistant.
- If the user provides an image, analyze it in conjunction with their text query. This could be a math problem, a physics diagram, a chemical formula, or any scientific concept. Provide a step-by-step solution or a clear explanation.
- For text-only calculations, provide the numeric answer directly, followed by an explanation if necessary.
- For general knowledge questions, provide a concise and accurate answer.
- Use Google Search for questions about recent events, real-time information, or topics requiring up-to-date data.`
                }
            });

            setResponse(genAIResponse.text);

            const groundingMetadata = genAIResponse.candidates?.[0]?.groundingMetadata;
            if (groundingMetadata?.groundingChunks) {
                const webSources: Source[] = groundingMetadata.groundingChunks
                    .filter(chunk => chunk.web).map(chunk => ({ uri: chunk.web!.uri, title: chunk.web!.title }));
                setSources(webSources);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [query, isLoading, image]);
    
    const renderOutput = () => {
        if (isLoading) return <div className="flex items-center justify-center p-4 h-full"><div className="flex items-center gap-2 text-base-content/70"><LoadingSpinner /><span>Thinking...</span></div></div>;
        if (error) return <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm"><strong>Error:</strong> {error}</div>;
        if (response) return (
            <div className="space-y-4">
                <div className="markdown-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                            table: ({node, ...props}) => <div className="overflow-x-auto"><table {...props} /></div>
                        }}
                    >
                        {response}
                    </ReactMarkdown>
                </div>
                {sources.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center"><SourceIcon /> Sources:</h3>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            {sources.map((s, i) => (
                                <li key={i}>
                                    <a href={s.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all" title={s.uri}>
                                        {s.title || new URL(s.uri).hostname}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
        return (
             <div className="flex flex-col items-center justify-center h-full text-center text-base-content/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                <p className="font-semibold text-lg">Ask anything or attach an image</p>
                <p className="text-sm mt-1">e.g., "Solve for x in the attached equation."</p>
             </div>
        );
    }

    return (
        <div className="flex flex-col h-full gap-4 relative">
            {cameraError && (
                <div 
                    role="alert"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md bg-red-500 text-white p-3 rounded-lg shadow-lg z-10 text-sm text-center animate-fade-in-up"
                >
                    {cameraError}
                </div>
            )}
            
            <div className="flex-grow bg-base-100 rounded-lg p-4 overflow-y-auto result-scroll">
                {renderOutput()}
            </div>
            
            <form onSubmit={handleSubmit} className="flex-shrink-0 flex flex-col gap-3">
                {image && (
                    <div className="relative w-28 h-28 self-start ml-2 flex-shrink-0">
                        <img src={image.dataUrl} alt="Query preview" className="w-full h-full object-cover rounded-lg shadow-md" />
                        <button type="button" onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-base-300 text-base-content rounded-full p-1 shadow-lg hover:bg-red-500 hover:text-white transition-all scale-100 hover:scale-110" aria-label="Remove image">
                            <CloseIcon />
                        </button>
                    </div>
                )}
                
                <div className="relative">
                    <textarea 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); }}}
                        placeholder="Ask a question or describe the image..."
                        className="w-full h-24 bg-base-200 rounded-lg p-3 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-base-content transition-shadow text-base"
                        disabled={isLoading} 
                        aria-label="AI query input"
                        data-keyboard-aware="true"
                    />
                     <button 
                        type="submit" 
                        disabled={isLoading || (!query.trim() && !image)}
                        className="absolute bottom-3 right-3 flex items-center justify-center w-10 h-10 bg-primary text-white rounded-lg hover:bg-primary-focus disabled:bg-primary/50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95" 
                        aria-label="Submit query"
                    >
                        {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <SendIcon />}
                    </button>
                </div>
                
                <div className="flex items-center gap-3 flex-shrink-0">
                     <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="flex items-center justify-center p-3 bg-base-300 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50" title="Upload Image" aria-label="Upload an image">
                        <GalleryIcon />
                    </button>
                    <button type="button" onClick={handleCameraClick} disabled={isLoading} className="flex items-center justify-center p-3 bg-base-300 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50" title="Use Camera" aria-label="Use camera to take a picture">
                        <CameraIcon />
                    </button>
                </div>
            </form>
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            {isCameraOpen && <CameraModal onClose={() => setIsCameraOpen(false)} onCapture={(dataUrl) => setImage({ dataUrl, mimeType: 'image/jpeg' })} onError={handleCameraError} />}
        </div>
    );
};

export default AICalculator;