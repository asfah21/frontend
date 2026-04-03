"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Circle, Maximize2, ShieldAlert } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Detection = {
  bbox: { x1: number; y1: number; x2: number; y2: number };
  name: string;
  person_id: number;
  frame_size: { w: number; h: number };
};

export function LiveCctvCard({ className }: { className?: string }) {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ===== WEBSOCKET =====
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const ws = new WebSocket("ws://10.10.11.5:3001/ws");

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      // SETIAP ADA DATA MASUK, RESET TIMER PEMBERSIHAN
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setDetections([]); // Kosongkan layar jika 1.5 detik tidak ada update
        window.dispatchEvent(new CustomEvent("ai:detections", { detail: [] }));
      }, 1500);

      try {
        const data = JSON.parse(event.data);

        // 🔥 DUKUNG BATCH DETECTIONS SESUAI REFERENSI
        if (data.event === "person_detect_batch" && Array.isArray(data.detections)) {
          setDetections(data.detections);
          window.dispatchEvent(new CustomEvent("ai:detections", { detail: data.detections }));
        } else if (data.event === "person_detect") {
          const single = [data];
          setDetections(single);
          window.dispatchEvent(new CustomEvent("ai:detections", { detail: single }));
        }
      } catch (e) {
        console.error("Failed to parse websocket data", e);
      }
    };

    return () => {
      ws.close();
      clearTimeout(timeout);
    };
  }, []);

  // ===== SYNC CANVAS SIZE AND DRAW BBOX =====
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!ctx || !canvas || !container) return;

      // Sync internal attributes with physical display size
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections.length === 0) return;

      // 🔥 ITERASI SEMUA DETECTIONS SESUAI REFERENSI
      detections.forEach((d) => {
        if (!d.bbox || !d.frame_size) return;

        const { x1, y1, x2, y2 } = d.bbox;

        // SCALING PROSES
        const scaleX = canvas.width / (d.frame_size.w || 1);
        const scaleY = canvas.height / (d.frame_size.h || 1);

        const sx1 = x1 * scaleX;
        const sy1 = y1 * scaleY;
        const sx2 = x2 * scaleX;
        const sy2 = y2 * scaleY;

        // WARNA SESUAI REFERENSI (LIME & RED)
        const color = d.name !== "Unknown" ? "lime" : "red";

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";

        // Draw box
        ctx.strokeRect(sx1, sy1, sx2 - sx1, sy2 - sy1);

        // Draw label background
        ctx.fillStyle = color;
        const label = `${d.name} (${d.person_id})`;
        ctx.font = "bold 14px Inter, Arial, sans-serif";
        const textWidth = ctx.measureText(label).width;

        ctx.fillRect(sx1, sy1 > 25 ? sy1 - 25 : sy1, textWidth + 10, 25);

        // Draw label text
        ctx.fillStyle = "#000000"; // Black text for better contrast on lime/red
        ctx.fillText(label, sx1 + 5, sy1 > 25 ? sy1 - 8 : sy1 + 18);
      });
    };

    // Add ResizeObserver to handle window/container resizing
    const resizeObserver = new ResizeObserver(() => {
      draw();
    });
    resizeObserver.observe(container);

    // Initial draw
    draw();

    return () => {
      resizeObserver.disconnect();
    };
  }, [detections]);

  return (
    <Card className={cn("overflow-hidden flex flex-col pb-[11px]", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Camera className="size-5 text-primary" />
          <CardTitle className="grow">Cam 01</CardTitle>
          <CardAction>
            <Badge
              variant={isConnected ? "outline" : "destructive"}
              className={cn("gap-1", isConnected && "text-green-500 border-green-500/30 bg-green-500/10")}
            >
              <Circle
                className={cn("size-2 fill-current animate-pulse", isConnected ? "text-green-500" : "text-destructive")}
              />
              {isConnected ? "Live" : "Offline"}
            </Badge>
          </CardAction>
        </div>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>

      <CardContent className="p-0 bg-black overflow-hidden relative flex-grow">
        <div className="w-full relative h-full">
          <AspectRatio ratio={16 / 9} className="group overflow-hidden">
            <div
              ref={containerRef}
              style={{
                border: "1px solid #222",
              }}
              className="absolute inset-0 w-full h-full z-10"
            >
              <iframe
                src="http://10.10.11.5:1984/stream.html?src=cam1"
                className="w-full h-full border-none grayscale-[0.1] transition-all group-hover:grayscale-0"
                title="CCTV Stream"
                allow="autoplay; fullscreen"
                allowFullScreen
              />

              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-[100]"
                style={{ width: "100%", height: "100%", display: "block" }}
              />

              {!isConnected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-[120]">
                  <ShieldAlert className="size-10 text-destructive mb-2" />
                  <p className="font-bold text-base text-white">Connection Lost</p>
                  <p className="text-[10px] text-zinc-400">Unable to reach the camera server</p>
                </div>
              )}
            </div>
          </AspectRatio>
        </div>
      </CardContent>
    </Card>
  );
}
